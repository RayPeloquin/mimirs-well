"use strict";

const params = new URLSearchParams(location.search);
const physical = params.get("physical") === "skeptic-1";
const roles = physical ? ["from"] : ["from", "to"];
const form = document.querySelector("#brief");
const fieldLabels = {
  mechanism: physical ? "Claim to test" : "Borrowed mechanism",
  change: physical ? "Physical setup and measurement" : "Proposed change",
  baseline: "Baseline and controls",
  criterion: "Success and failure criteria",
  materials: "Reproduction materials and open requirements",
};
const draftFields = ["title", ...Object.keys(fieldLabels)];
const contributions = window.WellDesignContributions;
const draftKey = physical ? "mimirs-well-physical-skeptic-1-v1" : "mimirs-well-combine-draft-v1";
const pair = { from: null, to: null };
const catalog = new Map();
const catalogStatus = document.querySelector("#catalog-status");
const exportStatus = document.querySelector("#export-status");
const copy = document.querySelector("#copy");
const download = document.querySelector("#download");
const fallback = document.querySelector("#fallback");
const fallbackLabel = document.querySelector("#fallback-label");
const acousticExample = {
  title: "Asymmetric acoustic probing",
  mechanism: "Borrow SKEPTIC-1’s reversible symmetry-breaking probe.",
  change: "Move the central acoustic source off-center, then repeat on the opposite side. Keep the two sweeps separate to measure their difference.",
  baseline: "Compare with a centered layout and a symmetric coverage control on the same synthetic rock worlds, at equal shot count and input energy.",
  criterion: "Choose the minimum useful reduction in false cavity detections before running. Compare layouts at the same cavity detection rate.",
  materials: "Use the linked Temporal Acoustics simulator. Prepare held-out rock worlds with solid inclusions that resemble cavities under the centered layout.",
};

 
const grokCaseExample = {
  title: "Reversible state probe for Recipe Pucks",
  mechanism: "Borrow the SKEPTIC-1 reasoning pattern of a reversible symmetry-breaking intervention, not a proven transferable mechanism. A user-triggered, one-sided tactile cue must encode the machine's verified current state and then return to neutral.",
  change: "Define the Recipe Pucks selector's actual states and build a safe state-dependent haptic or detent response. The response must distinguish the states under test; a state-independent vibration would reveal no information.",
  baseline: "Compare three counterbalanced conditions: A, ordinary Recipe Pucks selector without extra confirmation; B, the same selector with a reversible, one-sided state-dependent probe; C, the same selector with a conventional, accessible 'Show current state' button that presents the same verified state information without asymmetry. Compare both ambiguous and unambiguous visual trials with equivalent practice.",
  criterion: "Pre-register minimum useful reduction in true-state identification errors, maximum acceptable extra task time, and sample-size rationale. Record errors, time to correct identification, task time, accidental selections and confusion. B must improve on A and offer a practical advantage over C without exceeding cost thresholds to support a distinct asymmetric-probe benefit. If B beats A but not C, attribute improvement to explicit state information rather than demonstrated asymmetry benefit; report mixed or uncertain results as such.",
  materials: "A specified Recipe Pucks interaction model; three functionally comparable interface variants (or controlled mockups); a reliable state sensor/controller; a safe reversible cue for B; an accessible state readout for C; counterbalanced tasks and participant consent. This is a proposed human-interface test, not a working design or demonstrated efficacy.",
};

const grokOpticalExample = {
  title: "Calibration integrity: Ghostglass × Chihuahua Sphere",
  mechanism: "Borrow Ghostglass's pre-registered on/off statistical testing and Chihuahua Sphere's discipline of keeping independently measured source optical energy, losses and receiver energy separate. Treat an uncertain mismatch as a review flag, not proof of an artifact.",
  change: "Use an optical bench with separately calibrated source-output monitoring, characterized path losses and detector response. Run known-null, artifact-injected and true-signal trials, and compare decisions from the same raw observations under each rule.",
  baseline: "Three rules on matched blinded trials: A, Ghostglass-style statistical test alone; B, the same test with independent uncertainty-aware source/receiver ledger; C, the same test with conventional detector QC for gain, dark counts, leakage and drift. C does not use the explicit energy-closure rule. Do not derive both ledger sides from the same detector signal.",
  criterion: "Pre-register detection thresholds, a valid residual-uncertainty band, a minimum useful decrease in known-null false positives, and a minimum retained true-positive sensitivity. Compare B against both A and C at matched signal sensitivity. A failed energy balance flags review, not automatic falsehood; report uncertain, mixed and inconclusive cases.",
  materials: "Wavelength-characterized safe low-power optical source, calibrated independent optical reference, attenuation/occlusion control, detector and dark/gain reference, measured geometry and path-loss bounds, trial ground truth, code for pre-registered on/off statistics and QC, and calibration uncertainty. No joint physical test has been documented.",
};

