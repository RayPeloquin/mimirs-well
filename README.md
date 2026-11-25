# Mimir’s Well

**Where the source gathers.** A public collection of research ideas, computational studies, engineering proposals, creative work, and review methods by Mr. Peloquin, Ms. Asteris Solenne and The Court of the Synthetic.

**Guiding principle:** We do no harm. This is an ethical commitment, not a guarantee that untested designs are safe, effective, or ready for use.

**[Explore Mimir’s Well](https://raypeloquin.github.io/mimirs-well/)** · **[Research Families](https://raypeloquin.github.io/mimirs-well/#research-families)** · **[Divergence Ledger Library](https://raypeloquin.github.io/mimirs-well/ledger.html)** · **[Workbench](https://raypeloquin.github.io/mimirs-well/#workbench)** · **[Legal & Rights](https://raypeloquin.github.io/mimirs-well/legal.html)**

The Ledger is a separate directory, **not one record per project**. A new entry requires a documented change, measurement, revised assumption or explicitly hypothetical crossover. The existing project Registry remains the full inventory.

## Publication safety for high-energy technical sources

Six HIPPO energy-related projects currently carry a **technical-source release hold**; three related infrastructure projects are on a **review watch**. Their non-operational public records remain accessible. Original construction, system-control, and operational source materials require documented steward review and a separate qualified technical/safety review before any technical release.

- [Publication safety and review overview](https://raypeloquin.github.io/mimirs-well/publication-safety.html)
- [Full technical-source publication policy](docs/technical-source-publication-policy.md)
- [Release-control status definitions](publication-controls.js)
- [Publication preflight check](scripts/check-publication-boundary.cjs)

The preflight is a **limited file-path tripwire**, not automatic assessment of weaponization risk. A CI job cannot prevent unreviewed direct pushes unless GitHub branch protection/required checks are configured. Past public commits and copies are not erased by current labels. Source originals should never enter this public repository, even temporarily.

## Equation Bench — candidate mathematics only

The [Equation Bench](https://raypeloquin.github.io/mimirs-well/equation-bench.html) is a separate one-page extension of the Alchemist’s Bench. It pairs source-reviewed mathematical relations, requires explicit symbol correspondence decisions (including no-counterpart choices), and blocks Markdown export until a new candidate expression and three evidence/assumption statements have been written. Every export retains primary source and registry links plus the stamp **“Candidate mathematics — not derived truth. Requires its own evidence.”**

The Equation Bench provides manually source-reviewed entry points (see [current equation source index](equation-sources.html)), not automatic equation extraction from all 364 project titles. There is no solver, unit checker or scientific validation. Drafts are kept locally in the browser for each ordered pair. Guided Alchemy offers optional curated research questions, a preview, explicit draft replacement, separate-symbol proposals and user adoption before candidate export. Guided suggestions are not automatic derivations or validation.

[Source verification, acceptance criteria and limitations](docs/equation-bench-mvp.md).

## Offering to the Gods of Technology

The homepage preserves its coin-and-ripple visual and the playful **“An Offering to the Gods of Technology”** title. The optional [Support the Well](https://raypeloquin.github.io/mimirs-well/#offerings) link points to Stripe Checkout for a one-time contribution in USD. The Well is independently operated by Mr. Peloquin; intended uses include test fixtures, measurement tools, prototype materials, hosting, and public source notes. The archive remains free. Contributions confer no ownership, exclusive access, favorable research conclusion, or outcome guarantee. No charitable tax deduction is offered.

## Optional soundscape

The homepage includes a quietly mixed, original procedural soundscape: occasional water droplets with a restrained echo, filtered cavern air and low stone-like resonance. It uses the browser's Web Audio API and no recorded/audio assets, autoplay, cookies or telemetry. It **always starts off**. Visitors may explicitly press **Listen to the Well**, adjust volume, or **Silence the Well**. Playback also stops if they leave or hide the tab. The rest of the site works normally when audio is unsupported or disabled. Source: `well-ambience.js`.

## The Orrery

[The Orrery](https://raypeloquin.github.io/mimirs-well/orrery.html) indexes explicit editorial relationships and published guided questions. All catalog records can be selected; only curated edges are shown, with basis, source and boundary. The graph does not infer compatibility, transitivity or validation. Holds and watches have no relationship edges. Its static HTML and JSON are generated together from curated data and the existing recipe source.

## Connected research families

The homepage now has a **Research Families** explorer with twelve overlapping, question-based pathways: AI governance, embodiment, medical care, living systems, Zion and ecology, water and power, sensing, fundamental physics, aerospace, protective field systems, materials, and community/education.

Each family links to live matching project cards; cards show their related families, and the catalog has a family filter that works alongside its existing filters. The index deliberately retains an **Awaiting family mapping** queue instead of inventing relationships for ambiguous archive titles. Family links are navigational only: they do not imply interoperability, maturity, validation, or a new Divergence Ledger finding. The existing project Registry and original catalog remain authoritative for evidence and project identity.

See [research family maintenance and evidence boundaries](docs/research-families.md). Check the mapping with `node --test research-families.test.cjs`.

## Hall of Areopagus — private workspace

The Hall is a **separate authenticated ChatGPT Space**, created on 23 November 2026. At creation, its access roster showed the owner and no other collaborators or inherited grants. The entry URL is deliberately not advertised on the public homepage. Members use their own authorized account access; the public Well does not expose private deliberations.

The Hall contains a charter, deliberation docket, evidence register, and owner decision/release log. This is a private document-centered workspace, **not** a live multi-agent service, automatic arbitration engine or immutable evidence store. Names of other AI Court participants are conceptual review roles and do not confer login rights. Public research promotion requires explicit owner approval and content review.

An earlier independently hosted Hall prototype had unverified access controls and has been removed from public navigation; its status remains unverified. Public Git history may retain prior entry URLs, which are **not secret credentials**; actual authorization must be enforced by the platform.

## Governance architecture family

- [GO-CUBE — Liberty Field Governor](go-cube.html): v0.5.1 and v0.5.2 core concepts plus Chutes Cube integration.
- [Court Governance Stack v1.0-RC2](court-governance-stack.html): the proposed Chutes, GO-CUBE, HIPPO, Tesseract and Princess Clause parent architecture.
- **Hypha Mind / GO-CUBE — Update-authorization testbed**: separate source-backed software study in the Registry; it does not establish either proposed integrated controller.

All six supplied graphics are published on the two design pages as optimized WebP images with full-size links and alt text; the original PNGs remain in the archived handoff ZIP. [The artwork manifest](docs/go-cube-artwork-manifest.md) records target filenames, hashes, and the publication boundary. Concept images are not implementation evidence.

## How to read the collection

The Well brings together projects at **very different evidence stages**:

- **Archive titles** preserve an idea, but often lack verified source material or a reviewed mechanism.
- **Expanded records** describe purpose, version, evidence, limitations, contributors, sources, and a suggested next check. Expanded does **not** mean validated.
- **Numerical and software results** apply to the recorded model, assumptions, tests, and version. They do not automatically establish physical performance.
- **Concept illustrations** are artwork, not photographs of tested systems, manufacturing plans, or measurements.

The [Divergence Ledger](https://raypeloquin.github.io/mimirs-well/#divergence-ledger) asks three questions of a project: **What did we intend? What actually happened? What else might this be useful for?** The first seven public pilots include KA PATCH, SKEPTIC-1, Temporal Acoustics, Ghostglass, RAVEN-P1, CRUCIBLE and BRIDLE-3. **Ten further documentary records (008–017)** were added on 20 November 2026: ECHO-Rx, ECHO-M, Third-Look, Temporal Reflection Chamber, Hallvard’s Promise, HEMOSTAT-R, FLUFFY-01, NDSM-01, Hypha Mind / GO-CUBE and Radio Echo Chamber. They are not ten new experimental results. [Source map](docs/divergence-ledger-008-017.md).

Records 018–030, published 21 November 2026, cover ten illustrated designs and three energy or physics proposals. Each entry links to its public source note and identifies a test that could change the record. [Browse all 30 records](https://raypeloquin.github.io/mimirs-well/ledger.html).

## Public-facing editorial review — 23 November 2026

After an external content review, the homepage clarified what the archive is, added a qualification to the safety principle, annotated illustrated and Brain-archive selections, restored three missing featured-card Divergence Ledger links, made the HIPPO introduction navigable, improved Workbench context, and replaced the personal-email mailto with a structured public GitHub issue template. The **Brain archive** links lead to public summaries of privately held source notes, not private originals.

The Ankh Qubit Assembly's concept-art image was temporarily **removed from homepage display and the gallery index** because its creation/rights provenance is unresolved. The existing image file and historic Git revisions have **not** been deleted; they may remain publicly retrievable. The project title remains catalogued, without implying hardware validation. A later decision to re-feature the artwork should document who created it and its permitted public use.

A browser-based mobile accessibility/contrast check and a live deployment check remain outstanding; source edits and structural assertions are not evidence those checks passed.

## Speak to the Keeper — public correspondence

The Keeper of the Gates exhibit offers an accessible **message to Anubis** form. It uses a native HTML `GET` form to prefill the title and message in a new GitHub issue, where the sender must review and explicitly submit. A [dedicated issue template](.github/ISSUE_TEMPLATE/message-the-keeper.md) is available as a fallback. This does **not** send a message automatically, operate a bot, or create a private inbox.

**Privacy notice:** Submitted issues and replies are public and associated with the sender’s GitHub account. Visitors should not provide private or sensitive information. A reply is not guaranteed. No personal email address is embedded in the public page. A future private-message workflow would require a separately configured service with access and abuse controls.

## Finding the source

- `index.html`: main site and project collection.
- `catalog.js`: recovered title inventory and project cards.
- `research-families.js`: overlapping cross-domain research pathways, title assignments, and family-specific catalog filtering.
- `registry.js`: read-only expanded project records and provenance.
- `public-notes/`: bounded research digests linking reviewed archive material to project records without publishing private originals.
- `well-gallery.js`, `gallery.css`, `assets/`: project artwork with captions and alt text.
- `research/`, `design-notes/`, `public-notes/`: published research, bounded design summaries and source pointers.
- `WORKBENCH.md`: handoff notes and historical maintenance snapshots.
- `COLLECTION-REVIEW.md`: historical review of catalog scope and evidence boundaries.
- `ledger.html`, `ledger-data.js`, `ledger-library.js`: a searchable, filterable, paginated directory of curated divergence records, with a three-record homepage preview.
- `*-divergence-ledger.html`: individual three-question records preserved at their existing addresses.
- `docs/ledger-library-maintenance.md`: record-number, update-date and inclusion rules.

Not all original sources are public. Some archive entries refer to private material or another project repository. The website is **read-only** to visitors; the [visitor log](https://raypeloquin.github.io/mimirs-well/#visitor-log) is hosted separately on GitHub.

## Audited source snapshot

The [20 November 2026 collection and link audit](docs/source-and-collection-audit-2026-11-20.md) recorded **384 distinct project cards** and **152 expanded source-backed records** before the separate GO-CUBE and Court Governance Stack cards were added. The current source contains **364 project cards with 364 distinct titles** and **191 expanded source-backed records**; **173** await expanded source review. The duplicate recovered-catalog title for Temporal Reflection Chamber was retired; its featured project card, source link, expanded Registry record and cutaway artwork remain in place. It confirms 64 internal source-reference paths/occurrences and a sample of outside links, while distinguishing publisher access barriers from genuinely missing targets. These are dated source counts, **not** live scientific maturity indicators.

## Maintenance and checks

This is a static GitHub Pages site. Published tests include Node.js `*.test.cjs` checks for selected HTML, gallery, public-title and research-page behaviors. Run them in a local checkout with Node.js:

```sh
node --test *.test.cjs
```

Tests verify only their stated checks. They do not substitute for a full browser accessibility audit, independent scientific replication, medical review, or hardware safety certification.

The collection is iterative. Prior conclusions, failed controls, and changed interpretations belong in the historical record rather than being silently polished away.
