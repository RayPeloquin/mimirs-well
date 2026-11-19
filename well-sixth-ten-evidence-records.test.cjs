const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const candidates = [
  ['knock-moth-pool-tile-mapping', 'knock-moth.md', 'Knock-Moth — Pool-tile mapping'],
  ['fluffy-01', 'fluffy-01.md', 'FLUFFY-01'],
  ['skipjack-lf-hover-feasibility', 'skipjack-lf.md', 'SKIPJACK-LF — Hover feasibility'],
  ['ndsm-01-neutrino-feasibility-study', 'ndsm-01.md', 'NDSM-01 — Neutrino feasibility study'],
  ['green-craft-exterior-concept', 'green-craft.md', 'Green Craft — Exterior concept'],
  ['butterfly-wanderings-coloring-book', 'butterfly-wanderings.md', 'Butterfly Wanderings — Coloring book'],
  ['bridle-1-monolithic-cellular-aerospike', 'bridle-1.md', 'BRIDLE-1 — Monolithic cellular aerospike'],
  ['bridle-2', 'bridle-2.md', 'BRIDLE-2'],
  ['papergrid-0', 'papergrid-0.md', 'PAPERGRID-0'],
  ['off-grid-ranch-water-system', 'off-grid-ranch-water-system.md', 'Off-Grid Ranch Water System'],
];

test('ten more existing archive cards expose bounded public notes and expanded project records', () => {
  const registry = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf8');
  const catalog = fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8');
  const records = new Map(candidates.map(([id]) => [id, { id }]));

  for (const [id, filename, title] of candidates) {
    assert.ok(catalog.includes(title), `${title}: archive title missing`);
    const marker = `if(records.has('${id}'))Object.assign(records.get('${id}'),`;
    const start = registry.indexOf(marker);
    assert.notEqual(start, -1, `${id}: no published record`);
    vm.runInNewContext(registry.slice(start, registry.indexOf('\n', start)), { records });
    const record = records.get(id);
    assert.equal(record.expanded, true, `${id}: not expanded`);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 25,
        `${id}: ${field} not evidenced`);
    }
    assert.equal(record.sources.split('\n')[0],
      `https://github.com/RayPeloquin/mimirs-well/blob/main/public-notes/${filename}`);
    const digestPath = path.join(__dirname, 'public-notes', filename);
    assert.ok(fs.existsSync(digestPath), `${filename}: public note absent`);
    const note = fs.readFileSync(digestPath, 'utf8');
    assert.match(note, /^# /);
    assert.match(note, /\*\*Status:\*\*/);
    assert.match(note, /## Evidence limits\n\nNo /i);
    assert.match(note, /## Next check\n/);
    assert.match(note, /## Source and attribution\n/);
    assert.doesNotMatch(note, /BEGIN PRIVATE KEY|PRIVATE ARCHIVE BLOCK|Not for public distribution|API key|password/i);
  }
});
