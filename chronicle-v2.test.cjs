const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),os=require('node:os'),path=require('node:path'),{readText}=require('./scripts/test-text.cjs');
const base='research/chronicle/v2/',sha=s=>crypto.createHash('sha256').update(s).digest('hex');
test('expanded Chronicle fixtures detect all named mutants and preserve all outputs',()=>{
 const r=JSON.parse(readText(base+'receipt.json')),o=JSON.parse(readText(base+'output.json'));
 for(const a of r.artifacts)assert.equal(sha(readText(base+a.file)),a.sha256);
 const run=cp.spawnSync(process.execPath,[base+'run.cjs'],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.replace(/\r\n/g,'\n'),readText(base+'output.json'));
 assert.equal(o.retention.planned,16);assert.equal(o.retention.recorded,16);assert.equal(o.retention.excluded,0);assert.equal(o.mutants.length,17);assert.ok(o.mutants.every(m=>m.killed&&m.mismatches.length&&m.errors.length===0));
 const p=JSON.parse(readText(base+'plan.json'));const calc=require('./'+base+'calculate.cjs'),{evaluate}=require('./'+base+'run.cjs');p.tasks[0].expected.pop();assert.throws(()=>evaluate(p,calc),{code:'CASE_COUNT_MISMATCH'});
 assert.throws(()=>calc('test-energy-ceiling',{kind:'unknown'}),{code:'UNKNOWN_FIXTURE_KIND'});
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'well-v2-'));try{
 for(const f of ['plan.json','calculate.cjs','run.cjs','mutants.json'])fs.copyFileSync(base+f,path.join(dir,f));
 const execute=()=>{const r=cp.spawnSync(process.execPath,[path.join(dir,'run.cjs')],{encoding:'utf8'});assert.equal(r.status,2);return JSON.parse(r.stdout);};
 assert.equal(execute().code,'MISSING_QUEUE_SNAPSHOT_JSON');
 fs.copyFileSync(base+'queue-snapshot.json',path.join(dir,'queue-snapshot.json'));
 function change(fn){const p=JSON.parse(readText(base+'plan.json'));fn(p);fs.writeFileSync(path.join(dir,'plan.json'),JSON.stringify(p));return execute();}
 assert.equal(change(p=>p.tasks[0].expected.pop()).code,'CASE_COUNT_MISMATCH');
 assert.equal(change(p=>p.tasks[2].cases[0].kind='unknown').code,'UNKNOWN_FIXTURE_KIND');
 assert.equal(change(p=>p.tasks[0].expected[0].id='wrong').code,'CASE_ID_MISMATCH');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
