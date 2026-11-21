const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { currentTitles, expandedRecords, slug } = require('./inventory.cjs');
require('../ledger-data.js');

const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
function output(name, value) {
  const file = path.join(root, name);
  if (check) assert.ok(readFileSync(file, 'utf8') === value, name + ' is stale. Run node scripts/generate-catalog.cjs');
  else writeFileSync(file, value);
}
function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

const expanded = new Map(expandedRecords().map(record => [record.id, record]));
const entries = currentTitles().map(title => {
  const id = slug(title);
  const detail = expanded.get(id);
  return { id, title, status: detail ? 'Expanded record' : 'Source review pending',
    evidence: detail?.evidence || null, contributors: detail?.contributors || null,
    url: 'index.html#design/' + id };
}).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);
output('catalog.json', JSON.stringify(entries, null, 2) + '\n');
const rows = entries.map(entry => {
  const details = [['Evidence', entry.evidence], ['Contributors', entry.contributors]]
    .filter(([, value]) => value)
    .map(([label, value]) => '<p><strong>' + label + '</strong> ' + escapeHtml(value) + '</p>').join('');
  return '<li id="' + entry.id + '"><h2>' + escapeHtml(entry.title) + '</h2><p>' + entry.status + '</p>' + details + '<a href="' + entry.url + '">Interactive record</a></li>';
});
output('catalog.html', '<!doctype html>\n<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Project catalog · Mimir’s Well</title><style>html{color-scheme:light dark}body{max-width:48rem;margin:auto;padding:1rem;font:1rem/1.55 system-ui}li{padding-block:.75rem;border-bottom:1px solid}h2{font-size:1.2rem}</style><main><a href="index.html#projects">Mimir’s Well</a><h1>Project catalog</h1><p>' + entries.length + ' projects. Evidence and contributor notes appear where recorded. Use your browser’s Find to locate a title.</p><a href="catalog.json">Download the JSON index</a><ol>\n' + rows.join('\n') + '\n</ol></main></html>\n');
const home = readFileSync(path.join(root, 'index.html'), 'utf8');
const count = globalThis.MimirsLedgerData.length;
output('index.html', home.replace(/(data-ledger-total>)\d+/g, (_, prefix) => prefix + count)
  .replace(/\d+ distinct project cards, including \d+ expanded records and \d+ records pending/, entries.length + ' distinct project cards, including ' + expanded.size + ' expanded records and ' + (entries.length - expanded.size) + ' records pending'));
