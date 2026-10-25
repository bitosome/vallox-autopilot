# Shared design provenance

- `design-tokens.ts` and `card-primitives.ts` are controlled Space Hub copies. `DESIGN_PROVENANCE.json` pins their design version, source commit and SHA-256 hashes. Synchronize at the source using `scripts/sync-card-design.mjs`; do not edit these consumer copies.
- `glow.ts` is copied from Robot Vacuum Cleaner Card `src/shared/glow.ts` at commit `7cd3b6ff6b23180db8b051e622ba31f26f89790d`: the scoped Space Hub `buildGlow` extraction also shared by SmartEVSE Dual Charger Card. Its canonical source is Space Hub Card `src/glow.ts`.
- Tile surfaces and isolated under-tile stacking follow Space Hub `src/styles/base.styles.ts`. This card uses static, not pulsing, glows.

Upstream: https://github.com/bitosome/space-hub-card (MIT). Retain attribution and synchronize tokens from upstream rather than editing the vendored copy. There is no runtime dependency on another custom card.
