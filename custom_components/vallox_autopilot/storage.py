"""Atomic HA-compatible storage whose awaited save propagates disk failures.

The native Store logs some write errors instead of raising them. Controller
intent must be durable before sending a command, so use HA's public JSON helpers
directly (the same approach used by Coffee Tracker).
"""

import asyncio
from copy import deepcopy
from pathlib import Path

from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.json import save_json
from homeassistant.util.json import load_json


class StrictStore:
    def __init__(self, hass, version, key):
        self.hass, self.version, self.key = hass, version, key
        self.path = Path(hass.config.path('.storage', key))
        self.lock = asyncio.Lock()

    async def async_load(self):
        async with self.lock:
            envelope = await self.hass.async_add_executor_job(self._load)
        if envelope is None:
            return None
        if (
            not isinstance(envelope, dict)
            or envelope.get('version') != self.version
            or envelope.get('minor_version', 1) != 1
            or envelope.get('key') != self.key
            or not isinstance(envelope.get('data'), dict)
        ):
            raise HomeAssistantError('Invalid or unsupported ventilation storage; existing file preserved')
        return envelope['data']

    def _load(self):
        envelope = load_json(self.path, None)
        if envelope is None and self.path.exists():
            raise HomeAssistantError('Invalid ventilation storage; existing file preserved')
        return envelope

    def _write(self, envelope):
        self.path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        save_json(str(self.path), envelope, private=True, atomic_writes=True)

    async def async_save(self, data):
        envelope = {'version': self.version, 'minor_version': 1, 'key': self.key, 'data': deepcopy(data)}
        async with self.lock:
            job = self.hass.async_add_executor_job(self._write, envelope)
            cancelled = None
            while not job.done():
                try:
                    await asyncio.shield(job)
                except asyncio.CancelledError as err:
                    # Repeated cancellation must not release the lock while the
                    # thread still writes: an older snapshot could finish last.
                    cancelled = err
            job.result()
            if cancelled is not None:
                raise cancelled
