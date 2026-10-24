"""UI setup and configurable entity bindings/limits."""

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector, entity_registry as er
from .const import DOMAIN, DEFAULTS, NUMBERS, BINDINGS
from .engine import validate


def bindings_schema(values):
    schema = {}
    for key, (domain, multiple, required) in BINDINGS.items():
        marker = vol.Required if required else vol.Optional
        kwargs = (
            {"default": values[key]}
            if required and values.get(key)
            else {"description": {"suggested_value": values[key]}}
            if values.get(key)
            else {}
        )
        selection = {"domain": domain, "multiple": multiple}
        if key in (
            "fan_entity",
            "supply_fan_speed_entity",
            "extract_fan_speed_entity",
            "post_heater_entity",
        ):
            selection["integration"] = "vallox"
        schema[marker(key, **kwargs)] = selector.EntitySelector(selection)
    return vol.Schema(schema)


def validate_bindings(hass, data):
    if bool(data.get("sauna_entity")) == bool(data.get("sauna_current_entities")):
        raise ValueError(
            "Choose either sauna current sensors or an external sauna entity"
        )
    registry = er.async_get(hass)
    for key in BINDINGS:
        values = data.get(key, [])
        for entity_id in (
            values if isinstance(values, list) else [values] if values else []
        ):
            entity = registry.async_get(entity_id)
            if entity and entity.platform == DOMAIN:
                raise ValueError("Cannot use the controller's own output as an input")
    if not data.get("home_humidity_entities"):
        raise ValueError("Choose at least one home humidity sensor")
    if data["shower_humidity_entity"] in data["home_humidity_entities"]:
        raise ValueError("Keep the shower sensor out of the home group")
    fan_registration = registry.async_get(data["fan_entity"])
    if (
        not fan_registration
        or fan_registration.platform != "vallox"
        or fan_registration.disabled_by
    ):
        raise ValueError("Select an enabled fan from the native Vallox integration")
    fan = hass.states.get(data["fan_entity"])
    if fan is None or not {"Home", "Away"}.intersection(
        fan.attributes.get("preset_modes", [])
    ):
        raise ValueError("Select an available native Vallox fan")


class Flow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        errors = {}
        if user_input is not None:
            try:
                validate_bindings(self.hass, user_input)
                await self.async_set_unique_id(user_input["fan_entity"])
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title="Vallox Autopilot", data=user_input, options=DEFAULTS.copy()
                )
            except ValueError:
                errors["base"] = "invalid_bindings"
        return self.async_show_form(
            step_id="user", data_schema=bindings_schema(user_input or {}), errors=errors
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return Options()


class Options(config_entries.OptionsFlow):
    async def async_step_init(self, user_input=None):
        return self.async_show_menu(step_id="init", menu_options=["bindings", "tuning"])

    async def async_step_bindings(self, user_input=None):
        values = {**self.config_entry.data, **self.config_entry.options}
        errors = {}
        if user_input is not None:
            try:
                validate_bindings(self.hass, user_input)
                if user_input["fan_entity"] != self.config_entry.data["fan_entity"]:
                    raise ValueError("Create another controller for another fan")
                # Explicitly clear optional mappings omitted by the form.
                merged = {
                    k: v
                    for k, v in self.config_entry.options.items()
                    if k not in BINDINGS
                }
                merged.update(
                    {
                        k: user_input.get(k, [] if spec[1] else "")
                        for k, spec in BINDINGS.items()
                    }
                )
                return self.async_create_entry(title="", data=merged)
            except ValueError:
                errors["base"] = "invalid_bindings"
        return self.async_show_form(
            step_id="bindings",
            data_schema=bindings_schema(user_input or values),
            errors=errors,
        )

    async def async_step_tuning(self, user_input=None):
        values = {**DEFAULTS, **self.config_entry.options}
        errors = {}
        if user_input is not None:
            try:
                validate(user_input)
                return self.async_create_entry(
                    title="", data={**self.config_entry.options, **user_input}
                )
            except ValueError:
                errors["base"] = "invalid_settings"
        form = vol.Schema(
            {
                vol.Required(
                    k, default=(user_input or values)[k]
                ): selector.NumberSelector(
                    {
                        "min": v[0],
                        "max": v[1],
                        "step": v[2],
                        "mode": "box",
                        "unit_of_measurement": v[3],
                    }
                )
                for k, v in NUMBERS.items()
            }
        )
        return self.async_show_form(step_id="tuning", data_schema=form, errors=errors)
