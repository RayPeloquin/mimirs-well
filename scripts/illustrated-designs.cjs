'use strict';

function createArtworkViews(entries,artwork){
 const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const byId=new Map(entries.map(e=>[e.id,e])),groups=new Map();
 for(const a of artwork){
  if(!byId.has(a.id)||!/^assets\/[a-z0-9_./-]+\.(?:webp|png|jpg|jpeg|svg|gif|avif)$/i.test(a.src)||a.src.includes("..")||!a.alt||!a.caption)throw Error("Invalid project artwork: "+a.id);
  if(a.source&&!/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(a.source))throw Error("Invalid artwork source: "+a.source);
  if(!groups.has(a.id))groups.set(a.id,[]);
  if(groups.get(a.id).some(x=>x.src===a.src))throw Error("Duplicate project artwork: "+a.src);
  groups.get(a.id).push(a);
 }
 const countFor=id=>groups.get(id)?.length||0,plural=n=>n===1?"image":"images";
 const catalogLink=id=>countFor(id)?`<p class="artwork-link"><a href="illustrated-designs.html#${esc(id)}">${countFor(id)} ${plural(countFor(id))} · View project images</a></p>`:"";
 const figure=a=>`<figure><a href="${esc(a.src)}"><img src="${esc(a.src)}" alt="${esc(a.alt)}" loading="lazy" decoding="async"></a><figcaption>${esc(a.caption)}${a.source?` <a href="${esc(a.source)}">Original context</a>.`:""}</figcaption></figure>`;
 const galleryPage=()=>{
  const cards=entries.filter(e=>countFor(e.id)).map(e=>{
   const images=groups.get(e.id),remaining=images.slice(1);
   return `<article id="${esc(e.id)}" class="artwork-project"><h2><a href="records/${esc(e.id)}.html">${esc(e.title)}</a></h2><p class="catalog-families">${images.length} ${plural(images.length)} · ${esc(e.status)}</p>${figure(images[0])}${remaining.length?`<details><summary>Show ${remaining.length} more ${plural(remaining.length)}</summary>${remaining.map(figure).join("")}</details>`:""}<p><a href="records/${esc(e.id)}.html">Open project record</a></p></article>`;
  }).join("\n");
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Illustrated designs | Mimir&#39;s Well</title><link rel="stylesheet" href="catalog-browser.css"></head><body><nav><a href="index.html">Mimir&#39;s Well</a> | <a href="catalog.html?artwork=with">Catalog: with images</a> | <a href="research-plates.html">Research plates</a></nav><main><h1>Illustrated designs</h1><p>${groups.size} catalog projects with ${artwork.length} indexed visual assets. Artwork is grouped by catalog record, not by visual similarity. Concept renderings are not photographs of validated equipment; numerical-study graphics retain their source context. A catalog record may still be awaiting source review.</p><p><a href="catalog.html?artwork=without">Projects without indexed images</a> · <a href="research-plates.html">Original research plates, including unassigned artwork</a> · <a href="traveler-messaging.html">Traveler messaging (separate software design)</a>.</p><div class="artwork-grid">\n${cards}\n</div></main></body></html>\n`;
 };
 return {countFor,catalogLink,galleryPage};
}

module.exports = { createArtworkViews };
