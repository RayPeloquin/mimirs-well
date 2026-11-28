# Ten catalog expansion candidates — 2026-11-27

Status: proposed concept revisions for editorial review; not promoted registry records. The existing public [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html) and individual placeholder pages were checked. The source for these summaries is the public caption text, not a full review of original artwork files, private originals, code or hardware. The new models and test plans below are proposals by Asteris Solenne / ChatGPT in response to Mr. Peloquin's request; original art authorship remains unverified. No other Court member's review is claimed. No tests have been executed. All numerical sample counts are proposed, not results. Freeze parameter ranges, seeds, controls, uncertainty methods and decision thresholds before execution. Nothing here authorizes physical, human or clinical testing or technical release.

Current verified homepage count: 364 total, 191 expanded, 173 awaiting source review. Candidate note only; no generated catalog, ledger, registry or manifest changes. If all ten are later accepted and promoted through the canonical build, the arithmetic would be 201 expanded and 163 pending, total unchanged. No new Ledger entries are claimed.

## 1. ARBOR / SEED

- Existing record: [arbor-seed](https://raypeloquin.github.io/mimirs-well/records/arbor-seed.html)
- Public caption source: ARBOR v0.2; ARBOR-SEED v0.1, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** A time-indexed decision graph with resource balances; represent feedback in the world model and unfold it into a finite-horizon trajectory tree. Keep reasoning performance and habitat resource closure separate.

**Governing model:** For each resource r, inventory I[r,t+1] = I[r,t] + inflow - outflow - loss. Enforce nonnegative inventory and fixed demand; count imported resources separately.

**First falsifiable check (proposed):** Compare a greedy one-step planner with a constrained horizon planner on 100 frozen synthetic scenarios, using equal information and evaluation budgets. Include scarcity, interrupted supply and forecast error.

**Outcome and rejection condition:** Measure infeasible actions, unmet demand, imports and total cost. Reject the advantage claim if the horizon planner fails to reduce violations or unmet demand at matched cost, or produces negative inventory.

**Evidence boundary:** No habitat, resource closure, autonomy, or manufacturing capability demonstrated.

## 2. MindTrace / PhotonTrace

- Existing record: [mindtrace-photontrace](https://raypeloquin.github.io/mimirs-well/records/mindtrace-photontrace.html)
- Public caption source: PHOTONTRACE v0.1; MINDTRACE v0.2, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** An uncertainty-aware signal interpretation pipeline: preserve raw observations, timestamps and provenance separately from inferred labels. Treat any cognitive label as an inference, never a direct reading of thoughts.

**Governing model:** Observation model y = Hx + noise; multiple latent states may explain the same observations. Missing or contradictory channels must permit an unknown result.

**First falsifiable check (proposed):** Use 200 synthetic labeled multichannel traces with motion-like artifacts, channel dropouts, confounders and shuffled labels. Compare a single-channel classifier and a fusion classifier using a held-out split, matched feature budgets and identical abstention rules.

**Outcome and rejection condition:** Report balanced accuracy, coverage, calibration error and false confident labels. Reject the fusion claim if it cannot outperform the baseline at matched coverage; shuffled labels must not yield above-chance results beyond the prespecified uncertainty.

**Evidence boundary:** No human measurements, thought decoding, diagnosis, or neural interface performance. Synthetic data only.

## 3. OSMOSKIN

- Existing record: [osmoskin](https://raypeloquin.github.io/mimirs-well/records/osmoskin.html)
- Public caption source: OSMO-SKIN v0.1, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** Treat the coating as a hypothetical nonliving membrane and separate transport, fouling and durability; compare geometries without assuming thinner is always superior.

**Governing model:** For a simple steady transport model J = P times delta c / L, with permeability parameter P in square metres per second if concentration is in mol per cubic metre. Model coating defects and fouling separately; do not extrapolate to tissue.

**First falsifiable check (proposed):** Run an inert computational transport model comparing thin and thick coatings at matched area, concentration gradient and material assumptions; vary permeability and defect fraction over disclosed ranges.

**Outcome and rejection condition:** Report target flux, unwanted-species passage, modeled retention and sensitivity. Reject a thinner-coating advantage if matched selectivity and integrity constraints eliminate its flux improvement.

**Evidence boundary:** No demonstrated material performance, biocompatibility, maintenance lifetime, clinical or human use.

## 4. OSSUARY — Biomanufacturing

- Existing record: [ossuary-biomanufacturing](https://raypeloquin.github.io/mimirs-well/records/ossuary-biomanufacturing.html)
- Public caption source: OSSUARY v0.2, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** Restrict the first study to nonliving porous scaffold geometry. Separate structural integrity, modeled transport and biological viability.

**Governing model:** Porosity = void volume / total volume. For the simplified steady diffusion model, evaluate effective transport separately from elastic stiffness and state boundary conditions.

**First falsifiable check (proposed):** Compare a uniform lattice and graded porous geometry at equal external dimensions, solid material volume and assumed material properties. Use a synthetic finite-element/diffusion model; include mesh convergence and parameter sensitivity.

**Outcome and rejection condition:** Report peak stress, displacement and effective diffusivity. Reject the proposed geometry advantage if it cannot improve the chosen transport objective at matched stiffness constraints, or if mesh convergence changes the conclusion.

**Evidence boundary:** No cells, graft survival, vascularization, transplant suitability or clinical validation. No biological fabrication protocol.

## 5. SCARAB-DC — Shipboard repair

- Existing record: [scarab-dc-shipboard-repair](https://raypeloquin.github.io/mimirs-well/records/scarab-dc-shipboard-repair.html)
- Public caption source: SCARAB-DC shipboard repair, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** A civilian digital coordination model for inspection and repair planning under human authority. First version is a simulated scheduler, not an autonomous emergency responder.

**Governing model:** Track task prerequisites, time, resource limits and exclusions; unknown structural or environmental safety state blocks task assignment. Human approval remains outside the scheduler.

**First falsifiable check (proposed):** Compare a fixed priority queue and a dependency-aware queue on 100 synthetic compartment task graphs with missing reports, failed resources and contradictory observations. No real emergency equipment or operational deployment.

**Outcome and rejection condition:** Measure missed dependencies, simulated completion time, refused assignments and unsafe assignments in the toy ruleset. Any assignment that violates a mandatory exclusion rejects the tested configuration; report delays and false refusals as well.

**Evidence boundary:** No field trial, actual emergency repair, structural safety assessment, firefighting or flood-control performance.

## 6. JANUS-10

- Existing record: [janus-10](https://raypeloquin.github.io/mimirs-well/records/janus-10.html)
- Public caption source: JANUS-10 concept study and character portrait, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** Preserve the archive as speculative character art; the new design is a bounded virtual character state machine. Separate persistent character facts, scene state and authorized transitions.

**Governing model:** A transition is permitted only when the current state, event and explicit rule agree. No unsupported claim of a physical lattice, cognition or consciousness.

**First falsifiable check (proposed):** Create a toy text-only character simulation; compare unrestricted state updates with schema-validated transitions on 100 frozen event sequences including contradictory facts and invalid updates.

**Outcome and rejection condition:** Report unauthorized transitions, continuity errors and valid transitions wrongly refused. Reject the guarded design if any forbidden transition succeeds in the stated test set or if continuity is not improved at a tolerable refusal rate set before testing.

**Evidence boundary:** Artwork and proposed software architecture only. No physical transformation or inner experience established.

## 7. Zero-G Pod

- Existing record: [zero-g-pod](https://raypeloquin.github.io/mimirs-well/records/zero-g-pod.html)
- Public caption source: GSZ-01 orbital freefall enclosure, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** A computational study of attitude-control behavior in an already free-falling reference frame. Separate ground analogues, orbital free fall, rotation and translation.

**Governing model:** For an isolated system total linear momentum is conserved; internal torques exchange angular momentum between subsystems. They cannot move the isolated center of mass. Track actuator saturation.

**First falsifiable check (proposed):** Compare passive attitude drift and modeled reaction-wheel stabilization under the same synthetic torque disturbance; record body rotation, wheel momentum and center-of-mass motion separately.

**Outcome and rejection condition:** Reject the numerical model if its isolated center of mass accelerates without external force or total angular momentum changes without an external torque. Reject the stabilization advantage if pointing error is not improved within actuator limits.

**Evidence boundary:** No gravity cancellation, free-flight apparatus, crew safety, flight qualification or life-support results.

## 8. STACK-NV — Sensor family

- Existing record: [stack-nv-sensor-family](https://raypeloquin.github.io/mimirs-well/records/stack-nv-sensor-family.html)
- Public caption source: STACK-NV differential magnetometer, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** A multichannel inverse problem for estimating magnetic-field components from differently responsive sensing layers. More layers alone do not establish spatial resolution.

**Governing model:** Use y = A x + epsilon; define A from a hypothetical calibration model and inspect rank, singular values and condition number. Include calibration drift and correlated noise.

**First falsifiable check (proposed):** Compare a single-channel estimator with a multi-layer estimator on frozen synthetic fields at matched observation time and disclosed noise assumptions. Include indistinguishable source configurations and a deliberately ill-conditioned A.

**Outcome and rejection condition:** Report held-out reconstruction error, uncertainty coverage and false localization. Reject added-layer advantage if error does not improve at matched observation resources or if ambiguity is incorrectly reported as a unique source.

**Evidence boundary:** No measured NV sensor, optical addressing, magnetic sensitivity, depth resolution or calibrated hardware.

## 9. Outlaw Hovercruiser

- Existing record: [outlaw-hovercruiser](https://raypeloquin.github.io/mimirs-well/records/outlaw-hovercruiser.html)
- Public caption source: The Outlaw hover cruiser, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** Keep the original as unofficial vehicle styling; the new physics study compares a hypothetical ground-cushion platform with free hover, without treating luminous pods as an established lift mechanism.

**Governing model:** In ideal static vertical balance lift equals weight. For a simplified cushion, net gauge pressure times effective area is a force; leakage and propulsion power remain separate. Free hover needs a real momentum-exchange mechanism.

**First falsifiable check (proposed):** Use a dimensionally consistent calculation for fictional mass/area ranges and a synthetic pressure-loss sensitivity sweep. Compare ideal zero leakage against nonzero leakage; do not infer free-flight capability from ground-effect assumptions.

**Outcome and rejection condition:** Reject a proposed support condition when modeled lift falls below weight; reject any energy-free sustained hover claim. Report required pressure and unknown power rather than claiming an operable vehicle.

**Evidence boundary:** No built craft, validated propulsion, road/flight approval or manufacturer affiliation.

## 10. BACKTRACE

- Existing record: [backtrace](https://raypeloquin.github.io/mimirs-well/records/backtrace.html)
- Public caption source: BACKTRACE v0.4, in [research illustrations](https://raypeloquin.github.io/mimirs-well/research-plates.html).
- Proposed evidence class if accepted: concept/design review only.

**Revised design:** A privacy-preserving incident evidence log for a recovered unwanted tracker; distinguish observations, custody records and unverified hypotheses. Do not design a system for tracking or identifying people.

**Governing model:** Record the source and timestamp uncertainty with each observation. A hash can detect later modification relative to a trusted reference but cannot establish that the original observation is true or identify a person.

**First falsifiable check (proposed):** Compare an ordinary editable synthetic incident log with an append-only hash-linked log using fictitious events. Include gaps, clock mismatch, duplicated events and altered records; no real location or identity data.

**Outcome and rejection condition:** Measure alteration detection, false flags and unsupported attribution outputs. Reject any claimed attribution function based solely on proximity or motion; reject integrity advantage if known alterations are missed under the specified trusted-anchor model.

**Evidence boundary:** No identity attribution, tracking capability, verified evidence chain, forensic admissibility or real-world deployment.
