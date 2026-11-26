const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const designs = [
  ['mirrorbox-m01', 'mirrorbox-m01.md', 'MIRRORBOX M01'],
  ['rubiq', 'rubiq.md', 'RUBIQ'],
  ['aether-latch-memory', 'aether-latch-memory.md', 'Aether-Latch Memory'],
  ['polyforge-1-ocean-cleanup-ship', 'polyforge-1.md', 'Polyforge-1 — Ocean cleanup ship'],
  ['euplectella-node-a-node-b', 'euplectella-node.md', 'Euplectella Node A / Node B'],
];

test('five retained illustrated archive cards have source-limited public detail records', () => {
  const { reviews } = require('./registry.js');
  const catalog = readText(path.join(__dirname, 'catalog.js'));
  for (const [id, filename, title] of designs) {
    assert.ok(catalog.includes(title), `catalog missing ${title}`);
    const record = reviews.get(id);
    assert.ok(record, `missing reviewed record: ${id}`);
    assert.equal(record.expanded, true);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 20, `${id}: missing ${field}`);
    }
    const link = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], link);
    const file = path.join(__dirname, 'design-notes', filename);
    assert.ok(fs.existsSync(file), `missing ${filename}`);
    const note = readText(file);
    assert.match(note, /^# /);
    assert.match(note, /Status:/);
    assert.match(note, /## Evidence limits\n/);
    assert.match(note, /## Next check\n/);
    assert.match(note, /concept (image|art|illustration|poster)|illustrated concept|archived (diagram|poster|image)/i);
    assert.match(note, /\b(no|not|untested|unverified|unbuilt)\b/i);
    assert.doesNotMatch(note, /PRIVATE ARCHIVE BLOCK|Not for public distribution|BEGIN PRIVATE KEY|API key|password/i);
  }
});
