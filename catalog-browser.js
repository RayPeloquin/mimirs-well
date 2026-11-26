"use strict";

const controls = document.querySelector("#catalog-controls");
const results = document.querySelector("#catalog-entries");
const count = document.querySelector("#catalog-count");
const more = document.querySelector("#catalog-more");
const search = controls.elements.q;
const family = controls.elements.family;
const evidence = controls.elements.evidence;
const reviewStatus = controls.elements.status;
const selects = [family, evidence, reviewStatus];
const pageSize = 6;
let limit = pageSize;

function normalize(value) {
  return value.normalize("NFKD").replace(/\p{Mark}/gu, "").toLowerCase()
    .replace(/['’]/gu, "").replace(/[^\p{Letter}\p{Number}]+/gu, " ").trim();
}

const entries = Array.from(results.children, row => {
  const entry = row.firstElementChild;
  return {
    row,
    types: entry.dataset.types.split(" "),
    reviewStatus: entry.dataset.reviewStatus,
    families: entry.dataset.families.split(" "),
    searchable: normalize(entry.textContent + " " + row.id),
  };
});

function linkedEntry() {
  try {
    return entries.find(({ row }) => row.id === decodeURIComponent(location.hash.slice(1)));
  } catch {
    return undefined;
  }
}

function render(anchor, scrollToAnchor = false) {
  const words = normalize(search.value).split(" ").filter(Boolean);
  const matches = entries.filter(entry =>
    (!family.value || entry.families.includes(family.value)) &&
    (!evidence.value || entry.types.includes(evidence.value)) &&
    (!reviewStatus.value || entry.reviewStatus === reviewStatus.value) &&
    words.every(word => entry.searchable.includes(word)));
  const firstPage = matches.slice(0, limit);
  if (anchor && matches.includes(anchor) && !firstPage.includes(anchor)) {
    firstPage[firstPage.length - 1] = anchor;
  }
  const visible = new Set(firstPage);
  for (const entry of entries) entry.row.hidden = !visible.has(entry);
  count.textContent = matches.length ?
    `Showing ${visible.size} of ${matches.length} matching projects.` :
    "No projects match. Try a different search or clear the filters.";
  const remaining = matches.length - visible.size;
  more.hidden = remaining <= 0;
  const nextCount = Math.min(pageSize, remaining);
  more.textContent = `Show ${nextCount} more ${nextCount === 1 ? "project" : "projects"}`;
  if (scrollToAnchor && visible.has(anchor)) requestAnimationFrame(() => anchor.row.scrollIntoView());
  return firstPage;
}

function restoreFilters() {
  const params = new URLSearchParams(location.search);
  // Preserve links that used the old evidence filter to request pending records.
  if (params.get("evidence") === "pending") {
    if (!params.has("status")) params.set("status", "pending_review");
    params.delete("evidence");
  }
  search.value = params.get("q") || "";
  for (const filter of selects) {
    filter.value = params.get(filter.name) || "";
    if (filter.selectedIndex < 0) filter.selectedIndex = 0;
  }
  limit = pageSize;
  render(linkedEntry(), true);
}

function applyFilters() {
  const url = new URL(location.href);
  for (const filter of [search, ...selects]) {
    const value = filter.value.trim();
    if (value) url.searchParams.set(filter.name, value);
    else url.searchParams.delete(filter.name);
  }
  url.hash = "";
  history.replaceState(null, "", url);
  limit = pageSize;
  render();
}

controls.addEventListener("input", applyFilters);
controls.addEventListener("submit", event => event.preventDefault());
controls.addEventListener("reset", event => {
  event.preventDefault();
  for (const filter of [search, ...selects]) filter.value = "";
  applyFilters();
  search.focus();
});
more.addEventListener("click", () => {
  const previous = new Set(entries.filter(({ row }) => !row.hidden));
  limit += pageSize;
  const next = render(linkedEntry()).find(entry => !previous.has(entry));
  next?.row.querySelector("a")?.focus();
});
window.addEventListener("hashchange", restoreFilters);
for (const detail of results.querySelectorAll("details[open]")) detail.open = false;
controls.hidden = count.hidden = false;
restoreFilters();
