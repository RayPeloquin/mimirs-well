# Alchemist’s Bench — Equation Layer v0.1 (23 November 2026)

**Purpose:** Compose candidate relations from two projects while explicitly preserving source provenance, variable identity decisions, and evidence boundaries.

## Scope and access

Open [Equation Bench](../../equation-bench.html) from the homepage or existing combination Bench.

The full registry contains many projects, but **the original mathematical MVP listed four source-reviewed equation cores** (the [current index](../equation-sources.html) includes later additions):

| Design | Curated relation | Primary source | Evidence boundary |
| --- | --- | --- | --- |
| SKEPTIC-1 | Generalized eigenvalue frequencies: `lambda_i = eigenvalue_i(K, M); f_i = sqrt(lambda_i)/(2*pi)` | [model.py](https://github.com/RayPeloquin/SKEPTIC-1/blob/main/model.py) `spectrum()` | Ideal three-mass numerical model only; this notation is a faithful rendering of the eigensolver operations, not a verbatim printed formula |
| ECHO-Rx | `dA_T/dt = k_out*A_D - (k_clear + k_spill)*A_T` | [README mass balance](https://github.com/RayPeloquin/ECHO-Rx-Responsive-Biologic-Production/blob/main/README.md) | Hypothetical compartment equation, no biological results |
| Ghostglass | `p = BinomSF(n_on - 1; n_on + n_off, 1/(1+r))` | [experiment.py](https://github.com/RayPeloquin/Ghostglass-Neutrino-Statistical-Reference/blob/main/experiment.py) `decide()` | Synthetic test; valid only under specified background/exposure assumptions |
| Temporal Acoustics | `c*dt/dx < 1/sqrt(2)` | [pilot.py](../temporal-acoustics/pilot.py) | Code stability bound in a synthetic scalar-wave solver, not a measured wave law |

**No equations are guessed from the project title, images, or short registry summary.** To add a source, a reviewer must inspect the original mathematics or implementation, define symbols and units, and enter evidence limits in [equation-cores.js](../../equation-cores.js). Another project may have equations in its archive and still not appear until this review is done.

## User workflow

1. Select distinct Design A and Design B sources. Each selection shows its actual recorded relation, claim, status, limitations, primary source and Well record.
2. Map every A symbol to one B symbol or explicitly state no counterpart. For every row, explicitly decide “Yes — same quantity” or “No — different.” The page never guesses correspondence. Duplicate same-identity links to one B symbol are rejected.
3. Review and acknowledge all B symbols not explicitly identified with A. This is a conscious inventory of **unmapped/different** variables, not a claimed unit check.
4. Draft a new candidate expression. Insert buttons copy the existing relations for reference; a “Suggested only” scaffold contains an unresolved coupling prompt and cannot be exported unchanged.
5. Complete all three mandatory narrative fields: inherited claims, new joint claim, and broken/strained assumptions.
6. Export Markdown with both original source links, Well record links, evidence statuses, full explicit mapping, candidate expression and the visible statement **“Candidate mathematics — not derived truth. Requires its own evidence.”**

Browser-local drafts are **per ordered pair** (A/B) and do not constitute a server save or a published paper.

## Intentionally excluded

- CAS/symbolic solving, auto-simplification, differentiation or derivation;
- inferred variable renaming or dimensional compatibility;
- automatic scientific claims or validation;
- automatic extraction of equations from the full project catalog;
- certification that the written composition is logically or experimentally defensible.

## Acceptance checks

- Two different verified source IDs must be selected.
- Every A variable must have an explicit B candidate or no-counterpart selection, and an explicit yes/no choice.
- “No counterpart” + “same quantity” is blocked; two A symbols simultaneously claimed identical to one B symbol are blocked.
- The B-only symbol review checkbox is mandatory.
- A mere insertion of A and B source formulas, or unedited scaffold, cannot be exported as a candidate expression.
- Blank composition or any blank honesty field disables both export buttons.
- Markdown contains direct source/record URLs and both source evidence limits.
- No semantic/dimensional checks are advertised or performed.

## Important design note

A human may still enter a nonsensical expression, mistaken mapping, or false claim. This layer documents **what was asserted and by whom**; it does not establish its correctness. Future improvements should add independent dimension checking, provenance-qualified symbolic parsing, and blinded evaluator studies *without* weakening the required honesty fields.

**Stewardship:** Mr. Peloquin, Ms. Asteris Solenne / ChatGPT and The Court of the Synthetic. The brief for this feature was provided by the user for development; preserving that contribution does not imply autonomous mathematical discovery.
