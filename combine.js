"use strict";

const roles = ["from", "to"];
const form = document.querySelector("#brief");
const fieldLabels = {
  mechanism: "Borrowed mechanism",
  change: "Proposed change",
  baseline: "Baseline and controls",
  criterion: "Success and failure criteria",
  materials: "Reproduction materials and open requirements",
};
const draftFields = ["title", ...Object.keys(fieldLabels)];
const contributions = window.WellDesignContributions;
const draftKey = "mimirs-well-combine-draft-v1";
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
    document.querySelector("#brief-title + p").textContent =
      "Browser storage is unavailable. Copy or download your draft to keep it.";
  }
}

function syncPair() {
  const url = new URL(location.href);
  url.searchParams.delete("example");
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
  const limit = 8;
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
    renderMatches(role);
  }
  copy.disabled = download.disabled = !pair.from || !pair.to;
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
  const title = form.elements.title.value.trim() || "Design combination";
  const lines = [`# ${title}`, "", "**Status: Proposed test**", "", "## Parent designs"];
  for (const role of roles) {
    const entry = catalog.get(pair[role]);
    const note = contributions[entry.id];
    lines.push("", `### ${role === "from" ? "Borrow from" : "Build on"}`,
      markdownLink(entry.title, entry.url), "", entry.status, "",
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
  link.download = `${pair.from}-to-${pair.to}-test-brief.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  exportStatus.textContent = "Markdown brief downloaded.";
});

form.addEventListener("input", () => {
  if (new URLSearchParams(location.search).has("example")) syncPair();
  fallbackLabel.hidden = true;
  if (!copy.disabled) exportStatus.textContent = "";
  saveDraft();
});

form.addEventListener("submit", event => event.preventDefault());

async function start() {
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
    return;
  }

  const params = new URLSearchParams(location.search);
  const example = params.get("example") === "1" &&
    params.get("from") === "skeptic-1" && params.get("to") === "temporal-acoustics";
  const draft = readDraft();
  const requested = roles.some(role => params.has(role)) ?
    Object.fromEntries(roles.map(role => [role, params.get(role)])) : draft?.pair;
  for (const role of roles) {
    const id = requested?.[role];
    if (catalog.has(id) && !Object.values(pair).includes(id)) pair[role] = id;
    const input = document.querySelector(`#${role}-search`);
    input.disabled = false;
    input.addEventListener("input", () => renderMatches(role));
  }

  const matchesDraft = roles.every(role => draft?.pair?.[role] === pair[role]);
  const fields = example ? acousticExample : matchesDraft ? draft.fields : null;
  for (const name of draftFields) {
    if (typeof fields?.[name] === "string" && !form.elements[name].value) {
      form.elements[name].value = fields[name];
    }
  }
  catalogStatus.textContent = `Search ${catalog.size} designs across the Well.`;
  render();
}

start();
