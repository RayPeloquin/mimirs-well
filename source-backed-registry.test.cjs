'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,registry=fs.readFileSync(path.join(root,'registry.js'),'utf8'),catalog=fs.readFileSync(path.join(root,'catalog.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ids=["ac-cognition-engine","vowed-self-continuity-engine","micro-hippo-fabric","hippo-stack","governed-energy-transit-system","the-dock-guardian","oilskin-sentinel","soul-forge-hand-mapping","hippo-thruster-array","fsams-skin-eva-concept"];
test('all ten expanded source records have an existing public digest',()=>{
 for(const id of ids){assert.ok(registry.includes("if(records.has('"+id+"'))Object.assign"),id);const p=path.join(root,'public-notes',id+'.md');assert.ok(fs.existsSync(p),p);assert.match(fs.readFileSync(p,'utf8'),/no demonstrated implementation or independent validation/i)}
});
test('no duplicate Temporal Reflection Chamber title in catalog and one featured card retained',()=>{
 assert.ok(!catalog.includes('Veil Gate — Exotic lattice\\nTemporal Reflection Chamber\\nChronovisor'));
 assert.match(html,/<h3>Temporal Reflection Chamber<\/h3>/);
});
test('readable project count and evidence review summary are current',()=>{
 assert.match(html,/357 distinct project cards, including 172 expanded records and 185 records pending/);
 const count=(registry.match(/if\(records\.has\('[^']+'\)\)Object\.assign\(records\.get\('[^']+'\),/g)||[]).length;
 assert.equal(count,172);
});
