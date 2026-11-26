# Mimir's Well — Divergence Ledger library maintenance

**Updated:** 25 November 2026. The canonical public index is [ledger.html](../ledger.html). It is a **curated evidence ledger**, not a duplicate of every project in the Well.

## Publishing a new record
1. Verify a documented difference between intention and an observed result, a corrected assumption, a tested limitation, or an explicitly proposed alternative question. A project is **not** automatically eligible just because it exists.
2. Create its own `*-divergence-ledger.html` record containing intent, what the available documentation really shows, a separate possible crossover, source receipt, evidence classification and next test.
3. Assign the next permanent record number; never reuse or renumber an existing record. Add its metadata in **`ledger-data.js`** (number, title, category, evidence, status, summary, URL, and actual last-updated date in YYYY-MM-DD).
4. Run `node scripts/generate-catalog.cjs` to regenerate the no-script list and current counts in **`ledger.html`** and the homepage.
5. Run `node --test ledger-library.test.cjs` in a local checkout before publishing. Check the dedicated directory, six-record homepage preview and links in a browser, including a narrow screen and keyboard navigation.

## What the library does
- The homepage shows the six most recently *updated* entries (date desc, permanent number desc for ties).
- The dedicated library provides keyword search, research-field and evidence-type filters, sorting, and six results at a time.
- The list is generated using safe DOM methods; project titles and descriptions are not inserted as raw HTML.
- Record page URLs stay stable. A changed hypothesis never overwrites an older finding.
- `ledger-data.js` supplies both interactive views and the generated no-script list. Update Ledger metadata there.
- An evidence label is not a validation score. Numerical models, AI review and clinical or hardware testing remain explicitly different.
- Editorial review determines inclusion. No automated generation of divergence claims from registry cards.

**Guiding principle:** We do no harm.
