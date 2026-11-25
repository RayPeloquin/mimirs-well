'use strict';
const { readText } = require('./scripts/test-text.cjs');
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=__dirname;
const context={window:{}};
vm.runInNewContext(readText(path.join(root,'ledger-data.js')),context);
const records=context.window.MimirsLedgerData;
test('thirty ordered, unique permanent record IDs and URLs',()=>{
 assert.equal(records.length,30);
 assert.deepEqual(Array.from(records,r=>r.number),Array.from({length:30},(_,i)=>i+1));
 assert.equal(new Set(Array.from(records,r=>r.url)).size,records.length);
 for(const r of records){
  assert.match(r.url,/^[a-z0-9-]+\.html$/);
  assert.match(r.updated,/^\d{4}-\d{2}-\d{2}$/);
  for(const key of ['title','category','evidence','status','summary'])assert.ok(typeof r[key]==='string'&&r[key].trim(),r.url+': '+key);
  assert.ok(fs.existsSync(path.join(root,r.url)),r.url+' is missing');
 }
});
test('library and homepage use shared directory and preserve a no-script list',()=>{
 const home=readText(path.join(root,'index.html'));
 const page=readText(path.join(root,'ledger.html'));
 assert.ok(home.includes('id="ledger-preview"'));
 assert.ok(home.includes('href="ledger.html"'));
 assert.ok(home.includes('src="ledger-data.js?'));
 assert.ok(home.includes('src="ledger-library.js?'));
 assert.ok(page.includes('id="ledger-results"'));
 assert.ok(page.includes('id="ledger-search"'));
 assert.ok(page.includes('id="ledger-category"'));
 assert.ok(page.includes('id="ledger-evidence"'));
 assert.ok(page.includes('id="ledger-sort"'));
 assert.ok(page.includes('id="ledger-more"'));
 assert.ok(page.includes('id="ledger-fallback"'));
 assert.equal((page.match(/<li><a href="[a-z0-9-]+-ledger\.html|<li><a href="divergence-ledger\.html/g)||[]).length,30);
 for(const r of records)assert.ok(page.includes('href="'+r.url+'"'),r.url+' lacks fallback link');
 assert.equal((home.slice(home.indexOf('id="ledger-preview"'),home.indexOf('Six recent records appear here.')).match(/DIVERGENCE RECORD/g)||[]).length,6);
});
test('script syntax and progressive enhancement controls exist',()=>{
 const js=readText(path.join(root,'ledger-library.js'));
 assert.ok(js.includes('replaceChildren'));
 assert.ok(js.includes('const pageSize = 6'));
 assert.ok(js.includes('document.getElementById(\'ledger-preview\')'));
 assert.ok(js.includes('fallback.hidden=true'));
 assert.ok(js.includes('form.hidden=false'));
 assert.ok(js.includes('results.hidden=false'));
});
