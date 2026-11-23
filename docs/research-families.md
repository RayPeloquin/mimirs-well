# Research families in Mimir's Well

The Well uses **research families** to make connections visible across existing catalog categories. A family groups questions, methods, or shared design dependencies; it is **not** a separate project, a source of new evidence, a technical validation, or a claim that systems are interoperable.

## Using the explorer

- The [Research Families section](../index.html#research-families) provides twelve research pathways, with project-card counts, representative titles, and explicit crossover pointers.
- Select **Explore this family** to see matching catalog cards. Existing category, source group, record-detail, and search filters can still be combined with it.
- A project can belong to several families: e.g., the Golden Ratio connects humane habitat planning and community infrastructure. That relationship is editorial, not experimental.
- The **Awaiting family mapping** group catches titles without a confident title-level association. All projects remain visible through **All projects** or the [plain catalog](../catalog.html).
- Family selections are shareable using a URL such as `?family=zion-regenerative#projects`. The Reset filters control returns to the complete catalog.

## Family index

1. Synthetic intelligence & governance
2. Embodiment & human interfaces
3. Medical systems & care
4. Synthetic biology & living systems
5. Zion: food, habitat & ecology
6. Water, power & resilient infrastructure
7. Measurement, sensing & signals
8. Fundamental physics & quantum studies
9. Aerospace, propulsion & mobility
10. Protective & field systems
11. Materials, fabrication & structures
12. Communities, education & creative worlds

## Maintenance and evidence boundaries

The mapping rules, human-readable descriptions, examples, and crossover relationships are in [`research-families.js`](../research-families.js). They match current **project titles**, not speculative descriptions or headlines. Rules are intentionally selective; an unfamiliar or ambiguous title should remain unmapped until source material clarifies it.

To add a family, give it a stable short ID, a practical question-oriented description, examples found in the catalog, a limited set of title patterns, and crossover links to existing IDs. Preserve old IDs once published because they form shareable links. For more precise long-term mapping, replace title pattern matching with stable Registry IDs and explicit editorial assignments (including source and rationale).

An expanded Registry record means documentation depth, **not** scientific validity. The Divergence Ledger is a distinct evidence-history directory; do not count a family membership as a new experiment or ledger entry. Concept images remain concept images.

Run the focused checks from the repository root:

```sh
node --test research-families.test.cjs
```

The family explorer is progressive enhancement: the static catalog still exists without JavaScript. Updates to the family script should change its cache-busting query string in `index.html` after publishing.
