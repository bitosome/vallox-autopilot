# Changelog

## 0.4.2

- Match the main speed and bar to the native fan adjustment value, labelled Fan speed setting.
- Keep unit-reported speed in Details; remove the request/demand subline.
- Keep metric status dots and accessible status descriptions without text badges.

## 0.4.0

- Replace threshold sliders with directly draggable multi-point response curves, with point addition/removal, touch/keyboard controls and precise numeric editing.
- Independently edit Home/Away occupancy responses for humidity, shower rise and CO₂.
- Apply validated piecewise interpolation in the controller; retain existing demand unchanged until edited.
- Persist shared curves with revision checks, save-failure feedback and conflict recovery. Keep native protections, sauna inhibition, global bounds and ramp/cooldown.


## 0.3.3

- Add a subtle theme-coloured fan and airflow animation to the main tile, paced by reported fan speed.
- Keep unavailable/stopped fans still and honour reduced-motion preferences; preserve all controls and readings.

## 0.3.1

- Stop boost immediately returns to current automatic demand instead of waiting through the normal cooldown and slow ramp-down.
- Preserve pending cancellation across restart/native protection, respect external fan changes, and retain visible command failures.
- Automatic timer expiry retains the normal gradual release; Auto-off cancellation restores the pre-boost speed.

## 0.3.0

- Editable Home/Away fan-response curves for house humidity, shower humidity, shower rise and CO₂, with current readings and winter offsets.
- Fix false stale-input fallback for unchanged readings from connected ESPHome devices; offline and invalid readings remain guarded.
- Name affected sensors in fallback details and distinguish unknown sauna state from an active sauna.
- Report Sensor fallback when missing inputs raise the Away baseline.

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
