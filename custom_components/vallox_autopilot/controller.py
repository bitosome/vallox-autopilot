"""One rate-limited writer; device protection and external user control take priority."""

from __future__ import annotations
import asyncio
from copy import deepcopy
import logging
from datetime import timedelta
from math import isfinite
import time
from homeassistant.core import callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from .const import DOMAIN, DEFAULTS, BINDINGS
from .engine import demand, ramp, validate


_LOGGER = logging.getLogger(__name__)


class Controller:
    def __init__(self, hass, entry):
        self.hass = hass
        self.entry = entry
        self.config = {**DEFAULTS, **entry.data, **entry.options}
        validate(self.config)
        self.store = Store(hass, 1, f"{DOMAIN}.{entry.entry_id}")
        self.saved = {
            "enabled": False,
            "boost_until": 0,
            "hold_until": 0,
            "last_command": None,
            "boost_return": None,
            "events": [],
        }
        self.lock = asyncio.Lock()
        self.listeners = []
        self.unsubs = []
        self.closed = False
        self.state = "Starting"
        self.details = {}
        self.error = ""
        self.last_write = 0
        self.lower_since = 0
        self.pending = None

    async def setup(self):
        data = await self.store.async_load()
        if data is not None:
            if not isinstance(data, dict) or not isinstance(data.get("enabled"), bool):
                raise ValueError("Invalid controller storage")
            for key in ("boost_until", "hold_until"):
                if not isinstance(data.get(key, 0), (int, float)) or not isfinite(
                    data.get(key, 0)
                ):
                    raise ValueError("Invalid saved timer")
            for key in ("last_command", "boost_return"):
                value = data.get(key)
                if value is not None and (
                    isinstance(value, bool)
                    or not isinstance(value, (int, float))
                    or not isfinite(value)
                    or not 0 < value <= 100
                ):
                    raise ValueError("Invalid saved speed")
            if not isinstance(data.get("events", []), list):
                raise ValueError("Invalid saved history")
            self.saved.update(data)
        self.unsubs.append(
            async_track_time_interval(self.hass, self.tick, timedelta(seconds=30))
        )
        self.bind()
        await self.tick()

    def bind(self):
        if getattr(self, "unbind", None):
            self.unbind()
        entities = []
        for key in BINDINGS:
            value = self.config.get(key)
            entities.extend(
                value if isinstance(value, list) else [value] if value else []
            )
        self.unbind = async_track_state_change_event(self.hass, entities, self.changed)

    @callback
    def changed(self, event):
        if not self.closed:
            self.hass.async_create_task(self.tick())

    @callback
    def subscribe(self, fn):
        self.listeners.append(fn)
        return lambda: self.listeners.remove(fn)

    def publish(self):
        now = time.time()
        self.details.update(
            boost_until=self.saved["boost_until"]
            if self.saved["boost_until"] > now
            else None,
            hold_until=self.saved["hold_until"]
            if self.saved["hold_until"] > now
            else None,
            events=list(self.saved["events"]),
            error=self.error,
        )
        for fn in list(self.listeners):
            fn()

    def value(self, entity, low, high, unit=None):
        s = self.hass.states.get(entity) if entity else None
        if s is None or s.state in ["unknown", "unavailable"]:
            return None
        if unit and s.attributes.get("unit_of_measurement") != unit:
            return None
        reported = getattr(s, "last_reported", s.last_updated).timestamp()
        if time.time() - reported > self.config["stale_minutes"] * 60:
            return None
        try:
            v = float(s.state)
        except (ValueError, TypeError):
            return None
        return v if isfinite(v) and low <= v <= high else None

    def boolean(self, key):
        s = self.hass.states.get(self.config.get(key, ""))
        if s is None or s.state not in ["on", "off"]:
            return None
        # Persistent helper state does not become stale merely because nobody toggled it.
        return s.state == "on"

    def record(self, message):
        events = self.saved["events"]
        if not events or events[-1]["message"] != message:
            self.saved["events"] = (
                events + [{"time": time.time(), "message": message}]
            )[-40:]

    async def persist(self):
        await self.store.async_save(self.saved)

    async def option(self, key, value):
        async with self.lock:
            options = {**self.entry.options, key: value}
            validate({**self.config, **options})
            self.hass.config_entries.async_update_entry(self.entry, options=options)

    async def options_changed(self, hass, entry):
        async with self.lock:
            self.config = {**DEFAULTS, **entry.data, **entry.options}
            validate(self.config)
            self.bind()
        await self.tick()

    async def commit_action(self, previous):
        try:
            await self.persist()
        except Exception:
            self.saved = previous
            raise

    async def enabled(self, value):
        async with self.lock:
            previous = deepcopy(self.saved)
            self.saved["enabled"] = value
            if value:
                self.saved["hold_until"] = 0
                self.saved["last_command"] = None
            self.saved["boost_until"] = 0
            self.saved["boost_return"] = None
            self.record(
                "Automatic control enabled"
                if value
                else "Automatic control disabled; current native speed retained"
            )
            await self.commit_action(previous)
            self.pending = None
        await self.tick()

    async def boost(self, cancel=False):
        async with self.lock:
            previous = deepcopy(self.saved)
            if cancel:
                self.saved["boost_until"] = 0
            else:
                fan = self.hass.states.get(self.config["fan_entity"])
                if (
                    not fan
                    or fan.state != "on"
                    or fan.attributes.get("preset_mode") not in ["Home", "Away"]
                ):
                    raise ServiceValidationError(
                        "The fan must be on in Home or Away mode"
                    )
                if not self.saved["boost_until"] and self.saved["boost_return"] is None:
                    self.saved["boost_return"] = fan.attributes.get("percentage")
                self.saved["hold_until"] = 0
                self.saved["last_command"] = None
                self.saved["boost_until"] = (
                    time.time() + self.config["boost_minutes"] * 60
                )
            self.record(
                "Manual boost cancelled" if cancel else "Timed manual boost requested"
            )
            await self.commit_action(previous)
            self.pending = None
        await self.tick()

    async def resume(self):
        async with self.lock:
            previous = deepcopy(self.saved)
            self.saved["hold_until"] = 0
            self.saved["last_command"] = None
            await self.commit_action(previous)
            self.pending = None
        await self.tick()

    async def tick(self, _now=None):
        try:
            await self.evaluate()
        except Exception as err:
            self.error = f"Controller paused: {err}"
            self.state = "Controller error"
            self.publish()
            _LOGGER.exception(
                "Ventilation evaluation failed; no further commands this cycle"
            )

    async def evaluate(self):
        if self.closed or self.lock.locked():
            return
        async with self.lock:
            if self.closed:
                return
            now = time.time()
            c = self.config
            vals = [self.value(e, 0, 100, "%") for e in c["home_humidity_entities"]]
            valid = [v for v in vals if v is not None]
            home = sum(valid) / len(valid) if valid else None
            shower = self.value(c["shower_humidity_entity"], 0, 100, "%")
            co2 = self.value(c["co2_entity"], 250, 10000, "ppm")
            outdoor = self.value(c["outdoor_entity"], -60, 60, "°C")
            sauna = self.boolean("sauna_entity")
            occupied = self.boolean("home_entity")
            degraded = len(valid) != len(vals) or any(
                v is None for v in [shower, co2, outdoor, sauna, occupied]
            )
            boost = now < self.saved["boost_until"]
            result = demand(
                c, home, shower, co2, occupied, sauna, outdoor, boost, degraded
            )
            fan = self.hass.states.get(c["fan_entity"])
            current = fan.attributes.get("percentage") if fan else None
            if not isinstance(current, (int, float)) or not isfinite(current):
                current = None
            cell = self.hass.states.get(c["cell_entity"])
            cell_state = cell.state if cell else "unavailable"
            protection = (
                cell_state.lower() in ["unknown", "unavailable"]
                or "defrost" in cell_state.lower()
            )
            if cell and now - cell.last_reported.timestamp() > c["stale_minutes"] * 60:
                protection = True
            if fan and now - fan.last_reported.timestamp() > c["stale_minutes"] * 60:
                protection = True
            profile = fan.attributes.get("preset_mode") if fan else None
            self.details = {
                "controller": "vallox_autopilot",
                "home_humidity": home,
                "shower_humidity": shower,
                "co2": co2,
                "home_rag": result.home_rag,
                "shower_rag": result.shower_rag,
                "co2_rag": result.co2_rag,
                "desired_speed": result.target,
                "requested_speed": current,
                "actual_speed": self.value(c.get("actual_speed_entity"), 0, 100, "%"),
                "reason": result.reason,
                "winter": result.winter,
                "sauna_inhibited": sauna is not False,
                "home": occupied,
                "supply_temperature": self.value(c.get("supply_entity"), -30, 60, "°C"),
                "outdoor_temperature": outdoor,
                "extract_temperature": self.value(
                    c.get("extract_entity"), -30, 60, "°C"
                ),
                "profile": profile,
                "cell_state": cell_state,
                "degraded": degraded,
                "missing_home_sensors": len(vals) - len(valid),
                "boost_until": self.saved["boost_until"] if boost else None,
                "hold_until": self.saved["hold_until"]
                if now < self.saved["hold_until"]
                else None,
                "bindings": {k: c.get(k) for k in BINDINGS},
                "settings": {k: c[k] for k in DEFAULTS},
                "events": self.saved["events"],
            }
            self.error = ""
            ready = (
                fan is not None
                and fan.state == "on"
                and current is not None
                and profile in ["Home", "Away"]
                and not protection
            )
            if not ready:
                self.state = (
                    "Native control"
                    if fan and fan.state == "on"
                    else "Fan unavailable or off"
                )
                self.details["notice"] = (
                    "Waiting for Home/Away mode and valid heat-recovery status; native protection has priority."
                )
                self.publish()
                return
            # Detect a confirmed external percentage change. Measured fan speed is
            # deliberately NOT compared: native humidity/CO2 may boost actual airflow.
            last = self.saved["last_command"]
            if self.pending is not None:
                if abs(current - self.pending) < 1:
                    self.pending = None
                elif now - self.last_write < 90:
                    self.state = "Waiting for fan"
                    self.publish()
                    return
                else:
                    self.pending = None
                    self.saved["hold_until"] = now + c["override_minutes"] * 60
                    self.record("Requested speed not confirmed; control paused")
                    await self.persist()
            elif (
                last is not None
                and abs(current - last) >= 1
                and (self.saved["enabled"] or boost)
            ):
                self.saved["hold_until"] = now + c["override_minutes"] * 60
                self.saved["last_command"] = None
                self.saved["boost_until"] = 0
                self.saved["boost_return"] = None
                self.record("External fan adjustment; automatic control paused")
                await self.persist()
            if now < self.saved["hold_until"]:
                self.state = "Manual hold"
                self.publish()
                return
            if not self.saved["enabled"] and not boost:
                if self.saved["boost_return"] is not None:
                    target = self.saved["boost_return"]
                    self.saved["boost_return"] = None
                    self.saved["boost_until"] = 0
                    if last is not None and abs(current - last) < 1:
                        await self.write(target, "Manual boost finished", now)
                    await self.persist()
                self.state = "Automation off"
                self.publish()
                return
            if not boost and self.saved["boost_until"]:
                self.saved["boost_until"] = 0
                self.saved["boost_return"] = None
                await self.persist()
            target = result.target
            self.state = result.reason
            if target < current:
                if not self.lower_since:
                    self.lower_since = now
                if now - self.lower_since < c["release_minutes"] * 60:
                    self.details["notice"] = (
                        "Holding airflow while humidity / CO₂ settles"
                    )
                    self.publish()
                    return
            else:
                self.lower_since = 0
            elapsed = now - self.last_write if self.last_write else 60
            if elapsed < 30:
                self.publish()
                return
            command = round(
                target
                if boost
                else ramp(current, target, c["ramp_up"], c["ramp_down"], elapsed)
            )
            if abs(command - current) >= 1:
                await self.write(command, result.reason, now)
            self.publish()

    async def write(self, target, reason, now):
        target = max(10, min(100, round(target)))
        self.last_write = now
        # Persist command intent before dispatch, so restart can detect external changes.
        previous = deepcopy(self.saved)
        self.saved["last_command"] = target
        await self.commit_action(previous)
        self.pending = target
        try:
            await self.hass.services.async_call(
                "fan",
                "set_percentage",
                {"entity_id": self.config["fan_entity"], "percentage": target},
                blocking=True,
            )
            self.record(f"{reason}: requested {target}%")
            await self.persist()
        except HomeAssistantError as err:
            self.pending = None
            self.saved["last_command"] = None
            self.saved["hold_until"] = now + 120
            self.error = str(err)
            self.state = "Command failed"
            self.record("Fan command failed; retry held for two minutes")
            await self.persist()
        self.details["error"] = self.error

    async def close(self, persist=True):
        self.closed = True
        for fn in self.unsubs:
            fn()
        if getattr(self, "unbind", None):
            self.unbind()
        async with self.lock:
            if persist:
                await self.persist()
