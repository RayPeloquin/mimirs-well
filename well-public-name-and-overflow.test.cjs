const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const html = readText(path.join(__dirname, 'index.html'));

test('public search description uses Mr. Peloquin rather than the private nickname', () => {
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
  assert.ok(description, 'a public search description must exist');
  assert.match(description, /Mr\. Peloquin/);
  assert.doesNotMatch(description, /\bAnubis\b/i);
});

test('full-bleed decorative backgrounds do not introduce horizontal page scrolling', () => {
  assert.match(html, /\.hero-art\s*\{[^}]*50vw/s, 'hero retains its full-bleed artwork');
  assert.match(html, /html\s*\{[^}]*overflow-x\s*:\s*clip/s, 'decorative overspill is clipped at the root scrolling element');
});
