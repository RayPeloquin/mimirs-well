const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{readText}=require('./scripts/test-text.cjs'),fs=require('node:fs');
test('Orrery preserves catalog identity and publishes only explicit eligible relations',()=>{
const c=JSON.parse(readText('catalog.json')),g=JSON.parse(readText('orrery.json')),h=readText('orrery.html');
assert.equal(g.catalog_sha256,crypto.createHash('sha256').update(readText('catalog.json')).digest('hex'));
assert.deepEqual(g.nodes.map(n=>n.id),c.map(n=>n.id));assert.equal(g.counts.records,c.length);
const ids=new Set(),pairs=new Set(),connected=new Set();
for(const e of g.edges){assert.ok(!ids.has(e.id));ids.add(e.id);const p=[e.a,e.b].sort().join(':');assert.ok(!pairs.has(p));pairs.add(p);assert.notEqual(e.a,e.b);for(const id of [e.a,e.b]){connected.add(id);assert.equal(c.find(r=>r.id===id).publication_hold,'none');assert.ok(readText('records/'+id+'.html').includes('orrery.html?focus='+id));}assert.ok(e.question&&e.basis&&e.limit&&e.credit&&g.types[e.type]);assert.ok(fs.existsSync(e.source.split('#')[0]));assert.ok(h.includes('id="relation-'+e.id+'"'));}
assert.equal(g.counts.connected,connected.size);assert.equal(g.counts.edges,g.edges.length);for(const n of g.nodes){assert.equal(n.relationships,g.edges.filter(e=>e.a===n.id||e.b===n.id).length);if(n.publication_hold!=='none')assert.equal(n.relationships,0);}
assert.ok(h.includes('Unmapped means not yet reviewed'));assert.ok(readText('index.html').includes('href="orrery.html"'));assert.ok(readText('sitemap.xml').includes('/orrery.html'));
});
