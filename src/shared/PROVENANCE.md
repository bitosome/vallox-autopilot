# Shared design provenance

- `design-tokens.ts` is an exact copy of Space Hub Card `src/shared/design-tokens.ts` at commit `06ac33e6713482bbb1ad2f43c1ed67945f832e18`, inspected 2026-10-07.
- `glow.ts` is copied from Robot Vacuum Cleaner Card `src/shared/glow.ts` at commit `7cd3b6ff6b23180db8b051e622ba31f26f89790d`: the scoped Space Hub `buildGlow` extraction also shared by SmartEVSE Dual Charger Card. Its canonical source is Space Hub Card `src/glow.ts`.
- Tile surfaces and isolated under-tile stacking follow Space Hub `src/styles/base.styles.ts`. This card uses static, not pulsing, glows.

Upstream: https://github.com/bitosome/space-hub-card (MIT). Retain attribution and synchronize tokens from upstream rather than editing the vendored copy. There is no runtime dependency on another custom card.
