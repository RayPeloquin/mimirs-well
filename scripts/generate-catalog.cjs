const { readText } = require('./test-text.cjs');
const { readFileSync, writeFileSync, mkdirSync, readdirSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const base = 'https://raypeloquin.github.io/mimirs-well/';
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const { currentTitles, expandedRecords, slug } = require('./inventory.cjs');
const publication = require('../publication-controls.js');
require('../ledger-data.js');

const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
function output(name, value) {
  const file = path.join(root, name);
  if (check) assert.ok(readText(file) === value, name + ' is stale. Run node scripts/generate-catalog.cjs');
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
    url: detail?.publicPage || 'index.html#design/' + id };
}).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length);

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
const ledgerLinks = new Map();
const entryIds = new Set(entries.map(entry => entry.id));
for (const record of globalThis.MimirsLedgerData) {
  const id = ledgerAliases[record.number] || slug(record.title);
  assert.ok(entryIds.has(id), 'No catalog record for Ledger entry ' + record.title);
  const type = id === 'chihuahua-sphere-cs-1' ? 'numerical' : ledgerTypes.get(record.evidence);
  assert.ok(type, 'Unknown Ledger evidence type: ' + record.evidence);
  const types = [type];
  if (type !== 'software' && record.status.includes('+ tests')) types.push('software');
  ledgerEvidence.set(id, types);
  ledgerLinks.set(id, record);
}

