# Vallox Autopilot

A Home Assistant integration and bundled dashboard card for gradual, configurable ventilation using an existing native **Vallox MV** integration.

![Ventilation controls](docs/card.jpg)

## Install

1. Install the native Vallox integration and confirm its fan, humidity, CO₂ and temperature entities work.
2. Add `https://github.com/bitosome/vallox-autopilot` to HACS as an **Integration**, download and restart Home Assistant.
3. Add **Vallox Autopilot** in Settings → Devices & services. Select the native fan, dry-house humidity sensors, shower humidity, CO₂ and heat-recovery/outdoor sensors. Leave the occupancy input empty to use the integration’s shared Home mode switch (`on` = Home, `off` = Away). For sauna detection, choose heater current sensors in amperes, or an existing external sauna binary sensor. Keep shower sensors out of the dry-house group.
4. Add the **Vallox Autopilot** dashboard card and select its Status sensor. The module registers automatically; YAML dashboards can load `/vallox_autopilot/card.js?v=0.2.0` as a JavaScript module.
5. Review settings before turning Auto on. New controllers start **off**.

```yaml
type: custom:vallox-autopilot-card
entity: sensor.vallox_autopilot_status
name: Ventilation
```

## Control policy

- Independent dry-house humidity, shower absolute humidity, shower excess over the dry-house mean, and CO₂ demands. The highest demand wins.
- Linear interpolation between configurable start/full-boost thresholds. Home/away baselines, maximum boost, up/down ramp and release delay are configurable.
- Sauna suppresses **this controller's** humidity demand. CO₂ and manual boost remain available. Native Vallox RH/CO₂ sensors may still increase actual airflow independently.
- Winter optionally lowers humidity thresholds below a configurable outside temperature. This is a configurable condensation-management policy, not a substitute for dew-point/surface-temperature measurement.
- Manual Boost is a timed demand. It immediately requests the configured boost speed, works with Auto off, and restores the prior requested speed when it expires if nobody changed the fan. With Auto on, demand falls gradually after the release delay.
- Home/Away native profiles only. Fireplace, Extra, Auto, native Boost, fan off, unavailable heat-recovery state and defrost suspend writes. The controller never shuts off ventilation, changes fan balance, bypass, heaters or defrost parameters.
- Changing the native requested percentage creates a temporary manual hold. Native **measured** speed changes do not. Resume releases a hold; Auto must be on for ongoing automatic control.
- Missing/stale sensor readings use at least the configured home baseline; known high CO₂/humidity demands may still increase speed. Missing sauna state inhibits controller humidity boost.
- Shared settings, Auto state, timed-boost deadline, override hold and recent command history persist in Home Assistant. Back up HA configuration including `.storage`; ordinary restarts and integration updates preserve them.

The defaults are starting values, **not commissioned airflow rates**. Set the minimums according to your unit's ventilation commissioning and house needs. Units supported: humidity `%`, CO₂ `ppm`, temperature `°C`. Sensors must report within the configurable freshness interval.

## Entities and settings

One device contains Status, dry-house/shower humidity, CO₂, target speed, Automation and Home mode switches, Sauna active binary sensor, Boost / Cancel boost / Resume buttons, and number entities for all thresholds/timers/speeds. All users see the same settings. Native entity services allow automations, Companion/Watch and physical-switch integrations without wrapper scripts.

Configure entity mappings in the integration options. Use the card's Settings tab or number entities for individual values; use the options Tuning form to change interdependent thresholds together. Validation enforces `away ≤ home ≤ boost` and `start < full`. The card resolves entity IDs from the integration, so renaming entities is supported.

Home mode is shared and persisted across restarts and updates. When using an external occupancy entity, the internal Home mode switch is unavailable. Scenes can control the Home mode switch directly; no helper is needed.

Sauna detection uses the highest configured heater-current reading: above 1 A for 5 seconds activates it; all currents below the threshold for 15 minutes release it. These values are configurable. Missing current data makes Sauna active unavailable and inhibits controller humidity boosts. An active sauna survives restart with a fresh cooldown, so thermostat pauses do not prematurely enable humidity boosts.

History in Details records the latest 40 control decisions and interruptions. HA Recorder supplies longer native sensor/entity history. RAG labels reflect configured operating thresholds, including low-humidity warnings; they do not certify indoor air safety.

## Native Vallox and winter

Read [native settings and winter](docs/native-settings.md) before changing the unit's own settings. Requested speed and actual speed are deliberately separate. Native demand control can raise actual speed above our request; protections can also change operation.

## Development

```sh
npm ci
npm run check
python3.14 -m venv .venv
.venv/bin/pip install -r requirements-test.txt
.venv/bin/python -m unittest discover -s test -p 'test_*.py' -v
python3 -m http.server 8774 --bind 127.0.0.1
# http://127.0.0.1:8774/preview/ — synthetic data, no hardware calls
```

The controller is the only command writer; `engine.py` is pure policy, native HA platforms expose shared state, and the Lit card only calls entity services. Space Hub design tokens and glow helper are vendored with provenance; NIBE supplies the compact visual hierarchy. No runtime dependency on sibling repositories or cloud services.
