# Asteris’ Workbench

Public handoff snapshot · 17 November 2026

[Open the workbench](https://raypeloquin.github.io/mimirs-well/#workbench)

This is a maintained snapshot, not live monitoring or an automatic task runner. Read current source and commit history before resuming work. Do not put credentials, private conversations, personal details or unpublished technical material here.

## Current work

Build Mimir’s Well one small, reviewable batch at a time: connect each project’s public purpose to its evidence, limitations, attribution and next check.

The registry currently contains 70 expanded records with source references: Ghostglass, SKEPTIC-1, HIPPO Data Center Cooling Stack, PIPE-LISTENER-01, GENTLE-01, GRASP-01, SILT HARP, Roman Concrete, Third-Look, CRUCIBLE, ECHO-Rx, ECHO-M, BRIDLE-3, RAVEN-P1, Temporal Reflection Chamber, Adventurer’s Forge, Mimir’s Well, SPOTRECON, CONFLUENCE-01, LG–AETHER–01, Transporter T0, LANTEX-24/LANTEX-PRO, LANTERN-1, CONSCIENCE-01, SCOPE-365, Yggdrasil Protocol, Heimdall’s Bridge, Enki’s Will, The Triad, Hypha Mind / GO-CUBE, SR-MARGIN-01, Signature-Selective Receiver, FIELD MEDIC, Edge Reflex Mesh, TRUTH LAYER, Quantum Observability Layer, Quantum Floor, Cyber Meta-Material, Court of the Synthetic, MARGIN-01, BRIDGE-01, CMH-01, Artificial Heart, HEARTSEED, GIPS, Vascular Whisperer, Phantom Hub Medical, Wet HIPPO Well, Desert HIPPO Well, SHOFAR Mesh, HIVE-1, Consent Gate, Conduct Architecture, Embodied System Stack, Human Perception Stack, Reality Overlay Stack, Mobile Truth Stack, Truth Resolution Stack, Court on Trial, Olympus Witness Rig, Mount Olympus, Olympus Floor Model, Olympus Registry, SVALBARD, AI-dentity, AREOPAGUS, Aegis Sentinel Mesh, HIPPO Bus, HIPPO-MAG-01 and HIPPO CANTEEN. Other entries remain catalog listings pending source review. An expanded record is not a validation rating.

## What has been checked

- Recent website changes passed JavaScript syntax checks and selected logic checks for the behaviors changed. Committed files were read back to verify the intended source.
- Search checks cover former names, category terms, punctuation, word order, and reuse/refresh of normalized text.
- Public record editing, import and persistence controls were removed. The registry reads published source; it has no visitor write API. Existing browser-local notes were left untouched.
- The visitor log is a separate GitHub issue. Comments do not change website records.
- No full browser/device audit or independent rerun of every project’s research has been completed by this website-maintenance pass.


## Navigation spot-check — 17 November 2026

Live Chrome checks covered the default desktop viewport and requested 390 × 844 / 320 × 740 phone-sized viewports (usable widths 375 / 305 pixels with scrollbars). Search, the 50-record expanded filter, SKEPTIC-1 opening, source-link destination, Escape/Close, focus return, contained record scrolling and the visitor-log section/link were checked. No horizontal overflow or captured console errors were observed in those paths; the record dialog had no editing controls.

Two observed issues were addressed: the empty-results message now mentions all filters and Reset filters; dropdowns now have a 44-pixel minimum height. This is a spot-check, not a complete accessibility, device, cross-browser or external-link audit.

## External-source spot-check — 17 November 2026

Twelve existing targets sampled; not a full-site link audit or scientific evidence review.

| Target | Observation |
| --- | --- |
| Ghostglass public repository | Repository available and public |
| Ghostglass README.md | File exists via GitHub |
| Ghostglass experiment.py | File exists via GitHub |
| Ghostglass test_protocol.py | File exists via GitHub |
| Ghostglass results.json | File exists via GitHub |
| Ghostglass test-record.txt | File exists via GitHub |
| DOI 10.3390/s26144325 | HTTP 200 after redirect to MDPI |
| White Rose eprint 243429 | HTTP 200 |
| DOI 10.5281/zenodo.18631450 | HTTP 200 after redirect to Zenodo |
| MIT manipulation force.html | HTTP 200 |
| DOI 10.1126/sciadv.add1602 | Publisher returned HTTP 403; access barrier, not a confirmed missing paper |
| PFLOTRAN Richards theory page | HTTP 200 |

The Roman-concrete record retains its DOI and now also links PMC9821858. The alternative's article identity and DOI were confirmed through indexed PMC/PubMed records; direct automated retrieval encountered a challenge response. It is an alternative route, not a promise of unrestricted access. Repository-file existence and HTTP success do not establish scientific validity, complete content access or permanent availability.

## Collection suitability review — 17 November 2026

All 397 titles and the 70 expanded summaries were screened for collection fit, coherent scope, evidence wording and record binding. The 70 summaries are retained as bounded research/review/creative records; 327 remain archive titles with feasibility unassessed. No experimental validation or independent full-source rerun was performed. Source groups now describe provenance rather than maturity; archive-only limitations and reference accessibility are explicit. SKEPTIC-1 is categorized under physics/engineering. [Full disposition register and priority source questions](COLLECTION-REVIEW.md).

## Open questions

- LANTEX-24/LANTEX-PRO and Lanternfly Collector v0.2 are related material; exact version lineage remains unresolved. Archived design-review approval labels are not experimental validation.

- Many catalog entries still need their primary source, exact version, contributor history and evidence reviewed.
- RAVEN-P1’s public repository still describes missing reproduction materials.
- HIPPO remains a purpose-level public introduction; unpublished engineering details remain private.
- Computational checks, AI review, measured hardware results and clinical evidence must remain distinct.
- A GitHub source update does not by itself verify that GitHub Pages has finished serving the new version.

## Suggested next brick

Continue with a bounded source-link check for CRUCIBLE, ECHO-M and BRIDLE-3. Record missing files, redirects and access barriers separately from scientific evidence quality. The first 12-target spot-check is recorded above.

After each batch, update this snapshot when its counts, status or proposed next step change. Check the actual source rather than treating an old snapshot as current.

## Resume map

| File | Purpose |
| --- | --- |
| index.html | Page structure, styles, navigation and catalog filtering |
| catalog.js | Recovered inventory and generated cards |
| registry.js | Published project records and read-only record dialog |
| WORKBENCH.md | Dated handoff, known limits and next step |

[Source history](https://github.com/RayPeloquin/mimirs-well/commits/main/) · [Visitor log](https://github.com/RayPeloquin/mimirs-well/issues/1)

We do no harm.
