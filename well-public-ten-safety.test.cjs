const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const designs = [
  ['herdminder-hm-01', 'herdminder-hm-01.md'],
  ['uss-eldridge-working-physics-research', 'uss-eldridge-working-physics.md'],
  ['hidden-heat-mathematical-study', 'hidden-heat.md'],
  ['raptor-veil', 'raptor-veil.md'],
  ['paperpower-water-battery', 'paperpower.md'],
  ['atlas-cistern', 'atlas-cistern.md'],
  ['firewell-silo-wildfire-relief', 'firewell.md'],
  ['lifeguard-lance-rescue-drone-and-fleet', 'lifeguard-lance.md'],
  ['resonant-edge-masonry-saw', 'resonant-edge.md'],
  ['vortexcap-supercapacitor', 'vortexcap.md'],
];

test('ten archived titles expose only purpose-level public notes with evidence boundaries', () => {
  const { reviews } = require('./registry.js');
  for (const [id, filename] of designs) {
    const entry = reviews.get(id);
    assert.ok(entry, `missing reviewed record: ${id}`);
    assert.equal(entry.expanded, true);
    assert.ok(entry.purpose.length > 35);
    assert.match(entry.evidence, /no |not |unverified|untested|unknown/i);
    assert.ok(entry.contributors.length > 30);
    assert.equal(entry.sources, `https://github.com/RayPeloquin/mimirs-well/blob/main/public-notes/${filename}`);
    const notePath = path.join(__dirname, 'public-notes', filename);
    assert.ok(fs.existsSync(notePath), `${filename} is a publishable public note`);
    const note = readText(notePath);
    for (const heading of ['## Public purpose', '## Evidence limits', '## Next check', '## Credits and scope']) {
      assert.ok(note.includes(heading), `${filename} retains ${heading}`);
    }
    assert.ok(note.length < 1200, `${filename} stays purpose-level and compact`);
    assert.doesNotMatch(note, /## Source-based interpretation|## Archived source|BEGIN PRIVATE KEY|PRIVATE ARCHIVE BLOCK|password|API key/i);
  }
});
