import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, existsSync } from 'node:fs';

test('family behavior is a bundled package dependency, not a vendored fork', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.ok(pkg.dependencies['@bitosome/ha-card-ui']);
  assert.equal(lock.packages[''].dependencies['@bitosome/ha-card-ui'], pkg.dependencies['@bitosome/ha-card-ui']);
  for (const file of ['card-primitives.ts', 'design-tokens.ts', 'glow.ts'])
    assert.equal(existsSync(new URL('../src/shared/' + file, import.meta.url)), false);
});

test('card CSS uses the shared semantic aliases instead of private status colours', () => {
  for (const file of ['styles.ts', 'curves.ts', 'history.ts']) {
    const source = readFileSync(new URL('../src/' + file, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /--status-(success|warn|alert|active)-color|--(success|warning|error)-color|var\(--(surface|muted)\)|system-ui/);
    assert.doesNotMatch(source, /class="notice|\.notice\b|\.pill\.active/);
  }
  const styles = readFileSync(new URL('../src/styles.ts', import.meta.url), 'utf8');
  assert.match(styles, /familyStyles,/);
  assert.match(styles, /var\(--family-(success|warning|error)\)/);
});
