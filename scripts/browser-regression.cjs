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
