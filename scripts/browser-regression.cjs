const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.WELL_PLAYWRIGHT || 'playwright');
const root = path.resolve(__dirname, '..');
(async () => {
  const server = http.createServer((req,res) => {
    const url = new URL(req.url,'http://localhost');
    const file = path.resolve(root,'.'+(url.pathname==='/'?'/index.html':url.pathname));
    if (!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
    const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
    res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
    fs.createReadStream(file).on('error',()=>{res.statusCode=404;res.end();}).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch(process.env.WELL_BROWSER_CHANNEL?{channel:process.env.WELL_BROWSER_CHANNEL}:{});
    const context=await browser.newContext({acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
    const page=await context.newPage(); const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/equation-bench.html');
    await page.locator('#pick-a').waitFor();
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    assert.match(await page.locator('#draft-note').innerText(),/each source pair/i);
    await page.selectOption('#pick-a','echo-rx');
    await page.selectOption('#pick-b','ghostglass');
    assert.match(await page.locator('#draft-note').innerText(),/local draft/i);
    assert.ok(await page.locator('#mapping-rows tr[data-symbol]').count()>0);
    assert.ok(await page.locator('#download-equation').isDisabled());
    for(const row of await page.locator('#mapping-rows tr[data-symbol]').all()){
      await row.locator('.target').selectOption('__none');
      await row.locator('.decision').selectOption('different');
    }
    await page.locator('#ack-b').check();
    await page.locator('#scaffold').click();
    for(const id of ['inherited','joint','strained']) await page.locator('#'+id).fill('Browser test only; no validated scientific claim.');
    assert.ok(await page.locator('#download-equation').isDisabled(),'Scaffold must not export');
    await page.locator('#composition').fill('Audit placeholder: A and B remain distinct; no physical coupling asserted.');
    assert.ok(await page.locator('#download-equation').isEnabled());
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#download-equation').click()]);
    assert.equal(await download.failure(),null);
    assert.match(download.suggestedFilename(),/echo-rx-x-ghostglass/);
    await page.locator('#copy-equation').click();
    assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Candidate mathematics/i);
    await page.reload();
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    assert.match(await page.locator('#composition').inputValue(),/Audit placeholder/);
    assert.ok(await page.locator('#download-equation').isEnabled());
    assert.deepEqual(errors,[]);
    console.log('PASS Equation Bench: initialize, select, map, gate, export, clipboard, reload');
    // Witness: existing manual draft remains gated when an incompatible mapping is attempted.
    await page.goto(base+'/equation-bench.html?a=skeptic-1&b=confluence-01-synthetic-sense');
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    for(const row of await page.locator('#mapping-rows tr[data-symbol]').all()){
      await row.locator('.target').selectOption('__none');await row.locator('.decision').selectOption('different');
    }
    for(const id of ['inherited','joint','strained'])await page.locator('#'+id).fill('Witness fixture; no physical equivalence established.');
    await page.locator('#composition').fill('Test only: keep independent quantities separate.');
    const lambda=page.locator('tr[data-symbol="lambda_i"]');
    await lambda.locator('.target').selectOption('T_valid_hours');await lambda.locator('.decision').selectOption('same');
    await page.locator('#ack-b').check();
    assert.match(await page.locator('#mapping-status').innerText(),/Incompatible physical dimensions/);
    assert.ok(await page.locator('#download-equation').isDisabled());
    await lambda.locator('.decision').selectOption('different');
    const freq=page.locator('tr[data-symbol="f_i"]');
    await freq.locator('.target').selectOption('R_false');await freq.locator('.decision').selectOption('same');
    assert.match(await freq.locator('.witness-detail').innerText(),/unit\/scale or representation differs/);
    await page.locator('#ack-b').check();
    assert.ok(await page.locator('#download-equation').isDisabled());
    await freq.locator('.risk').fill('Synthetic UI fixture only; review the distinct count definition and h versus s scale. No actual equivalence inferred.');
    await freq.locator('.witness-review').check();await page.locator('#ack-b').check();
    assert.ok(await page.locator('#download-equation').isEnabled());
    await page.locator('#copy-equation').click();
    const witnessExport=await page.evaluate(()=>navigator.clipboard.readText());
    assert.match(witnessExport,/Dimensional Witness metadata version/);
    assert.match(witnessExport,/unit-review/);
    assert.match(witnessExport,/Acknowledged by user/);
    await page.reload();await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    assert.ok(await freq.locator('.witness-review').isChecked());
    assert.ok(await page.locator('#download-equation').isEnabled());
    await freq.locator('.risk').fill('Changed context; previous acknowledgement no longer applies.');
    assert.ok(!(await freq.locator('.witness-review').isChecked()));
    assert.ok(await page.locator('#download-equation').isDisabled());
    await freq.locator('.decision').selectOption('different');
    await page.locator('#ack-b').check();
    assert.ok(await page.locator('#download-equation').isEnabled());
    assert.deepEqual(errors,[]);
    console.log('PASS Dimensional Witness: mismatch refusal, unit review, acknowledgment, receipt, reload and revocation');
    await page.evaluate(()=>{const k='mimirs-well-equation-bench-v1:skeptic-1::confluence-01-synthetic-sense';const draft=JSON.parse(localStorage.getItem(k));draft.sourcePinA='old-source';localStorage.setItem(k,JSON.stringify(draft));});
    await page.reload();await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    assert.match(await page.locator('#draft-note').innerText(),/Re-review/);
    assert.match(await page.locator('#composition').inputValue(),/keep independent quantities separate/);
    assert.ok(!(await page.locator('#ack-b').isChecked()));assert.ok(await page.locator('#download-equation').isDisabled());
    await page.goto(base+'/equation-bench.html?a=echo-rx&b=spincell-dle');
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    for(const row of await page.locator('#mapping-rows tr[data-symbol]').all()){await row.locator('.target').selectOption('__none');await row.locator('.decision').selectOption('different');}
    for(const symbol of ['A_T','A_D']){const row=page.locator('tr[data-symbol="'+symbol+'"]');await row.locator('.target').selectOption('m_Li_in');await row.locator('.decision').selectOption('same');await row.locator('.risk').fill('Synthetic contradictory mapping fixture only.');await row.locator('.witness-review').check();}
    await page.locator('#ack-b').check();assert.match(await page.locator('#mapping-status').innerText(),/Two different A symbols/);assert.ok(await page.locator('#download-equation').isDisabled());
    const stalePage=await context.newPage();await stalePage.route('**/equation-cores.js*',async route=>{const response=await route.fetch();const body=await response.text();await route.fulfill({response,body:body+'\nwindow.WellEquationCores.ghostglass.statement += " changed";'});});
    await stalePage.goto(base+'/equation-bench.html');await stalePage.waitForFunction(()=>document.querySelector('#catalog-status').textContent.includes('Reviewed transcription changed'));
    assert.ok(await stalePage.locator('#pick-a').isDisabled());await stalePage.close();
    console.log('PASS stale draft revocation, duplicate-target refusal and altered-transcription startup refusal');



    await page.goto(base+'/equation-bench.html');
    await page.waitForFunction(()=>!document.querySelector('#guided-controls').hidden);
    await page.locator('[data-guide="optical-evidence"]').click();
    assert.match(await page.locator('#guided-name').innerText(),/independent checks/);
    assert.equal(await page.locator('#pick-a').inputValue(),'');
    await page.locator('#guided-load').click();
    assert.equal(await page.locator('#pick-a').inputValue(),'ghostglass');
    assert.equal(await page.locator('#pick-b').inputValue(),'chihuahua-sphere-cs-1');
    assert.ok((await page.locator('#mapping-rows .target').evaluateAll(xs=>xs.map(x=>x.value))).every(x=>x==='__none'));
    assert.ok(!(await page.locator('#ack-b').isChecked()));
    assert.ok(await page.locator('#download-equation').isDisabled());
    await page.locator('#ack-b').check();
    assert.ok(await page.locator('#download-equation').isDisabled());
    await page.locator('#guided-adopt').check();
    assert.ok(await page.locator('#download-equation').isEnabled());
    await page.locator('#copy-equation').click();
    assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Guided Alchemy draft origin/);
    await page.reload();
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    assert.ok(await page.locator('#guided-adopt').isChecked());
    await page.locator('#joint').fill('Edited hypothesis; still untested.');
    assert.ok(await page.locator('#download-equation').isDisabled());
    await page.locator('[data-guide="optical-evidence"]').click();
    assert.ok(await page.locator('#guided-load').isDisabled());
    assert.match(await page.locator('#joint').inputValue(),/Edited hypothesis/);
    await page.locator('#guided-replace').check();
    await page.locator('#guided-load').click();
    assert.ok(!(await page.locator('#guided-adopt').isChecked()));
    await page.locator('#guided-theme').selectOption('Account for resources');
    assert.equal(await page.locator('#guided-list button').count(),2);
    await page.locator('#guided-surprise').click();
    assert.ok(await page.locator('#guided-preview').isVisible());
    assert.deepEqual(errors,[]);
    console.log('PASS Guided Alchemy: preview, draft, explicit adoption, export, persistence, edit revocation and overwrite protection');
    await page.setViewportSize({width:390,height:844});
    await page.locator('#guided-theme').selectOption('all');
    for(const id of await page.locator('#guided-list button').evaluateAll(xs=>xs.map(x=>x.dataset.guide))){
      await page.locator('[data-guide="'+id+'"]').click();
      if(await page.locator('#guided-replace-wrap').isVisible())await page.locator('#guided-replace').check();
      await page.locator('#guided-load').click();
      assert.ok((await page.locator('#card-a pre').textContent()).length>0);
      assert.ok((await page.locator('#card-b pre').textContent()).length>0);
      assert.ok(await page.locator('#download-equation').isDisabled());
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    await page.setViewportSize({width:1280,height:720});
    console.log('PASS every guided recipe on mobile viewport; export initially gated');
    await page.goto(base+'/');
    await page.locator('#well-sound-toggle').click();
    await page.waitForFunction(()=>document.querySelector('#well-sound-toggle').getAttribute('aria-pressed')==='true');
    await page.locator('#well-sound-volume').fill('15');
    await page.locator('#well-sound-toggle').click();
    assert.equal(await page.locator('#well-sound-toggle').getAttribute('aria-pressed'),'false');
    console.log('PASS Audio start, volume, stop');
    await page.setViewportSize({width:390,height:844});
    for(const route of ['/','/catalog.html','/combine.html','/equation-bench.html','/ledger.html','/armory.html','/court-cases.html','/workbench.html','/zion-tuna.html']){
      await page.goto(base+route);
      await page.waitForTimeout(200);
      const w=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
      assert.ok(w.document<=w.viewport+1,route+' overflow '+JSON.stringify(w));
      console.log('PASS mobile '+route);
    }
    const staticContext=await browser.newContext({javaScriptEnabled:false});
    const staticPage=await staticContext.newPage();
    const external=[];
    staticPage.on('request',r=>{if(r.url().includes('hits.sh'))external.push(r.url())});
    await staticPage.goto(base+'/');
    assert.deepEqual(external,[]);
    const data=await (await staticPage.request.get(base+'/catalog.json')).json();
    const eqManifest=await (await staticPage.request.get(base+'/catalog-manifest.json')).json();
    await page.goto(base+'/equation-bench.html');
    await page.waitForFunction(()=>!document.querySelector('#pick-a').disabled);
    for(const id of eqManifest.equation_eligible){
      await page.locator('#pick-a').selectOption(id);
      assert.ok((await page.locator('#card-a pre').textContent()).length>0,id);
    }
    console.log('PASS all '+eqManifest.equation_eligible.length+' selectable equation sources');
    await page.goto(base+'/orrery.html?focus=echo-rx');
    assert.equal(await page.locator('#orrery-focus option').count(),365);
    assert.match(await page.locator('#orrery-status').innerText(),/3 of 3 direct curated relationships/);
    assert.ok(await page.locator('#orrery-svg').isVisible());
    assert.equal(await page.locator('.orrery-edge:visible').count(),3);
    await page.locator('#orrery-type').selectOption('documented-lineage');
    assert.equal(await page.locator('.orrery-edge:visible').count(),1);
    await page.getByRole('button',{name:'Center ECHO-M',exact:true}).click();
    assert.equal(await page.locator('#orrery-focus').inputValue(),'echo-m');
    assert.ok(page.url().includes('focus=echo-m'));
    await page.locator('#orrery-type').selectOption('');
    await page.locator('#orrery-focus').selectOption('hippo-dragon');
    assert.match(await page.locator('#orrery-status').innerText(),/Publication hold or watch/);
    assert.equal(await page.locator('.orrery-edge:visible').count(),0);
    await page.locator('#orrery-focus').selectOption('neuroshell-1');
    assert.match(await page.locator('#orrery-status').innerText(),/No curated relationships yet/);
    await page.locator('#orrery-search').fill('skeptic');
    assert.ok(await page.locator('#orrery-focus option').count()<10);
    await page.locator('#orrery-focus').selectOption('skeptic-1');
    assert.equal(await page.locator('.orrery-edge:visible').count(),2);
    await page.getByRole('button',{name:'Reset view',exact:true}).click();
    assert.equal(await page.locator('.orrery-edge:visible').count(),15);
    console.log('PASS Orrery: all records, direct links, type filter, recenter, hold exclusion, unmapped state and search');
    await page.goto(base+'/scriptorium-notebook.html');
    assert.ok(await page.locator('#locked').isVisible());
    assert.ok(await page.locator('#workspace').isHidden());
    const notebook=await context.newPage();const outgoing=[];const notebookErrors=[];
    notebook.on('request',r=>{if(/^https?:/i.test(r.url()))outgoing.push(r.url());});
    notebook.on('pageerror',e=>notebookErrors.push(e.message));
    await notebook.goto(require('node:url').pathToFileURL(path.join(root,'scriptorium-notebook.html')).href);
    assert.ok(await notebook.locator('#workspace').isVisible());
    await notebook.locator('#new').click();
    await notebook.locator('#title').fill('Synthetic notebook fixture');
    await notebook.locator('#thought').fill('PRIVATE-FIXTURE-DO-NOT-PROMOTE');
    await notebook.locator('#question').fill('Synthetic question');
    await notebook.locator('#state').selectOption('review');
    assert.equal(await notebook.locator('#publicTitle').inputValue(),'');
    assert.ok(await notebook.locator('#preview').isDisabled());
    const [privateDownload]=await Promise.all([notebook.waitForEvent('download'),notebook.locator('#save').click()]);
    const privateFile=await privateDownload.path();const privateData=JSON.parse(fs.readFileSync(privateFile,'utf8'));
    assert.equal(privateData.notes.length,1);assert.equal(privateData.notes[0].thought,'PRIVATE-FIXTURE-DO-NOT-PROMOTE');
    await notebook.locator('#publicTitle').fill('Synthetic review title');
    await notebook.locator('#publicSummary').fill('Public fixture summary only');
    await notebook.locator('#publicLimits').fill('No experimental evidence');
    await notebook.locator('#confirm').check();await notebook.locator('#preview').click();
    assert.ok(!(await notebook.locator('#packet').textContent()).includes('PRIVATE-FIXTURE-DO-NOT-PROMOTE'));
    const [packetDownload]=await Promise.all([notebook.waitForEvent('download'),notebook.locator('#exportPacket').click()]);
    const pkt=JSON.parse(fs.readFileSync(await packetDownload.path(),'utf8'));assert.equal(pkt.status,'requires-human-release-review');assert.ok(!JSON.stringify(pkt).includes('PRIVATE-FIXTURE-DO-NOT-PROMOTE'));
    await notebook.locator('#publicSummary').fill('Edited fixture');assert.ok(await notebook.locator('#exportPacket').isDisabled());
    await notebook.locator('#new').click();await notebook.locator('#title').fill('Another fixture');
    notebook.once('dialog',d=>d.accept());await notebook.locator('#import').setInputFiles(privateFile);
    await notebook.waitForFunction(()=>document.querySelector('#status').textContent.includes('Opened 1 private notes'));
    assert.equal(await notebook.locator('#thought').inputValue(),'PRIVATE-FIXTURE-DO-NOT-PROMOTE');
    await notebook.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":9}')});
    await notebook.waitForFunction(()=>document.querySelector('#status').textContent.includes('Archive not opened'));
    assert.equal(await notebook.locator('#thought').inputValue(),'PRIVATE-FIXTURE-DO-NOT-PROMOTE');
    for(const width of [320,390,768]){await notebook.setViewportSize({width,height:844});assert.ok(await notebook.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Notebook mobile overflow '+width);}
    assert.deepEqual(outgoing,[]);assert.deepEqual(notebookErrors,[]);await notebook.close();
    console.log('PASS Scriptorium: hosted lock, offline draft, archive export and reopen, invalid import, separate packet, revocation, zero HTTP requests and mobile widths');
    await page.goto(base+'/test-queue.html');
    assert.equal(await page.locator('.queue-card:visible').count(),6);
    await page.locator('#queue-priority').selectOption('1');assert.equal(await page.locator('.queue-card:visible').count(),3);
    await page.goto(base+'/test-worksheet.html');assert.ok(await page.locator('#locked').isVisible());assert.ok(await page.locator('#work').isHidden());
    const worksheet=await context.newPage();const worksheetRequests=[];const worksheetErrors=[];
    worksheet.on('request',r=>{if(/^https?:/i.test(r.url()))worksheetRequests.push(r.url());});worksheet.on('pageerror',e=>worksheetErrors.push(e.message));
    await worksheet.goto(require('node:url').pathToFileURL(path.join(root,'test-worksheet.html')).href);
    assert.equal(await worksheet.locator('#task option').count(),6);assert.ok(await worksheet.locator('#freeze').isDisabled());
    assert.ok(await worksheet.locator('#result').isHidden());
    for(const k of ['source','environment','inputs','criteria'])await worksheet.locator('#'+k).fill('SYNTHETIC BROWSER FIXTURE ONLY: '+k);
    await worksheet.locator('#ready').check();
    const [planDownload]=await Promise.all([worksheet.waitForEvent('download'),worksheet.locator('#freeze').click()]);
    const planFile=await planDownload.path();const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));assert.equal(plan.payload.format,'mimirs-well-frozen-test-plan');
    assert.equal(plan.digest,require('node:crypto').createHash('sha256').update(JSON.stringify(plan.payload)).digest('hex'));
    assert.ok(await worksheet.locator('#source').isDisabled());assert.ok(await worksheet.locator('#result').isHidden());
    await worksheet.locator('#saved').check();assert.ok(await worksheet.locator('#result').isVisible());
    await worksheet.locator('#outcome').selectOption('not-run');
    for(const k of ['observations','artifacts','deviations'])await worksheet.locator('#'+k).fill('No test executed: browser fixture '+k);
    await worksheet.locator('#honest').check();
    const [runDownload]=await Promise.all([worksheet.waitForEvent('download'),worksheet.locator('#export').click()]);
    const report=JSON.parse(fs.readFileSync(await runDownload.path(),'utf8'));assert.equal(report.outcome,'not-run');assert.equal(report.status,'reported-not-independently-verified');assert.equal(report.plan.digest,plan.digest);
    await worksheet.locator('#observations').fill('Changed');assert.ok(await worksheet.locator('#export').isDisabled());
    await worksheet.locator('#import').setInputFiles({name:'tampered.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...plan,payload:{...plan.payload,source:'changed'}}))});
    await worksheet.waitForFunction(()=>document.querySelector('#status').textContent.includes('Plan not opened'));
    worksheet.once('dialog',d=>d.accept());await worksheet.locator('#import').setInputFiles(planFile);
    await worksheet.waitForFunction(()=>document.querySelector('#status').textContent.includes('Plan digest and embedded task matched'));
    assert.ok(await worksheet.locator('#result').isHidden());
    for(const width of [320,390,768]){await worksheet.setViewportSize({width,height:844});assert.ok(await worksheet.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Worksheet overflow '+width);}
    assert.deepEqual(worksheetRequests,[]);assert.deepEqual(worksheetErrors,[]);await worksheet.close();
    console.log('PASS Crucible queue: filtering, offline freeze, hash validation, reported outcome, revocation, tamper rejection, reopen, no HTTP requests, mobile');
    await staticPage.goto(base+'/catalog.html');
    const actual=await staticPage.locator('#catalog-entries > li').evaluateAll(es=>es.map(e=>e.id));
    assert.deepEqual(actual,data.map(r=>r.id));
    for(const r of data){
      const row=staticPage.locator('#'+r.id);
      assert.equal(await row.count(),1);
      assert.ok(await row.locator('h2').isVisible());
      if(r.evidence) assert.ok(await row.locator('details').first().isVisible() && await row.locator('details').first().getAttribute('open')!==null);
    }
    for(const r of [data[0],data.find(r=>r.id==='skeptic-1'),data.find(r=>r.publication_hold==='precautionary_hold_summary_only'),data.find(r=>r.record_status==='pending_review')]){
      const response=await staticPage.goto(base+'/records/'+r.id+'.html');
      assert.equal(response.status(),200);
      assert.equal(await staticPage.locator('h1').textContent(),r.title);
      assert.ok((await staticPage.locator('main').textContent()).includes(r.publication_notice));
    }
    for(const [id,route,count] of [['dermis-bioreactor-cradle','dermis.html',2],['cortex-neural-bioreactor','cortex.html',1],['thoracis-bioperfusion','thoracis.html',1]]){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.match(await staticPage.locator('main').textContent(),/illustrative|hypothetical/i);
      const link=staticPage.locator('a[href$="/'+route+'"]');
      assert.equal(await link.count(),1);
      await staticPage.goto(base+'/'+route);
      await staticPage.setViewportSize({width:390,height:844});
      assert.match(await staticPage.locator('aside').textContent(),/CONCEPT ARTWORK ONLY/);
      assert.equal(await staticPage.locator('figure img').count(),count);
      for(const img of await staticPage.locator('figure img').all()){await img.scrollIntoViewIfNeeded();await staticPage.waitForFunction(src=>Array.from(document.images).some(i=>i.getAttribute('src')===src&&i.complete&&i.naturalWidth>0),await img.getAttribute('src'));}
      assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    console.log('PASS three illustrated biomedical concept pages, four images, no-JS links, mobile layout and caveats');
    for(const id of ['fsams-skin-eva-concept','eye-of-horus']){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.equal(await staticPage.locator('a[href$="/'+id+'.html"]').count(),1);
      await staticPage.goto(base+'/'+id+'.html');
      assert.match(await staticPage.locator('aside').textContent(),/CONCEPT ARTWORK ONLY/);
      const img=staticPage.locator('figure img');await img.scrollIntoViewIfNeeded();
      await staticPage.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));
      assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    for(const id of ['lunar-eva-life-support','nexus-bridge','amphibishell','aether-shroud','anubis-abyssal-gill']){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.match(await staticPage.locator('main').textContent(),/No demonstrated|No clinical procedure|No working breathing/);
      assert.equal(await staticPage.locator('main img').count(),0);
    }
    console.log('PASS seven recovered records, two public artworks, five summary-only records');
    for(const id of ["odin-s-ravens","enki-s-will-living-safety-stack","court-of-the-synthetic-multi-model-engineering-review","aegis-sentinel-mesh","sister-s-hope-hand-restoration-gloves","olympus-floor-model-engineering-project-and-portfolio-control","mount-olympus-cross-domain-design-and-adversarial-review","weaver-s-shuttle"]){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.ok(await staticPage.locator('a[href$="/'+id+'-art.html"]').count());
      await staticPage.goto(base+'/'+id+'-art.html');
      assert.match(await staticPage.locator('aside').textContent(),/CONCEPT ARTWORK ONLY/);
      await staticPage.locator('figure img').scrollIntoViewIfNeeded();
      await staticPage.waitForFunction(()=>Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0));
      assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    for(const id of ["gips-intramedullary-guidance-and-risk-control","dragon-s-bridle"]){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.equal(await staticPage.locator('main img').count(),0);
      assert.ok(!(await staticPage.locator('a[href$="/'+id+'-art.html"]').count()));
    }
    console.log('PASS ten recovered Court records, eight public images, two summary-only records');
    for(const [id,count] of [["crystal-damping-loop",1],["quantum-floor",2],["unidentified-transparent-fiber-composite-concept",1],["thoth-s-mind",1],["mosquito-reaper",1]]){
      await staticPage.goto(base+'/records/'+id+'.html');
      assert.ok(await staticPage.locator('a[href$="/'+id+'-artwork.html"]').count());
      await staticPage.goto(base+'/'+id+'-artwork.html');
      assert.match(await staticPage.locator('aside').textContent(),/CONCEPT ARTWORK ONLY/);
      assert.equal(await staticPage.locator('figure img').count(),count);
      for(const img of await staticPage.locator('figure img').all()){await img.scrollIntoViewIfNeeded();await staticPage.waitForFunction(src=>Array.from(document.images).some(i=>i.getAttribute('src')===src&&i.complete&&i.naturalWidth>0),await img.getAttribute('src'));}
      assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    }
    console.log('PASS five recovered artwork pages and six public images');
    await staticPage.goto(base+'/dimensional-witness.html');
    assert.match(await staticPage.locator('main').textContent(),/Completed teaching receipt/);
    assert.equal(await staticPage.locator('#witness-outcomes tbody tr').count(),3);
    assert.equal(await staticPage.locator('table:not(#witness-outcomes) tbody tr').count(),4);
    assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Witness mobile overflow');
    await staticPage.goto(base+'/orrery.html');
    assert.equal(await staticPage.locator('.orrery-edge:visible').count(),15);
    assert.ok(await staticPage.locator('#orrery-controls').isHidden());
    for(const width of [320,390,768]){await staticPage.setViewportSize({width,height:844});assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Orrery static mobile overflow at '+width);}
    await staticPage.setViewportSize({width:390,height:844});
    await staticPage.goto(base+'/test-queue.html');
    assert.equal(await staticPage.locator('.queue-card:visible').count(),6);
    assert.ok(await staticPage.locator('#queue-filter-label').isHidden());
    for(const width of [320,390,768]){await staticPage.setViewportSize({width,height:844});assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Queue overflow '+width);}
    await staticPage.setViewportSize({width:390,height:844});
    await staticPage.goto(base+'/chronicle.html');
    assert.equal(await staticPage.locator('#accounting-001 table tbody tr').count(),11);
    assert.match(await staticPage.locator('#archived-temporal-acoustics').textContent(),/Five of eight strong solid-inclusion/);
    assert.match(await staticPage.locator('main').textContent(),/No independent replication/);
    assert.ok(await staticPage.getByRole('link',{name:'Frozen queue snapshot'}).isVisible());
    for(const width of [320,390,768]){await staticPage.setViewportSize({width,height:844});assert.ok(await staticPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Chronicle overflow '+width);}
    await staticPage.setViewportSize({width:390,height:844});
    await staticPage.goto(base+'/trial-v-receipt.html');
    assert.match(await staticPage.locator('main').textContent(),/56 passed; 0 failed/);
    assert.match(await staticPage.locator('main').textContent(),/364 records; 0 validation errors/);
    assert.match(await staticPage.locator('main').textContent(),/Canonical records with related questions \(10\)/);
    for(const width of [320,390,768]){await staticPage.setViewportSize({width,height:844});const sizes=await staticPage.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));assert.ok(sizes.document<=sizes.viewport+1,'Trial V receipt overflow '+JSON.stringify(sizes));}
    await staticPage.setViewportSize({width:390,height:844});
    await staticPage.goto(base+'/catalog.html#skeptic-1');
    assert.ok(await staticPage.locator('#skeptic-1').isVisible());
    await staticPage.goto(base+'/equation-bench.html');
    assert.ok(await staticPage.getByRole('link',{name:'the static equation index'}).isVisible());
    await staticPage.goto(base+'/combine.html');
    assert.ok(await staticPage.getByRole('link',{name:'complete static catalog'}).isVisible());
    await staticContext.close();
    console.log('PASS JS-free catalog parity, stable records, Bench reading paths, no automatic counter request');
    assert.deepEqual(errors,[]);
  } finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(e=>{console.error(e);process.exitCode=1;});
