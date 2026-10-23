"""Configurable Vallox demand controller with a bundled Lovelace card."""

from pathlib import Path
import logging
from homeassistant.components.http import StaticPathConfig
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from .const import DOMAIN, VERSION, PLATFORMS, CARD_URL
from .controller import Controller

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
_LOGGER = logging.getLogger(__name__)


async def async_setup(hass, config):
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                CARD_URL,
                str(Path(__file__).parent / "www" / "vallox-autopilot-card.js"),
                False,
            )
        ]
    )
    try:
        resources = getattr(hass.data.get("lovelace"), "resources", None)
        if resources:
            await resources.async_get_info()
            url = f"{CARD_URL}?v={VERSION}"
            existing = next(
                (
                    x
                    for x in resources.async_items()
                    if x["url"].split("?")[0] == CARD_URL
                ),
                None,
            )
            if existing:
                await resources.async_update_item(
                    existing["id"], {"url": url, "res_type": "module"}
                )
            else:
                await resources.async_create_item({"url": url, "res_type": "module"})
    except Exception:
        _LOGGER.exception("Register %s manually as a dashboard module", CARD_URL)
    return True


async def async_setup_entry(hass, entry):
    manager = Controller(hass, entry)
    try:
        await manager.setup()
    except Exception as err:
        await manager.close(persist=False)
        raise ConfigEntryNotReady(str(err)) from err
    entry.runtime_data = manager
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(manager.options_changed))
    return True


async def async_unload_entry(hass, entry):
    if await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        await entry.runtime_data.close()
        return True
    return False
