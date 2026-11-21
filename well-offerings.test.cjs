'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
test('one accessible, unobtrusive voluntary offering section exists',()=>{
 assert.equal((html.match(/id="offerings"/g)||[]).length,1);
 assert.equal((html.match(/id="offerings-title"/g)||[]).length,1);
 assert.match(html,/section id="offerings" class="well-offerings" aria-labelledby="offerings-title"/);
 assert.match(html,/An Offering to the Gods of Technology/);
 assert.match(html,/Toss a coin into the Well/);
 assert.match(html,/class="well-offerings-coin"/);
 assert.match(html,/class="well-offerings-ripple"/);
 assert.match(html,/href="#offerings">Support the Well/);
});
test('uses existing contact rather than a fabricated payment destination',()=>{
 assert.match(html,/mailto:raypeloquin54@gmail\.com\?subject=An%20Offering/);
 assert.match(html,/No payments are collected on this website/);
 assert.match(html,/No charitable tax-deductible status is claimed/);
 assert.doesNotMatch(html,/href="https:\/\/(?:paypal|ko-fi|buymeacoffee|cash\.app|venmo|stripe)\./i);
});
