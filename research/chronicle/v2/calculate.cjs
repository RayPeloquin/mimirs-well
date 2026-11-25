'use strict';
function calculate(id,c){
 const ratio=(n,d)=>d===0?null:n/d;
 if(id==='test-material-balance'){
  const keys=['product','outlet','inventory'],missing=keys.filter(k=>c[k]===null);
  const apparentResidual=c.input-keys.reduce((s,k)=>s+(c[k]===null?0:c[k]),0);
  return {id:c.id,apparentResidual,missing,closed:missing.length===0&&apparentResidual===0,productRatio:ratio(c.product,c.input)};
 }
 if(id==='test-failure-counts')return {id:c.id,failureFraction:ratio(c.failed,c.runs),eventRate:ratio(c.events,c.hours)};
 if(id==='test-energy-ceiling'){
  if(c.kind==='ledger'){const sum=c.outputs.reduce((a,b)=>a+b,0);return {id:c.id,sum,residual:c.input-sum,closed:sum===c.input};}
  if(c.kind==='thermal'){const ceiling=1-c.cold/c.hot,workFraction=c.work/c.heat;return {id:c.id,ceiling,workFraction,permittedByBound:c.work*c.hot<=c.heat*(c.hot-c.cold)};}
  throw Object.assign(Error('Unknown fixture kind'),{code:'UNKNOWN_FIXTURE_KIND'});
 }
 throw Object.assign(Error('Unknown task'),{code:'UNKNOWN_TASK'});
}
module.exports=calculate;
