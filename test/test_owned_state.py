import time
from types import SimpleNamespace
import unittest
from unittest.mock import AsyncMock, patch
from homeassistant.exceptions import ServiceValidationError
from custom_components.vallox_autopilot.controller import Controller
from custom_components.vallox_autopilot.sauna import SaunaDetector
from custom_components.vallox_autopilot.config_flow import (
    validate_bindings,
    bindings_schema,
)
import test_controller as support

BINDINGS = support.BINDINGS


class SaunaPolicy(unittest.TestCase):
    def test_delay_and_thermostat_cycles(self):
        d = SaunaDetector(False)
        self.assertEqual(d.observe([0, 8, 0], 1, 100, 5, 900), (False, 105))
        self.assertEqual(d.observe([0, 8, 0], 1, 105, 5, 900), (True, None))
        self.assertEqual(d.observe([0, 0, 0], 1, 200, 5, 900), (True, 1100))
        self.assertEqual(d.observe([8, 0, 0], 1, 1000, 5, 900), (True, None))
        self.assertEqual(d.observe([0, 0, 0], 1, 1200, 5, 900), (True, 2100))
        self.assertEqual(d.observe([0, 0, 0], 1, 2100, 5, 900), (False, None))

    def test_unknown_resets_evidence_not_retained_activity(self):
        d = SaunaDetector(True)
        d.observe([0, 0, 0], 1, 100, 5, 900)
        self.assertEqual(d.observe([0, None, 0], 1, 800, 5, 900), (None, None))
        self.assertTrue(d.current)
        self.assertEqual(d.observe([0, 0, 0], 1, 1100, 5, 900), (True, 2000))

    def test_initial_idle_and_threshold(self):
        d = SaunaDetector()
        self.assertEqual(d.observe([0, 1, 0], 1, 100, 5, 900), (False, None))

    def test_short_spike_does_not_activate(self):
        d = SaunaDetector(False)
        d.observe([10], 1, 100, 5, 900)
        self.assertEqual(d.observe([0], 1, 102, 5, 900), (False, None))
        self.assertEqual(d.observe([10], 1, 103, 5, 900), (False, 108))


