"""Read-only native telemetry stays separate from ventilation demand and control."""

import time
import unittest
from unittest.mock import Mock, patch

import test_controller as support
from custom_components.vallox_autopilot.config_flow import bindings_schema
from custom_components.vallox_autopilot.sensor import async_setup_entry


TELEMETRY_BINDINGS = {
    "supply_fan_speed_entity": "sensor.supply_rotor",
    "extract_fan_speed_entity": "sensor.extract_rotor",
    "post_heater_entity": "binary_sensor.post_heater",
}


class Telemetry(unittest.IsolatedAsyncioTestCase):
    asyncSetUp = support.Runtime.asyncSetUp
    asyncTearDown = support.Runtime.asyncTearDown
    fan = support.Runtime.fan

    def bind_telemetry(self):
        self.entry.data.update(TELEMETRY_BINDINGS)
        self.m.config.update(TELEMETRY_BINDINGS)

    async def test_optional_readings_do_not_degrade_controller_or_issue_commands(self):
        await self.m.tick()
        for key in ("supply_fan_rpm", "extract_fan_rpm", "post_heater_active"):
            self.assertIsNone(self.m.details[key])
        self.assertFalse(self.m.details["degraded"])
        self.assertEqual(self.m.details["desired_speed"], 30)
        self.assertEqual(self.commands, [])

    async def test_independent_native_rpm_and_heater_readings(self):
        self.bind_telemetry()
        self.hass.states.async_set(
            "sensor.supply_rotor", "906", {"unit_of_measurement": "rpm"}
        )
        self.hass.states.async_set(
            "sensor.extract_rotor", "1042", {"unit_of_measurement": "rpm"}
        )
        self.hass.states.async_set("binary_sensor.post_heater", "on")
        await self.m.tick()
        self.assertEqual(self.m.details["supply_fan_rpm"], 906)
        self.assertEqual(self.m.details["extract_fan_rpm"], 1042)
        self.assertIs(self.m.details["post_heater_active"], True)
        self.assertEqual(self.m.details["fan_setting"], 30)
        self.assertEqual(self.m.details["actual_speed"], 60)
        self.assertEqual(self.m.details["desired_speed"], 30)
        self.assertEqual(self.commands, [])

    async def test_bad_or_missing_rotor_readings_are_not_zero_or_percentages(self):
        self.bind_telemetry()
        for value, unit in (
            ("unavailable", "rpm"), ("unknown", "rpm"), ("", "rpm"),
            ("abc", "rpm"), ("nan", "rpm"), ("inf", "rpm"),
            ("-1", "rpm"), ("10001", "rpm"), ("60", "%"), ("906", None),
        ):
            with self.subTest(value=value, unit=unit):
                self.hass.states.async_set(
                    "sensor.supply_rotor", value, {"unit_of_measurement": unit}
                )
                await self.m.tick()
                self.assertIsNone(self.m.details["supply_fan_rpm"])
                self.assertIsNone(self.m.details["extract_fan_rpm"])
                self.assertFalse(self.m.details["degraded"])
        self.hass.states.async_set(
            "sensor.supply_rotor", "0", {"unit_of_measurement": "rpm"}
        )
        await self.m.tick()
        self.assertEqual(self.m.details["supply_fan_rpm"], 0)
        self.assertEqual(self.commands, [])

    async def test_stale_rotor_reading_is_not_live_but_unchanged_heater_off_is_known(self):
        self.bind_telemetry()
        self.hass.states.async_set(
            "sensor.supply_rotor", "906", {"unit_of_measurement": "rpm"}
        )
        self.hass.states.async_set("binary_sensor.post_heater", "off")
        with patch(
            "custom_components.vallox_autopilot.controller.time.time",
            return_value=time.time() + 7200,
        ):
            await self.m.tick()
        self.assertIsNone(self.m.details["supply_fan_rpm"])
        self.assertIs(self.m.details["post_heater_active"], False)
        self.assertEqual(self.commands, [])

    async def test_heater_unavailability_is_not_reported_as_off(self):
        self.bind_telemetry()
        for value in ("unknown", "unavailable", "idle", "0"):
            with self.subTest(value=value):
                self.hass.states.async_set("binary_sensor.post_heater", value)
                await self.m.tick()
                self.assertIsNone(self.m.details["post_heater_active"])
                self.assertFalse(self.m.details["degraded"])
        self.assertEqual(self.commands, [])

    async def test_native_state_updates_refresh_bound_telemetry(self):
        self.bind_telemetry()
        await self.m.setup()
        self.hass.states.async_set("binary_sensor.post_heater", "on")
        self.hass.states.async_set(
            "sensor.extract_rotor", "1500", {"unit_of_measurement": "rpm"}
        )
        await self.hass.async_block_till_done()
        self.assertIs(self.m.details["post_heater_active"], True)
        self.assertEqual(self.m.details["extract_fan_rpm"], 1500)
        self.assertEqual(self.commands, [])

    async def test_fan_setting_sensor_tracks_native_percentage_not_demand_or_rpm(self):
        self.entry.runtime_data = self.m
        entities = []
        with patch(
            "custom_components.vallox_autopilot.sensor.entity_platform.async_get_current_platform",
            return_value=Mock(),
        ):
            await async_setup_entry(self.hass, self.entry, entities.extend)
        reading = next(entity for entity in entities if entity.key == "fan_setting")
        self.assertEqual(reading.native_unit_of_measurement, "%")
        self.assertEqual(reading.state_class, "measurement")
        self.fan(80)
        await self.m.tick()
        self.assertEqual(reading.native_value, 80)
        self.assertEqual(self.m.details["desired_speed"], 30)
        self.assertEqual(self.m.details["actual_speed"], 60)
        self.fan(80, state="off")
        await self.m.tick()
        self.assertEqual(reading.native_value, 0)
        self.fan(80, state="unavailable")
        await self.m.tick()
        self.assertIsNone(reading.native_value)
        self.assertEqual(self.commands, [])

    async def test_native_fan_setting_rejects_invalid_percentage_and_availability(self):
        for value in (None, True, False, "30", float("nan"), float("inf"), -1, 101):
            with self.subTest(value=value):
                self.fan(value)
                await self.m.tick()
                self.assertIsNone(self.m.details["fan_setting"])
        for state in ("unknown", "unavailable"):
            self.fan(80, state=state)
            await self.m.tick()
            self.assertIsNone(self.m.details["fan_setting"])
        for value in (0, 30.5, 100):
            self.fan(value)
            await self.m.tick()
            self.assertEqual(self.m.details["fan_setting"], value)
        self.assertEqual(self.commands, [])

    def test_native_telemetry_bindings_are_optional_and_can_be_cleared(self):
        values = {**support.BINDINGS, **TELEMETRY_BINDINGS}
        schema = bindings_schema(values)
        submitted = schema(support.BINDINGS)
        for key in TELEMETRY_BINDINGS:
            self.assertNotIn(key, submitted)
        self.assertEqual(schema(values), values)
        for marker, selector in schema.schema.items():
            if str(marker) in TELEMETRY_BINDINGS:
                self.assertEqual(selector.config["integration"], "vallox")
                self.assertEqual(
                    selector.config["domain"],
                    ["binary_sensor" if str(marker) == "post_heater_entity" else "sensor"],
                )
