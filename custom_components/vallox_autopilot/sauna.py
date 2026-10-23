"""Debounced sauna activity. Missing current measurements never mean heater off."""

from dataclasses import dataclass


@dataclass
class SaunaDetector:
    current: bool | None = None
    candidate: bool | None = None
    since: float | None = None

    def observe(self, values, threshold, now, on_seconds, off_seconds):
        if not values or any(value is None for value in values):
            self.candidate = self.since = None
            return None, None
        target = max(values) > threshold
        if target == self.current:
            self.candidate = self.since = None
            return self.current, None
        if target != self.candidate or self.since is None:
            self.candidate, self.since = target, now
        # Initial known idle needs no release delay; there is no retained active session.
        delay = on_seconds if target else off_seconds if self.current is True else 0
        deadline = self.since + delay
        if now >= deadline:
            self.current = target
            self.candidate = self.since = None
            return target, None
        return self.current, deadline
