const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const omitted = [
  'Hydrator Neo — Pizza station',
  'Khepri Stride — Sneaker concept',
  'Canine Wearable',
  'Underground Cattle Barn',
  'Shell City — Inverted-mushroom barn',
  'Butterfly Wanderings — Coloring book',
  'Purgatory Tavern',
  'Angels Diner',
  'Winchester Monster Guild',
  'Oasis Dadan',
  'Nile’s Shadow',
];

function renderCatalog() {
  const cards = [];
  const element = (tagName) => ({
    tagName,
    children: [],
    dataset: {},
    append(...nodes) { this.children.push(...nodes); },
    querySelector(selector) { return selector === 'h3' ? this.children.find(node => node.tagName === 'h3') : null; },
  });
  const document = {
    querySelectorAll() { return []; },
    querySelector(selector) {
      if(selector !== '.grid') return null;
      return { append(card) { cards.push(card); }, querySelectorAll() { return cards; } };
    },
    createElement: element,
  };
  vm.runInNewContext(readText(path.join(__dirname, 'catalog.js')), { document, wellArmoryDivisions: require('./armory-data.js') });
  return cards.map((card) => card.children.find((child) => child.tagName === 'h3')?.textContent);
}

test('public catalog omits eleven parked concepts but retains research entries', () => {
  const names = renderCatalog();
  for (const name of omitted) assert.ok(!names.includes(name), `${name} remains public`);
  for (const name of ['ECHO Protocell — Resonant and Provisioned Seed', 'MIRRORBOX M01', 'RUBIQ', 'Aether-Latch Memory', 'Polyforge-1 — Ocean cleanup ship', 'Euplectella Node A / Node B']) {
    assert.ok(names.includes(name), `${name} was accidentally omitted`);
  }
  assert.ok(names.includes('FQSC-01'), 'new reviewed physics design should remain public');
  assert.equal(new Set(names).size, names.length, 'no duplicate public cards');
  assert.equal(fs.existsSync(path.join(__dirname, 'public-notes', 'butterfly-wanderings.md')), false,
    'the removed demo should not retain a public source note');
});
