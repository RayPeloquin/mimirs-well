"use strict";

/* Equation Bench MVP — no algebra engine, no implied proof, no automatic variable merging. */
(() => {
  const cores = window.WellEquationCores || {};
  const controls = window.WellPublicationControls || {};
  const releaseHolds = controls.holds || {};
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
      notes: tr.querySelector(".risk").value
    }));
    const payload = {
      rows, ack: ackB.checked, composition: composition.value,
      manualComposition, inherited: $("inherited").value,
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
      first.append(name, meaning);
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
      const risk = element("input"); risk.className = "risk"; risk.type = "text";
      risk.placeholder = "Units, domain or mismatch?";
      risk.maxLength = 300;
      risk.setAttribute("aria-label", "Mapping risk or note for " + item.name);
      risk.value = stored?.notes || "";
      second.append(target); third.append(decision); fourth.append(risk);
      tr.append(first, second, third, fourth); mapBody.append(tr);
      target.addEventListener("change", onMappingChange);
      decision.addEventListener("change", onMappingChange);
      risk.addEventListener("input", onMappingChange);
    }
    showUnmappedB();
  }

  function mappings() {
    return Array.from(mapBody.querySelectorAll("tr[data-symbol]"), tr => ({
      a: tr.dataset.symbol,
      b: tr.querySelector(".target").value,
      decision: tr.querySelector(".decision").value,
      notes: tr.querySelector(".risk").value.trim()
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

  function mappingProblems() {
    if (!selected()) return ["Choose two different reviewed source equations."];
    const map = mappings();
    if (!map.length || map.some(row => !row.b || !row.decision))
      return ["Decide yes/no and select a B symbol (or no counterpart) for every A symbol."];
    if (map.some(row => row.b === "__none" && row.decision === "same"))
      return ["'No counterpart' cannot also mean 'same quantity'."];
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
    if (!manualComposition || composition.value.includes("SUGGESTED ONLY") ||
      composition.value.includes("[your proposed coupling]")) {
      problems.push("Add your own proposed relationship; inserted source formulas and scaffolds are not themselves a combination.");
    }
    for (const [i,field] of honesty.entries()) {
      if (!field.value.trim()) problems.push(["Inherited claims", "New joint claim", "Broken or strained assumptions"][i] + " is required.");
    }
    return problems;
  }
  function updateExport() {
    const problems = exportProblems();
    const valid = problems.length === 0;
    copy.disabled = download.disabled = !valid;
    $("scaffold").disabled = !selected();
    $("insert-a").disabled = !primary(pair.a);
    $("insert-b").disabled = !primary(pair.b);
    $("mapping-status").textContent = mappingProblems()[0] || "All mapped choices are explicit. No dimensional consistency has been checked.";
    exportStatus.textContent = valid ?
      "Ready to export as candidate mathematics. Nothing on this page verifies validity." :
      problems[0];
    return valid;
  }

  function onMappingChange() {
    ackB.checked = false;
    showUnmappedB();
    updateExport(); storageWrite();
  }
  function loadPair() {
    const saved = selected() ? storageRead() : null;
    manualComposition = Boolean(saved?.manualComposition);
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
    composition.value += (composition.value.trim() ? "\n\n" : "") + header + core.equation;
    composition.focus();
    updateExport(); storageWrite();
  }
  function suggestScaffold() {
    if (!selected()) return;
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
      "| Design A symbol | Design B symbol | Same quantity? | Notes / risk |",
      "| --- | --- | --- | --- |"
    ];
    for (const row of mappings()) {
      lines.push("| " + mdCell(row.a) + " | " + mdCell(row.b === "__none" ? "No counterpart" : row.b) +
        " | " + (row.decision === "same" ? "Yes" : "No") + " | " + mdCell(row.notes) + " |");
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
      "No algebraic verification, dimensional analysis, simplification, physical measurement, or independent validation was performed by the Equation Bench.",
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
  }

  aPick.addEventListener("change", () => changePair("a", aPick.value));
  bPick.addEventListener("change", () => changePair("b", bPick.value));
  $("insert-a").addEventListener("click", () => insertRelation("a"));
  $("insert-b").addEventListener("click", () => insertRelation("b"));
  $("scaffold").addEventListener("click", suggestScaffold);
  composition.addEventListener("input", () => {
    manualComposition = true;
    updateExport(); storageWrite();
  });
  for (const field of honesty) field.addEventListener("input", () => {
    updateExport(); storageWrite();
  });
  ackB.addEventListener("change", () => {
    showUnmappedB(); updateExport(); storageWrite();
  });
  copy.addEventListener("click", copyMarkdown);
  download.addEventListener("click", downloadMarkdown);
  start();
})();
