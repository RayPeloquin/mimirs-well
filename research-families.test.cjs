/* Regression checks for the Well's navigational research-family layer. */
'use strict';
const { readText } = require('./scripts/test-text.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { families, familyIdsFor } = require('./research-families.js');
const ids = new Set(families.map(f => f.id));

test('family identifiers and crossover links are stable and valid', () => {
  assert.equal(families.length, 12);
  assert.equal(ids.size, families.length);
  families.forEach(f => {
    assert.match(f.id, /^[a-z][a-z0-9-]+$/);
    assert.ok(f.name && f.description && f.patterns.length);
    assert.ok(f.bridges.every(id => id !== f.id && ids.has(id)));
  });
});

test('representative projects connect to their appropriate research families', () => {
  const checks = {
    'Court of the Synthetic': ['court-governance'],
    'GENTLE-01': ['embodiment-interfaces'],
    'Third-Look': ['clinical-care'],
    'RAVEN-P1': ['living-systems'],
    'Zion Twin-Ring Tuna Habitat': ['zion-regenerative'],
    'HIPPO CANTEEN': ['water-energy'],
    'Temporal Acoustics': ['measurement-sensing'],
    'Temporal Reflection Chamber': ['physics-quantum', 'measurement-sensing'],
    'BRIDLE-3': ['aerospace-propulsion'],
    'CRUCIBLE': ['field-protection'],
    'Roman Concrete': ['materials-making'],
    'The Golden Ratio': ['zion-regenerative', 'community-learning'],
    'Adventurer’s Forge': ['community-learning']
  };
  Object.entries(checks).forEach(([title, expected]) => {
    expected.forEach(id => assert.ok(familyIdsFor(title).includes(id), title + ' should belong to ' + id));
  });
  assert.ok(!familyIdsFor('Adventurer’s Forge').includes('materials-making'), 'Creative worlds are not material fabrication');
});

test('unfamiliar and unreviewed titles are not silently forced into a family', () => {
  assert.deepEqual(familyIdsFor(''), []);
  assert.deepEqual(familyIdsFor('Unidentified project 2027'), []);
});

test('all current source titles remain discoverable, with explicit unmapped remainder', () => {
  const src = readText('catalog.js');
  const groupMatches = [...src.matchAll(/\["(safety|biology|physics|infrastructure|robotics|community|defense)","([^"]+)","((?:\\.|[^"\\])*)"\]/g)];
  const titles = groupMatches.flatMap(m => JSON.parse('"' + m[3] + '"').split('\n').map(s => s.split(' — ')[0]));
  assert.ok(titles.length > 300, 'Recovered catalog should be available for classification');
  const mapped = titles.filter(title => familyIdsFor(title).length > 0);
  assert.ok(mapped.length / titles.length > 0.7, 'Existing work should have useful family coverage');
  assert.ok(mapped.length < titles.length, 'Unmapped projects should remain visible as a review queue');
});

test('homepage keeps the Registry and catalog filters alongside the family explorer', () => {
  const html = readText('index.html');
  assert.match(html, /id="research-families"/);
  assert.match(html, /id="family-grid"/);
  assert.match(html, /id="projects"/);
  assert.match(html, /catalog\.js[^"]*"><\/script><script src="research-families\.js/);
  assert.match(html, /registry\.js/);
  assert.match(html, /card\.dataset\.families/);
  assert.match(html, /id="reset-filters"/);
});