# Native Vallox settings and cold weather

This controller adds demand planning above Home Assistant's native Vallox integration. It does not replace MyVallox firmware or commissioning.

## What the native integration exposes

Home Assistant's `fan.set_percentage` sets the speed of the **currently active profile**. Zero shuts down ventilation, so Autopilot never requests zero. Profile selectors, Home/Away/Boost supply-temperature numbers, bypass lock, filter-change date, temperatures, RH, CO₂, fan speed/RPM, post-heater status and heat-recovery state are native entities when the unit supports them. Availability depends on the model and firmware.

Autopilot operates only in Home/Away. It leaves other profiles to the device, and does not set a native Boost profile because that would introduce another timer/owner. The configured speed is not an airflow measurement or guaranteed actual fan percentage.

Native per-profile RH/CO₂ control, humidity basic level/automatic mode, CO₂ setpoint, supply/extract ratio, heater configuration and detailed defrost parameters can exist in the local MyVallox API without being exposed as HA setting entities. This integration does **not** make undocumented register writes or override them. Manage commissioning settings in MyVallox with the unit's manual/installer.

## Sauna and ownership

When sauna is active (or its state is unknown), Autopilot removes its house/shower humidity demand. Native RH boosting remains enabled if configured in MyVallox. The card explicitly explains this. For strictly exclusive HA humidity control, the owner's/installer's separate decision to disable native RH boosting in the used profiles is necessary; that also removes the unit's independent humidity fallback when HA is down. Native CO₂ control should remain an independent fallback. Never claim a native RH boost is a fault or silently fight it by repeatedly lowering the requested setting.

## Estonia / sub-zero conditions

Keep heat recovery, factory defrost logic and commissioned supply/extract balance. Do not disable post/additional heating required by the configured defrost method. Supply-air temperature is a comfort/energy setting; a low target does not replace defrost protection. Manufacturer guidance generally recommends supply a few degrees below room temperature, with final settings depending on the system.

Autopilot can lower its humidity thresholds by a configurable number of percentage points below an outside-temperature threshold. Set the reduction to zero to disable this policy. It has no surface-temperature or dew-point inputs, so cannot prove condensation prevention. It does not cap ventilation solely because it is cold, and reports unavailable readings instead of interpreting them as zero.

Native measured fan speed can differ from requested speed during internal humidity/CO₂ demand, protection or profile transitions. Do not retune balance or defrost to make two dashboard numbers match.

## Filter maintenance

The filter entity shows the device's recorded service schedule, not a direct measurement of filter cleanliness. Check the physical filters and correct the native change date only after actual maintenance. An old date may mean overdue service or simply an unrecorded change.

## Primary sources

- [Home Assistant Vallox integration](https://www.home-assistant.io/integrations/vallox/)
- [HA 2026.10.2 native fan implementation](https://github.com/home-assistant/core/blob/2026.10.2/homeassistant/components/vallox/fan.py)
- [Vallox cold-weather guidance](https://www.vallox.com/en/ventilation-unit-and-below-zero-weather/)
- [Vallox FAQ](https://www.vallox.com/en/support-and-instructions/frequently-asked-questions/)
- [MyVallox defrost settings manual](https://vallox.techmanuals.info/ValloxMV/ENG/help/webhelp/user_manual/topics/cloud/cloud_sulatusasetukset_1.html)
- [MyVallox Control manual](https://res.cloudinary.com/vallox/image/upload/v1692707935/FileStock/ValidManuals/Manual_Vallox_MyVallox_Control_ENG.pdf)

Reviewed 2026-10-23. No installation-specific raw metrics, addresses or credentials belong in this public repository.
