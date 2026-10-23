"""Real policy/storage regression checks for shared editable response curves."""

import asyncio
import math
import unittest
from copy import deepcopy
from unittest.mock import AsyncMock, patch
from homeassistant.exceptions import ServiceValidationError
from custom_components.vallox_autopilot.curves import (
    validate_points,
    interpolate,
    effective_curves,
)
from custom_components.vallox_autopilot.const import DEFAULTS
from custom_components.vallox_autopilot.engine import demand
from custom_components.vallox_autopilot.controller import Controller
import test_controller as support

POINTS = [{"x": 50, "y": 30}, {"x": 60, "y": 45}, {"x": 70, "y": 80}]


class CurvePolicy(unittest.TestCase):
    def test_interpolates_and_holds_endpoint_values(self):
        self.assertEqual(interpolate(POINTS, 40), 30)
        self.assertEqual(interpolate(POINTS, 55), 37.5)
        self.assertEqual(interpolate(POINTS, 65), 62.5)
        self.assertEqual(interpolate(POINTS, 90), 80)

    def test_invalid_points_rejected(self):
        for points in [
            [],
            POINTS[:1],
            POINTS * 5,
            [{"x": True, "y": 30}, {"x": 70, "y": 80}],
            [{"x": 50, "y": math.nan}, {"x": 70, "y": 80}],
            [{"x": 50, "y": 30}, {"x": 50, "y": 80}],
            [{"x": 50, "y": 80}, {"x": 70, "y": 30}],
            [{"x": 19, "y": 30}, {"x": 70, "y": 80}],
            [{"x": 50, "y": 0}, {"x": 70, "y": 80}],
        ]:
            with self.subTest(points=points), self.assertRaises(ValueError):
                validate_points("home", "home", points)
        with self.assertRaises(ValueError):
            validate_points("co2", "home", [{"x": 1000, "y": 30}, {"x": 1020, "y": 80}])

    def test_default_curves_preserve_existing_linear_policy(self):
        for occupied in [True, False]:
            for humidity in range(20, 100):
                base = 30 if occupied else 10
                expected = round(
                    base + (80 - base) * max(0, min(1, (humidity - 56) / 10))
                )
                self.assertEqual(
                    demand({}, humidity, None, 600, occupied, False, 5).target, expected
                )

    def test_custom_profiles_and_winter_shift(self):
        curves = {
            "home": {
                "home": POINTS,
                "away": [{"x": 50, "y": 10}, {"x": 60, "y": 20}, {"x": 70, "y": 40}],
            }
        }
        self.assertEqual(
            demand({}, 60, 40, 600, True, False, 5, curves=curves).target, 45
        )
        self.assertEqual(
            demand({}, 60, 40, 600, False, False, 5, curves=curves).target, 20
        )
        self.assertEqual(
            demand({}, 55, 40, 600, True, False, -5, curves=curves).target, 45
        )
        self.assertEqual(
            demand({}, 70, 40, 600, True, True, 5, curves=curves).target, 30
        )
        self.assertEqual(
            demand(
                {}, 70, 40, 600, False, None, 5, degraded=True, curves=curves
            ).target,
            30,
        )

    def test_independent_co2_excess_and_global_limits(self):
        curves = {
            "co2": {
                "home": [
                    {"x": 800, "y": 30},
                    {"x": 1000, "y": 50},
                    {"x": 1500, "y": 80},
                ]
            },
            "excess": {
                "home": [{"x": 0, "y": 30}, {"x": 5, "y": 65}, {"x": 20, "y": 80}]
            },
        }
        self.assertEqual(
            demand({}, 40, 40, 1000, True, True, 5, curves=curves).target, 50
        )
        self.assertEqual(
            demand({}, 40, 45, 600, True, False, 5, curves=curves).target, 65
        )
        c = {**DEFAULTS, "home_speed": 40, "boost_speed": 60}
        p = effective_curves(c, curves)["co2"]["home"]
        self.assertEqual([v["y"] for v in p], [40, 50, 60])


