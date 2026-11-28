'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createArtworkViews}=require('./scripts/illustrated-designs.cjs');
const artwork=require('./well-gallery.js');
const catalog=require('./catalog.json');
const views=createArtworkViews(catalog,artwork);
test('artwork matches catalog IDs, actual asset paths and generated links',()=>{
 const ids=new Set(catalog.map(x=>x.id)),seen=new Set();
 for(const item of artwork){assert.ok(ids.has(item.id));assert.ok(fs.existsSync(path.join(__dirname,item.src)));assert.ok(!seen.has(item.src),'same asset assigned twice: '+item.src);seen.add(item.src);}
 assert.equal(fs.readFileSync(path.join(__dirname,'illustrated-designs.html'),'utf8'),views.galleryPage());
 const html=fs.readFileSync(path.join(__dirname,'catalog.html'),'utf8');
 for(const entry of catalog){const marker=html.match(new RegExp('<li id="'+entry.id+'"><div class="catalog-entry"[^>]*data-artwork="(\\d+)"'));assert.ok(marker);assert.equal(Number(marker[1]),views.countFor(entry.id));if(views.countFor(entry.id))assert.ok(html.includes(views.catalogLink(entry.id)));}
 assert.ok(views.countFor('lung-mapper')>0);assert.ok(views.countFor('direct-beta-energy-harvester-rtg-study')>0);
 assert.ok(!artwork.some(a=>a.src.includes('qubit-ankh')||a.src.includes('traveler-messaging')||a.src.includes('branching-tree-art')));
});