class OwnedState(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        await support.Runtime.asyncSetUp(self)

    asyncTearDown = support.Runtime.asyncTearDown
    fan = support.Runtime.fan

    async def test_unchanged_connected_esphome_current_remains_valid(self):
        from homeassistant.helpers import entity_registry as er

        reg = er.async_get(self.hass)
        entity = reg.async_get_or_create("sensor", "esphome", "stable_current")
        self.hass.states.async_set(
            entity.entity_id, "0.0088", {"unit_of_measurement": "A"}
        )
        source = SimpleNamespace(
            domain="esphome", runtime_data=SimpleNamespace(available=True)
        )
        with (
            patch.object(
                self.hass,
                "config_entries",
                SimpleNamespace(async_get_entry=lambda _: source),
            ),
            patch(
                "custom_components.vallox_autopilot.controller.time.time",
                return_value=time.time() + 7200,
            ),
        ):
            self.assertEqual(self.m.value(entity.entity_id, 0, 1000, "A"), 0.0088)
            source.runtime_data.available = False
            self.assertIsNone(self.m.value(entity.entity_id, 0, 1000, "A"))
            source.runtime_data.available = True
            self.hass.states.async_set(entity.entity_id, "unavailable")
            self.assertIsNone(self.m.value(entity.entity_id, 0, 1000, "A"))

    async def test_fallback_names_input_and_reason(self):
        self.hass.states.async_set(
            "sensor.shower", "unavailable", {"friendly_name": "Shower humidity"}
        )
        self.hass.states.async_set("input_boolean.home", "off")
        await self.m.tick()
        self.assertEqual(self.m.details["reason"], "Sensor fallback")
        self.assertIn(
            {
                "entity_id": "sensor.shower",
                "name": "Shower humidity",
                "reason": "Unavailable",
            },
            self.m.details["input_issues"],
        )

    async def test_home_mode_persists_and_chooses_away(self):
        self.m.config["home_entity"] = ""
        self.entry.data["home_entity"] = ""
        await self.m.home_mode(False)
        self.assertFalse(self.m.details["home"])
        self.assertEqual(self.m.details["desired_speed"], 10)
        other = Controller(self.hass, self.entry)
        await other.setup()
        self.assertFalse(other.saved["home_mode"])
        self.assertEqual(other.details["occupancy_source"], "integration")
        await other.close()

    async def test_external_source_cannot_be_overridden(self):
        with self.assertRaises(ServiceValidationError):
            await self.m.home_mode(False)

    async def test_old_store_adopts_legacy_mode_once(self):
        self.hass.states.async_set("input_boolean.home", "off")
        with patch.object(
            self.m.store, "async_load", AsyncMock(return_value={"enabled": False})
        ):
            await self.m.setup()
        self.assertFalse(self.m.saved["home_mode"])

    async def test_failed_home_save_rolls_back(self):
        self.m.config["home_entity"] = ""
        with patch.object(
            self.m.store, "async_save", AsyncMock(side_effect=OSError("disk full"))
        ):
            with self.assertRaises(OSError):
                await self.m.home_mode(False)
        self.assertTrue(self.m.saved["home_mode"])

    async def test_raw_sauna_publishes_and_survives_restart(self):
        self.entry.data.update(
            sauna_entity="", sauna_current_entities=["sensor.current"]
        )
        self.m.config.update(self.entry.data)
        self.m.saved["sauna_active"] = False
        self.m.sauna = SaunaDetector(False)
        self.hass.states.async_set("sensor.current", "12", {"unit_of_measurement": "A"})
        now = time.time()
        with patch(
            "custom_components.vallox_autopilot.controller.time.time", return_value=now
        ):
            await self.m.tick()
        self.assertEqual(self.m.sauna_deadline, now + 5)
        with patch(
            "custom_components.vallox_autopilot.controller.time.time",
            return_value=now + 5,
        ):
            await self.m.tick()
        self.assertTrue(self.m.details["sauna_active"])
        self.assertTrue(self.m.saved["sauna_active"])
        self.hass.states.async_set("sensor.current", "0", {"unit_of_measurement": "A"})
        other = Controller(self.hass, self.entry)
        await other.setup()
        self.assertTrue(other.details["sauna_active"])
        self.assertIsNotNone(other.sauna_deadline)
        await other.close()

    async def test_unavailable_current_inhibits_humidity(self):
        self.m.config.update(sauna_entity="", sauna_current_entities=["sensor.missing"])
        self.hass.states.async_set("sensor.shower", "90", {"unit_of_measurement": "%"})
        await self.m.tick()
        self.assertIsNone(self.m.details["sauna_active"])
        self.assertTrue(self.m.details["sauna_inhibited"])
        self.assertEqual(self.m.details["desired_speed"], 30)

    async def test_bad_current_unit_is_not_idle(self):
        self.m.config.update(sauna_entity="", sauna_current_entities=["sensor.current"])
        self.hass.states.async_set("sensor.current", "0", {"unit_of_measurement": "W"})
        await self.m.tick()
        self.assertIsNone(self.m.details["sauna_active"])

    async def test_unrelated_options_keep_sauna_release_timer(self):
        self.entry.data.update(
            sauna_entity="", sauna_current_entities=["sensor.current"]
        )
        self.m.config.update(self.entry.data)
        self.m.saved["sauna_active"] = True
        self.m.sauna = SaunaDetector(True)
        self.hass.states.async_set("sensor.current", "0", {"unit_of_measurement": "A"})
        await self.m.tick()
        deadline = self.m.sauna_deadline
        self.entry.options = {"home_speed": 31}
        await self.m.options_changed(self.hass, self.entry)
        self.assertEqual(self.m.sauna_deadline, deadline)

    async def test_optional_bindings_can_be_cleared_without_defaults_returning(self):
        schema = bindings_schema(BINDINGS)
        submitted = {
            k: v
            for k, v in BINDINGS.items()
            if k not in ["home_entity", "sauna_entity"]
        }
        submitted["sauna_current_entities"] = ["sensor.current"]
        result = schema(submitted)
        self.assertNotIn("home_entity", result)
        self.assertNotIn("sauna_entity", result)
        validate_bindings(self.hass, result)

    async def test_requires_exactly_one_sauna_source(self):
        validate_bindings(self.hass, BINDINGS)
        validate_bindings(
            self.hass,
            {
                **BINDINGS,
                "home_entity": "",
                "sauna_entity": "",
                "sauna_current_entities": ["sensor.current"],
            },
        )
        for fields in (
            {"sauna_entity": ""},
            {"sauna_current_entities": ["sensor.current"]},
        ):
            with self.assertRaises(ValueError):
                validate_bindings(self.hass, {**BINDINGS, **fields})

    async def test_reject_controller_output_as_input(self):
        from homeassistant.helpers import entity_registry as er

        registry = er.async_get(self.hass)
        entry = registry.async_get_or_create("switch", "vallox_autopilot", "owned")
        with self.assertRaises(ValueError):
            validate_bindings(self.hass, {**BINDINGS, "home_entity": entry.entity_id})

    async def test_reject_non_native_fan_even_with_matching_presets(self):
        from homeassistant.helpers import entity_registry as er
        er.async_get(self.hass).async_get_or_create("fan", "template", "other", suggested_object_id="other")
        self.hass.states.async_set("fan.other", "on", {"preset_modes": ["Home", "Away"]})
        with self.assertRaises(ValueError):
            validate_bindings(self.hass, {**BINDINGS, "fan_entity": "fan.other"})

    async def test_reject_disabled_native_fan(self):
        from homeassistant.helpers import entity_registry as er
        er.async_get(self.hass).async_update_entity("fan.test", disabled_by=er.RegistryEntryDisabler.USER)
        with self.assertRaises(ValueError):
            validate_bindings(self.hass, BINDINGS)

    async def test_reject_controller_humidity_feedback(self):
        from homeassistant.helpers import entity_registry as er
        e = er.async_get(self.hass).async_get_or_create("sensor", "vallox_autopilot", "humidity")
        with self.assertRaises(ValueError):
            validate_bindings(self.hass, {**BINDINGS, "home_humidity_entities": [e.entity_id]})
