"""Controller-owned sauna activity; unknown measurements remain unavailable."""

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
    BinarySensorDeviceClass,
)
from .entity import ControllerEntity


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([Sauna(entry)])


class Sauna(ControllerEntity, BinarySensorEntity):
    _attr_device_class = BinarySensorDeviceClass.POWER

    def __init__(self, entry):
        super().__init__(entry, "sauna_active", "Sauna active", "mdi:heat-wave")

    @property
    def available(self):
        return self.manager.details.get("sauna_active") is not None

    @property
    def is_on(self):
        return self.manager.details.get("sauna_active")