class CurveStorage(unittest.IsolatedAsyncioTestCase):
    asyncSetUp = support.Runtime.asyncSetUp
    asyncTearDown = support.Runtime.asyncTearDown
    fan = support.Runtime.fan

    async def test_shared_edit_applies_and_survives_restart(self):
        self.hass.states.async_set("sensor.home", "60", {"unit_of_measurement": "%"})
        await self.m.set_response_curve("home", "home", POINTS, 0)
        self.assertEqual(self.m.details["desired_speed"], 45)
        self.assertEqual(self.m.details["response_curves"]["home"]["home"], POINTS)
        self.assertEqual(self.m.details["curve_revisions"]["home:home"], 1)
        self.assertEqual(self.commands, [])  # Auto off, no physical writes from editing
        other = Controller(self.hass, self.entry)
        await other.setup()
        try:
            self.assertEqual(other.saved["response_curves"]["home"]["home"], POINTS)
            self.assertEqual(other.details["desired_speed"], 45)
        finally:
            await other.close()

    async def test_concurrent_same_curve_rejected_other_curve_preserved(self):
        results = await asyncio.gather(
            self.m.set_response_curve("home", "home", POINTS, 0),
            self.m.set_response_curve("home", "home", POINTS, 0),
            return_exceptions=True,
        )
        self.assertEqual(sum(isinstance(r, ServiceValidationError) for r in results), 1)
        await self.m.set_response_curve("home", "away", POINTS, 0)
        self.assertEqual(
            self.m.saved["curve_revisions"], {"home:home": 1, "home:away": 1}
        )
        self.assertEqual(self.m.saved["response_curves"]["home"]["home"], POINTS)

    async def test_failed_storage_preserves_previous_curve_and_revision(self):
        before = deepcopy(self.m.saved)
        with patch.object(
            self.m.store, "async_save", AsyncMock(side_effect=OSError("disk full"))
        ):
            with self.assertRaises(OSError):
                await self.m.set_response_curve("home", "home", POINTS, 0)
        self.assertEqual(self.m.saved, before)

    async def test_invalid_edit_does_not_mutate_store(self):
        before = deepcopy(self.m.saved)
        with self.assertRaises(ServiceValidationError):
            await self.m.set_response_curve("home", "home", POINTS[::-1], 0)
        self.assertEqual(self.m.saved, before)

    async def test_old_store_uses_settings_without_migration_writes(self):
        with patch.object(
            self.m.store, "async_load", AsyncMock(return_value={"enabled": False})
        ):
            await self.m.setup()
        self.assertEqual(self.m.saved["response_curves"], {})
        self.assertEqual(
            self.m.details["response_curves"]["home"]["home"],
            [{"x": 56, "y": 30}, {"x": 66, "y": 80}],
        )

    async def test_native_entity_service_routes_to_status_and_validates_revision(self):
        import logging
        from datetime import timedelta
        from homeassistant.helpers.entity_platform import EntityPlatform
        from custom_components.vallox_autopilot import sensor

        platform = EntityPlatform(
            hass=self.hass,
            logger=logging.getLogger(__name__),
            domain="sensor",
            platform_name="vallox_autopilot",
            platform=None,
            scan_interval=timedelta(seconds=30),
            entity_namespace=None,
        )
        self.entry.runtime_data = self.m
        entities = []
        with patch.object(
            sensor.entity_platform, "async_get_current_platform", return_value=platform
        ):
            await sensor.async_setup_entry(self.hass, self.entry, entities.extend)
        status = entities[0]
        status.hass = self.hass
        status.entity_id = "sensor.renamed_status"
        status.platform = platform
        platform.domain_platform_entities[status.entity_id] = status
        self.hass.states.async_set(status.entity_id, "Automation off")
        payload = {
            "entity_id": status.entity_id,
            "curve": "home",
            "profile": "home",
            "points": POINTS,
            "expected_revision": 0,
        }
        with patch.object(status, "async_update_ha_state", AsyncMock()):
            await self.hass.services.async_call(
                "vallox_autopilot", "set_response_curve", payload, blocking=True
            )
            self.assertEqual(self.m.saved["curve_revisions"]["home:home"], 1)
            with self.assertRaises(ServiceValidationError):
                await self.hass.services.async_call(
                    "vallox_autopilot", "set_response_curve", payload, blocking=True
                )
