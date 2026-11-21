# Mimir’s Well

**Where the source gathers.** A public collection of research ideas, computational studies, engineering proposals, creative work, and review methods by Mr. Peloquin and the Synthetic Court.

**Guiding principle:** We do no harm.

**[Explore Mimir’s Well](https://raypeloquin.github.io/mimirs-well/)** · **[Divergence Ledger](https://raypeloquin.github.io/mimirs-well/#divergence-ledger)** · **[Workbench](https://raypeloquin.github.io/mimirs-well/#workbench)** · **[Legal & Rights](https://raypeloquin.github.io/mimirs-well/legal.html)**

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

The [Divergence Ledger](https://raypeloquin.github.io/mimirs-well/#divergence-ledger) asks three questions of a project: **What did we intend? What actually happened? What else might this be useful for?** The first seven public pilots include KA PATCH, SKEPTIC-1, Temporal Acoustics, Ghostglass, RAVEN-P1, CRUCIBLE and BRIDLE-3.

## Finding the source

- `index.html`: main site and project collection.
- `catalog.js`: recovered title inventory and project cards.
- `registry.js`: read-only expanded project records and provenance.
- `well-gallery.js`, `gallery.css`, `assets/`: project artwork with captions and alt text.
- `research/`, `design-notes/`, `public-notes/`: published research, bounded design summaries and source pointers.
- `WORKBENCH.md`: handoff notes and historical maintenance snapshots.
- `COLLECTION-REVIEW.md`: historical review of catalog scope and evidence boundaries.
- `*-divergence-ledger.html`: project-specific three-question records.

Not all original sources are public. Some archive entries refer to private material or another project repository. The website is **read-only** to visitors; the [visitor log](https://raypeloquin.github.io/mimirs-well/#visitor-log) is hosted separately on GitHub.

## Audited source snapshot

The [20 November 2026 collection and link audit](docs/source-and-collection-audit-2026-11-20.md) recorded **384 distinct project cards** and **152 expanded source-backed records** before the separate GO-CUBE and Court Governance Stack cards were added. The current source contains **386 distinct project cards** and the same **152 expanded source-backed records**. It confirms 64 internal source-reference paths/occurrences and a sample of outside links, while distinguishing publisher access barriers from genuinely missing targets. These are dated source counts, **not** live scientific maturity indicators.

## Maintenance and checks

This is a static GitHub Pages site. Published tests include Node.js `*.test.cjs` checks for selected HTML, gallery, public-title and research-page behaviors. Run them in a local checkout with Node.js:

```sh
node --test *.test.cjs
```

Tests verify only their stated checks. They do not substitute for a full browser accessibility audit, independent scientific replication, medical review, or hardware safety certification.

The collection is iterative. Prior conclusions, failed controls, and changed interpretations belong in the historical record rather than being silently polished away.
