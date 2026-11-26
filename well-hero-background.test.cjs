const { readText } = require('./scripts/test-text.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('the Well homepage renders a readable illustrated hero background', () => {
  const html = readText(path.join(__dirname, 'index.html'));
  const asset = path.join(__dirname, 'assets', 'mimirs-well-olympus-background.webp');
  const file = fs.readFileSync(asset);
  assert.equal(file.toString('ascii', 0, 4), 'RIFF');
  assert.equal(file.toString('ascii', 8, 12), 'WEBP');
  assert.ok(file.length < 250_000, 'background should be lightweight');
  assert.doesNotMatch(html, /class="orb"/, 'the hero artwork should be clear of the old globe');
  assert.match(html, /\.hero-artwork\s*\{/);
  assert.ok(html.includes('url("assets/mimirs-well-olympus-background.webp")'));
  assert.match(html, /\.hero-art::after\s*\{[^}]*linear-gradient/s, 'image needs a legibility overlay');
  assert.match(html, /@media\s*\(max-width:1100px\)\s*\{[\s\S]*?\.hero-artwork\{/, 'mobile crop should be controlled');
});
