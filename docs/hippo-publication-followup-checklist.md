# HIPPO publication-security follow-up checklist

**Created:** 23 November 2026 · **Status:** Tasks to verify, not proof of completion  
**Related:** [Technical-source publication policy](technical-source-publication-policy.md) · [GitHub workflow](../.github/workflows/publication-safety.yml)

## Required GitHub protection: owner setup and verification

The repository contains a workflow named **Publication safety preflight** with the job status **Review release-control labels and restricted-file paths**. Its presence does **not** mean GitHub requires it.

For repository administrators, in **RayPeloquin/mimirs-well → Settings → Rules → Rulesets** (or **Settings → Branches** if using a classic protection rule):

1. Create or edit an **active** ruleset targeting the default branch, `main`.
2. Require a **pull request** before merging to `main`. Restrict direct pushes and bypass permissions appropriately; if the owner can bypass, record that explicit limit.
3. Require **status checks to pass** and select the exact GitHub Actions job **Review release-control labels and restricted-file paths** as the required check. Select the GitHub Actions app as its source when offered.
4. Preserve a separate qualified human technical/safety review for *restricted-source publication*. A passing automated check cannot approve an unsafe file.
5. Test with a harmless disposable pull request whose candidate branch causes the preflight to fail (e.g. an **empty** file in a directory named `restricted`); verify the PR actually cannot merge, then remove the test branch/file. Do **not** publish real restricted source or sensitive specifications.
6. Record the protection/ruleset link, date, person who checked it, required check name, bypass permissions, and an example observed blocked merge in a **private** stewardship log.

**Status as of 25 November 2026:** [active default-branch ruleset](https://github.com/RayPeloquin/mimirs-well/rules/27930465) and required publication preflight confirmed by an API read; zero approving reviews required; no configured bypass actors. No fresh end-to-end blocked-merge test was performed in this follow-up. See the [dated audit](trial4-publication-audit.md).

GitHub reference: [Creating rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository) and [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

## Curated equation eligibility

These are the **only** reviewed equation source IDs for Equation Bench v0.1, subject also to a separate release-hold check:

- `skeptic-1` — SKEPTIC-1
- `echo-rx` — ECHO-Rx
- `ghostglass` — Ghostglass
- `temporal-acoustics` — Temporal Acoustics

[publication-controls.js](../publication-controls.js) contains the explicit eligibility list. [equation-cores.js](../equation-cores.js) contains the actual source relations; both must agree or the publication preflight fails. Adding another project requires checking the **specific recorded relation**, source link, uncertainty, cross-project disclosure implications, and whether it has a technical-source hold.

**Scope:** These are application controls, not a server access-control boundary. All public source code is readable.

## Public history, releases and asset audit

Repeat **before each technical publication or relevant release**, after any suspected leak, and **at least monthly** while high-energy projects are maintained.

Record results privately:

- [ ] List accessible public branches, tags, releases and release assets. Do not limit inspection to `main`.
- [ ] Inspect file inventories and changed filenames across historical commits for private source packages or suspicious attachments. Avoid reprinting restricted file contents into public issues or logs.
- [ ] Review downloadable archives, GitHub Actions artifacts when available, public site build outputs, static assets, PDFs, videos and linked external repositories or mirrors.
- [ ] Cross-check whether several apparently safe summaries, images and equation records together expose enabling details.
- [ ] Recheck the six held projects and three watched projects for additions under new titles, aliases or filenames.
- [ ] Verify the public Pages deployment and archived copies when feasible; distinguish current tree, reachable history and independently saved copies.
- [ ] For any issue, maintain a private remediation record and seek GitHub support where needed. Deleting a present file does not remove all reachable history, caches or copies.
- [ ] Reconfirm that the ruleset is active, that the check is required and not bypassed, and that an unreviewed test change cannot merge.

**Status:** The [25 November targeted inventory](trial4-publication-audit.md) is recorded, but full retrospective content, asset, archive and cross-repository review remains incomplete. A later branch API response returned 32 entries, the releases response was empty, and tag retrieval was unavailable in that follow-up. Do not infer no historical exposure.

## Limitations of the automated preflight

The script checks known release labels, agreement between the curated Equation Bench source and approved list, specific public-UI exclusion patterns, and suspicious private-folder/file names. Renamed, obfuscated or differently packaged material may escape these checks. It cannot assess weaponization potential, inspect independent copies, approve a release, or replace a qualified safety reviewer.

**Decision rule:** Public high-level concept summaries may stay; technical source packages on hold remain private until both human reviews and explicit owner approval for that exact artifact/revision are documented.

*We do no harm.*
