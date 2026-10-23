from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.const import EntityCategory
from homeassistant.exceptions import ServiceValidationError
from .entity import ControllerEntity
from .const import NUMBERS


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([Setting(entry, k, v) for k, v in NUMBERS.items()])


class Setting(ControllerEntity, NumberEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_mode = NumberMode.BOX

    def __init__(self, entry, key, spec):
        super().__init__(entry, key, spec[4], "mdi:tune")
        self._attr_native_min_value = spec[0]
        self._attr_native_max_value = spec[1]
        self._attr_native_step = spec[2]
        self._attr_native_unit_of_measurement = spec[3]

    @property
    def native_value(self):
        return self.manager.config[self.key]

    async def async_set_native_value(self, value):
        try:
            await self.manager.option(self.key, value)
        except ValueError as err:
            raise ServiceValidationError(str(err)) from err
