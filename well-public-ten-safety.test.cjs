const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

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
  const registry = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf8');
  const records = new Map(designs.map(([id]) => [id, { id }]));
  for (const [id, filename] of designs) {
    const marker = `if(records.has('${id}'))Object.assign(records.get('${id}'),`;
    const start = registry.indexOf(marker);
    assert.notEqual(start, -1, `${id} has a public registry entry`);
    vm.runInNewContext(registry.slice(start, registry.indexOf('\n', start)), { records });
    const entry = records.get(id);
    assert.equal(entry.expanded, true);
    assert.ok(entry.purpose.length > 35);
    assert.match(entry.evidence, /no |not |unverified|untested|unknown/i);
    assert.ok(entry.contributors.length > 30);
    assert.equal(entry.sources, `https://github.com/RayPeloquin/mimirs-well/blob/main/public-notes/${filename}`);
    const notePath = path.join(__dirname, 'public-notes', filename);
    assert.ok(fs.existsSync(notePath), `${filename} is a publishable public note`);
    const note = fs.readFileSync(notePath, 'utf8');
    for (const heading of ['## Public purpose', '## Evidence limits', '## Next check', '## Credits and scope']) {
      assert.ok(note.includes(heading), `${filename} retains ${heading}`);
    }
    assert.ok(note.length < 1200, `${filename} stays purpose-level and compact`);
    assert.doesNotMatch(note, /## Source-based interpretation|## Archived source|BEGIN PRIVATE KEY|PRIVATE ARCHIVE BLOCK|password|API key/i);
  }
});
