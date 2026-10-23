from homeassistant.helpers.entity import Entity, DeviceInfo
from .const import DOMAIN


class ControllerEntity(Entity):
    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, entry, key, name, icon):
        self.manager = entry.runtime_data
        self.key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_name = name
        self._attr_icon = icon
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer="Bitosome",
            model="Vallox Autopilot",
        )

    async def async_added_to_hass(self):
        self.async_on_remove(self.manager.subscribe(self.async_write_ha_state))
