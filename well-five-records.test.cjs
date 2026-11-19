const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const designs = [
  ['asteris-relay-device-connection-and-handoff', 'asteris-relay.md'],
  ['emh-field-guide-gloves', 'emh-field-guide-gloves.md'],
  ['veil-e-edison-01', 'veil-e-edison-01.md'],
  ['choir-on-arqen', 'choir-on-arqen.md'],
  ['adaptive-qubit-allocator', 'adaptive-qubit-allocator.md'],
];

test('five archive entries receive real expanded project records linked to published notes', () => {
  const source = fs.readFileSync(path.join(__dirname, 'registry.js'), 'utf8');
  const records = new Map(designs.map(([id]) => [id, { id, purpose: 'Archive title only' }]));
  for (const [id, filename] of designs) {
    const marker = `if(records.has('${id}'))Object.assign(records.get('${id}'),`;
    const start = source.indexOf(marker);
    assert.notEqual(start, -1, `missing published override: ${id}`);
    const line = source.slice(start, source.indexOf('\n', start));
    vm.runInNewContext(line, { records });
    const record = records.get(id);
    assert.equal(record.expanded, true);
    for (const field of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
      assert.ok(typeof record[field] === 'string' && record[field].trim().length > 20, `${id}: missing ${field}`);
    }
    const published = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], published, `${id}: first source should be its public note`);
    assert.ok(fs.existsSync(path.join(__dirname, 'design-notes', filename)), `missing source note ${filename}`);
    const note = fs.readFileSync(path.join(__dirname, 'design-notes', filename), 'utf8');
    assert.match(note, /^# /);
    assert.match(note, /Status:/);
    assert.match(note, /Next check/i);
    assert.match(note, /not (yet )?(built|tested|validated|demonstrated)|no (prototype|experimental|measured|clinical|scored)/i);
  }
});
