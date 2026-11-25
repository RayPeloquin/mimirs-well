# Publication stewardship audit ? 25 November 2026

Baseline main: `1c8e068a511505b493d16383a44d071005387a07`.

- GitHub API: ruleset 27930465 active on default branch; no bypass actors configured; requires PR and strict status check "Review release-control labels and restricted-file paths"; prohibits non-fast-forward and deletion. Required approving-review count is zero. Browser and link checks passed on PR 21 but are not listed as mandatory by this ruleset. Pages source main, root, legacy build, built.
- Fresh read-only mirror: 19 heads, 20 pull refs, 367 reachable commits; 49 historical object-path hits matching HIPPO, Sound Bus, Quantum Shepherd or Dragon's Bridle. Hits include public summaries, generated records, a tabletop illustration and review notes. Names alone are not evidence of exposure. Zero tags and zero releases returned; API reported zero forks at the time.
- Known private-only artwork: 14 exact original blob IDs checked against the reachable object inventory, zero matches. This covers the three dated private-artwork recovery batches for which private-only entries were found, not every local private source.
- Live deployment: 14 requested public responses matched baseline local bytes; all 364 catalog records had 19 fields, catalog SHA-256 matched manifest, Traveler caveat and six homepage entrances present.
- No test PR containing restricted material was created, no branch settings changed, no files removed, no history rewritten. Independent review of named candidates, unrelated filenames, modified images, binary/archive contents, sibling repositories, cached artifacts and nonadvertised/unreachable objects remains open. Repository settings can change; this is a dated observation, not a guarantee. A full JSON Schema validator has not been run.
- A separate regression receipt records an observed local run, not a scientific reproduction or external CI attestation.

Do not publish private source files to test access controls. Use harmless synthetic fixtures for negative testing. We do no harm.
