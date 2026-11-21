const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');

const read = name => readFileSync(path.join(__dirname, name), 'utf8');
const html = read('index.html');
const catalog = read('catalog.js');
const registry = read('registry.js');
const gallery = read('well-gallery.js');

function currentTitles() {
  const begin = catalog.indexOf('const groups=') + 'const groups='.length;
  const end = catalog.indexOf(';\n// Keep the distinct protocell', begin);
  assert.ok(begin > 12 && end > begin, 'find the static source catalog');
  const groups = JSON.parse(catalog.slice(begin, end));
  for (const match of catalog.matchAll(/groups\.push\(\['([^']+)','([^']+)','([^']+)'\]\)/g)) {
    groups.push(match.slice(1, 4));
  }
  const withdrawals = catalog.match(/const withdrawnTitles=new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(withdrawals, 'find approved public-title withdrawals');
  const removed = new Set([...withdrawals[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
  const inventory = groups.flatMap(group => group[2].split('\n')).filter(title => !removed.has(title));
  const fixed = [...html.matchAll(/<article class="card"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(m => m[1]);
  const manual = [...catalog.matchAll(/const\s+(\w+)\s*=\s*document\.createElement\('h3'\);\s*\1\.textContent='([^']+)'/g)].map(m => m[2]);
  return inventory.concat(fixed, manual);
}

function expandedRecords() {
  return [...registry.matchAll(/if\(records\.has\('([^']+)'\)\)Object\.assign\(records\.get\('\1'\),(\{[^\n]*?\})\);/g)]
    .map(m => ({ id: m[1], ...JSON.parse(m[2].replace(/^\{expanded:true,/, '{"expanded":true,')) }));
}

const slug = title => title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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
  assert.ok(read('WORKBENCH.md').includes('**Verified inventory after batch:** ' + expected), 'Workbench current summary needs updating');
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
