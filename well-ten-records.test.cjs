const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const designs = [
  ['smt-r1-authenticated-update-governance', 'smt-r1.md'],
  ['safe-channel-negative-space-mapper', 'safe-channel.md'],
  ['truthmap', 'truthmap.md'],
  ['quantum-judge', 'quantum-judge.md'],
  ['crystal-security', 'crystal-security.md'],
  ['crystal-damping-loop', 'crystal-damping-loop.md'],
  ['adaptive-pulse-process-control-appc', 'appc.md'],
  ['quantum-quiet', 'quantum-quiet.md'],
  ['medi-goo', 'medi-goo.md'],
  ['sound-bus', 'sound-bus.md'],
];

test('ten archive entries become evidence-bounded, source-backed public records', () => {
  const { reviews } = require('./registry.js');
  for (const [id, filename] of designs) {
    const record = reviews.get(id);
    assert.ok(record, `missing reviewed record: ${id}`);
    assert.equal(record.expanded, true, `${id} not expanded`);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 20, `${id}: missing ${field}`);
    }
    const published = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], published, `${id}: first source not public note`);
    const notePath = path.join(__dirname, 'design-notes', filename);
    assert.ok(fs.existsSync(notePath), `missing source note ${filename}`);
    const note = readText(notePath);
    assert.match(note, /^# /);
    assert.match(note, /Status:/);
    assert.match(note, /Next check/i);
    assert.match(note, /## Evidence limits\n[\s\S]{20,}/i);
    assert.match(note, /\b(no|not|unverified)\b/i);
    assert.doesNotMatch(note, /PRIVATE ARCHIVE BLOCK|Not for public distribution|password|API key|PAC-3|intercept evasion/i);
  }
});
