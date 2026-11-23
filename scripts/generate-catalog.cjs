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
const { families, familyIdsFor } = require('../research-families.js');
const familyNames = new Map(families.map(({ id, name }) => [id, name]));
familyNames.set('unmapped', 'Awaiting family mapping');

const ledgerAliases = {
  1: 'ka-patch-bioenergy-jewelry',
  12: 'hallvard-s-promise-little-lungs',
  15: 'ndsm-01-neutrino-feasibility-study',
  16: 'hypha-mind-go-cube-update-authorization-testbed',
  20: 'orehearth-geothermal-concept',
  21: 'hydrofell-01-hydro-data-center',
  24: 'modular-rope-coupler-ranchline-utility',
  25: 'silt-hippo-silo-cistern',
  26: 'papercall-papercall-sky',
  30: 'chihuahua-sphere-cs-1',
};
const evidenceTypes = new Map([
  ['numerical', 'Calculation, prediction, or simulation'],
  ['software', 'Software tests'],
  ['concept', 'Concept or design review'],
  ['unclassified', 'Expanded record · evidence type uncategorized'],
  ['pending', 'Source review pending'],
]);
const ledgerTypes = new Map([
  ['Numerical / simulation', 'numerical'],
  ['Software tests', 'software'],
  ['Concept / design', 'concept'],
  ['Design review', 'concept'],
]);
const ledgerEvidence = new Map();
const entryIds = new Set(entries.map(entry => entry.id));
for (const record of globalThis.MimirsLedgerData) {
  const id = ledgerAliases[record.number] || slug(record.title);
  assert.ok(entryIds.has(id), 'No catalog record for Ledger entry ' + record.title);
  const type = id === 'chihuahua-sphere-cs-1' ? 'numerical' : ledgerTypes.get(record.evidence);
  assert.ok(type, 'Unknown Ledger evidence type: ' + record.evidence);
  const types = [type];
  if (type !== 'software' && record.status.includes('+ tests')) types.push('software');
  ledgerEvidence.set(id, types);
}

const rows = entries.map(entry => {
  const evidence = ledgerEvidence.get(entry.id) || [expanded.has(entry.id) ? 'unclassified' : 'pending'];
  const familyIds = familyIdsFor(entry.title);
  if (!familyIds.length) familyIds.push('unmapped');
  const details = [['Evidence and limits', entry.evidence], ['Contributors', entry.contributors]]
    .filter(([, value]) => value)
    .map(([label, value]) => '<p><strong>' + label + '</strong> ' + escapeHtml(value) + '</p>').join('');
  return '<li id="' + entry.id + '"><div class="catalog-entry" data-types="' + evidence.join(' ') + '" data-families="' + familyIds.join(' ') + '">' +
    '<h2>' + escapeHtml(entry.title) + '</h2><p class="catalog-type">' + evidence.map(type => escapeHtml(evidenceTypes.get(type))).join(' · ') + '</p>' +
    '<p class="catalog-families">' + familyIds.map(id => escapeHtml(familyNames.get(id))).join(' · ') + '</p>' +
    (details ? '<details><summary>Evidence and contributor notes</summary>' + details + '</details>' : '') +
    '<a href="' + entry.url + '">Open design record</a></div></li>';
});
const options = map => Array.from(map, ([id, label]) => '<option value="' + id + '">' + escapeHtml(label) + '</option>').join('');
output('catalog.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project catalog · Mimir’s Well</title><link rel="stylesheet" href="catalog-browser.css"><script defer src="catalog-browser.js"></script></head>
<body><a class="brand" href="index.html#projects">✳ Mimir’s Well</a>
<main><h1>Project catalog</h1>
<p>Browse ${entries.length} projects. Research families group related questions. Evidence types use the published Ledger where a project has an entry.</p>
<form id="catalog-controls" hidden>
  <label>Research family<select name="family"><option value="">All research families</option>${options(familyNames)}</select></label>
  <label>Evidence type<select name="evidence"><option value="">All evidence types</option>${options(evidenceTypes)}</select></label>
  <label class="catalog-search">Search projects<input name="q" type="search" placeholder="Search titles or notes" autocomplete="off"></label>
  <button type="reset">Clear filters</button>
</form>
<p class="catalog-status" id="catalog-count" role="status" hidden></p>
<noscript><p>All records are listed below. Use your browser’s Find to locate a project.</p></noscript>
<ol id="catalog-entries">
${rows.join('\n')}
</ol>
<button type="button" id="catalog-more" hidden>Show more projects</button>
<p class="catalog-download"><a href="catalog.json">Download the JSON index</a></p>
</main></body></html>
`);
const divisions = require('../armory-data.js');
const categories = new Map();
for (const entry of entries) {
  const division = divisions.get(entry.title);
  if (!division) continue;
  if (!categories.has(division)) categories.set(division, []);
  categories.get(division).push(entry);
}
const sections = Array.from(categories, ([division, projects]) => {
  const items = projects.map(({ id, title }) =>
    '<li><a href="catalog.html#' + id + '">' + escapeHtml(title) + '</a></li>');
  const previewSize = 6;
  const preview = '<ul>' + items.slice(0, previewSize).join('\n') + '</ul>';
  const overflow = items.slice(previewSize);
  const more = overflow.length ? '<details><summary>Show ' + overflow.length +
    ' more projects</summary><ul>' + overflow.join('\n') + '</ul></details>' : '';
  return '<section><h2>' + escapeHtml(division) + '</h2>' + preview + more + '</section>';
});
output('armory.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Armory · Mimir’s Well</title>
<style>:root{color-scheme:dark}body{max-width:52rem;margin:auto;padding:2rem 1.2rem;background:#080f17;color:#edf4ef;font:1rem/1.65 system-ui}a{color:#b5f5cf}section{border-top:1px solid #34444b}li{padding:.35rem 0}summary{cursor:pointer;color:#b5f5cf;margin-bottom:.5rem}</style></head>
<body><nav><a href="index.html#projects">Mimir’s Well</a> · <a href="catalog.html">Full catalog</a></nav>
<main><h1>The Armory</h1><p>Defense and protective systems in the Well. Each link opens the project’s catalog entry and its published evidence notes where available.</p>
${sections.join('\n')}</main></body></html>\n`);
const home = readFileSync(path.join(root, 'index.html'), 'utf8');
const count = globalThis.MimirsLedgerData.length;
output('index.html', home.replace(/(data-ledger-total>)\d+/g, (_, prefix) => prefix + count)
  .replace(/\d+ distinct project cards, including \d+ expanded records and \d+ records pending/, entries.length + ' distinct project cards, including ' + expanded.size + ' expanded records and ' + (entries.length - expanded.size) + ' records pending'));
