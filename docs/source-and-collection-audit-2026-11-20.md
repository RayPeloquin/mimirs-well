# Mimir's Well — Source and collection audit
**Review date:** 20 November 2026  
**Scope:** Current public repository source and a limited external-source reachability spot check.  
**Status:** Maintenance record, **not** scientific validation or a full accessibility/security audit.

## Current source inventory

| Measure | Count | Basis |
| --- | ---: | --- |
| Project cards expected from current source | **384** | 370 retained titles after six explicit withdrawals + 10 static featured cards + 4 separately scripted cards |
| Unique card names | **384** | Normalized title inventory, including the standalone Ankh Qubit Assembly artwork record |
| Expanded, source-referenced records | **152** | 152 parsed `Object.assign` source-backed record overrides in `registry.js`; all 152 slugs correspond to current project cards |
| Cards without a source-backed expanded override | **232** | 384 minus 152. Some still link to public repositories; this is **not** a count of projects with no sources. |
| Divergence Ledger pilots | **7** | The seven published three-question records |
| Gallery image references | **43** | All match published image assets in `assets/` at audit time |
| Published image assets in `assets/` | **49** | GitHub directory listing at audit time |

**Historical comparison:** The older 19 November handoff records **387** collection entries and **151** expanded records. Those numbers are retained in their dated context, not silently rewritten. The difference reflects subsequent curation and the ongoing collection. A previously opened browser tab displayed 383 projects; the current code-derived inventory is 384. A fresh, interactive browser reload should be used to independently verify rendering and the visible total.

## Source-reference inventory

The 152 expanded record overrides include **313 nonblank source-reference lines**: **177 HTTP(S) URLs** and **136 plain-text archival/source-context notes**. Plain-text references often intentionally refer to private source files or otherwise unpublished material; do not turn them into fabricated public hyperlinks.

### Internal GitHub source paths

All **64** internal `github.com/RayPeloquin/mimirs-well/blob/main/...` source-reference occurrences (**63 distinct paths**) were compared against current published directory entries for `public-notes/`, `design-notes/`, `research/temporal-acoustics/results/`, and the root directory.

**Result: 64 checked, 0 confirmed missing.** This is target-existence checking only, not an assessment of the scientific quality of the documents.

### Twelve selected GitHub targets retrieved

The connected GitHub file/repository reader opened each of the following without a not-found error:

1. `Ghostglass-Neutrino-Statistical-Reference/README.md`
2. `SKEPTIC-1/AUTHORSHIP.md`
3. `Third-Look-Three-Camera/README.md`
4. `CRUCIBLE-Autonomy-Test-Harness/v0.2/validation/checkpoint-timestep.json`
5. `ECHO-Rx-Responsive-Biologic-Production/shutdown_model.py`
6. `ECHO-Rx-Responsive-Biologic-Production/shutdown-model-results.json`
7. `BRIDLE-3-Modular-Aerospike/thermal_model.py`
8. `RAVEN-P1/DESIGN.md`
9. `Temporal-Reflection-Chamber/README.md`
10. `ECHO-M-Host-Coupled-Artificial-Chromosome` (repository root)
11. `Ghostglass-Neutrino-Statistical-Reference` (repository root)
12. `Third-Look-Three-Camera` (repository root)

All paths are below `https://github.com/RayPeloquin/`.

**Result: 12 retrieved, no confirmed missing targets.** A successfully retrieved page does not constitute independent reproduction.

### Public reference pages

Five representative off-GitHub reference pages opened and returned substantive content during the spot check:

- [FHWA: Hammer Sound / Chain Drag](https://infotechnology.fhwa.dot.gov/hammer-sound-chain-drag-hscd/) — cited by Knock-Moth.
- [NIST: Standard Test Methods for Response Robots](https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots) — cited by FLUFFY-01.
- [DOE: Best Management Practice #14 — Alternative Water Sources](https://www.energy.gov/cmei/femp/best-management-practice-14-alternative-water-sources) — cited by the ranch water-system concept.
- [NIST: Ion Storage Group](https://www.nist.gov/pml/time-and-frequency-division/ion-storage) — cited by FQSC-01.
- [CERN: ALICE detects the conversion of lead into gold at the LHC](https://home.cern/alice-detects-conversion-lead-gold-lhc/) — cited by FQSC-01.

**Access barrier, not confirmed broken:** [DOI 10.1038/s41567-023-01975-y](https://doi.org/10.1038/s41567-023-01975-y) redirected toward a Nature publisher authentication page inaccessible to the retrieval service. Preserve the DOI. Seek lawful open-access versions or bibliographic verification in a later review; a blocked fetch alone does not demonstrate that the scholarly link is dead.

## Accessibility and usability checks

- Existing project search results already use a polite live status region.
- The homepage has a skip-to-content link and keyboard focus outlines.
- The nav and project grid use responsive wrapping.
- The Ledger links on the main page were given a minimum 44-pixel touch height in this maintenance pass.
- The no-JavaScript fallback copy was corrected to say **ten featured project cards**, matching the static markup.
- This is a **source review only**. A full browser-based keyboard/zoom/contrast/screen-reader audit is still outstanding. Do not claim it was performed.

## Next small tasks

1. Fresh interactive desktop + phone viewport check at 320, 390 and 768 CSS pixels, including the seven-link navigation and Ledger cards.
2. Continue external scholarly-source link checks in small batches. Record **available**, **blocked**, **moved**, and **confirmed missing** separately.
3. Add source-review timestamps and explicit evidence types to the next ten title-only records with suitable public documentation.
4. When project evidence changes, update the Divergence Ledger rather than revising old claims without a dated record.

**Principle:** We do no harm. We preserve the unsuccessful and the uncertain along with the promising.
