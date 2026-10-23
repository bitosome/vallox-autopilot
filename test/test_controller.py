"""Behavioral tests against Home Assistant's actual state/service/storage APIs."""

import tempfile
import time
import unittest
from copy import deepcopy
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from custom_components.vallox_autopilot.controller import Controller
from custom_components.vallox_autopilot.engine import demand, validate, ramp

BINDINGS = dict(
    fan_entity="fan.test",
    home_humidity_entities=["sensor.home"],
    shower_humidity_entity="sensor.shower",
    co2_entity="sensor.co2",
    outdoor_entity="sensor.outdoor",
    home_entity="input_boolean.home",
    sauna_entity="binary_sensor.sauna",
    cell_entity="sensor.cell",
    actual_speed_entity="sensor.actual",
)


class Engine(unittest.TestCase):
    def test_separate_humidity_and_sauna(self):
        self.assertEqual(demand({}, 45, 75, 600, True, False, 5).target, 80)
        self.assertEqual(demand({}, 70, 90, 600, True, True, 5).target, 30)
        self.assertEqual(demand({}, 70, 90, 1400, True, True, 5).target, 80)
        self.assertEqual(demand({}, 70, 90, 600, True, None, 5).target, 30)

    def test_gradual_and_away(self):
        self.assertEqual(demand({}, 61, 61, 600, True, False, 5).target, 55)
        self.assertEqual(demand({}, 45, 45, 600, False, False, 5).target, 10)
        self.assertEqual(demand({}, 45, 45, 1200, False, False, 5).target, 45)

    def test_shower_excess(self):
        self.assertGreater(demand({}, 35, 55, 600, True, False, 5).target, 30)

    def test_winter(self):
        self.assertEqual(demand({}, 56, 50, 600, True, False, 5).target, 30)
        self.assertEqual(demand({}, 56, 50, 600, True, False, -10).target, 55)

    def test_fallback_manual_and_rag(self):
        self.assertEqual(
            demand({}, None, None, None, False, None, None, False, True).target, 30
        )
        self.assertEqual(demand({}, 20, 20, 600, False, True, 5, True).target, 80)
        self.assertEqual(demand({}, 10, None, 1500, True, False, 5).home_rag, "red")
        self.assertEqual(
            demand({}, 10, None, 1500, True, False, 5).shower_rag, "unknown"
        )

    def test_invalid_settings(self):
        for bad in (
            {"away_speed": 50},
            {"home_start": 70},
            {"co2_start": 1400},
            {"boost_speed": 101},
            {"home_speed": float("nan")},
            {"home_speed": True},
        ):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                validate(bad)

    def test_bounded_ramp(self):
        self.assertEqual(ramp(30, 80, 5, 2, 3600), 35)
        self.assertEqual(ramp(80, 30, 5, 2, 60), 78)
        self.assertEqual(ramp(30, 80, 5, 2, 30), 32.5)


