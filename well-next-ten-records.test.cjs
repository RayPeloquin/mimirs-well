const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// An omitted or misnamed override would leave a visitor seeing an archive-only card.
const designs = [
  ['wi-fi-sensing-for-accessible-homes', 'wifi-sensing-accessible-homes.md', 'Wi-Fi Sensing for Accessible Homes'],
  ['child-safety-search-assist', 'child-safety-search-assist.md', 'Child Safety Search Assist'],
  ['diamond-thermoelectric-power-source', 'diamond-thermoelectric.md', 'Diamond Thermoelectric Power Source'],
  ['radio-echo-chamber', 'radio-echo-chamber.md', 'Radio Echo Chamber'],
  ['chihuahua-sphere-cs-1', 'chihuahua-sphere.md', 'Chihuahua Sphere / CS-1'],
  ['stellar-nursery-01', 'stellar-nursery-01.md', 'Stellar Nursery-01'],
  ['lunarecycle-backplate', 'lunarecycle-backplate.md', 'LunaRecycle Backplate'],
  ['asteris-daydream-loop', 'asteris-daydream-loop.md', 'Asteris Daydream Loop'],
  ['fireground-fusion-hud', 'fireground-fusion-hud.md', 'FIREGROUND FUSION HUD'],
  ['small-farm-community', 'small-farm-community.md', 'Small Farm Community'],
];

test('next ten catalog entries render expanded details and their published sources', () => {
  const source = readText(path.join(__dirname, 'registry.js'));
  const catalog = readText(path.join(__dirname, 'catalog.js'));
  const records = new Map(designs.map(([id]) => [id, { id, purpose: 'Archive title only' }]));
  for (const [id, filename, title] of designs) {
    assert.ok(catalog.includes(title), `catalog lost ${title}`);
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
    const link = `https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/${filename}`;
    assert.equal(record.sources.split('\n')[0], link, `${id}: public note not first source`);
    const noteFile = path.join(__dirname, 'design-notes', filename);
    assert.ok(fs.existsSync(noteFile), `${filename} missing`);
    const note = readText(noteFile);
    assert.match(note, /^# /);
    assert.match(note, /Status:/);
    assert.match(note, /## Evidence limits\n/);
    assert.match(note, /## Next check\n/);
    assert.match(note, /\b(no|not|unverified|unbuilt|untested)\b/i);
    assert.doesNotMatch(note, /PRIVATE ARCHIVE BLOCK|Not for public distribution|BEGIN PRIVATE KEY|API key|password/i);
  }
});
