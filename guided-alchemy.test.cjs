const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const controls=require('./publication-controls.js');
const {readText}=require('./scripts/test-text.cjs');
test('guided recipes are unique, source-traced, and exclude all holds and watches',()=>{
 const ctx={window:{}};vm.runInNewContext(readText('guided-alchemy.js'),ctx);
 const recipes=ctx.window.WellGuidedRecipes;
 assert.ok(recipes.length>=6);
 const ids=new Set(),pairs=new Set();
 for(const r of recipes){
   assert.ok(!ids.has(r.id));ids.add(r.id);
   assert.notEqual(r.a,r.b);const pair=[r.a,r.b].sort().join('|');assert.ok(!pairs.has(pair));pairs.add(pair);
   for(const id of [r.a,r.b]){assert.ok(controls.equationEligible.includes(id));assert.ok(!Object.hasOwn(controls.holds,id));assert.ok(!Object.hasOwn(controls.watches,id));}
   for(const key of ['title','theme','credit','why','model','test','limit'])assert.ok(typeof r[key]==='string'&&r[key].trim());
   if(r.ref)assert.ok(fs.existsSync(r.ref));
 }
});
