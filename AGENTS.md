# Vallox Autopilot

<!-- workspace-pointer -->
## Shared workspace rules

Part of the bitosome Home Assistant workspace. Shared rules, access (SSH, ha-mcp) and processes
are in `../AGENTS.md` (the workspace entry point) and `../home-assistant-knowledge/`; they take
precedence over this file. Build, test, release and known gotchas for this repo:
[repo catalog](../home-assistant-knowledge/docs/repo-catalog.md#vallox-autopilot).

- Edit and release from this checkout; never patch production directly.
- Push, tag/release, HACS install, production changes, reloads and restarts need the owner's explicit approval.
- Shared UI comes from `@bitosome/ha-card-ui` (exact release tarball pin). Build anything two or more cards use there first; follow `../home-assistant-knowledge/docs/card-style-guide.md`.
- After a release or install, update `docs/current-state.md` and `docs/changelog.md` in the knowledge repo.

Keep all product code here. No production snapshots, credentials, addresses or installation-specific entity lists in this public repository.

The controller is the only writer. Policy must remain independently testable. Preserve native defrost, heater and balanced-airflow ownership; never infer requested speed from measured speed. Persist command intent before sending, and do not perform physical actions from the frontend. Any change to control policy needs behavioral tests against actual Home Assistant APIs.

Use the `@bitosome/ha-card-ui` package for Space Hub tokens/glow, modal behavior and common components, with the NIBE visual hierarchy. Preserve native MDI icons, keyboard/touch targets, compact shared settings, availability and visible errors. Do not copy or fork shared implementations; change the library and update its pinned dependency.

Run npm run check and Python unittest tests before release. Build and commit the bundled card. Keep package, manifest, constant and module versions aligned. Release/deploy only within user-authorized scope. Do not enable control implicitly during setup.
