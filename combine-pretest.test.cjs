"use strict";
const { readText } = require('./scripts/test-text.cjs');
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const html=readText(path.join(__dirname,"combine.html"));
const js=readText(path.join(__dirname,"combine.js"));
const css=readText(path.join(__dirname,"combine.css"));
function block(start,end) {
  const a=js.indexOf(start);
  const b=js.indexOf(end,a);
  assert.ok(a>=0&&b>a,"expected source function boundaries");
  return js.slice(a,b).trim();
}
const activeRolesFn=block("function activeRoles() {","\nfunction eligible() {");
const availabilityFn=block("function updateExportAvailability() {","\nfunction exportedUrl(path) {");
const exportFn=block("function briefMarkdown() {","\ncopy.addEventListener(");
const fields=["baseline","criterion","support","against","measurement"];
function runAvailability(overrides={}) {
  const catalog=new Map(["skeptic-1","temporal-acoustics","ghostglass"].map(id=>[id,{id}]));
  const elements=Object.fromEntries(fields.map(name=>[name,{value:"Defined "+name+" with units and a fixed threshold"}]));
  if(overrides.blank)elements[overrides.blank].value=" ";
  const checkbox={checked:overrides.checked ?? true};
  const ctx={
    roles:overrides.physical?["from"]:["from","to"],
    pair:{from:overrides.from??"skeptic-1",to:overrides.to??"temporal-acoustics",third:overrides.third},
    catalog,
    document:{querySelector:()=>null},
    form:{elements},
    requiredPretestFields:fields,
    pretestDeclaration:checkbox,
    isReleaseHeld:id=>id===overrides.held,
    physical:Boolean(overrides.physical),
    copy:{disabled:true},
    download:{disabled:true},
    exportStatus:{textContent:""},
  };
  vm.runInNewContext(activeRolesFn+"\n"+availabilityFn+"\nupdateExportAvailability();",ctx);
  return ctx;
}
test("both Bench modes expose distinct support, contrary and measurement fields",()=>{
  for(const name of ["support","against","measurement"])
    assert.match(html,new RegExp('textarea name="'+name+'"'));
  assert.match(html,/name="pretestDeclaration"/);
  assert.match(html,/fieldset class="full pretest-record"/);
  assert.match(css,/\.pretest-fields/);
  assert.match(js,/const draftFields = \["title", \.\.\.Object\.keys\(fieldLabels\)\]/);
});
test("requires all pre-test observations, threshold, baseline and declaration",()=>{
  assert.equal(runAvailability({checked:false}).download.disabled,true);
  for(const blank of fields)assert.equal(runAvailability({blank}).download.disabled,true,blank);
  assert.equal(runAvailability().download.disabled,false);
  assert.equal(runAvailability().copy.disabled,false);
});
test("held source and absent receiving design cannot export",()=>{
  assert.equal(runAvailability({held:"skeptic-1"}).copy.disabled,true);
  assert.equal(runAvailability({to:""}).copy.disabled,true);
  assert.equal(runAvailability({physical:true,to:""}).copy.disabled,false);
  assert.equal(runAvailability({to:"missing"}).copy.disabled,true);
  assert.equal(runAvailability({third:"temporal-acoustics"}).copy.disabled,true);
  assert.equal(runAvailability({third:"ghostglass",held:"ghostglass"}).copy.disabled,true);
  assert.equal(runAvailability({third:"ghostglass"}).copy.disabled,false);
});
test("exports contain independent predictions and a non-certified timestamp disclaimer",()=>{
  const elements={
    title:{value:"Acoustic test"},
    mechanism:{value:"Borrow a reversible probe"},
    change:{value:"Move the probe"},
    baseline:{value:"Symmetric control"},
    criterion:{value:"Threshold with defined uncertainty"},
    support:{value:"Signal clears threshold"},
    against:{value:"Control shows identical effect"},
    measurement:{value:"Repeated readings in Hz"},
    materials:{value:"Benign simulation"},
  };
  const labelMap={mechanism:"Claim",change:"Change",baseline:"Baseline",criterion:"Decision",support:"Supporting observation",against:"Contrary observation",measurement:"Measurement",materials:"Reproduction"};
  const ctx={form:{elements},physical:false,roles:["from","to"],pair:{from:"skeptic-1",to:"temporal-acoustics"},
    catalog:new Map([["skeptic-1",{id:"skeptic-1",title:"SKEPTIC-1",url:"a",status:"Proposed"}],["temporal-acoustics",{id:"temporal-acoustics",title:"Temporal Acoustics",url:"b",status:"Proposed"}]]),
    contributions:{},fieldLabels:labelMap,markdownLink:(label,url)=>label+" "+url};
  const output=vm.runInNewContext(activeRolesFn+"\n"+exportFn+"\nbriefMarkdown();",ctx);
  for(const phrase of ["Supporting observation","Signal clears threshold","Contrary observation","Control shows identical effect","Measurement","Repeated readings in Hz","browser clock; not independently certified","no experiment result claimed"])assert.ok(output.includes(phrase),phrase);
});
test("editing conditions resets declaration and public export remains release-held",()=>{
  assert.match(js,/event\.target !== pretestDeclaration\) pretestDeclaration\.checked = false/);
  assert.match(js,/if \(isReleaseHeld\(id\)\)/);
  assert.match(js,/roles\.some\(role => isReleaseHeld\(pair\[role\]\)\)/);
});
