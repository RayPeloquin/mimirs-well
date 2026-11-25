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
const staticPaths = [...entries.map(e => 'records/' + e.id + '.html'), '','guided-alchemy.html','verification-receipt.html','trial-v-receipt.html','orrery.html','scriptorium.html','test-queue.html','chronicle.html','research-cycle.html','how-to-misread.html','dimensional-witness.html','record-index.html','catalog-manifest.html','equation-sources.html','sitemap.html','catalog.html','ledger.html','publication-safety.html','legal.html','combine.html','equation-bench.html', ...globalThis.MimirsLedgerData.map(r=>r.url), 'dermis.html','cortex.html','thoracis.html','fsams-skin-eva-concept.html','eye-of-horus.html',"odin-s-ravens-art.html","enki-s-will-living-safety-stack-art.html","court-of-the-synthetic-multi-model-engineering-review-art.html","aegis-sentinel-mesh-art.html","sister-s-hope-hand-restoration-gloves-art.html","olympus-floor-model-engineering-project-and-portfolio-control-art.html","mount-olympus-cross-domain-design-and-adversarial-review-art.html","weaver-s-shuttle-art.html","crystal-damping-loop-artwork.html","quantum-floor-artwork.html","unidentified-transparent-fiber-composite-concept-artwork.html","thoth-s-mind-artwork.html","mosquito-reaper-artwork.html"];
output('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + [...new Set(staticPaths)].map(p => '  <url><loc>' + base + p + '</loc></url>').join('\n') + '\n</urlset>\n');
const vm = require('node:vm');
const eqContext = {window:{}};
vm.runInNewContext(readText(path.join(root,'equation-cores.js')),eqContext);
const cores = eqContext.window.WellEquationCores;
assert.deepEqual(Object.keys(cores).sort(), [...publication.equationEligible].sort());
assert.ok(publication.equationEligible.every(id=>!Object.hasOwn(publication.holds,id)));
const witness=require('../dimensional-witness.js');
assert.deepEqual(Object.keys(witness.metadata).sort(),Object.keys(cores).sort());
for(const [id,q] of Object.entries(cores)){
  assert.deepEqual(Object.keys(witness.metadata[id]).sort(),Array.from(q.symbols,s=>s.name).sort(),id+' symbol annotation coverage');
}
for(const [id,q] of Object.entries(cores)) assert.equal(sha(JSON.stringify(q)),witness.sourcePins[id],id+' reviewed transcription changed; fresh annotation review required');
const annotated=Object.fromEntries(publication.equationEligible.map(id=>[id,{...cores[id],witness_version:witness.version,reviewed_transcription_sha256:witness.sourcePins[id],symbols:cores[id].symbols.map(s=>({...s,witness:witness.get(id,s.name)}))}]));
output('equation-sources.json',JSON.stringify(annotated,null,2)+'\n');

// Small HTML reading views derived from the same public data, not separate editable datasets.
const readingPage = (title,body) => '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(title)+' | Mimir&#39;s Well</title><link rel="stylesheet" href="catalog-browser.css"></head><body><nav><a href="index.html">Mimir&#39;s Well</a> | <a href="record-index.html">Research directory</a> | <a href="catalog-manifest.html">Catalog manifest</a> | <a href="equation-sources.html">Equation sources</a> | <a href="sitemap.html">Site map</a> | <a href="guided-alchemy.html">Guided pathways</a> | <a href="verification-receipt.html">Test receipt</a> | <a href="trial-v-receipt.html">Trial V evidence</a> | <a href="orrery.html">The Orrery</a> | <a href="scriptorium.html">The Scriptorium</a> | <a href="test-queue.html">The Crucible Work Queue</a> | <a href="chronicle.html">The Chronicle</a> | <a href="dimensional-witness.html">Dimensional Witness</a></nav><main><h1>' +escapeHtml(title)+'</h1>'+ (title==='The research cycle'?'':'<p><a href="research-cycle.html">Research cycle map: start here or find the next stage</a>.</p>')+body+'</main></body></html>\n';
const notices = (items,label) => '<h2>'+label+'</h2><ul>'+items.map(x=>'<li><a href="records/'+x.id+'.html">'+x.id+'</a>: '+escapeHtml(x.notice)+'</li>').join('')+'</ul>';
output('catalog-manifest.html',readingPage('Catalog manifest and integrity','<p>Schema version '+manifest.schema_version+'. '+manifest.counts.total+' public records: '+manifest.counts.expanded+' expanded and '+manifest.counts.pending_review+' pending source review. The '+manifest.counts.ledger+' Divergence Ledger entries are a separate evidence-review collection, not additional project cards.</p><p>Catalog SHA-256: <code class="record-text">'+manifest.catalog_sha256+'</code></p><p>'+escapeHtml(manifest.hash_encoding)+'</p><p><a href="catalog.json">JSON catalog</a> | <a href="catalog-manifest.json">JSON manifest</a> | <a href="catalog.schema.json">Schema</a> | <a href="llms.txt">Reading guide</a> | <a href="legal.html#permission">Reuse terms</a></p>'+notices(manifest.holds,'Precautionary holds ('+manifest.holds.length+')')+notices(manifest.watches,'Review watches ('+manifest.watches.length+')')+'<p>Holds restrict original technical-source disclosure; approved non-operational summaries may remain public. <a href="publication-safety.html">Publication policy</a>.</p>'));
output('equation-sources.html',readingPage('Reviewed equation source index','<p>'+publication.equationEligible.length+' allow-listed transcriptions, not independent validation. <a href="equation-sources.json">JSON source index</a> | <a href="equation-bench.html">Interactive Equation Bench</a> | <a href="dimensional-witness.html">Dimensional Witness</a>. Symbol dimensions are review annotations, not expression-level validation.</p>'+publication.equationEligible.map(id=>{const q=cores[id];return '<section><h2><a href="records/'+id+'.html">'+id+'</a></h2><p>'+escapeHtml(q.evidence)+'</p><pre class="record-text">'+escapeHtml(q.equation)+'</pre><p>'+escapeHtml(q.statement)+'</p><dl>'+q.symbols.map(s=>'<dt>'+escapeHtml(s.name)+'</dt><dd>'+escapeHtml(s.meaning)+'<br>'+escapeHtml(witness.describe(witness.get(id,s.name)))+'</dd>').join('')+'</dl><p>'+escapeHtml(q.caveat)+'</p><p><a href="'+escapeHtml(q.source)+'">'+escapeHtml(q.sourceLabel)+'</a></p></section>'}).join('')));
output('sitemap.html',readingPage('Site map','<p>Public reading routes. The <a href="record-index.html">compact directory</a> lists all '+entries.length+' individual record pages. <a href="sitemap.xml">XML sitemap</a>.</p><ul>'+[...new Set(staticPaths)].filter(p=>!p.startsWith('records/')).map(p=>'<li><a href="'+(p||'index.html')+'">'+(p||'Homepage')+'</a></li>').join('')+'</ul>'));

// Static Guided Alchemy reading view; the interactive and static versions share one recipe array.
const guideContext={window:{}};
vm.runInNewContext(readText(path.join(root,'guided-alchemy.js')),guideContext);
const guides=guideContext.window.WellGuidedRecipes;
const guideIds=new Set();
const titleById=new Map(entries.map(e=>[e.id,e.title]));
for(const g of guides){
  assert.ok(!guideIds.has(g.id));guideIds.add(g.id);
  for(const id of [g.a,g.b])assert.ok(publication.equationEligible.includes(id)&&!Object.hasOwn(publication.holds,id)&&!Object.hasOwn(publication.watches,id));
}
const guidedCount=publication.equationEligible.length;
const guideLink=id=>'<a href="records/'+id+'.html">'+escapeHtml(titleById.get(id))+'</a>';
const guideBody=g=>'<section id="'+g.id+'"><h2>'+escapeHtml(g.title)+'</h2><p>'+escapeHtml(g.theme)+' | '+guideLink(g.a)+' + '+guideLink(g.b)+'</p><h3>Why investigate?</h3><p>'+escapeHtml(g.why)+'</p><h3>Proposed model (not derived truth)</h3><p>'+escapeHtml(g.model)+'</p><h3>Proposed falsification test</h3><p>'+escapeHtml(g.test)+'</p><h3>Limits and refusal conditions</h3><p>'+escapeHtml(g.limit)+'</p><h3>Symbol review</h3><p>Keep source quantities separate by default. Inspect the original definitions; no equivalence is established by the pairing. Record each explicit mapping decision, acknowledge unmatched symbols, and document inherited claims, the new hypothesis and strained assumptions before exporting a candidate.</p><p>'+escapeHtml(g.credit)+'</p>'+(g.ref?'<p><a href="'+escapeHtml(g.ref)+'">Underlying case study</a></p>':'')+'</section>';
output('guided-alchemy.html',readingPage('Guided Alchemy: static research pathways','<p>'+guides.length+' curated research suggestions from '+guidedCount+' reviewed sources. '+(guidedCount*(guidedCount-1)/2)+' possible unordered pairs is a combinatorial count, not validated compatibility. No pairing proves a physical connection.</p><p><a href="equation-bench.html">Interactive workspace</a> | <a href="equation-sources.html">Source definitions and caveats</a>. Static reading requires no JavaScript.</p><ol>'+guides.map(g=>'<li><a href="#'+g.id+'">'+escapeHtml(g.title)+'</a></li>').join('')+'</ol>'+guides.map(guideBody).join('')));
const receipt=JSON.parse(readText(path.join(root,'verification-receipt.json')));
assert.equal(receipt.tests.length,receipt.passed);assert.equal(receipt.failed,0);
output('verification-receipt.html',readingPage('Regression verification receipt','<p>Historical observed run, not a continuously updated CI status. <a href="trial-v-receipt.html">Later Trial V: 56 tests and deployed byte verification.</a></p><p>Tested commit: <a href="https://github.com/RayPeloquin/mimirs-well/commit/'+receipt.commit+'">'+receipt.commit+'</a></p><p>Observed UTC: '+escapeHtml(receipt.observed_at)+'; '+escapeHtml(receipt.environment.node)+' / '+escapeHtml(receipt.environment.platform)+' / '+escapeHtml(receipt.environment.arch)+'.</p><p>'+receipt.passed+' passed; '+receipt.failed+' failed.</p><p><code>'+escapeHtml(receipt.command)+'</code></p><p>'+escapeHtml(receipt.scope)+'</p><p>For example, the canonical-access regression fails when the catalog hash, required fields, record IDs or publication labels disagree. A failed assertion yields a nonzero test-runner exit status. The publication path/label check is separately required by branch rules.</p><p><a href="verification-receipt.json">JSON receipt</a> | <a href="https://github.com/RayPeloquin/mimirs-well/actions">Current GitHub workflow runs</a></p><ol>'+receipt.tests.map(name=>'<li>'+escapeHtml(name)+'</li>').join('')+'</ol>'));

const trial=JSON.parse(readText(path.join(root,'trial-v-receipt.json')));
assert.equal(trial.tests.length,trial.passed);assert.equal(trial.failed,0);
const relatedIds=[...new Set(guides.flatMap(g=>[g.a,g.b]))].sort();
output('trial-v-receipt.html',readingPage('Trial V: deployed evidence and regression receipt','<p>Dated observation, not a continuous status claim. Tested commit <a href="https://github.com/RayPeloquin/mimirs-well/commit/'+trial.commit+'">'+trial.commit+'</a>. Observed UTC: '+escapeHtml(trial.observed_at)+'.</p><p>'+trial.passed+' passed; '+trial.failed+' failed. '+escapeHtml(trial.scope)+'</p><p>Node '+escapeHtml(trial.environment.node)+' / '+escapeHtml(trial.environment.platform)+' / '+escapeHtml(trial.environment.arch)+'. Command: <code>'+escapeHtml(trial.command)+'</code>.</p><h2>Catalog verification</h2><p>'+escapeHtml(trial.schema_validation.validator)+': '+trial.schema_validation.records+' records; '+trial.schema_validation.errors+' validation errors. The live and commit-pinned CDN catalog bytes were identical to the local checkout. Catalog SHA-256: <code class="record-text">'+trial.cdn.sha256+'</code>; '+trial.cdn.bytes+' bytes.</p><p><a href="'+trial.cdn.url+'">Commit-pinned catalog mirror</a> | <a href="trial-v-receipt.json">JSON evidence receipt</a> | <a href="publication-safety.html">Dated ruleset and targeted history audit</a> | <a href="verification-receipt.html">Earlier 54-test receipt</a>.</p><h2>Live response byte matches</h2><ul>'+trial.live_comparisons.map(x=>'<li>'+escapeHtml(x.path)+': '+x.bytes+' bytes; SHA-256 <code class="record-text">'+x.sha256+'</code></li>').join('')+'</ul><h2>Current static annotation index</h2><p>Version '+witness.version+'; '+Object.values(witness.metadata).reduce((n,x)=>n+Object.keys(x).length,0)+' symbols across '+Object.keys(witness.metadata).length+' sources. SHA-256 of generated equation-sources.json: <code class="record-text">'+sha(JSON.stringify(annotated,null,2)+'\n')+'</code>. <a href="equation-sources.html">HTML annotations</a>. This generated index hash describes the current build, not the earlier observed deployment.</p><h2>Canonical records with related questions ('+relatedIds.length+')</h2><ul>'+relatedIds.map(id=>'<li>'+guideLink(id)+': '+guides.filter(g=>g.a===id||g.b===id).map(g=>'<a href="guided-alchemy.html#'+g.id+'">'+escapeHtml(g.title)+'</a>').join('; ')+'</li>').join('')+'</ul><h2>Observed CI check links</h2><ul>'+trial.ci.map((u,i)=>'<li><a href="'+u+'">'+['Browser regression','Local links','Publication preflight'][i]+'</a></li>').join('')+'</ul><h2>Observed regression test names</h2><ol>'+trial.tests.map(n=>'<li>'+escapeHtml(n)+'</li>').join('')+'</ol>'));

// Static reading receipt: examples are teaching decisions, not a research pairing recommendation.
const exampleA='skeptic-1',exampleB='confluence-01-synthetic-sense';
const exampleRows=[
 ['lambda_i','T_valid_hours','No','Inverse time squared is not elapsed time.'],
 ['K',null,'No','No stiffness counterpart in B.'],
 ['M',null,'No','No mass counterpart in B.'],
 ['f_i','R_false','No','Both have inverse-time dimensions, but oscillation frequency and false-event rate have different meanings and populations.']
];
const witnessTable='<div style="overflow-x:auto"><table><thead><tr><th scope="col">A symbol</th><th scope="col">Proposed B counterpart</th><th scope="col">Same quantity?</th><th scope="col">Witness result and reasoning</th></tr></thead><tbody>'+exampleRows.map(([a,b,decision,note])=>'<tr><td>'+a+'</td><td>'+(b||'None')+'</td><td>'+decision+'</td><td>'+escapeHtml((b?witness.compare(witness.get(exampleA,a),witness.get(exampleB,b)).text:'No equivalence assessed.')+' '+note)+'</td></tr>').join('')+'</tbody></table></div>';
output('dimensional-witness.html',readingPage('Dimensional Witness','<p>Version '+witness.version+'. A conservative review gate for explicit symbol mappings. Not an algebra engine, solver, unit converter, or expression-level dimensional checker. Matching dimensions never establish physical equivalence.</p><p><a href="equation-bench.html">Open Equation Bench</a> | <a href="equation-sources.html">Annotated source definitions</a> | <a href="equation-sources.json">Machine-readable annotations</a>.</p><h2>What the gate does</h2><ul><li>Known incompatible physical dimensions and Boolean/numeric mismatches block a same-quantity claim.</li><li>Matching dimensions, missing unit scales, differing units, unknown dimensions and matching Boolean types require a written explanation and explicit user acknowledgement before a same-quantity claim can be exported.</li><li>Different-quantity choices remain possible without declaring a physical relationship. Editing the target, decision or notes revokes that row acknowledgement. Changing annotation version requires fresh review.</li><li>Unit labels and quantity kinds are reviewed annotations of the source definitions, not newly measured data. Unspecified units remain unspecified. The exponent order is mass, length, time, thermodynamic temperature (M,L,T,Theta); null means not established or not applicable. Angles, counts, fractions and percentages are dimensionless in the SI sense but carry different meanings; Boolean values are not physical quantities.</li><li>A same-quantity claim is a user hypothesis even after acknowledgement. The Witness does not validate meaning, clocks, reference frames, sampling, scale conversions, vector/tensor shape or the final expression.</li></ul><h2>Outcome and review matrix</h2><p>Reviewed, not approved. No acknowledgement can override a hard refusal.</p><div style="overflow-x:auto"><table id="witness-outcomes"><thead><tr><th scope="col">Outcome</th><th scope="col">Trigger</th><th scope="col">Export rule</th></tr></thead><tbody><tr><td>Refused</td><td>Known incompatible dimensions or Boolean/numeric mismatch in a same-quantity claim.</td><td>Blocked. No override; revise the mapping or keep quantities separate.</td></tr><tr><td>Review required</td><td>All other proposed equivalences, including matching dimensions and unit labels, different units, unknown scales, unknown dimensions and Boolean/Boolean.</td><td>Written justification and explicit acknowledgement required. Unknown dimensions are unresolved, not evidence of compatibility. Reviewed, not approved.</td></tr><tr><td>Separate / not assessed</td><td>Different quantities or no counterpart.</td><td>May proceed as separate terms after required mapping and B-only review. No equivalence claimed.</td></tr></tbody></table></div><p>For equivalence review, explain what is measured, the units or scales, reference frame or clock where relevant, populations and the evidence for comparability. Explicitly identify unresolved unknowns. This gate cannot assess the quality of a user explanation.</p><p>Local transcription SHA-256 pins bind reviewed annotations to the exact serialized source definitions in the Well. Changes require fresh review; this does not track changes at remote upstream links.</p><h2>Completed teaching receipt: keep the quantities separate</h2><p>Source A: <a href="records/'+exampleA+'.html">SKEPTIC-1</a>. Source B: <a href="records/'+exampleB+'.html">CONFLUENCE-01</a>. This example is an illustration of review discipline, not a validated coupling or a new curated recipe.</p>'+witnessTable+'<p>B-only symbols: R_false, N_false, T_valid_hours. All remain distinct; reviewed, not approved (example).</p><h3>Inherited claims</h3><p>A describes natural frequencies in an ideal mass-spring model. B proposes a false-event reporting metric. Neither establishes hardware performance.</p><h3>New joint claim</h3><p>No physical equivalence asserted. An untested methodological question is whether independent reporting of model behavior and observation quality helps reviewers detect mistaken conclusions.</p><h3>Broken or strained assumptions</h3><p>Model oscillations and counted false events arise from different mechanisms. Equal inverse-time exponents do not establish shared units, populations, causation or identical quantities.</p><p><strong>Candidate mathematics - not derived truth.</strong> This completed example records refusal of equivalence, not proof of the hypothetical research relationship.</p>'));


// The Orrery: explicit editorial links, not inferred compatibility.
const curated=JSON.parse(readText(path.join(root,'orrery-curated.json')));
const orreryEdges=[...guides.map(g=>({id:'guided-'+g.id,a:g.a,b:g.b,type:'guided-hypothesis',question:g.title,basis:g.why,limit:g.limit,source:'guided-alchemy.html#'+g.id,credit:g.credit,reviewed_on:'2026-11-25'})),...curated.edges];
const byId=new Map(entries.map(e=>[e.id,e]));
const edgeIds=new Set(),pairs=new Set();
for(const e of orreryEdges){
  assert.ok(/^[a-z0-9-]+$/.test(e.id)&&!edgeIds.has(e.id));edgeIds.add(e.id);
  assert.ok(e.a!==e.b&&byId.has(e.a)&&byId.has(e.b));
  const pair=[e.a,e.b].sort().join(':');assert.ok(!pairs.has(pair),pair+' duplicate relation');pairs.add(pair);
  for(const id of [e.a,e.b])assert.equal(byId.get(id).publication_hold,'none',id+' not eligible for relationship indexing');
  assert.ok(Object.hasOwn(curated.types,e.type));
  for(const k of ['question','basis','limit','source','credit','reviewed_on'])assert.ok(typeof e[k]==='string'&&e[k].trim());
  assert.ok(/^(?:records\/[a-z0-9-]+|[a-z0-9-]+)\.html(?:#[a-z0-9-]+)?$/.test(e.source)&&require('node:fs').existsSync(path.join(root,e.source.split('#')[0])),e.source);
}
const connected=new Set(orreryEdges.flatMap(e=>[e.a,e.b]));
const nodes=entries.map(e=>({id:e.id,title:e.title,record_status:e.record_status,publication_hold:e.publication_hold,record:'records/'+e.id+'.html',relationships:orreryEdges.filter(r=>r.a===e.id||r.b===e.id).length}));
const orreryData={version:curated.version,catalog_sha256:manifest.catalog_sha256,scope:'Explicit documented or proposed relationships only. No inferred transitive links, compatibility, physical coupling, or safety approval. Hold/watch records have no indexed edges.',types:curated.types,counts:{records:nodes.length,connected:connected.size,edges:orreryEdges.length},nodes,edges:orreryEdges};
output('orrery.json',JSON.stringify(orreryData,null,2)+'\n');
const edgeCard=e=>'<article class="orrery-edge" id="relation-'+e.id+'" data-a="'+e.a+'" data-b="'+e.b+'" data-type="'+e.type+'"><h3>'+escapeHtml(e.question)+'</h3><p class="orrery-kind">'+escapeHtml(curated.types[e.type])+'</p><p><a href="records/'+e.a+'.html">'+escapeHtml(byId.get(e.a).title)+'</a> &mdash; <a href="records/'+e.b+'.html">'+escapeHtml(byId.get(e.b).title)+'</a></p><p><strong>Basis:</strong> '+escapeHtml(e.basis)+'</p><p><strong>Boundary:</strong> '+escapeHtml(e.limit)+'</p><p><a href="'+e.source+'">Read relationship source</a> | '+escapeHtml(e.credit)+'</p><div class="orrery-neighbors" hidden></div></article>';
const orreryBody='<p>A map of research relationships, not an automatic discovery or compatibility engine. '+nodes.length+' catalog records can be selected; '+connected.size+' have '+orreryEdges.length+' curated connections. Unmapped means not yet reviewed for relationships, not isolated or unworthy of research.</p><p><a href="orrery.json">Machine-readable graph</a> | <a href="record-index.html">Full research directory</a> | <a href="guided-alchemy.html">Guided pathways</a>. Holds and watches are excluded from relationship edges; public summary records remain available.</p><form id="orrery-controls" hidden><label>Find a record<input id="orrery-search" type="search" placeholder="Filter titles or IDs" autocomplete="off"></label><label>Center a design<select id="orrery-focus"><option value="">All documented relationships</option>'+nodes.map(n=>'<option value="'+n.id+'" data-status="'+n.publication_hold+'" data-record-status="'+n.record_status+'">'+escapeHtml(n.title)+(n.publication_hold==='none'?'':' [publication review]')+'</option>').join('')+'</select></label><label>Relationship type<select id="orrery-type"><option value="">All types</option>'+Object.entries(curated.types).map(([k,v])=>'<option value="'+k+'">'+escapeHtml(v)+'</option>').join('')+'</select></label><button type="reset">Reset view</button></form><p id="orrery-status" role="status" aria-live="polite" hidden></p><p id="orrery-record" hidden></p><div id="orrery-map" hidden><h2>Local relationship map</h2><p>Choose a design to center the map. The diagram shows only direct curated links; the evidence cards below are authoritative.</p><svg id="orrery-svg" role="img" aria-label="Local relationship diagram" viewBox="0 0 340 280"></svg></div><h2>Relationship register</h2><div id="orrery-edges">'+orreryEdges.map(edgeCard).join('')+'</div><noscript><p>All curated relationships are shown above. Use Find to locate a title. Interactive centering requires JavaScript.</p></noscript><p>Editorial connections are questions, not additional experimental evidence. Missing or uncertain relationships must not be filled by title similarity.</p>';
output('orrery.html',readingPage('The Orrery: research relationships',orreryBody).replace('</head>','<link rel="stylesheet" href="orrery.css"><script defer src="orrery.js"></script></head>'));

output('scriptorium.html',readingPage('The Scriptorium',"<p>The Scriptorium is the private drafting stage of the Well. See <a href=\"how-to-misread.html\">How to misread the Well</a>. Capture an unfinished thought, its question, uncertainties and possible related records before deciding whether it deserves review.</p><p><a href=\"scriptorium-notebook.html\" download=\"scriptorium-notebook.html\">Download the blank offline notebook</a>. Save it outside the public Git repository and open the downloaded file directly. The editor refuses to run on the hosted website.</p><h2>Working method</h2><ol><li>Capture a thought without having to justify a finished design.</li><li>Mark it draft, parked or ready for private review.</li><li>Export a private archive and verify it was saved. Reopen that JSON file in the offline notebook next time.</li><li>When appropriate, write a separate bounded review packet. Do not copy private material into the packet automatically.</li><li>Send the packet for human source, safety and release review before any catalog entry is considered.</li></ol><h2>Privacy boundaries</h2><p>The notebook uses session memory, not website storage, accounts or a remote database. It contains no automatic saving, synchronization, analytics, network submission or publication action. Files are not encrypted; device access and backup security remain your responsibility. Closing the notebook without exporting can lose work. The browser cannot verify whether an export was saved successfully.</p><p>Do not place private archives in the public repository. The public Well contains only the empty tool and these instructions, not notebook contents. Existing sticky notes are not automatically read or imported.</p><p><a href=\"orrery.html\">The Orrery</a> provides reviewed research links; possible related IDs in a private note remain unverified. <a href=\"publication-safety.html\">Publication safeguards</a> still apply to all proposed releases.</p>"));


const queueSeed=JSON.parse(readText(path.join(root,'test-queue-curated.json')));
const queueIds=new Set();
const queueTasks=queueSeed.tasks.map(task=>{
  assert.ok(!queueIds.has(task.guide));queueIds.add(task.guide);
  const g=guides.find(x=>x.id===task.guide);assert.ok(g,task.guide);
  for(const id of [g.a,g.b])assert.equal(byId.get(id).publication_hold,'none');
  for(const k of ['title','question','equipment','cost','effort','baseline','fixture','metric','accept','contrary','stop','scope'])assert.ok(typeof task[k]==='string'&&task[k].trim(),k);
  assert.ok([1,2,3].includes(task.priority));
  return {...task,id:'test-'+task.guide,status:'proposed-not-run',source:'guided-alchemy.html#'+g.id,records:[g.a,g.b],source_credit:g.credit,plan_credit:'Asteris Solenne / ChatGPT; proposed synthetic check, not Court-approved',revision:'2026-11-25-v1'};
});
const queue={version:'2026-11-25-v1',catalog_sha256:manifest.catalog_sha256,scope:'Proposed computational checks only. No run, approval or validation implied. Priority is editorial effort estimate, not scientific importance.',tasks:queueTasks};
output('test-queue.json',JSON.stringify(queue,null,2)+'\n');
const queueField=(k,v)=>'<dt>'+escapeHtml(k)+'</dt><dd>'+escapeHtml(v)+'</dd>';
const queueCard=t=>'<article class="queue-card" id="'+t.id+'" data-priority="'+t.priority+'"><p class="catalog-type">Priority '+t.priority+' | Proposed plan</p><h2>'+escapeHtml(t.title)+'</h2><p>'+escapeHtml(t.question)+'</p><p>'+t.records.map(guideLink).join(' &middot; ')+' | <a href="'+t.source+'">Source question</a></p><dl>'+[['Equipment',t.equipment],['Estimated incremental cost',t.cost],['Effort',t.effort],['Baseline',t.baseline],['Fixture / protocol',t.fixture],['Metric',t.metric],['Acceptance',t.accept],['Contrary result',t.contrary],['Stop / inconclusive',t.stop],['Scope and safety boundary',t.scope]].map(([k,v])=>queueField(k,v)).join('')+'</dl><p>'+escapeHtml(t.plan_credit)+'; source: '+escapeHtml(t.source_credit)+'</p></article>';
const queueBody='<p>Turn a research question into a bounded, falsifiable test. This work queue is distinct from the CRUCIBLE autonomy research project. All six entries are proposed test plans, not results. Later observed executions are indexed separately in <a href="chronicle.html">the Chronicle</a>. Priority 1 = small arithmetic fixtures; 2 = additional assumptions or implementation; 3 = protocol development required. No physical tests are authorized.</p><p><a href="test-queue.json">Machine-readable plans</a> | <a href="test-worksheet.html" download="test-worksheet.html">Download the offline test worksheet</a> | <a href="orrery.html">Research relationships</a> | <a href="publication-safety.html">Publication boundaries</a>.</p><h2>Research workflow</h2><ol><li>Choose a plan and read its source and limits.</li><li>Freeze the plan, source revision, environment, implementation, fixture and acceptance rules before seeing outcomes. Export a dated plan receipt.</li><li>Execute independently, outside this tool, only within the synthetic boundary.</li><li>Record actual observations, artifacts, deviations and outcome; retain failures and inconclusive cases. Export a separate reported-run receipt for review. A completed worksheet is not proof that a run happened.</li></ol><label for="queue-priority" hidden id="queue-filter-label">Filter priority<select id="queue-priority"><option value="">All proposed tasks</option><option value="1">1 - Small fixtures</option><option value="2">2 - Additional assumptions</option><option value="3">3 - Protocol development</option></select></label><p id="queue-count" role="status" hidden></p><div id="queue-register">'+queueTasks.map(queueCard).join('')+'</div><p>The worksheet runs only from a downloaded local file. No automatic test execution, source modification, approval or publication occurs. Local receipts are not encrypted.</p>';
output('test-queue.html',readingPage('The Crucible: experimental work queue',queueBody).replace('</head>','<link rel="stylesheet" href="test-queue.css"><script defer src="test-queue.js"></script></head>'));
const worksheetTemplate=readText(path.join(root,'templates/test-worksheet.template'));
output('test-worksheet.html',worksheetTemplate.replace('/*QUEUE_DATA*/null',JSON.stringify(queue).replaceAll('<','\\u003c')));


const chronicleRoot='research/chronicle/';
const runReceipt=JSON.parse(readText(path.join(root,chronicleRoot+'run-receipt.json')));
const runOutput=JSON.parse(readText(path.join(root,chronicleRoot+'observed-output.json')));
const frozenPlan=JSON.parse(readText(path.join(root,chronicleRoot+'frozen-plan.json')));
assert.equal(runOutput.plan_sha256,sha(readText(path.join(root,chronicleRoot+'frozen-plan.json'))));
for(const a of runReceipt.artifacts){
  const actualPath=a.path==='test-queue.json'?chronicleRoot+'queue-snapshot.json':a.path;
  assert.equal(sha(readText(path.join(root,actualPath))),a.sha256,actualPath+' historical receipt mismatch');
}
assert.deepEqual(runReceipt.tasks,runOutput.results.map(t=>({id:t.id,outcome:t.outcome,cases:t.cases.length,matched:t.cases.filter(c=>c.matches).length})));
const archive=JSON.parse(readText(path.join(root,chronicleRoot+'archive-index.json')));
for(const a of archive.artifacts)assert.equal(sha(readText(path.join(root,a.path))),a.sha256,a.path+' archive snapshot mismatch');
const archiveRecord=byId.get(archive.record);assert.equal(archiveRecord.publication_hold,'none');
const resultEntries=runReceipt.tasks.map(t=>{const task=frozenPlan.tasks.find(x=>x.id===t.id);const source=JSON.parse(readText(path.join(root,chronicleRoot+'queue-snapshot.json'))).tasks.find(x=>x.id===t.id);for(const id of source.records)assert.equal(byId.get(id).publication_hold,'none');return {...t,question:source.title,records:source.records,plan_url:'test-queue.html#'+t.id,observations:runOutput.results.find(x=>x.id===t.id).cases};});

const coverageRoot='research/chronicle/v2/';
const coverageReceipt=JSON.parse(readText(path.join(root,coverageRoot+'receipt.json')));
const coverageOutput=JSON.parse(readText(path.join(root,coverageRoot+'output.json')));
const coveragePlan=JSON.parse(readText(path.join(root,coverageRoot+'plan.json')));
const coverageFreeze=JSON.parse(readText(path.join(root,coverageRoot+'freeze-observation.json')));
for(const a of coverageReceipt.artifacts)assert.equal(sha(readText(path.join(root,coverageRoot+a.file))),a.sha256,a.file+' historical receipt mismatch');
assert.equal(coverageOutput.plan_sha256,sha(readText(path.join(root,coverageRoot+'plan.json'))));
assert.deepEqual(coverageReceipt.retention,coverageOutput.retention);
assert.equal(coverageReceipt.freeze_commit,coverageFreeze.commit);
assert.equal(coverageOutput.retention.recorded,coverageOutput.results.reduce((n,t)=>n+t.cases.length,0));
const coverageIndex={evidence_class:'same-author-determinism-check',receipt:coverageReceipt,freeze_observation:coverageFreeze,plan_path:coverageRoot+'plan.json',output_path:coverageRoot+'output.json',mutations:coverageOutput.mutants,results:coverageOutput.results};
const coverageBody='<section id="accounting-002"><h2>Observed run 002: strengthened fixture coverage</h2><p><strong>Evidence class: same-author determinism check.</strong> '+coverageOutput.retention.recorded+' / '+coverageOutput.retention.planned+' authored fixtures matched and recorded; '+coverageOutput.retention.excluded+' excluded. '+coverageOutput.mutants.filter(m=>m.killed).length+' / '+coverageOutput.mutants.length+' reconstructed named mutants caught by actual mismatches (not Claude&#39;s original script). Zero independent replications recorded.</p><p>'+escapeHtml(coveragePlan.credit)+'</p><p>'+escapeHtml(coveragePlan.scope)+'</p><p>Reproduce with <code>'+escapeHtml(coverageReceipt.command)+'</code>. The frozen queue snapshot is already beside the runner; no manual copying required. Exit 0 = all checks match; 1 = contrary; 2 = classified execution error. Inconclusive scientific outcomes require separate human review. The mutation list is reconstructed from the review, not a copy of Claude&#39;s original script.</p><p>Published freeze commit <a href="https://github.com/RayPeloquin/mimirs-well/commit/'+coverageFreeze.commit+'">'+coverageFreeze.commit+'</a>; author-observed raw bytes at '+escapeHtml(coverageFreeze.observed_at)+'; run started '+escapeHtml(coverageReceipt.started_at)+'. '+escapeHtml(coverageFreeze.scope)+'</p><h3>Mutation coverage</h3><ul>'+coverageOutput.mutants.map(m=>'<li>'+escapeHtml(m.id)+': '+(m.killed?'caught':'survived')+'; mismatches: '+escapeHtml(m.mismatches.join(', ')||'none')+'; execution errors: '+m.errors.length+'</li>').join('')+'</ul><h3>Frozen artifacts and full results</h3><ul>'+coverageReceipt.artifacts.map(a=>'<li><a href="'+coverageRoot+a.file+'">'+escapeHtml(a.file)+'</a> | SHA-256 <code class="record-text">'+a.sha256+'</code></li>').join('')+'</ul><p><a href="'+coverageRoot+'receipt.json">Execution receipt</a> | <a href="'+coverageRoot+'README.md">Reproduction notes</a>. '+escapeHtml(coverageReceipt.limitations)+'</p></section>';


const errorControl=JSON.parse(readText(path.join(root,coverageRoot+'error-controls-receipt.json')));
for(const a of errorControl.inputs)assert.equal(sha(readText(path.join(root,coverageRoot+a.file))),a.sha256);
assert.equal(errorControl.observations.length,3);
assert.ok(errorControl.observations.every(o=>o.matched&&o.exit_code===2&&o.stdout.status==='error'&&o.stdout.code===o.expected.code));
const errorBody='<section id="execution-error-controls"><h2>Observed software error controls (not scientific findings)</h2><p>'+escapeHtml(errorControl.scope)+'</p><p>Three deliberately invalid isolated copies all returned exit 2 and distinct error codes. No successful research receipt was generated by these invalid executions.</p><ul>'+errorControl.observations.map(o=>'<li>'+escapeHtml(o.id)+': <code>'+escapeHtml(o.stdout.code)+'</code> (exit '+o.exit_code+')</li>').join('')+'</ul><p><a href="'+coverageRoot+'error-controls-receipt.json">Observed error-control receipt</a> | <a href="'+coverageRoot+'error-controls.cjs">Reproduction script</a>. SHA-256 of receipt (UTF-8 LF): <code class="record-text">'+sha(readText(path.join(root,coverageRoot+'error-controls-receipt.json')) )+'</code>.</p></section>';

const chronicle={execution_error_controls:errorControl,coverage:coverageIndex,version:'2026-11-25-v2',scope:'Observed same-author synthetic fixture checks and separately labeled archived reports. No independent replication or physical validation.',observed:[{receipt:runReceipt,output_path:chronicleRoot+'observed-output.json',plan_path:chronicleRoot+'frozen-plan.json',queue_snapshot:chronicleRoot+'queue-snapshot.json',tasks:resultEntries}],archived:[archive]};
output('chronicle.json',JSON.stringify(chronicle,null,2)+'\n');
const chronicleArtifacts=items=>'<ul>'+items.map(a=>'<li><a href="'+escapeHtml(a.path==='test-queue.json'?chronicleRoot+'queue-snapshot.json':a.path)+'">'+escapeHtml(a.path==='test-queue.json'?'Frozen queue snapshot':a.path)+'</a><br>SHA-256 (UTF-8 LF): <code class="record-text">'+a.sha256+'</code></li>').join('')+'</ul>';
const observedCards=resultEntries.map(t=>'<section id="run-'+t.id+'"><h3>'+escapeHtml(t.question)+'</h3><p><strong>'+escapeHtml(t.outcome==='supports-limited-check'?'Same-author determinism check (historical outcome code preserved)':t.outcome)+'</strong> | '+t.matched+' / '+t.cases+' fixture cases matched the frozen expectations. <a href="'+t.plan_url+'">Proposed test plan</a> | '+t.records.map(guideLink).join(' &middot; ')+'</p><div style="overflow-x:auto"><table><thead><tr><th scope="col">Case</th><th scope="col">Expected</th><th scope="col">Observed</th><th scope="col">Matches</th></tr></thead><tbody>'+t.observations.map(c=>'<tr><th scope="row">'+escapeHtml(c.id)+'</th><td><code>'+escapeHtml(JSON.stringify(c.expected))+'</code></td><td><code>'+escapeHtml(JSON.stringify(c.actual))+'</code></td><td>'+ (c.matches?'Yes':'No')+'</td></tr>').join('')+'</tbody></table></div></section>').join('');
const chronoBody='<p>Research receipts, not site-maintenance test counts. This library preserves observed calculations, archived reports, contrary results and reproduction gaps. Replaying a same-author fixture is not independent replication.</p><p><a href="chronicle.json">Machine-readable library</a> | <a href="test-queue.html">Experimental work queue</a> | <a href="ledger.html">Divergence Ledger</a>.</p><section id="accounting-001"><h2>Observed run: three synthetic accounting checks</h2><p>'+escapeHtml(runReceipt.run_id)+' | '+escapeHtml(runReceipt.started_at)+' to '+escapeHtml(runReceipt.finished_at)+' | Exit '+runReceipt.exit_code+' | '+escapeHtml(runReceipt.environment.node+' / '+runReceipt.environment.platform+' / '+runReceipt.environment.arch)+'</p><p>Local pre-execution plan commit: <code>'+runReceipt.plan_commit+'</code>. Queue source commit: <a href="https://github.com/RayPeloquin/mimirs-well/commit/'+frozenPlan.source_commit+'">'+frozenPlan.source_commit+'</a>. Local timestamp and commit order are not independently certified; a squash merge may not retain the intermediate commit on main.</p><p>Reproduce in a clean checkout containing this receipt and the matching queue: <code>'+escapeHtml(runReceipt.command)+'</code>. No additional packages required. If the queue changes, use the frozen queue snapshot in an isolated copy, not by overwriting a working archive. Compare stdout with the observed output. A different result is evidence to retain, not suppress.</p><p>'+escapeHtml(runReceipt.limitations)+'</p>'+observedCards+'<h3>Frozen artifacts</h3>'+chronicleArtifacts(runReceipt.artifacts)+'<p><a href="'+chronicleRoot+'run-receipt.json">Original execution receipt</a> | <a href="'+chronicleRoot+'README.md">Reproduction instructions</a>.</p></section><section id="archived-temporal-acoustics"><h2>Archived report: Temporal Acoustics v0.3</h2><p>Archived synthetic study, not rerun for this release. <a href="records/'+archive.record+'.html">Canonical research record</a> | <a href="temporal-acoustics-divergence-ledger.html">Divergence Ledger</a>.</p><p>'+escapeHtml(archive.summary)+'</p><p><strong>Contrary control:</strong> '+escapeHtml(archive.contrary)+'</p><p><strong>Reproduction gap:</strong> '+escapeHtml(archive.limit)+'</p><p>Archived source snapshot: <a href="https://github.com/RayPeloquin/mimirs-well/commit/'+archive.source_commit+'">'+archive.source_commit+'</a>. Commands from the archived README: <code>'+escapeHtml(archive.commands.join(' ; '))+'</code>.</p>'+chronicleArtifacts(archive.artifacts)+'</section><h2>Independent replication</h2><p>No independent replication is recorded in this initial library. A reviewer must identify the exact inputs and implementation, use an independent execution or method, and retain discrepancies and limits. Reported results are not automatically promoted to validated evidence.</p>';
output('chronicle.html',readingPage('The Chronicle: reproducibility library','<p><a href="how-to-misread.html">How to misread the Well</a></p>'+coverageBody+errorBody+chronoBody));

output('how-to-misread.html',readingPage('How to misread the Well',"<p>Read evidence classes before conclusions. A relationship is a question, not a coupling. A frozen plan is a proposal, not a result. A hash identifies bytes relative to a reference, not truth, authority, safety or a trusted time. A local acknowledgement is not approval.</p><h2>Evidence ladder</h2><ol><li>Editorial comparison or guided hypothesis: a research direction.</li><li>Proposed test plan: acceptance criteria, not executed evidence.</li><li>Same-author determinism check: a finite set of cases matches authored expectations. A replay, including on another platform, does not independently validate the model.</li><li>Independent implementation or analysis: separate reviewer and declared method; distinguish blind reimplementation from review of existing code.</li><li>Independent data or physical test: a separate evidence class requiring its own protocol, uncertainty, limitations and safety review.</li></ol><p>Negative controls are deliberately chosen test cases, not necessarily observed experimental failures. Retain every planned case, contrary result, execution error and exclusion with its reason. Missing data is not zero. A result does not automatically move a design into a stronger evidence class.</p><p><a href=\"scriptorium.html\">Private drafting</a> stays offline; explicit archives are readable files, not encrypted storage. Keep them out of public repositories. <a href=\"chronicle.html\">The Chronicle</a> preserves observed runs separately from the <a href=\"test-queue.html\">proposed queue</a>. No independent replication is claimed for the current synthetic fixtures.</p>"));
output('research-cycle.html',readingPage('The research cycle',"<p>Start anywhere, or follow this ordered reading route. The stages are a human-reviewed workflow, not an automatic promotion system. No stage authorizes physical testing or publication.</p><ol><li><h2><a href=\"scriptorium.html\">The Scriptorium</a></h2><p>Capture unfinished ideas privately; export only deliberately separated review material.</p></li><li><h2><a href=\"orrery.html\">The Orrery</a></h2><p>Explore curated relationships and their limitations; no inferred compatibility.</p></li><li><h2><a href=\"guided-alchemy.html\">Guided Alchemy</a></h2><p>Choose a proposed research question, not an established coupling.</p></li><li><h2><a href=\"dimensional-witness.html\">Dimensional Witness</a></h2><p>Review quantity meanings and refuse incompatible mappings; no approval of equations.</p></li><li><h2><a href=\"equation-bench.html\">The Alchemist's Equation Bench</a></h2><p>Prepare a bounded mathematical hypothesis and test brief; the separate interactive workspace is also available. <a href=\"combine.html\">Open the interactive Alchemist&#39;s Bench</a>.</p></li><li><h2><a href=\"test-queue.html\">The Crucible Work Queue</a></h2><p>Specify a baseline, fixture, acceptance, contrary and stop conditions before execution.</p></li><li><h2><a href=\"chronicle.html\">The Chronicle</a></h2><p>Preserve observed outcomes, inputs, source hashes, contrary controls and reproduction limits.</p></li><li><h2><a href=\"ledger.html\">The Divergence Ledger</a></h2><p>Record evidence and unresolved questions; return to the Scriptorium to revise.</p></li></ol><h2>Read the limits first</h2><p><a href=\"how-to-misread.html\">How to misread the Well</a>: evidence classes, hashes, privacy, and the distinction between a deterministic check and independent science. <a href=\"publication-safety.html\">Publication safeguards</a> remain in force. No independent replication is claimed by the current Chronicle fixtures.</p>"));
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
  const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escapeHtml(entry.title)+' | Mimir&#39;s Well</title><meta name="description" content="'+escapeHtml(entry.status+(entry.record_status==='pending_review'&&evidence===entry.status?'':'; '+evidence)+'. Public research record, not certification.')+'"><link rel="canonical" href="'+entry.canonical_url+'"><link rel="stylesheet" href="../catalog-browser.css"></head><body><nav><a href="../index.html">Mimir&#39;s Well</a> | <a href="../catalog.html#'+entry.id+'">Full catalog</a> | <a href="../llms.txt">Reading guide</a></nav><main><h1>'+escapeHtml(entry.title)+'</h1><p>Record ID: '+entry.id+' | '+escapeHtml(entry.status)+'</p><p class="catalog-type">'+escapeHtml(evidence)+'</p><p class="catalog-safety">'+escapeHtml(entry.publication_notice)+' <a href="../publication-safety.html">Publication policy</a></p><p>'+escapeHtml(entry.evidence_notice)+'</p>'+field('Summary',entry.summary)+field('Evidence and limits',entry.evidence)+field('Contributors',entry.contributors)+field('Source revision',entry.revision_note)+'<section><h2>Published sources</h2>'+(links?'<ul>'+links+'</ul>':'<p>No source links supplied in this public export.</p>')+'</section>'+(entry.ledger_url?'<p><a href="'+escapeHtml(entry.ledger_url)+'">Divergence Ledger</a></p>':'')+(guides.some(g=>g.a===entry.id||g.b===entry.id)?'<section><h2>Related research questions</h2><p>Curated hypotheses only; no physical equivalence or validated coupling implied.</p><ul>'+guides.filter(g=>g.a===entry.id||g.b===entry.id).map(g=>'<li><a href="'+(g.a===entry.id?g.b:g.a)+'.html">'+escapeHtml(titleById.get(g.a===entry.id?g.b:g.a))+'</a> ? <a href="../guided-alchemy.html#'+g.id+'">'+escapeHtml(g.title)+'</a></li>').join('')+'</ul></section>':'')+(connected.has(entry.id)?'<p><a href="../orrery.html?focus='+entry.id+'">Explore direct research relationships in the Orrery</a></p>':'')+'<p>Catalog schema '+manifest.schema_version+' | <a href="../catalog-manifest.html">Catalog version and checksum</a> | <a href="../legal.html#permission">Reuse terms</a></p><p class="catalog-families">Record SHA-256: '+entry.content_sha256+'</p></main></body></html>\n';
  output('records/'+entry.id+'.html',html);
}
const compactRows = entries.map(e=>'<li><a href="records/'+e.id+'.html">'+escapeHtml(e.title)+'</a>'+ (e.publication_hold==='precautionary_hold_summary_only'?' <strong>[Hold]</strong>':e.publication_hold==='review_watch'?' <strong>[Watch]</strong>':'')+(e.record_status==='pending_review'?' [Pending review]':'')+(e.id==='unidentified-transparent-fiber-composite-concept'?' [Artwork identity pending]':'')+'</li>').join('\n');
output('record-index.html','<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research record directory | Mimir&#39;s Well</title><link rel="stylesheet" href="catalog-browser.css"></head><body><nav><a href="index.html">Mimir&#39;s Well</a> | <a href="catalog.html">Full catalog</a> | <a href="catalog-manifest.html">Manifest</a> | <a href="guided-alchemy.html">Guided pathways</a> | <a href="orrery.html">The Orrery</a> | <a href="equation-sources.html">Equation sources</a></nav><main><h1>Research record directory</h1><p>'+entries.length+' public titles. Includes unreviewed placeholders and public hold summaries; follow each link for evidence and publication status.</p><ol>'+compactRows+'</ol></main></body></html>\n');
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
