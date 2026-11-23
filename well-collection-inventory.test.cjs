const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');

const read = name => readFileSync(path.join(__dirname, name), 'utf8');
const html = read('index.html');
const gallery = read('well-gallery.js');

const { currentTitles, expandedRecords, slug } = require('./scripts/inventory.cjs');

test('project-card count has distinct titles and all expanded records attach', () => {
  const titles = currentTitles();
  const ids = new Set(titles.map(slug));
  assert.equal(ids.size, titles.length, 'duplicate normalized project titles');
  const expanded = expandedRecords();
  assert.equal(expanded.length, new Set(expanded.map(x => x.id)).size, 'duplicate expanded record');
  for (const r of expanded) {
    assert.equal(r.expanded, true, r.id + ' must explicitly be expanded');
    assert.ok(ids.has(r.id), r.id + ': orphaned registry entry');
  }
  const expected = titles.length + ' distinct project cards';
  assert.ok(html.includes(expected), 'homepage count needs updating: ' + expected);
  const summary = read('README.md').match(/The current source contains \*\*(\d+) project cards with (\d+) distinct titles/);
  assert.ok(summary, 'README current inventory is present');
  assert.equal(Number(summary[1]), titles.length, 'README project count');
  assert.equal(Number(summary[2]), ids.size, 'README distinct title count');
  assert.ok(read('WORKBENCH.md').includes('**Current inventory:** ' + expected), 'Workbench current summary needs updating');
  assert.ok(html.includes('<a href="ledger.html">THE LEDGER</a>'), 'Ledger not in main nav');
});

test('published local source references exist and remain distinct from private notes', () => {
  const prefix = 'https://github.com/RayPeloquin/mimirs-well/blob/main/';
  let checked = 0;
  let nonUrlNotes = 0;
  for (const record of expandedRecords()) {
    for (const item of (record.sources || '').split('\n').map(s => s.trim()).filter(Boolean)) {
      if (!item.startsWith('https://') && !item.startsWith('http://')) nonUrlNotes++;
      if (!item.startsWith(prefix)) continue;
      const name = decodeURIComponent(item.slice(prefix.length).split('#')[0]);
      assert.ok(!name.startsWith('/') && !name.split('/').includes('..'), 'unsafe local path: ' + name);
      assert.ok(existsSync(path.join(__dirname, name)), record.id + ': missing source ' + name);
      checked++;
    }
  }
  assert.ok(checked > 0, 'expected at least one local source');
  assert.ok(nonUrlNotes > 0, 'private archival notes should remain distinguishable from URLs');
});

test('gallery artwork resolves and Ledger cards have accessible touch targets', () => {
  const images = [...gallery.matchAll(/src: '(assets\/[^']+)'/g)].map(m => m[1]);
  assert.ok(images.length > 0);
  for (const name of images) assert.ok(existsSync(path.join(__dirname, name)), 'missing image: ' + name);
  assert.match(html, /\.ledger-item a\{[^}]*min-height:44px/);
  assert.match(html, /id="results"[^>]*role="status"[^>]*aria-live="polite"/);
});

test('plain HTML, JSON and homepage counts match the published inventory', () => {
  require('node:child_process').execFileSync(process.execPath, [
    path.join(__dirname, 'scripts/generate-catalog.cjs'), '--check'
  ]);
});

test('Armory navigation reaches published catalog entries without scripts', () => {
  const armory = read('armory.html');
  const publicEntries = JSON.parse(read('catalog.json'));
  const divisions = require('./armory-data.js');
  const expected = publicEntries.filter(entry => divisions.has(entry.title)).map(entry => entry.id).sort();
  const links = [...armory.matchAll(/href="catalog\.html#([^"]+)"/g)].map(match => match[1]).sort();
  assert.match(html, /<details[^>]*id="research-archive"[\s\S]*?<a href="armory.html">The Armory/);
  assert.ok(expected.length > 0);
  assert.deepEqual(links, expected);
  const plainCatalog = read('catalog.html');
  for (const id of links) assert.ok(plainCatalog.includes('<li id="' + id + '">'));
});
