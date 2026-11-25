const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const w=require('./dimensional-witness.js');
const {readText}=require('./scripts/test-text.cjs');
const controls=require('./publication-controls.js');
const context={window:{}};vm.runInNewContext(readText('equation-cores.js'),context);
const cores=context.window.WellEquationCores;
test('Dimensional Witness covers every eligible symbol without inferring unspecified units',()=>{
  assert.deepEqual(Object.keys(w.metadata).sort(),[...controls.equationEligible].sort());
  const json=JSON.parse(readText('equation-sources.json'));
  for(const id of controls.equationEligible){
    assert.deepEqual(Object.keys(w.metadata[id]).sort(),Array.from(cores[id].symbols,s=>s.name).sort());
    assert.equal(json[id].witness_version,w.version);
    for(const s of json[id].symbols){
      const m=w.get(id,s.name);assert.deepEqual(s.witness,m);
      assert.ok(m.kind);assert.ok(m.dimensions===null||(m.dimensions.length===4&&m.dimensions.every(Number.isInteger)));
    }
  }
  assert.equal(w.get('echo-rx','t').unit,null);
  assert.equal(w.get('zion-twin-ring-tuna-habitat','C_initial').dimensions,null);
  assert.match(readText('dimensional-witness.html'),/Completed teaching receipt/);
  assert.match(readText('equation-bench.html'),/dimensional-witness\.js/);
});
test('Witness rejects known incompatibility but never certifies an equivalence',()=>{
  const get=w.get;const compare=w.compare;
  const f=get('skeptic-1','f_i'), rate=get('confluence-01-synthetic-sense','R_false');
  const lam=get('skeptic-1','lambda_i'),time=get('confluence-01-synthetic-sense','T_valid_hours');
  assert.equal(compare(lam,time).code,'dimension-mismatch');assert.equal(compare(lam,time).blocked,true);
  assert.equal(compare(f,rate).code,'unit-review');assert.equal(compare(f,rate).blocked,false);
  assert.equal(compare(get('the-traveler-solar-electric-research-airship','lap'),get('ghostglass','p')).code,'type-mismatch');
  assert.equal(compare(get('ghostglass','p'),get('crucible','p_observed')).code,'meaning-review');
  assert.equal(compare(get('echo-rx','t'),time).code,'unit-unknown');
  assert.equal(compare(get('zion-twin-ring-tuna-habitat','C_initial'),time).code,'unknown');
  assert.equal(compare(null,time).code,'unknown');
  assert.equal(compare(get('zion-twin-ring-tuna-habitat','F_dye_percent'),get('spincell-dle','R_Li')).code,'unit-review');
  const all=Object.values(w.metadata).flatMap(Object.values);
  for(const a of all)for(const b of all){const r=compare(a,b);assert.equal(r.code,compare(b,a).code);assert.equal(r.blocked,compare(b,a).blocked);assert.ok(r.text);}
});

test('reviewed transcription pins bind exact definitions and distinguish colliding names',()=>{const crypto=require('node:crypto');for(const [id,q] of Object.entries(cores))assert.equal(w.sourcePins[id],crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'));assert.notEqual(w.sourcePins['ghostglass'],crypto.createHash('sha256').update(JSON.stringify({...cores.ghostglass,statement:'changed'})).digest('hex'));assert.equal(w.compare(w.get('ghostglass','r'),w.get('the-traveler-solar-electric-research-airship','r')).blocked,true);});