class Runtime(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.hass = HomeAssistant(self.tmp.name)
        self.entry = SimpleNamespace(
            entry_id="test", data=BINDINGS.copy(), options={}, title="Ventilation"
        )
        self.m = Controller(self.hass, self.entry)
        self.commands = []

        def sensor(id, v, unit=None):
            self.hass.states.async_set(
                id, str(v), {"unit_of_measurement": unit} if unit else {}
            )

        sensor("sensor.home", 45, "%")
        sensor("sensor.shower", 45, "%")
        sensor("sensor.co2", 600, "ppm")
        sensor("sensor.outdoor", 5, "°C")
        sensor("sensor.cell", "Heat Recovery")
        sensor("sensor.actual", 60, "%")
        sensor("input_boolean.home", "on")
        sensor("binary_sensor.sauna", "off")
        self.fan(30)

        async def call(service):
            self.commands.append(dict(service.data))
            self.fan(service.data["percentage"])

        self.hass.services.async_register("fan", "set_percentage", call)

    async def asyncTearDown(self):
        await self.m.close()
        await self.hass.async_stop()
        self.tmp.cleanup()

    def fan(self, speed, profile="Home", state="on"):
        self.hass.states.async_set(
            "fan.test",
            state,
            {
                "percentage": speed,
                "preset_mode": profile,
                "preset_modes": ["Home", "Away", "Boost", "Fireplace"],
            },
        )

    async def test_off_no_commands(self):
        self.hass.states.async_set("sensor.shower", "95", {"unit_of_measurement": "%"})
        await self.m.tick()
        self.assertEqual(self.commands, [])

    async def test_gradual_increase(self):
        self.hass.states.async_set("sensor.co2", "1400", {"unit_of_measurement": "ppm"})
        await self.m.enabled(True)
        self.assertEqual(self.commands[-1]["percentage"], 35)
        await self.m.tick()
        self.assertEqual(len(self.commands), 1)

    async def test_native_actual_not_override(self):
        self.m.saved.update(enabled=True, last_command=30)
        await self.m.tick()
        self.assertEqual(self.m.saved["hold_until"], 0)

    async def test_external_override(self):
        self.m.saved.update(enabled=True, last_command=30)
        self.fan(45)
        await self.m.tick()
        self.assertEqual(self.m.state, "Manual hold")
        self.assertEqual(self.commands, [])

    async def test_native_profiles_and_defrost(self):
        self.m.saved["enabled"] = True
        for profile, cell in [
            ("Boost", "Heat Recovery"),
            ("Fireplace", "Heat Recovery"),
            ("Home", "Defrost"),
            ("Home", "unknown"),
        ]:
            self.fan(30, profile)
            self.hass.states.async_set("sensor.cell", cell)
            await self.m.tick()
            self.assertEqual(self.commands, [])

    async def test_missing_sensor_fallback(self):
        self.hass.states.async_set("input_boolean.home", "off")
        self.hass.states.async_set("sensor.home", "unavailable")
        self.fan(10)
        await self.m.enabled(True)
        self.assertEqual(self.m.details["desired_speed"], 30)
        self.assertTrue(self.m.details["degraded"])

    async def test_bad_unit_and_staleness(self):
        self.hass.states.async_set("sensor.home", "45", {"unit_of_measurement": "ppm"})
        self.assertIsNone(self.m.value("sensor.home", 0, 100, "%"))
        with patch(
            "custom_components.vallox_autopilot.controller.time.time",
            return_value=time.time() + 3600,
        ):
            await self.m.enabled(True)
            self.assertEqual(self.commands, [])

    async def test_release_delay(self):
        self.fan(80)
        self.m.saved["enabled"] = True
        await self.m.tick()
        self.assertEqual(self.commands, [])
        self.m.lower_since = time.time() - 601
        await self.m.tick()
        self.assertEqual(self.commands[-1]["percentage"], 78)

    async def test_boost_restore_when_automation_off(self):
        await self.m.boost()
        self.assertEqual(self.commands[-1]["percentage"], 80)
        self.m.last_write = 0
        await self.m.boost(True)
        self.assertEqual(self.commands[-1]["percentage"], 30)

    async def test_boost_external_change_cancels(self):
        await self.m.boost()
        await self.m.tick()
        self.fan(42)
        await self.m.tick()
        self.assertEqual(self.m.state, "Manual hold")
        self.assertEqual(self.m.saved["boost_until"], 0)

    async def test_restart_persistence(self):
        await self.m.enabled(True)
        await self.m.boost()
        other = Controller(self.hass, self.entry)
        await other.setup()
        self.assertTrue(other.saved["enabled"])
        self.assertEqual(other.saved["boost_until"], self.m.saved["boost_until"])
        self.assertEqual(other.saved["boost_return"], 30)
        await other.close()

    async def test_failed_save_no_action(self):
        before = deepcopy(self.m.saved)
        with patch.object(
            self.m.store, "async_save", AsyncMock(side_effect=OSError("disk full"))
        ):
            with self.assertRaises(OSError):
                await self.m.boost()
        self.assertEqual(self.m.saved, before)
        self.assertEqual(self.commands, [])

    async def test_failed_command_hold_visible(self):
        async def fail(service):
            raise HomeAssistantError("offline")

        self.hass.services.async_register("fan", "set_percentage", fail)
        await self.m.boost()
        self.assertEqual(self.m.state, "Command failed")
        self.assertIn("offline", self.m.details["error"])
        self.assertGreater(self.m.saved["hold_until"], time.time())

    async def test_rejected_acknowledgement(self):
        self.m.saved["enabled"] = True
        self.m.pending = 50
        self.m.last_write = time.time() - 100
        await self.m.tick()
        self.assertEqual(self.m.state, "Manual hold")
        self.assertEqual(self.commands, [])

    async def test_corrupt_storage_not_replaced(self):
        with (
            patch.object(
                self.m.store,
                "async_load",
                AsyncMock(return_value={"enabled": True, "boost_until": "bad"}),
            ),
            patch.object(self.m.store, "async_save", AsyncMock()) as save,
        ):
            with self.assertRaises(ValueError):
                await self.m.setup()
            await self.m.close(persist=False)
            save.assert_not_awaited()


if __name__ == "__main__":
    unittest.main()
