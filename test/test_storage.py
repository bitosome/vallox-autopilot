"""Storage compatibility, failures and cancellation against real HA helpers."""
import asyncio
import json
import tempfile
import threading
import unittest
from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.storage import Store
from custom_components.vallox_autopilot.storage import StrictStore


class StorageTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.hass = HomeAssistant(self.tmp.name)
        self.store = StrictStore(self.hass, 1, 'test.ventilation')

    async def asyncTearDown(self):
        await self.hass.async_stop()
        self.tmp.cleanup()

    async def test_loads_native_store_without_migration_and_keeps_envelope(self):
        await Store(self.hass, 1, self.store.key).async_save({'enabled': True})
        self.assertEqual(await self.store.async_load(), {'enabled': True})
        await self.store.async_save({'enabled': False})
        self.assertEqual(json.loads(self.store.path.read_text()), {
            'version': 1, 'minor_version': 1, 'key': self.store.key,
            'data': {'enabled': False},
        })

    async def test_invalid_or_future_storage_is_not_silently_reset(self):
        self.store.path.parent.mkdir(parents=True, exist_ok=True)
        for content in ['null', '{', '{"version":2,"data":{}}']:
            self.store.path.write_text(content)
            with self.assertRaises(Exception):
                await self.store.async_load()
            self.assertEqual(self.store.path.read_text(), content)

    async def test_cancelled_write_cannot_overwrite_newer_snapshot(self):
        entered, release = threading.Event(), threading.Event()
        original = self.store._write
        def slow(envelope):
            if envelope['data']['sequence'] == 1:
                entered.set()
                release.wait(5)
            original(envelope)
        with patch.object(self.store, '_write', slow):
            old = asyncio.create_task(self.store.async_save({'sequence': 1}))
            await self.hass.async_add_executor_job(entered.wait, 5)
            old.cancel()
            newer = asyncio.create_task(self.store.async_save({'sequence': 2}))
            await asyncio.sleep(0)
            self.assertFalse(newer.done())
            release.set()
            with self.assertRaises(asyncio.CancelledError):
                await old
            await newer
        self.assertEqual(await self.store.async_load(), {'sequence': 2})
