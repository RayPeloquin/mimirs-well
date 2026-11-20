const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('the Well gives three distinct sections their own publicly published design art', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const placements = [
    ['projects', 'assets/aegis-twin-v06-exterior.webp'],
    ['hippo', 'assets/hippo-mag-01-tabletop.webp'],
    ['workbench', 'assets/field-medic-assistive-backpack.webp'],
  ];

  for (const [section, image, localCopy = image] of placements) {
    const file = fs.readFileSync(path.join(__dirname, localCopy));
    assert.equal(file.toString('ascii', 0, 4), 'RIFF', `${image} is a valid RIFF image`);
    assert.equal(file.toString('ascii', 8, 12), 'WEBP', `${image} is a WebP image`);
    assert.ok(file.length < 350_000, `${image} stays light enough for the homepage`);
    assert.match(html, new RegExp(`<section[^>]*id="${section}"`), `${section} exists on the homepage`);
    assert.match(html, new RegExp(`#${section}::before\\s*\\{[^}]*url\\("${image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\)`, 's'), `${section} features its matching art`);
  }

  assert.match(html, /#projects::before,#hippo::before,#workbench::before\s*\{[^}]*pointer-events:none/s, 'backgrounds do not block the interface');
  assert.match(html, /#projects::before,#hippo::before,#workbench::before\s*\{[^}]*mask-image:/s, 'art softly fades into the page');
  assert.match(html, /@media\s*\(max-width:800px\)\s*\{\s*#projects::before,#hippo::before,#workbench::before/s, 'mobile view dims the artwork');
});
