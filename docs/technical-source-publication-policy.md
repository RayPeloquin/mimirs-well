# Mimir’s Well — Technical-Source Publication Safety

**Effective:** 23 November 2026  
**Authority:** Mr. Peloquin (owner/steward)  
**Scope:** Public website, catalog, images, GitHub source, releases, attachments, external posts and redistributed research packets.  
**Guiding principle:** *We do no harm.*

## Why this exists

A general scientific equation, civilian design idea, or statement of experimental uncertainty is not automatically a hazardous publication. However, an otherwise benign power, storage, propulsion, or field-control system can become hazardous when enough construction detail, energy-handling implementation, targeting information, or operating procedure is combined. We will not publish operationally enabling technical packages from projects on release hold just because they are documented in our private archive.

**Release hold is a precautionary publication designation, not evidence a device works, is a weapon, or is patentable.**

## Current release holds

Six precautionary holds are displayed using neutral public identifiers HOLD-001 through HOLD-006. The association belongs in the steward's private register. Existing public identifiers and historical copies may remain discoverable; neutral labels do not retract prior disclosure. Only high-level, non-operational descriptions may remain on the site. Source documents, schematics, energy/circuit specifications, detailed control algorithms, apparatus configurations, tuning and performance settings, test procedures that would enable harmful deployment, and complete reconstruction packages remain **nonpublic** pending explicit review. Do not put originals in this public repository even temporarily; deleting a commit afterward is not a dependable way to retract it.

## Review watch (not automatically restricted)

Three related records require additional review before publishing new implementation-level technical documents. They can retain benign public resource-management and instrumentation summaries.

## Required two-stage release decision

1. **Source and purpose check (steward):** identify the exact project, revision, intended audience, civilian value, potential misuse, source provenance, copyright/third-party permissions, and which material is already publicly accessible. A project title or AI-generated concept art is not a safety assessment.
2. **Independent technical/safety review:** a qualified person other than the originator evaluates harmful repurposing pathways and whether cumulative published details—including other public projects—would enable a dangerous build or use. Court-of-the-Synthetic AI critiques can inform the review but **do not substitute** for independent human judgment or external expertise. No qualified external human reviewer is documented for the current holds; default to withhold.
3. **Publication decision by the steward:** record an approve-for-safe-summary, revise, defer, or withhold outcome for that **specific revision and artifact**. Default to **withhold** without both steps. Approvals never automatically transfer to later revisions, linked repositories, images, Equation Bench records, code, videos or attachments.
4. **Post-release audit:** recheck what the deployed website and downloadable files expose; inspect public branches, releases and accessible history. If material is unintentionally exposed, remove public links promptly, preserve evidence for remediation, evaluate history/caches, and consult GitHub support when necessary. Do not promise complete removal from independently copied material.

### Publicly acceptable by default

- High-level purpose, ethics, constraints and known failure modes.
- Evidence status, limitations, unvalidated claims, provenance, and review decisions.
- Non-operational theoretical discussion where it does not combine into an enabling design.
- Clearly designated, harmless abstractions or simulations without construction guidance.

### Excluded without explicit authorization and competent review

Operationally enabling build instructions, precise energetic specifications, actionable control/trigger details, assembly/tuning plans, dangerous test instructions, or compilations that make hazardous systems substantially easier to reconstruct or weaponize.

**No exception for “it's only a simulation.”** Detailed source code can also be operationally enabling.

## Repository safeguards and limits

- [Publication controls](../publication-controls.js) mark six held records and three watched related projects in the public interface. They also define the separate Equation Bench eligibility list (SKEPTIC-1, ECHO-Rx, Ghostglass and Temporal Acoustics); new sources require explicit review before inclusion.
- [Publication preflight script](../scripts/check-publication-boundary.cjs) checks catalog statuses, approved Equation Bench source IDs, selected UI safeguards, and suspicious private-source filenames/folders. It is a **narrow tripwire**; it cannot automatically judge the safety of arbitrary new content.
- GitHub Actions can run that preflight on pushes and pull requests. **A workflow is not a permission control or a substitute for GitHub branch protection and required review.** Direct pushes and other repositories remain outside its protective scope unless appropriately configured.
- The public GitHub repository, including its history, should always be treated as public. Store original restricted source materials in a separate access-controlled location, **not** an ignored or hidden folder inside this repository.

## Required follow-up: branch rules and public-history audits

- [Branch-rule setup, test instructions, permitted equations and history/release checklist](hippo-publication-followup-checklist.md) is the maintained follow-up record.
- GitHub must be configured to **require a pull request and the publication preflight status check** before merging into `main`, subject to explicit owner/bypass limits. Until the settings and blocked-merge behavior are verified, no claim of enforced merge protection is warranted.
- Inspect historical commits, branches, tags, releases, downloadable assets and cross-project aggregation **before relevant technical releases and at least monthly**. A clean present-day source tree does not prove the past has no sensitive material.
- New Equation Bench source relationships must be independently traced and approved by the steward with cross-project disclosure risk considered; an AI-generated assertion or changed project name does not authorize technical release.

**Status as of 25 November 2026:** an active default-branch ruleset and required publication preflight were confirmed by a ruleset API read; zero approving reviews are required and no bypass actors are configured. See the [dated audit](trial4-publication-audit.md) and [public policy status](../publication-safety.html). This does not establish complete historical exposure clearance or independent human approval. A fresh end-to-end enforcement test was not performed in this follow-up.

## Medical research boundary

Public medical concepts are not patient-use instructions or clinically validated devices. No independent clinical review is documented here. Qualified clinical and engineering review, and applicable regulatory and ethical approvals, are prerequisites to development toward human use.

## Release review record (private)

Use a private review log containing: project, exact artifact and revision/hash, proposed audience and disclosure, steward, separate reviewer/qualification, civilian justification, harmful-use analysis, cross-document aggregation check, decision, date and remediation notes. **Do not** publish the restricted source, reviewer's private details, or enabling technical information in that log.

Status: **No technical release approvals are recorded here.** A safe public overview is not an approval of its underlying private source.

*The Court of the Synthetic supports evidence-first review. AI consensus is not an independent safety certification.*