const grokResidualExample = {
  title: "Residual-aware rule enforcement: CRUCIBLE × ECHO-Rx",
  mechanism: "Transfer ECHO-Rx's mathematical lesson that an accumulated effect continues after production stops into CRUCIBLE-style guarded control: legal actions must be assessed for their delayed future consequences. This is a conceptual crossover, not a demonstrated new control principle.",
  change: "Extend versioned CRUCIBLE-like rover and quadrotor simulations with persistent, observable or estimated residual state (e.g. momentum, actuator lag or thermal storage). Before approving each action, forecast residual trajectories and uncertainty envelopes over a pre-specified horizon, and derate or stop early when a future safety constraint would otherwise be crossed. Include a justified bound beyond the horizon.",
  baseline: "Three controllers on matched held-out traces: A, immediate-state CRUCIBLE-style rule guard; B, same guard plus an explicit residual budget, predictive safety envelope and auditable trigger; C, conventional predictive safety controller using the same available residual dynamics and uncertainty data, without B's separate budget ledger. Include delayed stops, disturbances and model mismatch.",
  criterion: "Pre-register acceptable reduction in post-stop constraint violations and overshoot, maximum unnecessary early-stop and task-failure rates, and sample size. Compare B with A for useful lookahead, and B with C for incremental value beyond prior predictive control. Track violation frequency, severity and duration, task completion, compute costs and calibration. Zero observed violations alone do not prove zero risk.",
  materials: "Versioned CRUCIBLE simulator, exact rover and quadrotor campaign records, reproducible residual-state dynamics with units, separate tuning/held-out scenarios and disturbance seeds, matched scenario replay, controller logs, uncertainty and mismatch sweeps, and documented stopping/constraint contracts. ECHO-Rx supplies an analogy only; no wet-lab experiment is proposed.",
};

const skepticPhysicalExample = {
  title: "SKEPTIC-1: Can a physical brace distinguish mirrored faults?",
  mechanism: "The numerical model predicts that a reversible off-center brace makes identical stiffness losses at opposite ends distinguishable. Test whether the effect survives measurement uncertainty and repeat setup on a physical rig.",
  change: "Compare two known stiffness-loss conditions, one at each end, on the same three-mass spring rig. Measure the first natural frequency in hertz for each probe position. Repeat after reseating the brace and check that the original response returns after removal.",
  baseline: "Compare no brace, a centered brace, and an off-center brace. Use the same masses, spring set, excitation, sensors, and frequency estimator. Repeat both fault conditions and record the scatter from each setup.",
  criterion: "Before collecting data, specify the repeat count, minimum useful separation, and how frequency uncertainty will be estimated. Support the claim if the off-center probe clears the threshold after uncertainty is included, while both controls stay within the predefined equivalence band. Count the result against the claim if the off-center difference falls short of the threshold, or either control separates the faults, with enough precision to decide. Otherwise report it as inconclusive.",
  materials: "Specify masses, springs, a removable stiffness brace, a stable fixture, a vibration sensor and data recorder. Measure the actual spring stiffnesses and check the sensor timebase. Use the linked design record and source model for the numerical comparison.",
};

function enterPhysicalMode() {
  document.querySelector("#bench-intro").textContent =
    "Distill to physics. Turn one model prediction into a measurement someone can make.";
  document.querySelector("#physical-example").hidden = true;
  document.querySelector("#back-to-combine").hidden = false;
  document.querySelector("#pair-title").textContent = "Source design";
  document.querySelector(".pair").classList.add("physical");
  document.querySelector(".connector").hidden = true;
  document.querySelector("#to-slot").hidden = true;
  document.querySelector("#from-title").textContent = "Design under test";
  document.querySelector("#brief-title").textContent = "Draft the physical test";
  document.querySelector("#draft-note").textContent = "Proposed test · Your draft is saved in this browser.";
  document.querySelector("#mechanism-label").textContent = "What claim will you test?";
  document.querySelector("#change-label").textContent = "What will you measure, and how?";
  form.elements.title.placeholder = "Name the proposed physical test";
  form.elements.mechanism.placeholder = "State the model prediction to check.";
  form.elements.change.placeholder = "Describe the rig, test conditions, and measured quantity.";
  exportStatus.textContent = "Loading the source design…";
}

