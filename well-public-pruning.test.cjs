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
];

function renderCatalog() {
  const cards = [];
  const element = (tagName) => ({
    tagName,
    children: [],
    dataset: {},
    append(...nodes) { this.children.push(...nodes); },
  });
  const document = {
    querySelectorAll() { return []; },
    querySelector(selector) {
      assert.equal(selector, '.grid');
      return { append(card) { cards.push(card); } };
    },
    createElement: element,
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'catalog.js'), 'utf8'), { document });
  return cards.map((card) => card.children.find((child) => child.tagName === 'h3')?.textContent);
}

test('public catalog omits the five parked illustrated concepts but retains the research entries', () => {
  const names = renderCatalog();
  assert.equal(names.length, 384, 'three dynamic feature cards plus 381 archived titles');
  for (const name of omitted) assert.ok(!names.includes(name), `${name} remains public`);
  for (const name of ['MIRRORBOX M01', 'RUBIQ', 'Aether-Latch Memory', 'Polyforge-1 — Ocean cleanup ship', 'Euplectella Node A / Node B']) {
    assert.ok(names.includes(name), `${name} was accidentally omitted`);
  }
  assert.ok(names.includes('FQSC-01'), 'new reviewed physics design should remain public');
  assert.equal(new Set(names).size, names.length, 'no duplicate public cards');
});
