const { readText } = require('./test-text.cjs');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const read = name => readText(path.join(__dirname, '..', name));
const html = read('index.html');
const catalog = read('catalog.js');
const registry = read('registry.js');

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

module.exports = { currentTitles, expandedRecords, slug };
