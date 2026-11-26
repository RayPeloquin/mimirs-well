const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const designs = [
  ['quantum-shepherd', 'quantum-shepherd.md', 'Quantum Shepherd'],
  ['quantum-sovereign-stack', 'quantum-sovereign-stack.md', 'Quantum Sovereign Stack'],
  ['dog-soundboard-communication-protocol', 'dog-soundboard.md', 'Dog Soundboard — Communication protocol'],
  ['jaguar-mode', 'jaguar-mode.md', 'Jaguar Mode'],
  ['ghost-fiber', 'ghost-fiber.md', 'Ghost Fiber'],
  ['asteris-desktop-steward', 'asteris-desktop-steward.md', 'Asteris Desktop Steward'],
  ['ocean-boundary-residual-inference', 'ocean-boundary-residual-inference.md', 'Ocean Boundary Residual Inference'],
  ['mosquito-reaper', 'mosquito-reaper.md', 'Mosquito Reaper'],
  ['drone-rotor-d1', 'drone-rotor-d1.md', 'Drone Rotor D1'],
  ['bamboo-rf-agricultural-tolerance-concept', 'bamboo-rf.md', 'BAMBOO-RF — Agricultural tolerance concept'],
];

test('third ten archived cards render bounded source-linked expanded records', () => {
  const { reviews } = require('./registry.js');
  const catalog = readText(path.join(__dirname, 'catalog.js'));
  for (const [id, filename, title] of designs) {
    assert.ok(catalog.includes(title), `missing catalog card: ${title}`);
    const record = reviews.get(id);
    assert.ok(record, `missing reviewed record: ${id}`);
    assert.equal(record.expanded, true, `${id}: not marked expanded`);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 20, `${id}: missing ${field}`);
    }
    const link = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], link, `${id}: no linked public digest`);
    const notePath = path.join(__dirname, 'design-notes', filename);
    assert.ok(fs.existsSync(notePath), `no digest ${filename}`);
    const digest = readText(notePath);
    assert.match(digest, /^# /);
    assert.match(digest, /Status:/i);
    assert.match(digest, /## Evidence limits\n/i);
    assert.match(digest, /## Next check\n/i);
    assert.match(digest, /\b(no|not|untested|unverified|unbuilt)\b/i);
    assert.doesNotMatch(digest, /PRIVATE ARCHIVE BLOCK|Not for public distribution|BEGIN PRIVATE KEY|password|API key|PAC-3/i);
  }
});
