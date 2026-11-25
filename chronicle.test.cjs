const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),os=require('node:os'),path=require('node:path'),{readText}=require('./scripts/test-text.cjs');
test('Chronicle preserves frozen artifacts and reproduces the observed synthetic fixtures in isolation',()=>{
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'well-chronicle-'));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),r=JSON.parse(readText('research/chronicle/run-receipt.json')),c=JSON.parse(readText('chronicle.json'));
try{for(const a of r.artifacts){const source=a.path==='test-queue.json'?'research/chronicle/queue-snapshot.json':a.path;const s=readText(source);assert.equal(sha(s),a.sha256);const dest=path.join(dir,a.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s);}
const run=cp.spawnSync(process.execPath,['research/chronicle/replay.cjs'],{cwd:dir,encoding:'utf8'});assert.equal(run.status,0,run.stderr);assert.equal(run.stdout.replace(/\r\n/g,'\n'),readText('research/chronicle/observed-output.json'));
assert.equal(r.tasks.reduce((n,t)=>n+t.matched,0),11);assert.equal(r.tasks.length,3);
assert.equal(c.archived[0].status,'archived-report-not-rerun');for(const a of c.archived[0].artifacts)assert.equal(sha(readText(a.path)),a.sha256);
const h=readText('chronicle.html');assert.match(h,/Five of eight strong solid-inclusion/);assert.match(h,/No independent replication/);assert.ok(readText('index.html').includes('href="chronicle.html"'));assert.ok(readText('test-queue.html').includes('href="chronicle.html"'));
fs.appendFileSync(path.join(dir,'test-queue.json'),' ');const tampered=cp.spawnSync(process.execPath,['research/chronicle/replay.cjs'],{cwd:dir,encoding:'utf8'});assert.notEqual(tampered.status,0);assert.match(tampered.stderr,/Queue revision changed/);
}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
