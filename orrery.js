(() => {
"use strict";
const $=id=>document.getElementById(id);
const form=$("orrery-controls"),focus=$("orrery-focus"),search=$("orrery-search"),type=$("orrery-type"),status=$("orrery-status"),record=$("orrery-record"),map=$("orrery-map"),svg=$("orrery-svg");
const options=Array.from(focus.options).map(o=>({id:o.value,title:o.textContent,status:o.dataset.status,recordStatus:o.dataset.recordStatus}));
const byId=new Map(options.map(o=>[o.id,o]));
const cards=Array.from(document.querySelectorAll(".orrery-edge"));
const ns="http://www.w3.org/2000/svg";
function make(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;}
function add(parent,tag,attrs,text){const el=make(tag,attrs,text);parent.append(el);return el;}
function short(s){return s.length>24?s.slice(0,23)+"...":s;}
function recLink(id){const a=document.createElement("a");a.href="records/"+id+".html";a.textContent=byId.get(id).title;return a;}
function select(id){search.value="";rebuild();focus.value=id;render();}
function rebuild(){
const old=focus.value, q=search.value.trim().toLowerCase();
focus.replaceChildren();
for(const o of options.filter(o=>!o.id||o.id===old||(o.title+" "+o.id).toLowerCase().includes(q))){const el=new Option(o.title,o.id);focus.add(el);}
focus.value=old;
}
function render(){
 const id=focus.value,t=type.value;
 const visible=cards.filter(c=>(!id||c.dataset.a===id||c.dataset.b===id)&&(!t||c.dataset.type===t));
 const all=cards.filter(c=>c.dataset.a===id||c.dataset.b===id);
 for(const c of cards){c.hidden=!visible.includes(c);const n=c.querySelector(".orrery-neighbors");n.replaceChildren();n.hidden=!id||c.hidden;if(!n.hidden){const other=c.dataset.a===id?c.dataset.b:c.dataset.a;const b=document.createElement("button");b.type="button";b.textContent="Center "+byId.get(other).title;b.addEventListener("click",()=>select(other));n.append(b);}}
 status.textContent=id?(all.length?visible.length+" of "+all.length+" direct curated relationships.":byId.get(id).status!=="none"?"Publication hold or watch: no indexed relationships.":"No curated relationships yet. This is an unmapped record, not evidence of isolation."):(visible.length+" curated relationships. Choose a design to see its local map.");
 record.replaceChildren();record.hidden=!id;
 if(id){record.append("Selected: ",recLink(id)," | "+(byId.get(id).recordStatus==="pending_review"?"Source review pending":"Expanded record"));}
 svg.replaceChildren();map.hidden=!id||!visible.length;
 if(!map.hidden){
  const neighbors=visible.map(c=>c.dataset.a===id?c.dataset.b:c.dataset.a);
  const h=Math.max(280,neighbors.length*66+38);svg.setAttribute("viewBox","0 0 340 "+h);svg.setAttribute("aria-label",byId.get(id).title+"; direct links to "+neighbors.map(n=>byId.get(n).title).join(", "));
  const cy=h/2;
  for(const [i,n] of neighbors.entries()){const y=(i+1)*h/(neighbors.length+1);add(svg,"path",{d:"M 138 "+cy+" C 170 "+cy+", 167 "+y+", 195 "+y,stroke:"#87b4c9","stroke-width":2,fill:"none"});add(svg,"rect",{x:195,y:y-22,width:140,height:44,rx:7,fill:"#182e3b",stroke:"#87b4c9"});add(svg,"text",{x:265,y:y+4,"text-anchor":"middle",fill:"#edf4ef","font-size":10},short(byId.get(n).title));}
  add(svg,"rect",{x:5,y:cy-27,width:133,height:54,rx:8,fill:"#203b33",stroke:"#b5f5cf","stroke-width":2});add(svg,"text",{x:71.5,y:cy-5,"text-anchor":"middle",fill:"#b5f5cf","font-size":10},"Selected design");add(svg,"text",{x:71.5,y:cy+12,"text-anchor":"middle",fill:"#edf4ef","font-size":10},short(byId.get(id).title));
 }
 const url=new URL(location.href);if(id)url.searchParams.set("focus",id);else url.searchParams.delete("focus");if(t)url.searchParams.set("type",t);else url.searchParams.delete("type");history.replaceState(null,"",url);
}
form.hidden=status.hidden=false;
const q=new URLSearchParams(location.search);if(byId.has(q.get("focus")))focus.value=q.get("focus");if(Array.from(type.options).some(o=>o.value===q.get("type")))type.value=q.get("type");
search.addEventListener("input",rebuild);focus.addEventListener("change",render);type.addEventListener("change",render);
form.addEventListener("submit",e=>e.preventDefault());form.addEventListener("reset",e=>{e.preventDefault();search.value="";focus.value="";type.value="";rebuild();render();});
render();
})();
