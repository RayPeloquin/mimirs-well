const test=require('node:test'),assert=require('node:assert/strict'),{readText}=require('./scripts/test-text.cjs');
test('Scriptorium keeps the private notebook separate from public data and network actions',()=>{
const h=readText('scriptorium-notebook.html'),g=readText('scriptorium.html');
assert.match(h,/location.protocol!=='file:'/);assert.match(h,/connect-src 'none'; form-action 'none'/);assert.match(h,/id="workspace" hidden/);assert.doesNotMatch(h,/(?:localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|WebSocket|sendBeacon|<script[^>]+src=)/);assert.match(h,/mimirs-well-private-notebook/);assert.match(h,/requires-human-release-review/);assert.match(g,/download="scriptorium-notebook.html"/);assert.match(g,/not encrypted/);assert.ok(readText('index.html').includes('href="scriptorium.html"'));
});
