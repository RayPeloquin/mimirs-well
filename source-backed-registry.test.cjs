'use strict';
const { readText } = require('./scripts/test-text.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,catalog=readText(path.join(root,'catalog.js')),html=readText(path.join(root,'index.html'));
const { reviews } = require('./registry.js');
const { currentTitles, expandedRecords } = require('./scripts/inventory.cjs');
const ids=["ac-cognition-engine","vowed-self-continuity-engine","micro-hippo-fabric","hippo-stack","governed-energy-transit-system","the-dock-guardian","oilskin-sentinel","soul-forge-hand-mapping","hippo-thruster-array","fsams-skin-eva-concept"];
test('all ten expanded source records have an existing public digest',()=>{
 for(const id of ids){assert.ok(reviews.has(id),id);const p=path.join(root,'public-notes',id+'.md');assert.ok(fs.existsSync(p),p);assert.match(readText(p),/no demonstrated implementation or independent validation/i)}
});
test('no duplicate Temporal Reflection Chamber title in catalog and one featured card retained',()=>{
 assert.ok(!catalog.includes('Veil Gate — Exotic lattice\\nTemporal Reflection Chamber\\nChronovisor'));
 assert.match(html,/<h3>Temporal Reflection Chamber<\/h3>/);
});
test('readable project count and evidence review summary are current',()=>{
 const total = currentTitles().length;
 const expanded = expandedRecords().length;
 assert.ok(html.includes(`${total} distinct project cards: ${expanded} expanded records and ${total - expanded} awaiting source review`));
});
