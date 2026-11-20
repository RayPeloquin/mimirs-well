const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8');

test('Temporal Acoustics has a discoverable physics record with explicit evidence limits', () => {
  const index = read('index.html');
  const registry = read('registry.js');
  assert.match(index, /<h3>Temporal Acoustics<\/h3>/);
  assert.match(index, /href="temporal-acoustics\.html"/);
  assert.match(registry, /records\.has\('temporal-acoustics'\)/);
  assert.match(registry, /solid inclusions/);
  assert.match(registry, /No actual measurements of Malta/);
});

test('public research page and image references resolve to real published files', () => {
  const page = read('temporal-acoustics.html');
  const gallery = read('well-gallery.js');
  const sources = [
    'assets/temporal-acoustics-survey-concept.png',
    'assets/temporal-acoustics-void-v-solid-concept.png',
    'assets/temporal-acoustics-holdout-detection.png',
    'assets/temporal-acoustics-solid-inclusion-challenge.png',
    'assets/temporal-acoustics-deep-lens-ambiguity.png'
  ];
  assert.equal((gallery.match(/id: 'temporal-acoustics'/g)||[]).length, 2);
  for (const source of sources) {
    assert.ok(page.includes(source), 'page links ' + source);
    assert.ok(fs.statSync(path.join(__dirname, source)).size > 1000, 'non-empty ' + source);
  }
  assert.ok(fs.existsSync(path.join(__dirname, 'research/temporal-acoustics/test_validation.py')));
  assert.ok(fs.existsSync(path.join(__dirname, 'research/temporal-acoustics/results/v0.3-metrics.json')));
  assert.match(page, /5\/8/);
  assert.match(page, /No measurements were taken at Malta/);
});
