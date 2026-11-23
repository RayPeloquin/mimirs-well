/* A searchable index of existing research pages, not a score of scientific merit. */
(function () {
  'use strict';
  const records = window.MimirsLedgerData;
  if (!Array.isArray(records) || records.length === 0) return;

  function newest(a, b) {
    const dates = b.updated.localeCompare(a.updated);
    return dates || b.number - a.number;
  }
  const byRecent = records.slice().sort(newest);
  const pageSize = 6;
  document.querySelectorAll('[data-ledger-total]').forEach(node => { node.textContent = String(records.length); });

  function elt(tag, cls, value) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (value !== undefined) node.textContent = String(value);
    return node;
  }

  function createCard(item, featured) {
    const card = elt('article', featured ? 'ledger-item ledger-feature' : 'ledger-entry');
    const top = elt('div', 'ledger-entry__top');
    top.append(elt('span', 'ledger-entry__id', String(item.number).padStart(3,'0') + ' / DIVERGENCE RECORD'));
    if (!featured) top.append(elt('span', 'ledger-entry__date', 'Updated ' + item.updated));
    const heading = elt('h3', 'ledger-entry__title');
    const anchor = elt('a', '', item.title);
    anchor.href = item.url;
    heading.append(anchor);
    const group = elt('p', 'ledger-entry__meta', item.category + ' · ' + item.evidence);
    const status = elt('p', 'ledger-entry__status', item.status);
    const summary = elt('p', 'ledger-entry__summary', item.summary);
    card.append(top, heading, group, status, summary);
    const link = elt('a', 'ledger-entry__read', 'Read the record →');
    link.href = item.url;
    link.setAttribute('aria-label', 'Read Divergence Record ' + String(item.number).padStart(3,'0') + ': ' + item.title);
    card.append(link);
    return card;
  }

  // The homepage always shows up to six recently updated records.
  const preview = document.getElementById('ledger-preview');
  if (preview) {
    const cards = byRecent.slice(0, pageSize).map(item => createCard(item, true));
    preview.replaceChildren(...cards);
  }

  const results = document.getElementById('ledger-results');
  if (!results) return;

  const form = document.getElementById('ledger-controls');
  const query = document.getElementById('ledger-search');
  const category = document.getElementById('ledger-category');
  const evidence = document.getElementById('ledger-evidence');
  const sort = document.getElementById('ledger-sort');
  const reset = document.getElementById('ledger-reset');
  const showMore = document.getElementById('ledger-more');
  const statusText = document.getElementById('ledger-result-count');
  const empty = document.getElementById('ledger-empty');
  const fallback = document.getElementById('ledger-fallback');
  if (![form,query,category,evidence,sort,reset,showMore,statusText,empty,fallback].every(Boolean)) return;

  function addOptions(select, values) {
    for (const value of [...new Set(values)].sort((a,b)=>a.localeCompare(b))) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.append(option);
    }
  }
  addOptions(category, records.map(item=>item.category));
  addOptions(evidence, records.map(item=>item.evidence));

  let visibleCount = pageSize;
  function matches(item, text) {
    if (category.value && item.category !== category.value) return false;
    if (evidence.value && item.evidence !== evidence.value) return false;
    const haystack = [item.number, String(item.number).padStart(3,'0'), item.title, item.category, item.evidence, item.status, item.summary].join(' ').toLowerCase();
    return haystack.includes(text);
  }
  function sorted(items) {
    if (sort.value === 'oldest') return items.sort((a,b)=>a.number-b.number);
    if (sort.value === 'number-desc') return items.sort((a,b)=>b.number-a.number);
    if (sort.value === 'title') return items.sort((a,b)=>a.title.localeCompare(b.title));
    return items.sort(newest);
  }
  function render(resetPage) {
    if (resetPage) visibleCount = pageSize;
    const text = query.value.trim().toLowerCase();
    const selected = sorted(records.filter(item=>matches(item,text)));
    const showing = selected.slice(0,visibleCount);
    results.replaceChildren(...showing.map(item=>createCard(item,false)));
    empty.hidden = selected.length !== 0;
    showMore.hidden = showing.length >= selected.length;
    if (!showMore.hidden) showMore.textContent = 'Show ' + Math.min(pageSize,selected.length-showing.length) + ' more records';
    statusText.textContent = 'Showing ' + showing.length + ' of ' + selected.length + ' matching records · ' + records.length + ' total';
  }
  const params = new URLSearchParams(window.location.search);
  const preset = params.get('q') || '';
  query.value = preset;
  const cat = params.get('category') || '';
  if ([...category.options].some(o=>o.value===cat)) category.value=cat;
  const ev = params.get('evidence') || '';
  if ([...evidence.options].some(o=>o.value===ev)) evidence.value=ev;
  const order = params.get('sort') || '';
  if ([...sort.options].some(o=>o.value===order)) sort.value=order;

  const change = () => render(true);
  query.addEventListener('input',change);
  category.addEventListener('change',change);
  evidence.addEventListener('change',change);
  sort.addEventListener('change',change);
  form.addEventListener('submit',event=>event.preventDefault());
  showMore.addEventListener('click', () => {
    const firstNew = results.children.length;
    visibleCount += pageSize;
    render(false);
    results.children[firstNew]?.querySelector('a')?.focus();
  });
  reset.addEventListener('click',()=>{
    query.value=''; category.value=''; evidence.value=''; sort.value='recent';
    render(true); query.focus();
  });

  render(true);
  fallback.hidden=true;
  form.hidden=false;
  results.hidden=false;
})();
