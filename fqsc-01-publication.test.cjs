const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;

function element(tag) {
  return {
    tag, children: [], dataset: {}, textContent: '', href: '',
    append(...items) { this.children.push(...items); },
    querySelector(selector) { return selector === 'h3' ? this.children.find(child => child.tag === 'h3') : null; },
    querySelectorAll(selector) { return selector === '.card' ? this.children.filter(child => child.className === 'card') : []; },
  };
}

test('FQSC-01 appears in the physics catalog with a dedicated design page', () => {
  const grid = element('div');
  const document = {
    createElement: element,
    querySelector(selector) { return selector === '.grid' ? grid : null; },
    querySelectorAll() { return []; },
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'catalog.js'), 'utf8'), { document, wellArmoryDivisions: require('./armory-data.js') });
  const card = grid.children.find(node => node.children.some(child => child.tag === 'h3' && child.textContent === 'FQSC-01'));
  assert.ok(card, 'the physics catalog must render the actual FQSC-01 design');
  assert.equal(card.dataset.category, 'physics');
  const link = card.children.find(child => child.tag === 'a');
  assert.equal(link?.href, 'fqsc-01.html', 'visitor must be able to open the complete design');
});

test('FQSC-01 publishes a substantive concept with an image and an evidence-limited record', () => {
  const pagePath = path.join(root, 'fqsc-01.html');
  assert.ok(fs.existsSync(pagePath), 'dedicated public design page missing');
  const page = fs.readFileSync(pagePath, 'utf8');
  assert.match(page, /Field-Quench Spectral Coupling/);
  assert.match(page, /Proposed architecture/);
  assert.match(page, /Computational test/);
  assert.match(page, /not (?:a )?working (?:device|apparatus)|not built/i);
  assert.match(page, /assets\/fqsc-01-concept\.webp/);
  assert.ok(fs.existsSync(path.join(root, 'assets', 'fqsc-01-concept.webp')));

  const notePath = path.join(root, 'design-notes', 'fqsc-01.md');
  assert.ok(fs.existsSync(notePath), 'public design note missing');
  const note = fs.readFileSync(notePath, 'utf8');
  assert.match(note, /## Evidence limits\n/);
  assert.match(note, /## Next check\n/);

  const source = fs.readFileSync(path.join(root, 'registry.js'), 'utf8');
  const marker = "if(records.has('fqsc-01'))Object.assign(records.get('fqsc-01'),";
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, 'FQSC-01 needs a reviewed, expanded registry record');
  const records = new Map([['fqsc-01', { id: 'fqsc-01' }]]);
  vm.runInNewContext(source.slice(start, source.indexOf('\n', start)), { records });
  const record = records.get('fqsc-01');
  assert.equal(record.expanded, true);
  assert.equal(record.sources.split('\n')[0], 'https://github.com/RayPeloquin/mimirs-well/blob/main/design-notes/fqsc-01.md');
  for (const key of ['purpose', 'version', 'evidence', 'contributors', 'sources', 'next', 'notes']) {
    assert.ok(record[key]?.length > 25, `missing registry field: ${key}`);
  }
});
