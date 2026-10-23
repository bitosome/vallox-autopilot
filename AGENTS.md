# Vallox Autopilot

Keep all product code here. No production snapshots, credentials, addresses or installation-specific entity lists in this public repository.

The controller is the only writer. Policy must remain independently testable. Preserve native defrost, heater and balanced-airflow ownership; never infer requested speed from measured speed. Persist command intent before sending, and do not perform physical actions from the frontend. Any change to control policy needs behavioral tests against actual Home Assistant APIs.

Use Space Hub vendored design tokens/glow and the NIBE visual hierarchy. Preserve native MDI icons, keyboard/touch targets, compact shared settings, availability and visible errors. Do not hand-edit vendored shared code without upstream provenance.

Run npm run check and Python unittest tests before release. Build and commit the bundled card. Keep package, manifest, constant and module versions aligned. Release/deploy only within user-authorized scope. Do not enable control implicitly during setup.
