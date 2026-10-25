# Vallox Autopilot

Keep all product code here. No production snapshots, credentials, addresses or installation-specific entity lists in this public repository.

The controller is the only writer. Policy must remain independently testable. Preserve native defrost, heater and balanced-airflow ownership; never infer requested speed from measured speed. Persist command intent before sending, and do not perform physical actions from the frontend. Any change to control policy needs behavioral tests against actual Home Assistant APIs.

Use the `@bitosome/ha-card-ui` package for Space Hub tokens/glow, modal behavior and common components, with the NIBE visual hierarchy. Preserve native MDI icons, keyboard/touch targets, compact shared settings, availability and visible errors. Do not copy or fork shared implementations; change the library and update its pinned dependency.

Run npm run check and Python unittest tests before release. Build and commit the bundled card. Keep package, manifest, constant and module versions aligned. Release/deploy only within user-authorized scope. Do not enable control implicitly during setup.
