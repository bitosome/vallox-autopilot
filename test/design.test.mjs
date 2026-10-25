import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('vendored family primitives match their pinned source manifest', () => {
  const base = new URL('../src/shared/', import.meta.url);
  const provenance = JSON.parse(readFileSync(new URL('DESIGN_PROVENANCE.json', base), 'utf8'));
  assert.equal(provenance.source, 'bitosome/space-hub-card');
  for (const [file, hash] of Object.entries(provenance.files)) {
    const vendored = readFileSync(new URL(file, base), 'utf8');
    assert.ok(vendored.startsWith(`// VENDORED from ${provenance.source} design ${provenance.version}. See DESIGN_PROVENANCE.json.\n`));
    const canonical = vendored.slice(vendored.indexOf('\n') + 1);
    assert.equal(createHash('sha256').update(canonical).digest('hex'), hash, file);
  }
});
