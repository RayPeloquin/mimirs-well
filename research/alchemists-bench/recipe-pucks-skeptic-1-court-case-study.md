# Court case study 001 — Recipe Pucks × SKEPTIC-1

**Status:** Proposed experiment; not built, conducted, or validated  
**Recorded:** 23 November 2026  
**Origin:** Alchemist’s Bench independent workflow test by Grok  
**Contributions:** Grok — unexpected pairing, transferable principle, initial two-condition proposal and experimental concept. Asteris Solenne / ChatGPT — third condition and stronger causal comparison. Mr. Peloquin — research direction, review and authorization to preserve the record.

## The parent designs

- [Recipe Pucks](../../index.html#design/recipe-pucks): a proposed tangible kitchen/recipe selector. Its functional specification remains ambiguous: the archived illustration does not establish whether a puck carries ingredients, encodes instructions, or identifies a recipe. No working hardware or user tests are documented.
- [SKEPTIC-1](https://github.com/RayPeloquin/SKEPTIC-1): an ideal numerical three-mass/spring model demonstrating that a reversible off-center brace can distinguish some mirror-equivalent stiffness faults within its modeled assumptions. No physical validation is documented.

## Cross-domain idea

**Hypothesis:** When a kitchen interface's visible state is ambiguous, a user-triggered, reversible asymmetric haptic probe may help people distinguish the *actual* underlying machine state.

SKEPTIC-1 contributes the *reasoning pattern* of reversible intervention to break an ambiguity, **not** proven hardware or evidence of a transferable kitchen mechanism. Recipe Pucks contributes the tangible user-control context and the question of mismatched human and machine states. A haptic change on its own cannot reveal state: the device must implement and verify a **state-dependent, discriminable response mapping**; the cue must return to neutral after release.

## Three experimental conditions

| Condition | Interface | What it isolates |
| --- | --- | --- |
| **A — Baseline** | Ordinary tangible recipe selector without an extra state probe | Current usability and identification error |
| **B — Asymmetric probe** | Same selector with a deliberate, reversible, user-triggered one-sided haptic/detent cue whose response is mapped to actual machine state | Whether the asymmetric probe helps |
| **C — Conventional confirmation** | Same selector plus an ordinary accessible “Show current state” confirmation button, presenting the same verified state information without an asymmetric probe | Whether any improvement is simply due to making state information available |

**Critical comparison:** B versus C, not only B versus A. If B improves over A but not over C, the study does not demonstrate a special advantage from asymmetric probing; ordinary explicit confirmation may be sufficient.

## Proposed protocol

1. Build or simulate mechanically comparable selectors under safe, non-cooking conditions. Confirm that each hidden state produces its intended response in B and the correct visible/accessible confirmation in C before involving participants.
2. Pre-register the candidate states, ambiguous visual conditions, training, task prompts, sample-size rationale, analysis, minimum meaningful improvement in error rate, acceptable extra response time, and stop/withdrawal procedures.
3. Ask consenting participants to identify the true selector state and complete recipe-selection tasks in both *unambiguous* and intentionally *visually ambiguous* conditions. Do not conceal that intentional ambiguity may occur; explain it in consent and debrief.
4. Randomize and counterbalance A/B/C order, states, and task prompts. Give equivalent practice, available state information, and task difficulty across conditions. Include realistic divided-attention and simulated wet-hand trials only if safe.
5. Log actual state, participant response, error type, state-identification time, task completion time, probe usage, accidental selections, perceived confusion and preferences. Assess accessibility and whether haptic cues are reliably distinguished.
6. Compare B versus A and **B versus C** with uncertainty estimates, including separate analyses of ambiguous and unambiguous trials.

## Proposed decision rule

A useful result would require pre-registered evidence that B reduces true-state identification errors compared with A under ambiguity **and** offers a practical advantage over C (such as lower error or faster successful identification) without exceeding the stated time, confusion or accidental-selection limits. A result that merely matches C supports state confirmation in general, not a distinctive asymmetry benefit. Null, mixed, and inconclusive findings must be reported.

## Open constraints and limitations

- Recipe Pucks is not a demonstrated device; its purpose and exact control mapping need specifying.
- The SKEPTIC-1 result is numerical and does not establish any effect on human perception or kitchen usability.
- A state-dependent haptic cue requires a reliable state sensor/controller and a safe reversible actuator; the cue must not itself alter selected recipes.
- Cue strength, reproducibility, individual perception, handedness, accessibility, cleaning, wet handling, power loss and error recovery remain open.
- User testing, reliable hardware, effect size and safety are all **unverified**.

## Grok's assessment

**Worth building as a product?** Not yet.  
**Worth investigating as a small, inexpensive human–machine disambiguation experiment?** Possibly.

The Bench helped structure contributions, needs and falsifiable measurement; Grok supplied the unexpected connection. The Bench did **not** discover the insight on its own.

**Evidence level:** Conceptual crossover and proposed test, **not** experimental validation.
