"""Bounded native telemetry refreshes after a speed command, never actuator writes."""

import asyncio
import logging

from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)
READBACK_DELAYS = (5, 15, 30)


class SpeedReadback:
    """Let the native integration sample spin-up/down before its next 60s poll."""

    def __init__(self, hass, updated):
        self.hass = hass
        self.updated = updated
        self.cancels = []
        self.generation = 0
        self.remaining = 0
        self.error = ""

    @property
    def active(self):
        return self.remaining > 0

    def start(self, entity_id):
        self.close()
        self.error = ""
        generation = self.generation
        self.remaining = len(READBACK_DELAYS)

        async def refresh(_now):
            if generation != self.generation:
                return
            try:
                # Public HA service: the native Vallox coordinator owns network
                # access, refresh coalescing and availability of all its entities.
                async with asyncio.timeout(15):
                    await self.hass.services.async_call(
                        "homeassistant", "update_entity",
                        {"entity_id": entity_id}, blocking=True,
                    )
                if generation == self.generation:
                    self.error = ""
            except Exception:
                if generation == self.generation:
                    self.error = "Speed refresh unavailable; waiting for the native update"
                _LOGGER.debug("Native fan telemetry refresh failed", exc_info=True)
            finally:
                if generation == self.generation:
                    self.remaining -= 1
                    await self.updated()

        self.cancels = [
            async_call_later(self.hass, delay, refresh) for delay in READBACK_DELAYS
        ]

    def close(self):
        self.generation += 1
        for cancel in self.cancels:
            cancel()
        self.cancels.clear()
        self.remaining = 0
