const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const path = require('node:path');

const script = path.join(__dirname, 'well-gallery.js');

function element(tag) {
  return {
    tag, className: '', children: [], attributes: {}, dataset: {}, textContent: '',
    append(...items) { for (const item of items) { item.parent = this; this.children.push(item); } },
    after(item) { const siblings = this.parent.children; item.parent = this.parent; siblings.splice(siblings.indexOf(this) + 1, 0, item); },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

function createFixture(ids) {
  const cards = new Map(ids.map(id => {
    const card = element('article');
    const note = element('p');
    card.append(note);
    card.querySelector = selector => selector === 'p' ? note : card.children.find(x => x.className === 'concept-art');
    card.querySelectorAll = selector => selector === '.concept-art' ? card.children.filter(x => x.className === 'concept-art') : [];
    return [id, card];
  }));
  const document = {
    createElement: element,
    querySelector(selector) {
      const match = selector.match(/^\.card\[data-record-id="([^"]+)"\]$/);
      return match ? cards.get(match[1]) || null : null;
    },
  };
  function render() { if (existsSync(script)) runInNewContext(readFileSync(script, 'utf8'), { document }); }
  function figures(id) { return cards.get(id)?.children.filter(x => x.className === 'concept-art') || []; }
  return { render, figures };
}

test('thirteen matching design cards receive labeled, clickable concept artwork', () => {
  const fieldId = 'field-medic-guided-hand-support';
  const hippoId = 'hippo-mag-01-magnetic-compensation-experiment';
  const skepticId = 'skeptic-1';
  const aegisId = 'aegis-twin-v0-6';
  const herdId = 'herdminder-hm-01';
  const atlasId = 'atlas-cistern';
  const lanceId = 'lifeguard-lance-rescue-drone-and-fleet';
  const fqscId = 'fqsc-01';
  const radioId = 'radio-echo-chamber';
  const fluffyId = 'fluffy-01';
  const knockId = 'knock-moth-pool-tile-mapping';
  const siltId = 'silt-harp-manual-muddy-water-prefiltration';
  const crucibleId = 'crucible';
  const otherId = 'sisters-hope-hand-restoration-gloves';
  const app = createFixture([fieldId, hippoId, skepticId, aegisId, herdId, atlasId, lanceId, fqscId, radioId, fluffyId, knockId, siltId, crucibleId, otherId]);
  app.render();
  for (const [id, filename, name] of [
    [fieldId, 'field-medic-assistive-backpack.webp', 'FIELD MEDIC'],
    [hippoId, 'hippo-mag-01-tabletop.webp', 'HIPPO-MAG-01'],
    [skepticId, 'skeptic-1-probe-bench.webp', 'SKEPTIC-1'],
    [aegisId, 'aegis-twin-v06-exterior.webp', 'AEGIS-TWIN'],
    [herdId, 'herdminder-hm01-concept.webp', 'HerdMinder'],
    [atlasId, 'atlas-cistern-concept.webp', 'Atlas Cistern'],
    [lanceId, 'lifeguard-lance-concept.webp', 'Lifeguard Lance'],
    [fqscId, 'fqsc-01-concept.webp', 'FQSC-01'],
    [radioId, 'radio-echo-chamber-concept.webp', 'Radio Echo Chamber'],
    [fluffyId, 'fluffy-01-concept.webp', 'FLUFFY-01'],
    [knockId, 'knock-moth-concept.webp', 'Knock-Moth'],
    [siltId, 'silt-harp-concept.webp', 'SILT HARP'],
    [crucibleId, 'crucible-aviation-test-harness-poster.png', 'CRUCIBLE'],
  ]) {
    const figure = app.figures(id).find(f => f.children[0]?.href === 'assets/' + filename);
    assert.ok(figure, id + ' should include its expected artwork (possibly alongside later variants)');
    const [link, caption] = figure.children;
    const image = link.children[0];
    assert.equal(image.src, 'assets/' + filename);
    assert.equal(link.href, image.src);
    assert.match(image.alt, new RegExp(name));
    assert.equal(image.loading, 'lazy');
    assert.match(caption.textContent, /concept|illustration|untested/i);
    const localAsset = path.join(__dirname, 'assets', filename);
    assert.ok(existsSync(localAsset), `${filename} must have a matching image asset`);
  }
  assert.equal(app.figures(otherId).length, 0, 'unrelated designs remain untouched');
  const crucibleCaption = app.figures(crucibleId)[0].children[1].textContent;
  assert.match(crucibleCaption, /synthetic/i, 'existing demo is labeled synthetic');
  assert.match(crucibleCaption, /proposed/i, 'aircraft extension is labeled proposed');
});

test('artwork loader tolerates a missing design and does not duplicate existing figures', () => {
  const id = 'field-medic-guided-hand-support';
  const app = createFixture([id]);
  app.render();
  assert.equal(app.figures(id).length, 1);
  app.render();
  assert.equal(app.figures(id).length, 1);
});
