const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const path = require('node:path');

const script = path.join(__dirname, 'well-gallery.js');

function element(tag) {
  return {
    tag, className: '', children: [], attributes: {}, textContent: '',
    append(...items) { this.children.push(...items); },
    setAttribute(name, value) { this.attributes[name] = value; },
  };
}

function createFixture(ids) {
  const cards = new Map(ids.map(id => {
    const card = element('article');
    const note = element('p');
    card.append(note);
    note.after = child => card.append(child);
    card.querySelector = selector => selector === 'p' ? note : card.children.find(x => x.className === 'concept-art');
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

test('seven matching design cards receive labeled, clickable concept artwork', () => {
  const fieldId = 'field-medic-guided-hand-support';
  const hippoId = 'hippo-mag-01-magnetic-compensation-experiment';
  const skepticId = 'skeptic-1';
  const aegisId = 'aegis-twin-v0-6';
  const herdId = 'herdminder-hm-01';
  const atlasId = 'atlas-cistern';
  const lanceId = 'lifeguard-lance-rescue-drone-and-fleet';
  const otherId = 'sisters-hope-hand-restoration-gloves';
  const app = createFixture([fieldId, hippoId, skepticId, aegisId, herdId, atlasId, lanceId, otherId]);
  app.render();
  for (const [id, filename, name] of [
    [fieldId, 'field-medic-assistive-backpack.webp', 'FIELD MEDIC'],
    [hippoId, 'hippo-mag-01-tabletop.webp', 'HIPPO-MAG-01'],
    [skepticId, 'skeptic-1-probe-bench.webp', 'SKEPTIC-1'],
    [aegisId, 'aegis-twin-v06-exterior.webp', 'AEGIS-TWIN'],
    [herdId, 'herdminder-hm01-concept.webp', 'HerdMinder'],
    [atlasId, 'atlas-cistern-concept.webp', 'Atlas Cistern'],
    [lanceId, 'lifeguard-lance-concept.webp', 'Lifeguard Lance'],
  ]) {
    assert.equal(app.figures(id).length, 1, id + ' should have exactly one image');
    const figure = app.figures(id)[0];
    const [link, caption] = figure.children;
    const image = link.children[0];
    assert.equal(image.src, 'assets/' + filename);
    assert.equal(link.href, image.src);
    assert.match(image.alt, new RegExp(name));
    assert.equal(image.loading, 'lazy');
    assert.match(caption.textContent, /concept|illustration|untested/i);
    const localAsset = filename.startsWith('aegis-') ? path.join(__dirname, 'web_assets', filename) : path.join(__dirname, 'assets', filename);
    assert.ok(existsSync(localAsset), `${filename} must have a matching image asset`);
  }
  assert.equal(app.figures(otherId).length, 0, 'unrelated designs remain untouched');
});

test('artwork loader tolerates a missing design and does not duplicate existing figures', () => {
  const id = 'field-medic-guided-hand-support';
  const app = createFixture([id]);
  app.render();
  assert.equal(app.figures(id).length, 1);
  app.render();
  assert.equal(app.figures(id).length, 1);
});
