# Court Case Study 002 — Ghostglass × Chihuahua Sphere

**Status:** Proposed crossover and experiment — not built, run, or validated  
**Recorded:** 23 November 2026  
**Origin:** Grok's second Alchemist's Bench test  
**Credit:** Grok identified the unexpected pairing and drafted the initial two-condition proposal. Asteris Solenne / ChatGPT proposed a third conventional-QC comparator, independent measurement requirement, and uncertainty-aware decision rule. Mr. Peloquin directed and authorized the Court research workflow.

## Parent designs and evidence

- **[Ghostglass](../../index.html#design/ghostglass)** — A synthetic on/off statistical reference with a committed software test record (**15 software tests passed**, not 15 optical experiments). Numerical false-alert and injected-signal behavior is documented under model assumptions. No physical detector validation.
- **[Chihuahua Sphere / CS-1](../../index.html#design/chihuahua-sphere-cs-1)** — Calculation-only optical/energy bookkeeping proposal, emphasizing that electrical source input, emitted optical energy, path losses, and receiver energy are *not* interchangeable or additive outputs. No built apparatus or verified collection efficiency.

The combination transfers an **accounting discipline**, not validated performance of a new photonic device.

## Proposed crossover

**Question:** Does a separately measured, uncertainty-aware optical energy ledger improve the rejection or review of false on/off detections, above a statistical test alone **and** above conventional instrument quality controls?

The novel *candidate* is the workflow integration, not a claim of new conservation physics or a new statistical test.

## Important scientific constraints

1. **Independence of evidence:** Do not construct the "expected received energy" solely from the detector count stream being checked. Use independently calibrated source output and path characterization, plus a defensible detector calibration. Otherwise the ledger is circular.
2. **Keep separate accounts:** Record source electrical input, emitted optical energy, measured or bounded light losses, receiver incident optical energy, and detector response as distinct quantities. Convert counts to optical energy only with a justified wavelength, detector efficiency, gain and uncertainty model. Electrical input cannot simply be treated as optical output.
3. **Uncertainty-aware closure:** Source-to-receiver conservation is a model with finite collection geometry, scatter, reflections, thermal effects, unmeasured paths and calibration error. Define an allowed residual or credible bounds *before* testing. An apparent mismatch flags a result for investigation; it does **not**, by itself, prove a detection is an artifact.
4. **Non-redundancy:** A generic light-loss budget may be too loose to detect weak-signal false positives. Evaluate whether the second measurement actually adds discriminating power beyond ordinary dark, drift, gain and contamination checks.
5. **Separation of statistical questions:** A statistically significant on/off difference can still reflect stray light or apparatus changes rather than the intended target signal. Conversely, a legitimate weak target signal need not provide a directly measurable absolute energy residual.

## Three conditions

| Arm | Procedure | Purpose |
| --- | --- | --- |
| **A — Statistics only** | Pre-registered Ghostglass-style on/off test with required basic detector safety and operation checks | Baseline false-positive and true-positive rates |
| **B — Independent dual ledger** | Exactly the same on/off test plus separately measured source optical output, path-loss/throughput bounds and detector/receiver accounting with an uncertainty-aware discrepancy flag | Does an energy-consistency check add useful information? |
| **C — Conventional quality controls** | Same on/off test plus calibrated standard detector QC (dark counts, gain checks, reference monitoring, drift/leakage checks), without an explicit dual-ledger closure rule | Does B outperform ordinary good experimental practice? |

All arms receive the same raw optical trials, with fixed, independently tuned thresholds and no outcome-dependent retuning. Blind the analysts to the hidden trial labels where feasible.

## Practical experiment proposal

- Start with a safe, low-power, wavelength-characterized source, controlled attenuators/occluders, power/reference photodiode or independent optical power reference, detector, ambient/temperature logging and calibrated geometry. Observe applicable laser/LED safety practices.
- Include verified **known-null target** trials, controlled false-cue artifacts (e.g. deliberate source leakage, path scattering or sensor drift), and independently injected positive-target signals. Explicitly distinguish source-on background light from the target signal under test.
- Establish ground truth and randomization in advance, and pre-register the scope of hypotheses, per-family alpha, analysis rule, quality-gate/veto logic, uncertainty bands, minimum meaningful change, and sample size/power rationale.
- Keep numerical simulation separate from physical optical trials. Confirm the Ghostglass assumptions (on/off exposure, rate stationarity and count model) or evaluate departures as stress tests rather than assuming they hold.
- Record each arm's flag/accept decisions, false alarms for known-null trials, detection sensitivity on injected positives, uncertainty-calibrated energy residuals, abstention/inconclusive rate, additional equipment time and analysis burden.
- Analyze B versus A **and** B versus C at **matched sensitivity**, or report sensitivity/false-positive tradeoff curves. A quality gate that rejects everything achieves zero false alarms and is not a success.
- Predefine inconclusive outcomes; a ledger mismatch alone should trigger review, not automatic dismissal of a potentially genuine measurement.

## Pass/fail interpretation

**Potentially useful:** B yields a pre-specified, statistically and practically meaningful false-positive reduction on known-null trials versus both A and C at comparable true-positive sensitivity, without unacceptable increases in inconclusive flags or cost.

**Not distinctive:** B improves on A but not C, so conventional quality checks explain most or all improvement.

**Unsupported or inconclusive:** No meaningful improvement, benefits disappearing on blinded data, or uncertainty too broad to tell. Report all, including failures.

## Limitations

No joint test, optical apparatus, physically validated Ghostglass detector, or demonstrated energy-ledger advantage currently exists. The Chihuahua Sphere's original energy-accounting example is a calculation, not a precision radiometry calibration. Standard optical metrology and quality control already cover parts of this workflow; a prior-art and instrumentation review is required before suggesting novelty.

## Grok's bench findings

Grok identified the shared theme of avoiding self-deception across two otherwise unrelated designs. The Alchemist's Bench supplied the contribution/needs structure and a falsifiable test-brief form; it **did not autonomously identify the pairing**.

Grok's initial verdict: not worth building as a full system yet; possibly worth a small controlled optical null-test. This revised protocol adds the conventional-QC comparator and independent measurement requirement.

**Evidence label:** Hypothesis / proposed experiment. No experimental confirmation.
