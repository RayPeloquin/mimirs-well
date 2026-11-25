'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const dir=__dirname,read=p=>fs.readFileSync(path.join(dir,p),'utf8').replace(/\r\n/g,'\n'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function fail(code,msg){throw Object.assign(Error(msg),{code});}
function load(name){try{return read(name);}catch(e){fail('MISSING_'+name.toUpperCase().replace(/[^A-Z0-9]/g,'_'),e.code||'READ_ERROR');}}
function evaluate(plan,calculate){
 return plan.tasks.map(t=>{
  if(t.cases.length!==t.expected.length)fail('CASE_COUNT_MISMATCH',t.id);
  if(new Set(t.cases.map(c=>c.id)).size!==t.cases.length||t.cases.some((c,i)=>c.id!==t.expected[i].id))fail('CASE_ID_MISMATCH',t.id);
  const cases=t.cases.map((c,i)=>{const actual=calculate(t.id,c);let matches=true;try{assert.deepStrictEqual(actual,t.expected[i]);}catch{matches=false;}return {id:c.id,expected:t.expected[i],actual,matches};});
  return {id:t.id,outcome:cases.every(c=>c.matches)?'same-author-determinism-check':'contrary',cases};
 });
}
function run(){
 const planText=load('plan.json'),plan=JSON.parse(planText),source=load('calculate.cjs'),queue=load('queue-snapshot.json'),mutText=load('mutants.json');
 for(const [key,value] of Object.entries({calculator:source,queue,mutants:mutText,runner:load('run.cjs')}))if(sha(value)!==plan.hashes[key])fail('HASH_MISMATCH',key);
 const q=JSON.parse(queue);
 for(const t of plan.tasks){const entry=q.tasks.find(x=>x.id===t.id);if(!entry||sha(JSON.stringify(entry))!==t.task_sha256)fail('TASK_HASH_MISMATCH',t.id);}
 const calculate=require('./calculate.cjs'),results=evaluate(plan,calculate);
 const mutants=JSON.parse(mutText).map(([id,a,b])=>{
  if(source.split(a).length!==2)fail('MUTANT_ANCHOR_MISMATCH',id);
  const ctx={module:{exports:{}}};vm.runInNewContext(source.replace(a,b),ctx);
  // Return JSON-compatible values into the host realm; preserve undefined/nonfinite as mismatches.
  const mutated=ctx.module.exports;
  const mismatches=[];const errors=[];
  for(const t of plan.tasks)for(const [i,c] of t.cases.entries()){
   try{const actual=mutated(t.id,c);const expected=t.expected[i];
    // Compare fields using JSON text with a nonfinite sentinel; no key reordering or tolerance.
    const serialize=v=>JSON.stringify(v,(k,x)=>typeof x==='number'&&!Number.isFinite(x)?'NONFINITE':x);
    if(serialize(actual)!==serialize(expected))mismatches.push(t.id+'/'+c.id);
   }catch(e){errors.push({case:t.id+'/'+c.id,message:e.message});}
  }
  return {id,killed:mismatches.length>0,mismatches,errors};
 });
 return {format:'well-chronicle-coverage-v2',plan_sha256:sha(planText),status:results.some(t=>t.outcome==='contrary')||mutants.some(m=>!m.killed)?'contrary':'same-author-determinism-check',results,mutants,retention:{planned:plan.tasks.reduce((n,t)=>n+t.cases.length,0),recorded:results.reduce((n,t)=>n+t.cases.length,0),excluded:0,mutants_planned:mutants.length,mutants_recorded:mutants.length}};
}
if(require.main===module){let result;try{result=run();}catch(e){result={format:'well-chronicle-coverage-v2',status:'error',code:e.code||'EXECUTION_ERROR',message:e.message};}process.stdout.write(JSON.stringify(result,null,2)+'\n');process.exitCode=result.status==='error'?2:result.status==='contrary'?1:0;}
module.exports={evaluate,run};
