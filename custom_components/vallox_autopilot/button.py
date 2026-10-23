from homeassistant.components.button import ButtonEntity
from .entity import ControllerEntity


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities(
        [
            Action(entry, "boost", "Boost", "mdi:fan-plus"),
            Action(entry, "cancel_boost", "Cancel boost", "mdi:fan-minus"),
            Action(entry, "resume", "Resume automatic control", "mdi:play"),
        ]
    )


class Action(ControllerEntity, ButtonEntity):
    async def async_press(self):
        if self.key == "resume":
            await self.manager.resume()
        else:
            await self.manager.boost(self.key == "cancel_boost")
