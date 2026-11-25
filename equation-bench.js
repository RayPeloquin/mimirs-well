"use strict";

/* Equation Bench MVP — no algebra engine, no implied proof, no automatic variable merging. */
(() => {
  const cores = window.WellEquationCores || {};
  const controls = window.WellPublicationControls || {};
  const witness = window.WellDimensionalWitness;
  const releaseHolds = {...(controls.holds || {}), ...(controls.watches || {})};
  const approved = new Set(controls.equationEligible || []);
  const ids = Object.keys(cores).filter(id =>
    approved.has(id) && !Object.hasOwn(releaseHolds, id));
  const $ = id => document.getElementById(id);
  const aPick = $("pick-a"), bPick = $("pick-b");
  const aCard = $("card-a"), bCard = $("card-b");
  const mapBody = $("mapping-rows"), ackB = $("ack-b");
  const composition = $("composition");
  const honesty = ["inherited", "joint", "strained"].map($);
  const copy = $("copy-equation"), download = $("download-equation");
  const exportStatus = $("export-status");
  const catalog = new Map();
  const fileStamp = "Candidate mathematics — not derived truth. Requires its own evidence.";
  let ready = false;
  let pair = {a: "", b: ""};
  let manualComposition = false;
  let guidedOrigin = null;

  function element(tag, value) {
    const x = document.createElement(tag);
    if (value !== undefined) x.textContent = value;
    return x;
  }
  function primary(id) { return approved.has(id) && !Object.hasOwn(releaseHolds, id) ? cores[id] || null : null; }
  function entry(id) { return catalog.get(id) || null; }
  function selected() { return Boolean(primary(pair.a) && primary(pair.b) && pair.a !== pair.b); }
  function pairKey() { return "mimirs-well-equation-bench-v1:" + pair.a + "::" + pair.b; }
  function url(path) { return new URL(path, document.baseURI).href; }

  function storageRead() {
    try { return JSON.parse(localStorage.getItem(pairKey()) || "null"); }
    catch { return null; }
  }
  function storageWrite() {
    if (!selected()) return;
    const rows = Array.from(mapBody.querySelectorAll("tr[data-symbol]"), tr => ({
      a: tr.dataset.symbol,
      b: tr.querySelector(".target").value,
      decision: tr.querySelector(".decision").value,
      notes: tr.querySelector(".risk").value,
      witnessReviewed: tr.querySelector(".witness-review").checked
    }));
    const payload = {
      rows, witnessVersion: witness?.version || null, ack: ackB.checked, composition: composition.value,
      manualComposition, guidedOrigin, inherited: $("inherited").value,
      joint: $("joint").value, strained: $("strained").value
    };
    try {
      localStorage.setItem(pairKey(), JSON.stringify(payload));
      $("draft-note").textContent = "Local draft for this source pair saved in this browser.";
    } catch {
      $("draft-note").textContent = "Browser saving unavailable. Copy or download a finished candidate.";
    }
  }

  function sourceCard(role) {
    const target = role === "a" ? aCard : bCard;
    const id = pair[role];
    target.replaceChildren();
    if (!id) {
      target.append(element("p", "Choose a source to display its exact recorded relationship and evidence status."));
      return;
    }
    const core = primary(id), registry = entry(id);
    const heading = element("h4", registry?.title || id);
    const status = element("p", "Evidence: " + core.evidence);
    status.className = "equation-status";
    const code = element("pre", core.equation);
    const claim = element("p", core.statement);
    const caveat = element("p", "Limits: " + core.caveat);
    caveat.className = "caveat";
    const symbols = element("p", "Symbols: " + core.symbols.map(s => s.name).join(", "));
    symbols.className = "symbol-list";
    const links = element("p");
    links.className = "source-links";
    const original = element("a", "Inspect source equations ↗");
    original.href = core.source;
    original.rel = "noopener noreferrer";
    const record = element("a", "Open Well record ↗");
    record.href = url(registry.url);
    links.append(original, record);
    target.append(heading, status, code, claim, symbols, caveat, links);
  }

  function renderChoices() {
    aPick.replaceChildren(element("option", "Select a source…"));
    aPick.firstElementChild.value = "";
    bPick.replaceChildren(element("option", "Select a source…"));
    bPick.firstElementChild.value = "";
    const sorted = ids.slice().sort((x,y) => entry(x).title.localeCompare(entry(y).title));
    for (const id of sorted) {
      for (const select of [aPick, bPick]) {
        const option = element("option", entry(id).title);
        option.value = id;
        select.append(option);
      }
    }
    aPick.disabled = bPick.disabled = false;
  }

  function buildMapping(saved) {
    mapBody.replaceChildren();
    ackB.checked = Boolean(saved?.ack);
    ackB.disabled = !selected();
    if (!selected()) {
      const row = element("tr"), cell = element("td", "Choose two different source equations to start.");
      cell.colSpan = 4; row.append(cell); mapBody.append(row);
      $("unmapped-b").textContent = "Unmatched Design B variables will be listed here.";
      return;
    }

    const bSymbols = primary(pair.b).symbols;
    for (const item of primary(pair.a).symbols) {
      const stored = saved?.rows?.find(row => row.a === item.name);
      const tr = element("tr");
      tr.dataset.symbol = item.name;
      const first = element("td");
      const name = element("span", item.name); name.className = "symbol";
      const meaning = element("span", item.meaning); meaning.className = "symbol-meaning";
      const unit = element("span", witness?.describe(witness.get(pair.a,item.name)) || "Witness unavailable"); unit.className="witness-unit";
      first.append(name, meaning, unit);
      const second = element("td");
      const target = element("select"); target.className = "target";
      target.setAttribute("aria-label", "Possible counterpart in Design B for " + item.name);
      const unset = element("option", "Choose a counterpart…"); unset.value = ""; target.append(unset);
      const none = element("option", "No counterpart in B"); none.value = "__none"; target.append(none);
      for (const symbol of bSymbols) {
        const option = element("option", symbol.name + " — " + symbol.meaning);
        option.value = symbol.name; target.append(option);
      }
      target.value = stored?.b || "";
      const third = element("td");
      const decision = element("select"); decision.className = "decision";
      decision.setAttribute("aria-label", "Do " + item.name + " and its proposed B counterpart represent the same quantity?");
      const undecided = element("option", "Undecided"); undecided.value = "";
      const same = element("option", "Yes — same quantity"); same.value = "same";
      const different = element("option", "No — different"); different.value = "different";
      decision.append(undecided, same, different);
      decision.value = stored?.decision || "";
      const fourth = element("td");
      const witnessDetail=element("p"); witnessDetail.className="witness-detail"; witnessDetail.setAttribute("aria-live","polite");
      const reviewLabel=element("label"); reviewLabel.className="witness-ack"; reviewLabel.hidden=true;
      const review=element("input"); review.type="checkbox";review.className="witness-review";
      review.setAttribute("aria-label","Review dimensions, unit and meaning for "+item.name);
      review.checked=Boolean(saved?.witnessVersion===witness?.version && stored?.witnessReviewed);
      reviewLabel.append(review,element("span","I reviewed units, meaning and uncertainty for this equivalence."));
      const risk = element("input"); risk.className = "risk"; risk.type = "text";
      risk.placeholder = "Units, domain or mismatch?";
      risk.maxLength = 300;
      risk.setAttribute("aria-label", "Mapping risk or note for " + item.name);
      risk.value = stored?.notes || "";
      second.append(target); third.append(decision,witnessDetail); fourth.append(risk,reviewLabel);
      tr.append(first, second, third, fourth); mapBody.append(tr);
      target.addEventListener("change", onMappingChange);
      decision.addEventListener("change", onMappingChange);
      risk.addEventListener("input", onMappingChange);
      review.addEventListener("change", onMappingChange);
    }
    showUnmappedB();
  }

  function mappings() {
    return Array.from(mapBody.querySelectorAll("tr[data-symbol]"), tr => ({
      a: tr.dataset.symbol,
      b: tr.querySelector(".target").value,
      decision: tr.querySelector(".decision").value,
      notes: tr.querySelector(".risk").value.trim(),
      witnessReviewed: tr.querySelector(".witness-review").checked
    }));
  }
  function showUnmappedB() {
    if (!selected()) return;
    const aligned = new Set(mappings().filter(row => row.decision === "same" && row.b !== "__none").map(row => row.b));
    const missing = primary(pair.b).symbols.map(item => item.name).filter(name => !aligned.has(name));
    $("unmapped-b").textContent = missing.length ?
      "B symbols not explicitly identified with A: " + missing.join(", ") + ". They remain distinct or unmatched." :
      "All B symbols have explicit same-quantity mappings. Review the mappings and assumptions before confirming.";
  }

  function witnessResult(row) {
    if (!row.b || row.b === "__none") return {code:"separate",text:"No counterpart selected; no equivalence assessed.",blocked:false};
    if (!witness) return {code:"unavailable",text:"Witness unavailable. Reload before export.",blocked:true};
    return witness.compare(witness.get(pair.a,row.a),witness.get(pair.b,row.b));
  }
  function updateWitness() {
    if (!selected()) return;
    for(const tr of mapBody.querySelectorAll("tr[data-symbol]")) {
      const row={a:tr.dataset.symbol,b:tr.querySelector(".target").value,decision:tr.querySelector(".decision").value};
      const result=witnessResult(row),detail=tr.querySelector(".witness-detail"),review=tr.querySelector(".witness-review");
      const relevant=row.decision==="same"&&Boolean(row.b)&&row.b!=="__none"&&!result.blocked;
      const text=(row.b&&row.b!=="__none"&&witness?witness.describe(witness.get(pair.b,row.b))+". ":"")+result.text;
      if(detail.textContent!==text)detail.textContent=text;
      detail.dataset.blocked=String(result.blocked&&row.decision==="same");
      review.parentElement.hidden=!relevant;review.disabled=!relevant;if(!relevant)review.checked=false;
    }
  }
  function mappingProblems() {
    if (!selected()) return ["Choose two different reviewed source equations."];
    const map = mappings();
    if (!map.length || map.some(row => !row.b || !row.decision))
      return ["Decide yes/no and select a B symbol (or no counterpart) for every A symbol."];
    if (map.some(row => row.b === "__none" && row.decision === "same"))
      return ["'No counterpart' cannot also mean 'same quantity'."];
    if (!witness) return ["Dimensional Witness unavailable; reload before export."];
    for(const row of map.filter(r=>r.decision==="same")) {
      const result=witnessResult(row);
      if(result.blocked)return ["Dimensional Witness: "+row.a+" / "+row.b+": "+result.text];
      if(!row.notes||!row.witnessReviewed)return ["Dimensional Witness: document the unit, meaning and uncertainty review for "+row.a+" / "+row.b+" and acknowledge it."];
    }
    const same = map.filter(row => row.decision === "same").map(row => row.b);
    if (new Set(same).size !== same.length)
      return ["Two different A symbols cannot both be silently identified as the same B symbol. Revise the mapping."];
    if (!ackB.checked)
      return ["Review and acknowledge the B-only symbols."];
    return [];
  }

  function exportProblems() {
    const problems = mappingProblems();
    if (!composition.value.trim()) problems.push("Write a candidate combined expression or model.");
    if ((!manualComposition && !guidedOrigin?.adopted) || composition.value.includes("SUGGESTED ONLY") ||
      composition.value.includes("[your proposed coupling]")) {
      problems.push("Write your own relationship or explicitly adopt a reviewed guided draft; inserted formulas and scaffolds alone are not combinations.");
    }
    if (guidedOrigin && !guidedOrigin.adopted) problems.push("Review and explicitly adopt the guided draft before export.");
    for (const [i,field] of honesty.entries()) {
      if (!field.value.trim()) problems.push(["Inherited claims", "New joint claim", "Broken or strained assumptions"][i] + " is required.");
    }
    return problems;
  }
  function updateExport() {
    updateGuideReview();
    updateWitness();
    const problems = exportProblems();
    const valid = problems.length === 0;
    copy.disabled = download.disabled = !valid;
    $("scaffold").disabled = !selected();
    $("insert-a").disabled = !primary(pair.a);
    $("insert-b").disabled = !primary(pair.b);
    $("mapping-status").textContent = mappingProblems()[0] || "All mapped choices are explicit. Dimensional Witness reviewed symbol mappings only, not the proposed expression.";
    exportStatus.textContent = valid ?
      "Ready to export as candidate mathematics. Nothing on this page verifies validity." :
      problems[0];
    return valid;
  }

  function onMappingChange(event) {
    const tr=event?.currentTarget?.closest("tr[data-symbol]");
    if(tr&&!event.currentTarget.classList.contains("witness-review"))tr.querySelector(".witness-review").checked=false;
    invalidateGuideReview();
    ackB.checked = false;
    showUnmappedB();
    updateExport(); storageWrite();
  }
  function loadPair() {
    const saved = selected() ? storageRead() : null;
    manualComposition = Boolean(saved?.manualComposition);
    guidedOrigin = saved?.guidedOrigin || null;
    composition.value = saved?.composition || "";
    $("inherited").value = saved?.inherited || "";
    $("joint").value = saved?.joint || "";
    $("strained").value = saved?.strained || "";
    $("draft-note").textContent = selected() ? "Local draft for this pair; not published." : "Each source pair has its own local draft.";
    sourceCard("a"); sourceCard("b"); buildMapping(saved); updateExport();
    syncQuery();
  }
  function syncQuery() {
    const u = new URL(location.href);
    for (const role of ["a", "b"]) {
      if (pair[role]) u.searchParams.set(role, pair[role]);
      else u.searchParams.delete(role);
    }
    history.replaceState(null,"",u);
  }
  function changePair(role, id) {
    const other = role === "a" ? "b" : "a";
    pair[role] = id;
    if (id && id === pair[other]) {
      pair[other] = "";
      (other === "a" ? aPick : bPick).value = "";
    }
    loadPair();
  }
  function insertRelation(role) {
    const core = primary(pair[role]);
    if (!core) return;
    const header = (role === "a" ? "A" : "B") + " SOURCE RELATION (" + entry(pair[role]).title + "):\n";
    invalidateGuideReview();
    composition.value += (composition.value.trim() ? "\n\n" : "") + header + core.equation;
    composition.focus();
    updateExport(); storageWrite();
  }
  function suggestScaffold() {
    if (!selected()) return;
    invalidateGuideReview();
    composition.value =
      "SUGGESTED ONLY — NOT A DERIVATION. Replace all placeholders and this warning before export.\n\n" +
      "A: " + primary(pair.a).equation + "\n\n" +
      "B: " + primary(pair.b).equation + "\n\n" +
      "[your proposed coupling]\n[units and validity check not performed]";
    manualComposition = false;
    composition.focus();
    updateExport(); storageWrite();
  }
  function mdCell(value) { return String(value || "").replace(/\|/g,"\\|").replace(/\r?\n/g," "); }
  function markdown() {
    const a = primary(pair.a), b = primary(pair.b);
    const ar = entry(pair.a), br = entry(pair.b);
    const lines = [
      "# Candidate equation combination: " + ar.title + " × " + br.title,
      "",
      "**" + fileStamp + "**",
      "",
      ...(guidedOrigin ? ["## Guided Alchemy draft origin", "", guidedOrigin.title, guidedOrigin.credit, ...(guidedOrigin.ref ? [url(guidedOrigin.ref)] : []), "Explicitly adopted for research review; not validated.", ""] : []),
      "## Source A: " + ar.title,
      "",
      "Well record: [" + ar.title + "](" + url(ar.url) + ")",
      "Primary equation source: [" + a.sourceLabel + "](" + a.source + ")",
      "Evidence status: " + a.evidence,
      "Source relation (transcribed):",
      "",
      "~~~text", a.equation, "~~~",
      "",
      "Original claim: " + a.statement,
      "Source caveat: " + a.caveat,
      "",
      "## Source B: " + br.title,
      "",
      "Well record: [" + br.title + "](" + url(br.url) + ")",
      "Primary equation source: [" + b.sourceLabel + "](" + b.source + ")",
      "Evidence status: " + b.evidence,
      "Source relation (transcribed):",
      "",
      "~~~text", b.equation, "~~~",
      "",
      "Original claim: " + b.statement,
      "Source caveat: " + b.caveat,
      "",
      "## Explicit symbol mapping",
      "",
      "Dimensional Witness metadata version: " + witness.version + ". Dimensions are advisory except known incompatibilities block equivalence. No expression-level check.", "",
      "| Design A symbol | Design B symbol | Same quantity? | Notes / risk | Witness result and review |",
      "| --- | --- | --- | --- | --- |"
    ];
    for (const row of mappings()) {
      lines.push("| " + mdCell(row.a) + " | " + mdCell(row.b === "__none" ? "No counterpart" : row.b) +
        " | " + (row.decision === "same" ? "Yes" : "No") + " | " + mdCell(row.notes) + " | " + mdCell(witnessResult(row).code + ": " + witnessResult(row).text + " A: " + witness.describe(witness.get(pair.a,row.a)) + (row.b==="__none"?"":" B: "+witness.describe(witness.get(pair.b,row.b))) + "; equivalence review: " + (row.decision==="same"?(row.witnessReviewed?"Acknowledged by user":"Not acknowledged"):"Not claimed")) + " |");
    }
    const matched = new Set(mappings().filter(x => x.decision === "same").map(x => x.b));
    const unmatched = b.symbols.map(x => x.name).filter(name => !matched.has(name));
    lines.push("", "B symbols not explicitly treated as identical to A: " +
      (unmatched.join(", ") || "None") + ". Reviewed: Yes.", "",
      "## Proposed combined expression / model", "", "~~~text",
      composition.value.trim(), "~~~", "",
      "## Inherited claims", "", $("inherited").value.trim(), "",
      "## New joint claim", "", $("joint").value.trim(), "",
      "## Broken or strained assumptions", "", $("strained").value.trim(), "",
      "## Evidence boundary", "",
      "**" + fileStamp + "**",
      "Dimensional Witness checked annotated symbol mappings only; it did not check the proposed expression, convert units, prove physical equivalence, perform algebraic verification, simplification, physical measurement, or independent validation.",
      ""
    );
    return lines.join("\n");
  }
  async function copyMarkdown() {
    if (!updateExport()) return;
    const txt = markdown();
    try {
      await navigator.clipboard.writeText(txt);
      exportStatus.textContent = "Candidate Markdown copied.";
    } catch {
      $("copy-fallback").value = txt;
      $("copy-fallback-wrap").hidden = false;
      $("copy-fallback").focus();
      $("copy-fallback").select();
      exportStatus.textContent = "Clipboard unavailable. Markdown selected for manual copy.";
    }
  }
  function downloadMarkdown() {
    if (!updateExport()) return;
    const blob = new Blob([markdown()], {type: "text/markdown;charset=utf-8"});
    const objectURL = URL.createObjectURL(blob);
    const anchor = element("a");
    anchor.href = objectURL;
    anchor.download = pair.a + "-x-" + pair.b + "-candidate-mathematics.md";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(objectURL), 1000);
    exportStatus.textContent = "Candidate Markdown downloaded.";
  }


  // Curated guided drafts are optional, local, and never silently equate symbols.
  const recipeList = (window.WellGuidedRecipes || []).filter(r => primary(r.a) && primary(r.b) && r.a !== r.b);
  let previewRecipe = null;
  function guidedKey(r){return "mimirs-well-equation-bench-v1:"+r.a+"::"+r.b;}
  function existingGuidedDraft(r){if(pair.a===r.a&&pair.b===r.b&&(guidedOrigin||composition.value.trim()||honesty.some(x=>x.value.trim())||mappings().some(x=>x.b||x.decision||x.notes)))return true;try{return Boolean(localStorage.getItem(guidedKey(r)));}catch{return false;}}
  function filteredRecipes(){return recipeList.filter(r=>$("guided-theme").value==="all"||r.theme===$("guided-theme").value);}
  function renderGuides(){
    const list=$("guided-list");list.replaceChildren();
    for(const r of filteredRecipes()){
      const button=element("button",r.title);button.type="button";button.className="button secondary";
      button.dataset.guide=r.id;button.setAttribute("aria-pressed",String(previewRecipe?.id===r.id));
      button.addEventListener("click",()=>previewGuide(r));list.append(button);
    }
  }
  function previewGuide(r){
    previewRecipe=r;renderGuides();
    $("guided-name").textContent=r.title;
    $("guided-pair").textContent=entry(r.a).title+" + "+entry(r.b).title;
    for(const field of ["why","model","test","limit","credit"]) $("guided-"+field).textContent=r[field];
    const ref=$("guided-reference");ref.hidden=!r.ref;if(r.ref)ref.href=r.ref;else ref.removeAttribute("href");
    $("guided-replace").checked=false;$("guided-replace-wrap").hidden=!existingGuidedDraft(r);
    $("guided-load").disabled=existingGuidedDraft(r);
    $("guided-preview").hidden=false;
    $("guided-name").focus();
    $("guided-status").textContent="Preview only. No workspace changes made.";
  }
  function loadGuide(){
    const r=previewRecipe;if(!r||!primary(r.a)||!primary(r.b))return;
    if(existingGuidedDraft(r)&&!$("guided-replace").checked){$("guided-status").textContent="Confirm replacement of the existing saved draft first.";return;}
    pair={a:r.a,b:r.b};aPick.value=r.a;bPick.value=r.b;
    guidedOrigin={id:r.id,title:r.title,credit:r.credit,ref:r.ref||"",adopted:false};
    manualComposition=false;
    sourceCard("a");sourceCard("b");buildMapping(null);
    // Independent quantities by default, visibly proposed and subject to review.
    for(const row of mapBody.querySelectorAll("tr[data-symbol]")){
      row.querySelector(".target").value="__none";
      row.querySelector(".decision").value="different";
      row.querySelector(".risk").value="Guided proposal: keep source quantities separate; review before export.";
    }
    showUnmappedB();
    composition.value=r.model+"\n\nProposed falsification test: "+r.test;
    $("inherited").value="A: "+primary(r.a).statement+" Limits: "+primary(r.a).caveat+"\nB: "+primary(r.b).statement+" Limits: "+primary(r.b).caveat;
    $("joint").value=r.why+" This is an untested research hypothesis.";
    $("strained").value=r.limit;
    syncQuery();updateExport();storageWrite();
    $("guided-status").textContent="Draft loaded. Review both source cards, the proposed separate-symbol choices, and the three honesty fields. Acknowledge the symbols and adopt the draft below to export.";
    $("guided-replace-wrap").hidden=false;$("guided-replace").checked=false;$("guided-load").disabled=true;
    $("sources-title").scrollIntoView({block:"start"});
  }
  function updateGuideReview(){
    $("guided-review-wrap").hidden=!guidedOrigin;
    $("guided-adopt").checked=Boolean(guidedOrigin?.adopted);
  }
  function invalidateGuideReview(){if(guidedOrigin) guidedOrigin.adopted=false;}
  function startGuides(){
    $("guided-controls").hidden=false;renderGuides();
    $("guided-theme").addEventListener("change",()=>{previewRecipe=null;$("guided-preview").hidden=true;renderGuides();});
    $("guided-surprise").addEventListener("click",()=>{const all=filteredRecipes();const choices=all.filter(r=>r!==previewRecipe);const pool=choices.length?choices:all;if(pool.length)previewGuide(pool[Math.floor(Math.random()*pool.length)]);});
    $("guided-replace").addEventListener("change",()=>{$("guided-load").disabled=Boolean(previewRecipe&&existingGuidedDraft(previewRecipe)&&!$("guided-replace").checked);});
    $("guided-load").addEventListener("click",loadGuide);
    $("guided-adopt").addEventListener("change",()=>{if(guidedOrigin)guidedOrigin.adopted=$("guided-adopt").checked;updateExport();storageWrite();});
  }

  async function start() {
    if (ids.length < 2) {
      $("catalog-status").textContent = "Not enough source-traced equations are available.";
      return;
    }
    try {
      const response = await fetch("catalog.json");
      if (!response.ok) throw new Error("Catalog unavailable: HTTP " + response.status);
      const list = await response.json();
      for (const item of list) catalog.set(item.id,item);
      if (ids.some(id => !catalog.has(id))) throw new Error("A reviewed equation source is missing from the published catalog.");
    } catch (error) {
      $("catalog-status").textContent = "Could not load the equation index. Please reload the page. " + error.message;
      return;
    }
    ready = true;
    renderChoices();
    $("catalog-status").textContent = ids.length + " source-traced equation sets available from " +
      catalog.size + " catalog records; unreviewed equations are not selectable.";
    const query = new URLSearchParams(location.search);
    const a = query.get("a"), b = query.get("b");
    if (primary(a) && primary(b) && a !== b) {
      pair = {a,b};
      aPick.value = a; bPick.value = b;
    }
    loadPair();
    startGuides();
  }

  aPick.addEventListener("change", () => changePair("a", aPick.value));
  bPick.addEventListener("change", () => changePair("b", bPick.value));
  $("insert-a").addEventListener("click", () => insertRelation("a"));
  $("insert-b").addEventListener("click", () => insertRelation("b"));
  $("scaffold").addEventListener("click", suggestScaffold);
  composition.addEventListener("input", () => {
    invalidateGuideReview();
    manualComposition = true;
    updateExport(); storageWrite();
  });
  for (const field of honesty) field.addEventListener("input", () => {
    invalidateGuideReview();
    updateExport(); storageWrite();
  });
  ackB.addEventListener("change", () => {
    showUnmappedB(); updateExport(); storageWrite();
  });
  copy.addEventListener("click", copyMarkdown);
  download.addEventListener("click", downloadMarkdown);
  start();
})();
