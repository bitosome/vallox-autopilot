import voluptuous as vol
from homeassistant.helpers import entity_platform
from homeassistant.components.sensor import (
    SensorEntity,
    SensorDeviceClass,
    SensorStateClass,
)
from .entity import ControllerEntity
from homeassistant.helpers import entity_registry as er
from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    entity_platform.async_get_current_platform().async_register_entity_service(
        "set_response_curve",
        {
            vol.Required("curve"): vol.In(["home", "shower", "excess", "co2"]),
            vol.Required("profile"): vol.In(["home", "away"]),
            vol.Required("points"): list,
            vol.Required("expected_revision"): vol.All(
                vol.Coerce(int), vol.Range(min=0)
            ),
        },
        "async_set_response_curve",
    )
    async_add_entities(
        [Status(entry)]
        + [
            Reading(entry, k, n, u, d)
            for k, n, u, d in [
                ("home_humidity", "Home humidity", "%", SensorDeviceClass.HUMIDITY),
                ("shower_humidity", "Shower humidity", "%", SensorDeviceClass.HUMIDITY),
                ("co2", "CO₂", "ppm", SensorDeviceClass.CO2),
                ("desired_speed", "Target speed", "%", None),
                ("fan_setting", "Fan setting", "%", None),
            ]
        ]
    )


class Status(ControllerEntity, SensorEntity):
    def __init__(self, entry):
        super().__init__(entry, "status", "Status", "mdi:air-filter")

    async def async_set_response_curve(self, curve, profile, points, expected_revision):
        await self.manager.set_response_curve(curve, profile, points, expected_revision)

    @property
    def native_value(self):
        return self.manager.state

    @property
    def extra_state_attributes(self):
        registry = er.async_get(self.hass)
        prefix = f"{self.manager.entry.entry_id}_"
        controls = {
            e.unique_id[len(prefix) :]: e.entity_id
            for e in er.async_entries_for_config_entry(
                registry, self.manager.entry.entry_id
            )
            if e.platform == DOMAIN
            and e.unique_id.startswith(prefix)
            and not e.disabled_by
        }
        return {**self.manager.details, "entities": controls}


class Reading(ControllerEntity, SensorEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, entry, key, name, unit, device_class):
        super().__init__(entry, key, name, "mdi:air-filter")
        self._attr_native_unit_of_measurement = unit
        self._attr_device_class = device_class

    @property
    def native_value(self):
        v = self.manager.details.get(self.key)
        return round(v, 1) if v is not None else None
