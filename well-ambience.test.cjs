'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'well-ambience.js'), 'utf8');
test('sound is optional and labeled on the homepage', () => {
  assert.match(html, /id="well-sound-toggle" aria-pressed="false"/);
  assert.match(html, /id="well-sound-volume"/);
  assert.match(html, /Sound is off until you press play/);
  assert.match(html, /src="well-ambience.js\?v=/);
});
test('audio is generated locally and controlled by an explicit click', () => {
  assert.match(source, /button.addEventListener\('click'/);
  assert.match(source, /new AudioCtor\(\)/);
  assert.match(source, /document.addEventListener\('visibilitychange'/);
  assert.match(source, /window.addEventListener\('pagehide'/);
  assert.ok(!/\.play\(\)|fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(source));
});
