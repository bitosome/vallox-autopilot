# Shared UI dependency

This card imports `@bitosome/ha-card-ui` at build time. The package version and integrity are pinned in `package-lock.json`; its code is bundled into the self-contained HACS JavaScript asset. No second card or runtime download is required.

The package owns the family tokens, Space Hub under-tile glow, shared components, and modal lifecycle/navigation. Fix common behavior in [ha-card-ui](https://github.com/bitosome/ha-card-ui), then update the pinned dependency; do not vendor or fork implementations here.

The visual foundation comes from [Space Hub Card](https://github.com/bitosome/space-hub-card) (MIT). Domain controls, entity validation, history requests, and command confirmation remain in this repository.
