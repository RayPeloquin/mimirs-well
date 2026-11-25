const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),{readText}=require('./scripts/test-text.cjs');
test('body cycle map connects every research stage and preserves classified failure controls',()=>{
 const map=readText('research-cycle.html');
 for(const p of ['scriptorium.html','orrery.html','guided-alchemy.html','dimensional-witness.html','equation-bench.html','test-queue.html','chronicle.html','ledger.html','combine.html','how-to-misread.html']){assert.ok(map.includes('href="'+p+'"'),p);assert.ok(readText(p).includes('href="research-cycle.html"'),p);}
 assert.ok(readText('index.html').includes('href="research-cycle.html"'));
 const b='research/chronicle/v2/',old=JSON.parse(readText(b+'error-controls-receipt.json'));
 for(const a of old.inputs)assert.equal(crypto.createHash('sha256').update(readText(b+a.file)).digest('hex'),a.sha256);
 const r=cp.spawnSync(process.execPath,[b+'error-controls.cjs'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
 const actual=JSON.parse(r.stdout);const shape=x=>x.observations.map(({id,expected,exit_code,stdout,stderr,matched})=>({id,expected,exit_code,stdout,stderr,matched}));
 assert.deepEqual(shape(actual),shape(old));assert.equal(actual.observations.length,3);assert.ok(actual.observations.every(o=>o.exit_code===2&&o.matched&&o.stdout.status==='error'));
 const page=readText('chronicle.html');assert.ok(page.includes('17 / 17 reconstructed named mutants'));assert.ok(page.includes('Zero independent replications recorded'));assert.ok(page.includes('Same-author determinism check (historical outcome code preserved)'));assert.ok(!page.includes('<strong>supports-limited-check</strong>'));
});