// Export explicitly selected fields from the already-public registry.
const notice = 'Evidence type describes the public artifact, not a validation or safety certificate.';
for (const entry of entries) {
  const detail = expanded.get(entry.id);
  const hold = Object.hasOwn(publication.holds, entry.id);
  const watch = Object.hasOwn(publication.watches, entry.id);
  const ledger = ledgerLinks.get(entry.id);
  const types = ledgerEvidence.get(entry.id) || [detail?.evidenceType || (detail ? 'unclassified' : 'pending')];
  Object.assign(entry, {
    record_status: detail ? 'expanded' : 'pending_review',
    evidence_types: types,
    publication_hold: hold ? 'precautionary_hold_summary_only' : watch ? 'review_watch' : 'none',
    publication_notice: hold ? publication.holds[entry.id] : watch ? publication.watches[entry.id] : 'Standard public record; no technical-release approval implied.',
    summary: detail?.purpose || 'Archive title awaiting source review; no evidence assessment established.',
    revision_note: detail?.version || null,
    canonical_url: base + 'records/' + entry.id + '.html',
    source_urls: hold || watch ? [] : (detail?.sources || '').split('\n').map(s => s.trim()).filter(s => /^https?:\/\/\S+$/.test(s)),
    ledger_url: ledger ? base + ledger.url : null,
    ledger_updated: ledger?.updated || null,
    evidence_notice: notice,
    policy_url: base + publication.policy
  });
  entry.content_sha256 = sha(JSON.stringify(entry));
}
const json = JSON.stringify(entries, null, 2) + '\n';
output('catalog.json', json);
const manifest = {
  schema_version: '1.2.0',
  catalog: 'catalog.json',
  schema: 'catalog.schema.json',
  counts: { total: entries.length, expanded: expanded.size, pending_review: entries.length - expanded.size, ledger: globalThis.MimirsLedgerData.length },
  catalog_sha256: sha(json),
  hash_encoding: 'UTF-8, LF; record hash is SHA-256 of JSON.stringify(record excluding content_sha256)',
  policy: publication.policy,
  policy_version: publication.version,
  holds: Object.entries(publication.holds).map(([id, notice]) => ({id, notice})),
  watches: Object.entries(publication.watches).map(([id, notice]) => ({id, notice})),
  equation_eligible: publication.equationEligible
};
output('catalog-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
output('catalog.sha256', manifest.catalog_sha256 + '  catalog.json\n');
const columns = ['id','title','record_status','evidence_types','publication_hold','publication_notice','summary','evidence','contributors','revision_note','canonical_url','source_urls','ledger_url','ledger_updated','evidence_notice','policy_url','content_sha256'];
const csvCell = value => {
  let text = Array.isArray(value) ? JSON.stringify(value) : String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"','""') + '"';
};
output('catalog.csv', [columns.join(','), ...entries.map(e => columns.map(k => csvCell(e[k])).join(','))].join('\n') + '\n');
const staticPaths = [...entries.map(e => 'records/' + e.id + '.html'), '','record-index.html','catalog-manifest.html','equation-sources.html','sitemap.html','catalog.html','ledger.html','publication-safety.html','legal.html','combine.html','equation-bench.html', ...globalThis.MimirsLedgerData.map(r=>r.url), 'dermis.html','cortex.html','thoracis.html','fsams-skin-eva-concept.html','eye-of-horus.html',"odin-s-ravens-art.html","enki-s-will-living-safety-stack-art.html","court-of-the-synthetic-multi-model-engineering-review-art.html","aegis-sentinel-mesh-art.html","sister-s-hope-hand-restoration-gloves-art.html","olympus-floor-model-engineering-project-and-portfolio-control-art.html","mount-olympus-cross-domain-design-and-adversarial-review-art.html","weaver-s-shuttle-art.html","crystal-damping-loop-artwork.html","quantum-floor-artwork.html","unidentified-transparent-fiber-composite-concept-artwork.html","thoth-s-mind-artwork.html","mosquito-reaper-artwork.html"];
output('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [...new Set(staticPaths)].map(p => '  <url><loc>' + base + p + '</loc></url>').join('\n') + '\n</urlset>\n');
const vm = require('node:vm');
const eqContext = {window:{}};
vm.runInNewContext(readText(path.join(root,'equation-cores.js')),eqContext);
const cores = eqContext.window.WellEquationCores;
assert.deepEqual(Object.keys(cores).sort(), [...publication.equationEligible].sort());
assert.ok(publication.equationEligible.every(id=>!Object.hasOwn(publication.holds,id)));
output('equation-sources.json',JSON.stringify(Object.fromEntries(publication.equationEligible.map(id=>[id,cores[id]])),null,2)+'\n');
// Small HTML reading views derived from the same public data, not separate editable datasets.
const readingPage = (title,body) => '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(title)+' | Mimir&#39;s Well</title><link rel="stylesheet" href="catalog-browser.css"></head><body><nav><a href="index.html">Mimir&#39;s Well</a> | <a href="record-index.html">Research directory</a> | <a href="catalog-manifest.html">Catalog manifest</a> | <a href="equation-sources.html">Equation sources</a> | <a href="sitemap.html">Site map</a></nav><main><h1>'+escapeHtml(title)+'</h1>'+body+'</main></body></html>\n';
const notices = (items,label) => '<h2>'+label+'</h2><ul>'+items.map(x=>'<li><a href="records/'+x.id+'.html">'+x.id+'</a>: '+escapeHtml(x.notice)+'</li>').join('')+'</ul>';
output('catalog-manifest.html',readingPage('Catalog manifest and integrity','<p>Schema version '+manifest.schema_version+'. '+manifest.counts.total+' public records: '+manifest.counts.expanded+' expanded and '+manifest.counts.pending_review+' pending source review. The '+manifest.counts.ledger+' Divergence Ledger entries are a separate evidence-review collection, not additional project cards.</p><p>Catalog SHA-256: <code class="record-text">'+manifest.catalog_sha256+'</code></p><p>'+escapeHtml(manifest.hash_encoding)+'</p><p><a href="catalog.json">JSON catalog</a> | <a href="catalog-manifest.json">JSON manifest</a> | <a href="catalog.schema.json">Schema</a> | <a href="llms.txt">Reading guide</a> | <a href="legal.html#permission">Reuse terms</a></p>'+notices(manifest.holds,'Precautionary holds ('+manifest.holds.length+')')+notices(manifest.watches,'Review watches ('+manifest.watches.length+')')+'<p>Holds restrict original technical-source disclosure; approved non-operational summaries may remain public. <a href="publication-safety.html">Publication policy</a>.</p>'));
output('equation-sources.html',readingPage('Reviewed equation source index','<p>'+publication.equationEligible.length+' allow-listed transcriptions, not independent validation. <a href="equation-sources.json">JSON source index</a> | <a href="equation-bench.html">Interactive Equation Bench</a>.</p>'+publication.equationEligible.map(id=>{const q=cores[id];return '<section><h2><a href="records/'+id+'.html">'+id+'</a></h2><p>'+escapeHtml(q.evidence)+'</p><pre class="record-text">'+escapeHtml(q.equation)+'</pre><p>'+escapeHtml(q.statement)+'</p><dl>'+q.symbols.map(s=>'<dt>'+escapeHtml(s.name)+'</dt><dd>'+escapeHtml(s.meaning)+'</dd>').join('')+'</dl><p>'+escapeHtml(q.caveat)+'</p><p><a href="'+escapeHtml(q.source)+'">'+escapeHtml(q.sourceLabel)+'</a></p></section>'}).join('')));
output('sitemap.html',readingPage('Site map','<p>Public reading routes. The <a href="record-index.html">compact directory</a> lists all '+entries.length+' individual record pages. <a href="sitemap.xml">XML sitemap</a>.</p><ul>'+[...new Set(staticPaths)].filter(p=>!p.startsWith('records/')).map(p=>'<li><a href="'+(p||'index.html')+'">'+(p||'Homepage')+'</a></li>').join('')+'</ul>'));

// Standalone reading views use only the already exported public fields.
const recordDirectory = path.join(root, 'records');
if (!check) mkdirSync(recordDirectory,{recursive:true});
const expectedPages = new Set(entries.map(e=>e.id+'.html'));
for(const file of readdirSync(recordDirectory)) {
  assert.ok(expectedPages.has(file), 'Unexpected or withdrawn public record page: '+file+'; remove after review');
}
for(const entry of entries) {
  const field = (label,value) => '<section><h2>'+label+'</h2><p class="record-text">'+escapeHtml(value ?? 'Not established or not supplied.')+'</p></section>';
  const links = entry.source_urls.map((url,i)=>'<li><a href="'+escapeHtml(url)+'">Published source '+(i+1)+'</a></li>').join('');
  const evidence = entry.evidence_types.map(type=>evidenceTypes.get(type)).join(' / ');
  const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escapeHtml(entry.title)+' | Mimir&#39;s Well</title><meta name="description" content="'+escapeHtml(entry.status+(entry.record_status==='pending_review'&&evidence===entry.status?'':'; '+evidence)+'. Public research record, not certification.')+'"><link rel="canonical" href="'+entry.canonical_url+'"><link rel="stylesheet" href="../catalog-browser.css"></head><body><nav><a href="../index.html">Mimir&#39;s Well</a> | <a href="../catalog.html#'+entry.id+'">Full catalog</a> | <a href="../llms.txt">Reading guide</a></nav><main><h1>'+escapeHtml(entry.title)+'</h1><p>Record ID: '+entry.id+' | '+escapeHtml(entry.status)+'</p><p class="catalog-type">'+escapeHtml(evidence)+'</p><p class="catalog-safety">'+escapeHtml(entry.publication_notice)+' <a href="../publication-safety.html">Publication policy</a></p><p>'+escapeHtml(entry.evidence_notice)+'</p>'+field('Summary',entry.summary)+field('Evidence and limits',entry.evidence)+field('Contributors',entry.contributors)+field('Source revision',entry.revision_note)+'<section><h2>Published sources</h2>'+(links?'<ul>'+links+'</ul>':'<p>No source links supplied in this public export.</p>')+'</section>'+(entry.ledger_url?'<p><a href="'+escapeHtml(entry.ledger_url)+'">Divergence Ledger</a></p>':'')+'<p>Catalog schema '+manifest.schema_version+' | <a href="../catalog-manifest.html">Catalog version and checksum</a> | <a href="../legal.html#permission">Reuse terms</a></p><p class="catalog-families">Record SHA-256: '+entry.content_sha256+'</p></main></body></html>\n';
  output('records/'+entry.id+'.html',html);
}
const compactRows = entries.map(e=>'<li><a href="records/'+e.id+'.html">'+escapeHtml(e.title)+'</a>'+ (e.publication_hold==='precautionary_hold_summary_only'?' <strong>[Hold]</strong>':e.publication_hold==='review_watch'?' <strong>[Watch]</strong>':'')+(e.record_status==='pending_review'?' [Pending review]':'')+'</li>').join('\n');
output('record-index.html','<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research record directory | Mimir&#39;s Well</title><link rel="stylesheet" href="catalog-browser.css"></head><body><nav><a href="index.html">Mimir&#39;s Well</a> | <a href="catalog.html">Full catalog</a> | <a href="catalog-manifest.html">Manifest</a></nav><main><h1>Research record directory</h1><p>'+entries.length+' public titles. Includes unreviewed placeholders and public hold summaries; follow each link for evidence and publication status.</p><ol>'+compactRows+'</ol></main></body></html>\n');
const rows = entries.map(entry => {
  const detail = expanded.get(entry.id);
  const evidence = ledgerEvidence.get(entry.id) || [detail?.evidenceType || (detail ? 'unclassified' : 'pending')];
  const familyIds = familyIdsFor(entry.title);
  const publicationStatus = publication.holds[entry.id] ? publication.holdLabel :
    publication.watches[entry.id] ? publication.watchLabel : '';
  const reviewLabel = publicationStatus ?
    '<p class="catalog-publication-control"><strong>' + escapeHtml(publicationStatus) +
    '</strong> · <a href="publication-safety.html">Publication policy</a></p>' : '';
  if (!familyIds.length) familyIds.push('unmapped');
  const details = [['Evidence and limits', entry.evidence], ['Contributors', entry.contributors], ['Source revision', entry.revision_note]]
    .filter(([, value]) => value)
    .map(([label, value]) => '<p><strong>' + label + '</strong> ' + escapeHtml(value) + '</p>').join('');
  return '<li id="' + entry.id + '"><div class="catalog-entry" data-types="' + evidence.join(' ') + '" data-families="' + familyIds.join(' ') + '">' +
    '<h2>' + escapeHtml(entry.title) + '</h2>' + reviewLabel + '<p class="catalog-type">' + evidence.map(type => escapeHtml(evidenceTypes.get(type))).join(' · ') + '</p>' +
    '<p class="catalog-families">' + familyIds.map(id => escapeHtml(familyNames.get(id))).join(' · ') + '</p>' +
    '<p>' + escapeHtml(entry.summary) + '</p><p class="catalog-families">' + escapeHtml(entry.evidence_notice) + '</p>' + (publicationStatus ? '<p>' + escapeHtml(entry.publication_notice) + '</p>' : '') + '<p class="catalog-families">Record ID: ' + entry.id + ' &middot; ' + escapeHtml(entry.status) + '</p>' +
    (details ? '<details open><summary>Evidence and contributor notes</summary>' + details + '</details>' : '') +
    (entry.source_urls.length ? '<details open><summary>Published sources</summary><ul>' + entry.source_urls.map((url,i) => '<li><a href="' + escapeHtml(url) + '">Source ' + (i+1) + ' for ' + escapeHtml(entry.title) + '</a></li>').join('') + '</ul></details>' : '') +
    (entry.ledger_url ? '<p><a href="' + escapeHtml(entry.ledger_url.replace(base,'')) + '">Divergence Ledger: ' + escapeHtml(entry.title) + '</a></p>' : '') +
    '<a href="records/' + entry.id + '.html" aria-label="Permanent catalog record: ' + escapeHtml(entry.title) + '">Permanent record link</a> &middot; <a href="' + entry.url + '" aria-label="Open design record: ' + escapeHtml(entry.title) + '">Open design record' + (entry.url.includes('#design/') ? ' (interactive)' : '') + '</a></div></li>';
});
const options = map => Array.from(map, ([id, label]) => '<option value="' + id + '">' + escapeHtml(label) + '</option>').join('');
output('catalog.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Project catalog · Mimir’s Well</title><link rel="stylesheet" href="catalog-browser.css"><script defer src="catalog-browser.js"></script></head>
<body><a class="brand" href="index.html#projects">✳ Mimir’s Well</a>
<main><h1>Project catalog</h1>
<p>Browse ${entries.length} projects. Research families group related questions. Evidence types use the published Ledger where a project has an entry.</p>\n<p class="catalog-safety">Some energy-system records have technical-source publication holds or review-watch status. Public summaries are not technical-release approvals. <a href="publication-safety.html">See the publication safety policy</a>.</p>
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
<p class="catalog-download"><a href="catalog.json">JSON catalog</a> ? <a href="catalog.csv">CSV catalog</a> ? <a href="catalog-manifest.json">Version and checksums</a> ? <a href="catalog.schema.json">Schema</a> ? <a href="llms.txt">Reading guide</a> ? <a href="legal.html#permission">Reuse terms</a></p>
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
    (overflow.length === 1 ? ' more project' : ' more projects') + '</summary><ul>' + overflow.join('\n') + '</ul></details>' : '';
  return '<section><h2>' + escapeHtml(division) + '</h2>' + preview + more + '</section>';
});
output('armory.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Armory · Mimir’s Well</title>
<style>:root{color-scheme:dark}body{max-width:52rem;margin:auto;padding:2rem 1.2rem;background:#080f17;color:#edf4ef;font:1rem/1.65 system-ui}a{color:#b5f5cf}section{border-top:1px solid #34444b}li{padding:.35rem 0}summary{cursor:pointer;color:#b5f5cf;margin-bottom:.5rem}</style></head>
<body><nav><a href="index.html#projects">Mimir’s Well</a> · <a href="catalog.html">Full catalog</a></nav>
<main><h1>The Armory</h1><p>Defense and protective systems in the Well. Each link opens the project’s catalog entry and its published evidence notes where available.</p>
${sections.join('\n')}</main></body></html>\n`);
const home = readText(path.join(root, 'index.html'));
const count = globalThis.MimirsLedgerData.length;
output('index.html', home.replace(/(data-ledger-total>)\d+/g, (_, prefix) => prefix + count)
  .replace(/\d+ distinct project cards, including \d+ expanded records and \d+ records pending/, entries.length + ' distinct project cards, including ' + expanded.size + ' expanded records and ' + (entries.length - expanded.size) + ' records pending'));
