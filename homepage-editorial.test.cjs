/* Content-only regression checks after the 23 November 2026 editorial review. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html','utf8');
const gallery = fs.readFileSync('well-gallery.js','utf8');
const issue = fs.readFileSync('.github/ISSUE_TEMPLATE/project-critique.md','utf8');
const sections = [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m => m[1]);
const featured = [...html.matchAll(/<article class="card" data-featured[\s\S]*?<\/article>/g)].map(m => m[0]);

test('the collection and its pending subsection precede the Bench and Ledger', () => {
  assert.deepEqual(sections.slice(0,4), ['projects','pending-projects','alchemists-bench','divergence-ledger']);
  assert.match(html, /<a id="jump-pending" href="#pending-projects" hidden>/);
  assert.match(html, /pendingJump\.hidden=pendingSection\.hidden/);
  assert.match(html,/Mimir’s Well is a public collection of engineering concepts/);
  assert.equal(featured.length,10);
  const visible = featured.filter(card => !card.startsWith('<article class="card" data-featured hidden'));
  assert.equal(visible.length, 6);
  for (const card of visible) {
    assert.match(card, /<\/h3><div class="featured-evidence">[^<]+<\/div><p>/);
    assert.match(card, />Inspect the /);
  }
});

test('private Hall and unverified prototype URLs are not advertised publicly', () => {
  assert.doesNotMatch(html,/chatgpt\.com\/space\/page_/);
  assert.doesNotMatch(html,/viridduck16\.chatgpt\.site/);
  assert.doesNotMatch(html, /Hall of Areopagus/);
  assert.match(fs.readFileSync('workbench.html', 'utf8'), /private review workspace/);
});

test('Ankh concept art is not presented without provenance', () => {
  assert.doesNotMatch(html,/id="qubit-art"/);
  assert.doesNotMatch(html,/qubit-ankh-quantum-concept\.jpg/);
  assert.doesNotMatch(gallery,/qubit-ankh-quantum-concept\.jpg/);
});

test('the safety principle is framed as guidance, not certified safety', () => {
  assert.match(html,/Guiding principle:/);
  assert.match(html,/Untested concepts are not certified safe/);
  assert.equal((html.match(/We do no harm\./g)||[]).length,1);
});

test('public archive excerpts and evidence connections remain discoverable', () => {
  for(const name of ['echo-rx-divergence-ledger.html','echo-m-divergence-ledger.html','temporal-reflection-chamber-divergence-ledger.html'])
    assert.ok(html.includes('href="'+name+'"'), name+' linked');
  assert.match(html,/public summaries of privately held design materials/);
  assert.equal((html.match(/<ul class="archive-list">/g)||[]).length,2);
  assert.match(html,/catalog\.html#hippo-bus-scheduled-hybrid-power-distribution/);
  assert.match(html,/href="workbench\.html"/);
});

test('public feedback does not publish owner email', () => {
  assert.doesNotMatch(html,/mailto:raypeloquin54@gmail\.com/);
  assert.match(html,/issues\/new\?template=project-critique\.md/);
  assert.match(issue,/GitHub issues are public/);
});

test('offerings are voluntary and do not assert charity status', () => {
  assert.match(html,/independently operated project by Mr\. Peloquin/);
  assert.match(html,/No charitable tax deduction is offered/);
});

test('switching a catalog category clears stale research-family selection', () => {
  assert.match(html, /buttons\.forEach\(button=>button\.addEventListener\('click'/);
  assert.match(html, /if\(family&&family\.value!=='all'\)\{family\.value='all';syncFamilyUrl\(\)\}/);
  assert.match(html, /card\.dataset\.families\?\.split\(' '\)/);
});