function element(tag, value) {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  return node;
}

function normalize(value) {
  return value.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase()
    .replace(/['’]/gu, "").replace(/[^\p{Letter}\p{Number}]+/gu, " ").trim();
}

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(draftKey) || "null");
  } catch {
    return null;
  }
}

function saveDraft() {
  const fields = Object.fromEntries(
    draftFields.map(name => [name, form.elements[name].value]),
  );
  try {
    localStorage.setItem(draftKey, JSON.stringify({ pair, fields }));
  } catch {
    document.querySelector("#draft-note").textContent =
      "Browser storage is unavailable. Copy or download your draft to keep it.";
  }
}

function syncPair() {
  const url = new URL(location.href);
  url.searchParams.delete("example");
  url.searchParams.delete("case");
  for (const role of roles) {
    if (pair[role]) url.searchParams.set(role, pair[role]);
    else url.searchParams.delete(role);
  }
  history.replaceState(null, "", url);
}

function setDesign(role, id) {
  pair[role] = id;
  document.querySelector(`#${role}-search`).value = "";
  render();
  syncPair();
  saveDraft();
  const next = id ? `#${role}-selection h4` : `#${role}-search`;
  document.querySelector(next).focus();
}

function renderMatches(role) {
  const input = document.querySelector(`#${role}-search`);
  const list = document.querySelector(`#${role}-matches`);
  const count = document.querySelector(`#${role}-count`);
  list.replaceChildren();
  if (pair[role]) {
    count.textContent = "";
    return;
  }

  const words = normalize(input.value).split(" ").filter(Boolean);
  const otherRole = role === "from" ? "to" : "from";
  const candidates = Array.from(catalog.values()).filter(entry => entry.id !== pair[otherRole]);
  const matches = words.length ?
    candidates.filter(entry => words.every(word => entry.searchText.includes(word))) :
    candidates.filter(entry => Object.hasOwn(contributions, entry.id));
  const limit = 6;
  if (words.length) {
    const shown = Math.min(matches.length, limit);
    count.textContent = !shown ? "No matching designs." :
      matches.length > limit ? `Showing ${shown} of ${matches.length}. Refine the search to see more.` :
      `${shown} matching ${shown === 1 ? "design" : "designs"}.`;
  } else {
    count.textContent = "Start with one of these records or search the full catalog.";
  }
  for (const entry of matches.slice(0, limit)) {
    const item = element("li");
    const button = element("button", entry.title);
    button.type = "button";
    button.addEventListener("click", () => setDesign(role, entry.id));
    item.append(button);
    list.append(item);
  }
}

function renderSelection(role) {
  const input = document.querySelector(`#${role}-search`);
  const selection = document.querySelector(`#${role}-selection`);
  selection.replaceChildren();
  selection.hidden = !pair[role];
  input.hidden = Boolean(pair[role]);
  if (!pair[role]) return;

  const entry = catalog.get(pair[role]);
  const note = contributions[entry.id];
  const heading = element("h4", entry.title);
  heading.tabIndex = -1;
  const meta = element("p", entry.status);
  meta.className = "meta";
  selection.append(heading, meta);
  if (note) {
    const list = element("dl");
    list.append(
      element("dt", "What it can contribute"), element("dd", note.contribution),
      element("dt", "What it still needs"), element("dd", note.need),
    );
    selection.append(list);
  }

  const details = element("details");
  details.append(element("summary", "Evidence and limits"),
    element("p", entry.evidence || "Source review pending."));
  const record = element("a", "Open design record");
  record.href = entry.url;
  selection.append(details, record);
  if (note?.source) {
    const source = element("a", note.sourceLabel);
    source.href = note.source;
    selection.append(source);
  }

  if (physical) return;
  const clear = element("button", "Change design");
  clear.type = "button";
  clear.className = "clear";
  clear.setAttribute("aria-label", `Change ${entry.title}`);
  clear.addEventListener("click", () => setDesign(role, null));
  selection.append(clear);
}

function render() {
  for (const role of roles) {
    renderSelection(role);
    if (!physical) renderMatches(role);
  }
  copy.disabled = download.disabled = !roles.every(role => pair[role]);
  fallbackLabel.hidden = true;
  exportStatus.textContent = copy.disabled ? "Choose two designs to export a proposed test." : "";
}

function exportedUrl(path) {
  return new URL(path, document.baseURI).href.replaceAll("(", "%28").replaceAll(")", "%29");
}

