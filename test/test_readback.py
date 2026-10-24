"""Native telemetry refresh scheduling and lifecycle without physical hardware."""

import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock, patch

from custom_components.vallox_autopilot.readback import SpeedReadback


class ReadbackTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.hass = SimpleNamespace(services=SimpleNamespace(async_call=AsyncMock()))
        self.updated = AsyncMock()
        self.readback = SpeedReadback(self.hass, self.updated)
        self.timers = []

        def later(hass, delay, callback):
            cancel = Mock()
            self.timers.append((delay, callback, cancel))
            return cancel

        self.patch = patch('custom_components.vallox_autopilot.readback.async_call_later', later)
        self.patch.start()
        self.addCleanup(self.patch.stop)

    async def test_bounded_read_only_refreshes(self):
        self.readback.start('fan.native')
        self.assertEqual([t[0] for t in self.timers], [5, 15, 30])
        self.assertTrue(self.readback.active)
        for _, callback, _ in self.timers:
            await callback(None)
        self.assertFalse(self.readback.active)
        self.assertEqual(self.updated.await_count, 3)
        for call in self.hass.services.async_call.call_args_list:
            self.assertEqual(call.args, ('homeassistant', 'update_entity', {'entity_id': 'fan.native'}))
            self.assertEqual(call.kwargs, {'blocking': True})

    async def test_replaced_command_and_unload_cancel_old_callbacks(self):
        self.readback.start('fan.old')
        old = list(self.timers)
        self.readback.start('fan.new')
        for _, callback, cancel in old:
            cancel.assert_called_once()
            await callback(None)
        self.hass.services.async_call.assert_not_called()
        self.readback.close()
        for _, callback, _ in self.timers:
            await callback(None)
        self.hass.services.async_call.assert_not_called()
        self.assertFalse(self.readback.active)

    async def test_refresh_failure_is_visible_and_next_read_can_recover(self):
        self.readback.start('fan.native')
        self.hass.services.async_call.side_effect = RuntimeError('Offline')
        await self.timers[0][1](None)
        self.assertIn('unavailable', self.readback.error)
        self.hass.services.async_call.side_effect = None
        await self.timers[1][1](None)
        self.assertEqual(self.readback.error, '')
        self.assertEqual(self.updated.await_count, 2)

    async def test_close_during_refresh_does_not_publish(self):
        self.readback.start('fan.native')
        async def close_during_call(*args, **kwargs):
            self.readback.close()
        self.hass.services.async_call.side_effect = close_during_call
        await self.timers[0][1](None)
        self.updated.assert_not_called()
