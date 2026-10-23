# Changelog

## 0.2.1

- Fix clearing optional entity bindings in the native options form: suggested values no longer reinsert removed legacy sources.

## 0.2.0

- Added persistent shared Home mode switch for scene control without a legacy helper.
- Added Sauna active sensor derived directly from heater current sensors, with configurable activation and cooldown delays and conservative restart recovery.
- Optional external occupancy/sauna inputs remain supported; self-referential mappings are rejected.
- Card exposes Home/Away control, sauna state and detector settings.

## 0.1.0

- Configurable native-Vallox demand controller with separate house/shower humidity, relative shower excess, CO₂ and occupancy baselines.
- Gradual speed changes, cooldown, sauna inhibition of controller humidity demand and configurable winter thresholds.
- Timed boost, external manual hold, conservative sensor fallback and native profile/defrost protection.
- Shared persistent entity settings, restart-safe timers and recent decision history.
- Bundled HACS card using Space Hub tokens/glows and the NIBE hierarchy, with RAG badges, native controls and settings.