function markdownLink(label, path) {
  const safeLabel = label.replace(/[\\\[\]]/gu, "\\$&");
  return `[${safeLabel}](${exportedUrl(path)})`;
}

function briefMarkdown() {
  const title = form.elements.title.value.trim() || (physical ? "Physical test" : "Design combination");
  const lines = [`# ${title}`, "", "**Status: Proposed test**", "", physical ? "## Source design" : "## Parent designs"];
  for (const role of roles) {
    const entry = catalog.get(pair[role]);
    const note = contributions[entry.id];
    if (!physical) lines.push("", `### ${role === "from" ? "Borrow from" : "Build on"}`);
    lines.push("", markdownLink(entry.title, entry.url), "", entry.status, "",
      entry.evidence || "Source review pending.");
    if (note) {
      lines.push("", `- What it can contribute: ${note.contribution}`,
        `- What it still needs: ${note.need}`,
        `- ${markdownLink(note.sourceLabel, note.source)}`);
    }
  }
  for (const [name, label] of Object.entries(fieldLabels)) {
    lines.push("", `## ${label}`, "", form.elements[name].value.trim() || "To be specified.");
  }
  return lines.join("\n") + "\n";
}

copy.addEventListener("click", async () => {
  const text = briefMarkdown();
  try {
    await navigator.clipboard.writeText(text);
    exportStatus.textContent = "Brief copied.";
  } catch {
    fallback.value = text;
    fallbackLabel.hidden = false;
    fallback.focus();
    fallback.select();
    exportStatus.textContent = "The brief is selected. Use your browser’s copy command.";
  }
});

download.addEventListener("click", () => {
  const blob = new Blob([briefMarkdown()], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = element("a");
  link.href = url;
  link.download = physical ? `${pair.from}-physical-test-brief.md` : `${pair.from}-to-${pair.to}-test-brief.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  exportStatus.textContent = "Markdown brief downloaded.";
});

form.addEventListener("input", () => {
  if (!physical && (new URLSearchParams(location.search).has("example") ||
      new URLSearchParams(location.search).has("case"))) syncPair();
  fallbackLabel.hidden = true;
  if (!copy.disabled) exportStatus.textContent = "";
  saveDraft();
});

form.addEventListener("submit", event => event.preventDefault());

async function start() {
  if (physical) enterPhysicalMode();
  try {
    const response = await fetch("catalog.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    for (const entry of await response.json()) {
      const note = contributions[entry.id];
      catalog.set(entry.id, {
        ...entry,
        searchText: normalize([entry.title, note?.contribution, note?.need].join(" ")),
      });
    }
  } catch {
    catalogStatus.textContent = "The catalog could not load. Reload this page to try again.";
    exportStatus.textContent = "";
    return;
  }

  const example = params.get("example") === "1" &&
    params.get("from") === "skeptic-1" && params.get("to") === "temporal-acoustics";
  const grokCase = params.get("case") === "grok-001" &&
    params.get("from") === "skeptic-1" && params.get("to") === "recipe-pucks";
  const grokOptical = params.get("case") === "grok-002" &&
    params.get("from") === "ghostglass" && params.get("to") === "chihuahua-sphere-cs-1";
  const grokResidual = params.get("case") === "grok-003" &&
    params.get("from") === "crucible" && params.get("to") === "echo-rx";
  const draft = readDraft();
  const requested = physical ? { from: "skeptic-1" } : roles.some(role => params.has(role)) ?
    Object.fromEntries(roles.map(role => [role, params.get(role)])) : draft?.pair;
  for (const role of roles) {
    const id = requested?.[role];
    if (catalog.has(id) && !Object.values(pair).includes(id)) pair[role] = id;
    const input = document.querySelector(`#${role}-search`);
    input.disabled = false;
    input.addEventListener("input", () => renderMatches(role));
  }

  const matchesDraft = roles.every(role => draft?.pair?.[role] === pair[role]);
  const fields = physical ? (draft?.fields || skepticPhysicalExample) :
    example ? acousticExample : grokCase ? grokCaseExample :
    grokOptical ? grokOpticalExample : grokResidual ? grokResidualExample :
    matchesDraft ? draft.fields : null;
  for (const name of draftFields) {
    if (typeof fields?.[name] === "string" && !form.elements[name].value) {
      form.elements[name].value = fields[name];
    }
  }
  catalogStatus.textContent = physical ? "SKEPTIC-1 · Numerical model" : `Search ${catalog.size} designs across the Well.`;
  render();
}

start();
