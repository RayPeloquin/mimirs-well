# Mimir’s Well

**Where the source gathers.** A public collection of research ideas, computational studies, engineering proposals, creative work, and review methods by Mr. Peloquin and the Synthetic Court.

**Guiding principle:** We do no harm.

**[Explore Mimir’s Well](https://raypeloquin.github.io/mimirs-well/)** · **[Divergence Ledger Library](https://raypeloquin.github.io/mimirs-well/ledger.html)** · **[Workbench](https://raypeloquin.github.io/mimirs-well/#workbench)** · **[Legal & Rights](https://raypeloquin.github.io/mimirs-well/legal.html)**

The Ledger is a separate directory, **not one record per project**. A new entry requires a documented change, measurement, revised assumption or explicitly hypothetical crossover. The existing project Registry remains the full inventory.

## Offering to the Gods of Technology

The homepage uses a coin-and-ripple visual with the playful title **“An Offering to the Gods of Technology”**. It has a discreet, entirely voluntary [Support the Well](https://raypeloquin.github.io/mimirs-well/#offerings) invitation. The button opens Stripe Checkout for a one-time tip in USD. Readers choose the amount. The archive remains free to everyone. A tip confers no ownership, special access or promised research outcome. The website claims no charitable tax-deductible status.

## Optional soundscape

The homepage includes a quietly mixed, original procedural soundscape: occasional water droplets with a restrained echo, filtered cavern air and low stone-like resonance. It uses the browser's Web Audio API and no recorded/audio assets, autoplay, cookies or telemetry. It **always starts off**. Visitors may explicitly press **Listen to the Well**, adjust volume, or **Silence the Well**. Playback also stops if they leave or hide the tab. The rest of the site works normally when audio is unsupported or disabled. Source: `well-ambience.js`.

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

## Finding the source

- `index.html`: main site and project collection.
- `catalog.js`: recovered title inventory and project cards.
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

The [20 November 2026 collection and link audit](docs/source-and-collection-audit-2026-11-20.md) recorded **384 distinct project cards** and **152 expanded source-backed records** before the separate GO-CUBE and Court Governance Stack cards were added. The current source contains **358 project cards with 358 distinct titles** and **173 expanded source-backed records**; **185** await expanded source review. The duplicate recovered-catalog title for Temporal Reflection Chamber was retired; its featured project card, source link, expanded Registry record and cutaway artwork remain in place. It confirms 64 internal source-reference paths/occurrences and a sample of outside links, while distinguishing publisher access barriers from genuinely missing targets. These are dated source counts, **not** live scientific maturity indicators.

## Maintenance and checks

This is a static GitHub Pages site. Published tests include Node.js `*.test.cjs` checks for selected HTML, gallery, public-title and research-page behaviors. Run them in a local checkout with Node.js:

```sh
node --test *.test.cjs
```

Tests verify only their stated checks. They do not substitute for a full browser accessibility audit, independent scientific replication, medical review, or hardware safety certification.

The collection is iterative. Prior conclusions, failed controls, and changed interpretations belong in the historical record rather than being silently polished away.
