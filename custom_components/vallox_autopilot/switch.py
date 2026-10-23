from homeassistant.components.switch import SwitchEntity
from .entity import ControllerEntity


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([Automation(entry)])


class Automation(ControllerEntity, SwitchEntity):
    def __init__(self, entry):
        super().__init__(entry, "automation", "Automation", "mdi:auto-fix")

    @property
    def is_on(self):
        return self.manager.saved["enabled"]

    async def async_turn_on(self, **kwargs):
        await self.manager.enabled(True)

    async def async_turn_off(self, **kwargs):
        await self.manager.enabled(False)
