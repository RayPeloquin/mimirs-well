"use strict";
// Curated research questions; not derived or validated combinations.
window.WellGuidedRecipes = [
  {
    "id": "optical-evidence",
    "a": "ghostglass",
    "b": "chihuahua-sphere-cs-1",
    "title": "Can two independent checks catch false signals?",
    "theme": "Trust a measurement",
    "credit": "Adapted from Court Case 002: Grok pairing; Asteris Solenne / ChatGPT revised protocol.",
    "ref": "research/alchemists-bench/ghostglass-chihuahua-sphere-court-case-study.md",
    "why": "Ghostglass tests whether counts differ; Chihuahua Sphere tracks energy crossing boundaries. A separate optical ledger may flag some misleading detections.",
    "model": "Keep the statistical result and independently measured optical energy residual separate. Compare statistics alone, statistics plus a residual review flag, and conventional quality control at matched sensitivity. A discrepancy flags review, not automatic rejection.",
    "test": "In blinded synthetic trials with known nulls and injected signals, compare false alarms at matched sensitivity across the three arms. Record inconclusive outcomes.",
    "limit": "Counts are not joules. Independent calibration and uncertainty bounds are required; a ledger constructed from the same detector counts is circular. No optical apparatus or joint experiment has been validated."
  },
  {
    "id": "stale-senses",
    "a": "spotrecon-spotrecon-r2",
    "b": "confluence-01-synthetic-sense",
    "title": "When does old information become misleading?",
    "theme": "Trust a measurement",
    "credit": "New guided hypothesis by Asteris Solenne / ChatGPT; not Court-reviewed.",
    "why": "One source measures observation age; the other proposes false events per valid hour. Their combination asks how age affects reliability.",
    "model": "For a synthetic timestamped data stream, report false-event rate separately for predefined observation-age bins. Retain unavailable duration and coverage as separate outputs; compare with an age-blind baseline.",
    "test": "Inject known synthetic delays, dropouts and ground-truth events. Compare false-event rates, coverage and missed events for a frozen freshness policy versus the baseline.",
    "limit": "Age is not error or false-event rate. Clock synchronization, event definitions and valid-duration accounting matter; excluding stale data may hide failures. No field or sensory performance demonstrated."
  },
  {
    "id": "energy-ceiling",
    "a": "chihuahua-sphere-cs-1",
    "b": "adventurer-s-forge",
    "title": "Where does the energy really go?",
    "theme": "Account for resources",
    "credit": "New guided hypothesis by Asteris Solenne / ChatGPT; not Court-reviewed.",
    "why": "The optical ledger tracks delivered energy; the Carnot ceiling bounds an ideal heat engine. Separate them to avoid claiming all energy losses can become useful work.",
    "model": "For a hypothetical separate heat-engine stage, keep optical/electrical conversion and heat-engine efficiency in separate ledgers. Bound the latter by its stated absolute temperatures. Do not add intermediate transfers to total output or equate the two efficiencies.",
    "test": "Construct a synthetic energy budget with explicit boundaries and compare it with a deliberately double-counted budget. Check conservation and the ideal thermal ceiling independently.",
    "limit": "Carnot applies only to a reversible two-reservoir heat engine, not direct photovoltaic conversion. No recoverable heat quantity or actual conversion performance is supplied."
  },
  {
    "id": "material-balance",
    "a": "zion-twin-ring-tuna-habitat",
    "b": "spincell-dle",
    "title": "Did the material arrive, or merely move?",
    "theme": "Account for resources",
    "credit": "New guided hypothesis by Asteris Solenne / ChatGPT; not Court-reviewed.",
    "why": "Both sources report a fraction of a conserved quantity, but the dye fraction and lithium product recovery describe different systems.",
    "model": "Define separate normalized accounting metrics for synthetic tracer transfer and material recovery. Compare their reported fractions only with explicit initial/input boundaries, product or receiving compartment, residual inventory and uncertainty.",
    "test": "Use synthetic mass-balance tables with known missing outlets and inventory changes. Compare complete and incomplete accounts; verify that closure errors are identified.",
    "limit": "Dye concentration sums and lithium mass are not interchangeable. Equal-area grid assumptions apply to Zion; its mesh-dependent results do not establish physical transfer. SpinCell has no measured extraction data."
  },
  {
    "id": "failure-counts",
    "a": "crucible",
    "b": "confluence-01-synthetic-sense",
    "title": "Is a system failing often or being observed longer?",
    "theme": "Test a system",
    "credit": "New guided hypothesis by Asteris Solenne / ChatGPT; not Court-reviewed.",
    "why": "A fraction of failed runs and a rate per hour answer different questions. Reporting both may expose misleading comparisons.",
    "model": "For an inanimate synthetic benchmark, record violation fraction per conclusive exercised run and false-event rate per valid observation hour separately. Stratify by scenario duration and report coverage.",
    "test": "Compare synthetic groups with equal failure fractions but unequal valid durations, then with equal rates but unequal run lengths. Verify the metrics are not conflated.",
    "limit": "A contract violation is not necessarily a false event. Runs and hours have different denominators. No real-world reliability or safety benefit follows."
  },
  {
    "id": "numerical-check",
    "a": "skeptic-1",
    "b": "temporal-acoustics",
    "title": "Can a numerical artifact masquerade as a finding?",
    "theme": "Test a system",
    "credit": "New guided hypothesis by Asteris Solenne / ChatGPT; not Court-reviewed.",
    "why": "One source computes natural modes; the other records a numerical time-step stability guard. Both illustrate the importance of checking a model before interpreting outputs.",
    "model": "Keep the two source models independent. In a toy numerical comparison, record modal outputs and convergence diagnostics separately from scalar-wave time-step acceptance. Treat a numerical guard as a prerequisite for interpretation, not evidence of a physical mode.",
    "test": "Use the existing ideal models independently, compare results at refined numerical settings where applicable, and record failed convergence or stability checks instead of interpreting them as physical effects.",
    "limit": "A lumped stiffness-mass model and a scalar-wave discretization are not the same physical system. The wave stability bound does not establish the accuracy of either model or a coupling between them."
  }
];
