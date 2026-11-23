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
test('the voluntary offering opens the verified one-time Stripe checkout', () => {
  const section = html.match(/<section id="offerings"[^>]*>([\s\S]*?)<\/section>/);
  assert.ok(section, 'offering section is present');
  const destinations = [...section[1].matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(destinations, ['https://buy.stripe.com/5kQcN7gQqary1Ol8qAfrW00']);
  assert.match(section[1], /one-time tip/i);
  assert.match(section[1], /you choose the amount/i);
  assert.match(section[1], /No charitable tax deduction is offered/);
});
