const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const designs = [
  ['mirrorbox-m01', 'mirrorbox-m01.md', 'MIRRORBOX M01'],
  ['rubiq', 'rubiq.md', 'RUBIQ'],
  ['aether-latch-memory', 'aether-latch-memory.md', 'Aether-Latch Memory'],
  ['polyforge-1-ocean-cleanup-ship', 'polyforge-1.md', 'Polyforge-1 — Ocean cleanup ship'],
  ['shell-city-inverted-mushroom-barn', 'shell-city.md', 'Shell City — Inverted-mushroom barn'],
  ['underground-cattle-barn', 'underground-cattle-barn.md', 'Underground Cattle Barn'],
  ['khepri-stride-sneaker-concept', 'khepri-stride.md', 'Khepri Stride — Sneaker concept'],
  ['canine-wearable', 'canine-wearable.md', 'Canine Wearable'],
  ['euplectella-node-a-node-b', 'euplectella-node.md', 'Euplectella Node A / Node B'],
  ['hydrator-neo-pizza-station', 'hydrator-neo.md', 'Hydrator Neo — Pizza station'],
];

test('ten illustrated archive cards have source-limited public detail records', () => {
  const source = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf8');
  const catalog = fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8');
  const records = new Map(designs.map(([id]) => [id, { id, purpose: 'Archive title only' }]));
  for (const [id, filename, title] of designs) {
    assert.ok(catalog.includes(title), `catalog missing ${title}`);
    const marker = `if(records.has('${id}'))Object.assign(records.get('${id}'),`;
    const start = source.indexOf(marker);
    assert.notEqual(start, -1, `missing expanded override: ${id}`);
    vm.runInNewContext(source.slice(start, source.indexOf('\n', start)), { records });
    const record = records.get(id);
    assert.equal(record.expanded, true);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 20, `${id}: missing ${field}`);
    }
    const link = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], link);
    const file = path.join(__dirname, 'design-notes', filename);
    assert.ok(fs.existsSync(file), `missing ${filename}`);
    const note = fs.readFileSync(file, 'utf8');
    assert.match(note, /^# /);
    assert.match(note, /Status:/);
    assert.match(note, /## Evidence limits\n/);
    assert.match(note, /## Next check\n/);
    assert.match(note, /concept (image|art|illustration|poster)|illustrated concept|archived (diagram|poster|image)/i);
    assert.match(note, /\b(no|not|untested|unverified|unbuilt)\b/i);
    assert.doesNotMatch(note, /PRIVATE ARCHIVE BLOCK|Not for public distribution|BEGIN PRIVATE KEY|API key|password/i);
  }
});
