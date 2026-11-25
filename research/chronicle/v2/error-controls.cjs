const fs=require('fs'),cp=require('child_process'),os=require('os'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const base='research/chronicle/v2/',read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'well-error-controls-'));
const inputs=['run.cjs','calculate.cjs','mutants.json','plan.json','queue-snapshot.json'];
const observations=[];
try{
for(const f of inputs)fs.copyFileSync(base+f,path.join(dir,f));
const plan=JSON.parse(read(base+'plan.json'));
function check(id,expected,setup){
 for(const f of inputs)fs.copyFileSync(base+f,path.join(dir,f));
 setup();
 const started_at=new Date().toISOString();
 const r=cp.spawnSync(process.execPath,[path.join(dir,'run.cjs')],{encoding:'utf8'});
 const finished_at=new Date().toISOString(),actual=JSON.parse(r.stdout);
 observations.push({id,expected:{exit_code:2,status:'error',code:expected},started_at,finished_at,exit_code:r.status,stdout:actual,stderr:r.stderr,matched:r.status===2&&actual.status==='error'&&actual.code===expected});
}
check('missing-queue','MISSING_QUEUE_SNAPSHOT_JSON',()=>fs.unlinkSync(path.join(dir,'queue-snapshot.json')));
check('truncated-expected-list','CASE_COUNT_MISMATCH',()=>{const p=structuredClone(plan);p.tasks[0].expected.pop();fs.writeFileSync(path.join(dir,'plan.json'),JSON.stringify(p));});
check('unknown-fixture-kind','UNKNOWN_FIXTURE_KIND',()=>{const p=structuredClone(plan);p.tasks[2].cases[0].kind='unknown';fs.writeFileSync(path.join(dir,'plan.json'),JSON.stringify(p));});
const receipt={format:'well-chronicle-execution-error-controls-v1',source_commit:'0c1548588c8cce260b58845f7ea2740242024591',evidence_class:'same-author-software-error-controls',environment:{node:process.version,platform:process.platform,arch:process.arch},command:'node research/chronicle/v2/error-controls.cjs',scope:'Deliberate error injection in an isolated temporary copy; original research inputs and outputs unchanged. A classified execution error is not a scientific contrary result or independent replication. These controls do not implement an exclusion or inconclusive-result workflow.',inputs:inputs.map(file=>({file,sha256:sha(read(base+file))})),observations};
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');if(observations.some(o=>!o.matched))process.exitCode=1;
}finally{fs.rmSync(dir,{recursive:true,force:true});}
