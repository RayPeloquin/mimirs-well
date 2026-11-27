'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const clean=x=>String(x??'').replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,300);
const limit=5;
function select(queue,now){
 const hour=Math.floor(now.getTime()/3600000);
 return ['assigned','exploratory'].map(k=>({lane:k,...queue[k][hour%queue[k].length]}));
}
async function discover(topic,now,fetcher=fetch){
 const url=new URL('https://api.crossref.org/works');
 url.searchParams.set('query.bibliographic',topic.query);
 url.searchParams.set('filter','from-pub-date:'+new Date(now.getTime()-90*86400000).toISOString().slice(0,10)+',until-pub-date:'+now.toISOString().slice(0,10));
 url.searchParams.set('rows',String(limit));
 url.searchParams.set('select','DOI,title,published,type');
 try{
 const response=await fetcher(url,{signal:AbortSignal.timeout(15000),redirect:'error',headers:{'User-Agent':'MimirsWell-Diogenes/0.1 (https://github.com/RayPeloquin/mimirs-well)'}});
 if(!response.ok)throw Error('HTTP '+response.status);
 const body=await response.json();
 if(!Array.isArray(body?.message?.items))throw Error('Unexpected metadata response');
 const seen=new Set(),candidates=[];
 for(const item of body.message.items.slice(0,limit)){
 const doi=String(item.DOI??'').toLowerCase();
 if(!/^10\.\d{4,9}\/[a-z0-9._;()/:+-]+$/i.test(doi)||doi.length>250||seen.has(doi))continue;
 seen.add(doi);
 candidates.push({doi,url:'https://doi.org/'+doi,title:clean(item.title?.[0]),published:item.published?.['date-parts']?.[0]?.filter(Number.isInteger)??[],type:clean(item.type),status:'unreviewed metadata candidate'});
 }
 return {...topic,status:'metadata retrieved',candidates};
 }catch(e){return {...topic,status:'unavailable',error:clean(e.message),candidates:[]};}
}
async function run({now=new Date(),fetcher=fetch,replay=()=>require('../chronicle/v2/run.cjs').run()}={}){
 const queueText=read('research/diogenes/queue.json'),queue=JSON.parse(queueText);
 const topics=select(queue,now),discovery=[];
 for(const t of topics)discovery.push(await discover(t,now,fetcher));
 let fixture;try{fixture=replay();}catch(e){fixture={status:'error',message:clean(e.message)};}
 const status=fixture.status!=='same-author-determinism-check'?'fixture attention':discovery.some(d=>d.status==='unavailable')?'partial':'completed';
 return {format:'diogenes-lantern-v0.1',observed_at:now.toISOString(),commit:process.env.GITHUB_SHA??null,queue_sha256:hash(queueText.replace(/\r\n/g,'\n')),status,scope:'Public metadata leads and frozen synthetic replay only; no full-text assessment, independent replication, autonomous publication, or AI inference.',discovery,fixture};
}
function summary(r){
 return ['# Diogenes’ Lantern — research cycle','', 'UTC: '+r.observed_at,'Status: '+r.status,'Frozen fixture: '+r.fixture.status,'','Metadata leads (not findings):',...r.discovery.map(d=>'- '+d.lane+' / '+d.id+': '+d.status+'; '+d.candidates.length+' candidates'),'','Review the JSON artifact for candidate DOI links, errors and frozen replay. No claims promoted.'].join('\n')+'\n';
}
if(require.main===module)(async()=>{const r=await run();const out=process.argv[2];if(!out)throw Error('Output directory required');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(r,null,2)+'\n');const s=summary(r);process.stdout.write(s);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,s);if(r.status!=='completed')process.exitCode=1;})().catch(e=>{console.error(e);process.exitCode=2;});
module.exports={select,discover,run,summary};
