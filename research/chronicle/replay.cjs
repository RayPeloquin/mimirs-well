'use strict';
// Deterministic synthetic fixture replay; no network, hardware, or external dependencies.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const plan=JSON.parse(read('research/chronicle/frozen-plan.json'));
assert.equal(sha(read('test-queue.json')),plan.queue_sha256,'Queue revision changed');
assert.equal(sha(read('research/chronicle/replay.cjs')),plan.runner_sha256,'Runner changed');
const queue=JSON.parse(read('test-queue.json'));
const ratio=(n,d)=>d===0?null:n/d;
function calculate(id,c){
  switch(id){
    case 'test-material-balance': {
      const keys=['product','outlet','inventory'],missing=keys.filter(k=>c[k]===null);
      const apparentResidual=c.input-keys.reduce((sum,k)=>sum+(c[k]===null?0:c[k]),0);
      return {id:c.id,apparentResidual,missing,closed:missing.length===0&&apparentResidual===0,productRatio:ratio(c.product,c.input)};
    }
    case 'test-failure-counts': return {id:c.id,failureFraction:ratio(c.failed,c.runs),eventRate:ratio(c.events,c.hours)};
    case 'test-energy-ceiling': {
      if(c.kind==='ledger'){const sum=c.outputs.reduce((a,b)=>a+b,0);return {id:c.id,sum,residual:c.input-sum,closed:sum===c.input};}
      if(c.kind==='thermal'){const ceiling=1-c.cold/c.hot,workFraction=c.work/c.heat;return {id:c.id,ceiling,workFraction,permittedByBound:workFraction<=ceiling};}
      throw Error('Unknown fixture kind');
    }
    default:throw Error('Unknown test');
  }
}
const results=plan.tasks.map(t=>{
  const task=queue.tasks.find(q=>q.id===t.id);assert.ok(task);assert.equal(sha(JSON.stringify(task)),t.task_sha256);
  const actual=t.cases.map(c=>calculate(t.id,c));
  const cases=actual.map((a,i)=>{let matches=true;try{assert.deepStrictEqual(a,t.expected[i]);}catch{matches=false;}return {id:a.id,expected:t.expected[i],actual:a,matches};});
  return {id:t.id,outcome:cases.every(c=>c.matches)?'supports-limited-check':'contrary',cases};
});
const result={format:'well-chronicle-synthetic-replay',version:1,plan_sha256:sha(read('research/chronicle/frozen-plan.json')),results};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
if(results.some(r=>r.outcome==='contrary'))process.exitCode=1;
