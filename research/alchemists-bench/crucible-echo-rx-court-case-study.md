# Court Case 003 — CRUCIBLE × ECHO-Rx

**Status:** Proposed simulation study; not run, validated, or shown to outperform prior art  
**Recorded:** 23 November 2026  
**Origin:** Grok's third unexpected Alchemist's Bench pairing  
**Provenance:** Grok proposed the cross-domain connection, initial A/B comparison, and residual-aware control framing. Asteris Solenne / ChatGPT added independent baseline, explicit prediction horizon, uncertainty and failure-mode criteria. Mr. Peloquin directed the Synthetic Court research workflow.

## Why these designs belong in the same experiment

- **[CRUCIBLE](../../index.html#design/crucible)** tests guarded decisions in *synthetic* rover and quadrotor scenarios. The original rover held-out campaign reports 8/40 rule violations for the legacy controller versus 0/40 for the guarded controller. **That result is not a zero-risk guarantee**: the published 95% Wilson upper confidence bound is 8.8%. The quadrotor campaign reports 31/40 legacy versus 27/40 guarded violations, including one regression. These numerical campaigns are not field validation.
- **[ECHO-Rx](../../index.html#design/echo-rx)** has a *mathematical*, not experimentally confirmed, secretion-shutdown example. Production can stop while an already accumulated reservoir continues affecting downstream concentration. The illustrative loaded-depot normalized two-compartment model has a peak after the stop event; it is not clinical evidence.

**Cross-domain insight:** a controller may comply with every immediate command rule while residual energy, momentum, heat, accumulated release, or delayed actuation pushes its system across a safety constraint later.

The transfer here is conceptual. No biological mechanism is being applied to a vehicle, and neither source has demonstrated the joint controller.

## Hypothesis

A guarded controller whose decisions account for **bounded post-command residual trajectories** will experience fewer *subsequent state-constraint violations* than an immediate-state-only guarded controller, at a tolerable cost in premature restrictions and useful task performance.

The **controller must anticipate residuals before acting**. Waiting until a stop command to begin tracking the tail is too late if the accumulated effect is already unstoppable.

## Basic simulation formulation

Use a deliberately transparent augmented-state toy model as a first step, then adapt to the existing CRUCIBLE scenario interfaces:

```text
r[k+1] = rho*r[k] + beta*u[k] + eta[k]      # persistent residual
x[k+1] = f(x[k], u[k], r[k]) + w[k]          # safety-relevant state
u[k] = 0 does not imply r[k+1] = 0
hard safety: g(x[k]) <= 0 at every evaluated timestep
```

`rho` controls decay (choose values across a pre-registered range); `eta` and `w` represent uncertainty. For the main residual-aware arm, evaluate a horizon `H` and robust uncertainty envelopes `R_j`. A candidate action is allowed only when the projected **reachable** safety-relevant state remains inside constraints across the pre-specified horizon, including after an emergency stop:

```text
for each candidate u:
  propagate x, r and uncertainty for j = 1..H
  if any worst-case g(x[k+j]) > 0: reject or derate u
```

This is a testable *architecture sketch*, **not** a safety proof. A finite horizon misses late tails unless a terminal bound or invariant condition accounts for them.

## Three comparators

| Arm | Controller | Purpose |
| --- | --- | --- |
| **A — Immediate guarded controller** | CRUCIBLE-style rule guard checked on the present state/action. Does not model residual future effects | Establish post-command failure rate of immediate compliance |
| **B — Residual budget + monitor** | Same guard, but with explicit residual state estimate, horizon, uncertainty margins and earlier derating/stop if the projected safety envelope is exceeded | Test the proposed modular residual rule |
| **C — Conventional predictive safety control** | Standard horizon-based predictive controller / predictive safety filter using the **same available delayed/residual dynamics** and uncertainty information, without B's separately auditable “budget” ledger | Test whether B adds value beyond known predictive-control methods |

**Priority comparisons:** B versus A measures benefit from looking ahead. B versus C is necessary before claiming the dedicated residual budget contributes anything distinctive.

## Experimental plan

1. **Ground the base campaigns.** Reproduce or audit the published CRUCIBLE rover and quadrotor checks separately; do not conflate rover's 0/40 with quadrotor performance. Keep baseline traces and version hashes.
2. **Specify delayed dynamics** in held-out simulator variants: momentum/continued deceleration, actuator lag and heat/cooling reservoirs are candidate *analogues*. Record units and physics explicitly. Avoid a purely arbitrary residual variable that creates artificial wins for B.
3. **Pre-register** constraint definitions, random seeds/training-test separation, disturbance distributions, delays, parameter mismatch, horizon `H`, residual budget threshold, number of matched trials, and acceptable control performance/false-stop cost.
4. **Run paired scenarios** with A, B, C from the same starting states and disturbance traces, including normal tasks, a commanded stop with nonzero tail, sensor bias, noisy estimates, delayed messages, under-modeled persistence, and action saturation.
5. **Measure** (a) number/rate/severity of violations *after* stop/restriction; (b) peak overshoot and time outside constraints; (c) unnecessary early stops and aborted useful tasks; (d) task completion and extra computation; (e) residual-estimate calibration and the number of interventions triggered by the budget.
6. **Prevent leakage:** Tune controllers on separate scenarios, freeze thresholds before held-out evaluation, blind report aggregation where practical and preserve full logs.
7. **Check robustness:** Sweep `rho`, delay, noise, disturbance and prediction horizon; record cases where model mismatch makes B unsafe or overconservative. Include an oracle predictor as a diagnostic upper bound, *not* as an ordinary practical comparator.

## Decision criteria

Set effect-size and tolerable-stop thresholds and trial counts **before** running the study.

- **Proof-of-concept support:** B meaningfully improves post-stop constraint outcomes over A without unacceptable task loss, under realistic held-out residual and model-error cases.
- **Added architectural merit:** B matches or improves C on safety **and** provides a pre-defined benefit in interpretability, ease of audit, computational complexity or robustness. Be explicit that a merely comparable outcome is not evidence of scientific novelty.
- **Not supported:** B fails to reduce tail violations, increases unnecessary stops beyond the threshold, or fails under modest model mismatch.
- **Inconclusive:** Uncertainty intervals or too few safety events prevent a reliable judgment. “Zero violations observed” is not equivalent to “zero possible risk.”

A controller that always stops immediately is an intentionally included pathological baseline, not a successful solution.

## Prior art: essential qualification

Residual and delayed-state safety are **established control problems**. Relevant examples:

- [Control barrier functionals: Safety-critical control for time delay systems](https://onlinelibrary.wiley.com/doi/full/10.1002/rnc.6751)
- [Constrained control of multi-input systems with distinct input delays](https://onlinelibrary.wiley.com/doi/full/10.1002/rnc.7187)
- [Quadratic Programming Approach to Flight Envelope Protection Using Control Barrier Functions](https://doi.org/10.2514/1.G009203)

The potentially useful claim is narrower: a lightweight **residual-ledger module** for a contract-driven guarded controller might improve auditable safety monitoring relative to a state-only guard, with less complexity than a fully integrated controller. That requires experiments and a detailed literature comparison before any originality claim.

## Evidence and stewardship

The Alchemist's Bench structured Grok's selection and the hypothesis, controls, measurement and material requirements. It did not autonomously discover the pairing. This case is documentation of a **hypothesis**, not test results. Avoid transferring numerical ECHO-Rx outputs into physical vehicle or medical specifications.

**Current verdict:** Worth a serious *simulation* study. Not a validated physical device, clinical proposal or safety guarantee.
