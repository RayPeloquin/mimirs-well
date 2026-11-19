const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const candidates = [
  ['herdminder-hm-01', 'herdminder-hm-01.md', 'HerdMinder / HM-01'],
  ['uss-eldridge-working-physics-research', 'uss-eldridge-working-physics.md', 'USS Eldridge — Working-physics research'],
  ['hidden-heat-mathematical-study', 'hidden-heat.md', 'Hidden Heat — Mathematical study'],
  ['raptor-veil', 'raptor-veil.md', 'Raptor Veil'],
  ['paperpower-water-battery', 'paperpower.md', 'PaperPower — Water battery'],
  ['atlas-cistern', 'atlas-cistern.md', 'Atlas Cistern'],
  ['firewell-silo-wildfire-relief', 'firewell.md', 'Firewell — Silo wildfire relief'],
  ['lifeguard-lance-rescue-drone-and-fleet', 'lifeguard-lance.md', 'Lifeguard Lance — Rescue drone and fleet'],
  ['resonant-edge-masonry-saw', 'resonant-edge.md', 'Resonant Edge — Masonry saw'],
  ['vortexcap-supercapacitor', 'vortexcap.md', 'Vortexcap — Supercapacitor'],
];

test('next ten public purpose digests expand existing archive titles with evidence limits', () => {
  const registry = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf8');
  const catalog = fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8');
  const records = new Map(candidates.map(([id]) => [id, { id }]));
  for (const [id, filename, title] of candidates) {
    assert.ok(catalog.includes(title), `missing catalog title: ${title}`);
    const marker = `if(records.has('${id}'))Object.assign(records.get('${id}'),`;
    const start = registry.indexOf(marker);
    assert.notEqual(start, -1, `missing public record: ${id}`);
    vm.runInNewContext(registry.slice(start, registry.indexOf('\n', start)), { records });
    const record = records.get(id);
    assert.equal(record.expanded, true);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 25, `${id}: missing ${field}`);
    }
    const expected = `https://github.com/RayPeloquin/mimirs-well/blob/main/public-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], expected);
    const file = path.join(__dirname, 'public-notes', filename);
    assert.ok(fs.existsSync(file), `missing digest: ${filename}`);
    const note = fs.readFileSync(file, 'utf8');
    assert.match(note, /^# /);
    assert.match(note, /\*\*Status:\*\*/);
    assert.match(note, /## Evidence limits\n/);
    assert.match(note, /## Next check\n/);
    assert.match(note, /## Evidence limits\n\nNo /i, 'every digest must lead its evidence limits with a clear negative claim');
    assert.doesNotMatch(note, /BEGIN PRIVATE KEY|PRIVATE ARCHIVE BLOCK|Not for public distribution|password|API key/i);
  }
});
