/* Mimir's Well: a deliberately small, title-matched concept-art index. */
(() => {
  'use strict';
  const illustrations = [
    {
      id: 'qubit-ankh-assembly',
      src: 'assets/qubit-ankh-quantum-concept.jpg',
      alt: 'Concept artwork of a suspended cryogenic-style quantum apparatus with many wires and an illuminated central panel marked by an ankh.',
      caption: 'Ankh Qubit Assembly · archive concept artwork, not a validated device or a QBERT illustration. Original design version unverified.',
    },

    {
      id: 'crucible',
      src: 'assets/crucible-aviation-test-harness-poster.png',
      alt: 'CRUCIBLE reusable autonomy test harness concept poster with a proposed fixed-wing aircraft above a synthetic rover, multirotor and simulation engine.',
      caption: 'CRUCIBLE · AI-generated test-harness concept poster. Rover and multirotor are synthetic demonstrations; the fixed-wing aircraft extension is proposed, not implemented or validated.',
    },
    {
      id: 'temporal-reflection-chamber',
      src: 'assets/temporal-reflection-chamber-concept.jpg',
      alt: 'Temporal Reflection Chamber proposal showing an 8 by 8 by 8 foot metal research enclosure, instrumented transmission-line testbed, external equipment rack and idealized wave-speed and frequency equations.',
      caption: 'Temporal Reflection Chamber · AI-generated cutaway concept. Unbuilt and untested. The transmission-line equations are an ideal-model prediction under fixed inductance and uniform nondispersive assumptions, not a measured temporal-reflection effect.',
    },
    {
      id: 'temporal-acoustics',
      src: 'assets/temporal-acoustics-survey-concept.png',
      alt: 'Conceptual cutaway of Maltese limestone with surface acoustic receivers, a source and wavefronts scattering from a dark underground air-filled cavity.',
      caption: 'Temporal Acoustics · AI-generated concept artwork illustrating a possible surface survey, not an actual archaeological scan.',
    },
    {
      id: 'temporal-acoustics',
      src: 'assets/temporal-acoustics-void-v-solid-concept.png',
      alt: 'Split scientific concept art: left a hollow limestone cavity, right a solid contrasting rock inclusion, both with stylized acoustic wavefronts.',
      caption: 'Temporal Acoustics · AI-generated visual comparison of cavity versus solid inclusion. Propagation paths are illustrative, not numerical results.',
    },
    {
      id: 'hallvard-s-promise-little-lungs',
      src: 'assets/hallvards-promise-ivory-diaphragm-module.jpg',
      alt: 'Hallvard’s Promise HP-B0 v0.3 research concept poster showing an ivory and gold, transparent cylindrical diaphragm test module with two tubing connections.',
      caption: 'Hallvard’s Promise · HP-B0 v0.3 neonatal breathing-support research illustration. Artist’s concept only: no prototype, breathing performance data or clinical validation.',
    },
    {
      id: 'hallvard-s-promise-little-lungs',
      src: 'assets/hallvards-promise-ribbon-of-breath.jpg',
      alt: 'Hallvard’s Promise dedication poster with the words For the smallest breaths, soft luminous ribbon shapes and two tiny footprints.',
      caption: 'Hallvard’s Promise · For the smallest breaths. Concept title artwork, not evidence of a demonstrated respiratory-assist system.',
    },
    {
      id: 'hemostat-r',
      src: 'assets/hemostat-r-three-questions.jpg',
      alt: 'HEMOSTAT-R concept poster showing three panels of temporary wound-scaffold material: Bound the Activity, Preserve Needed Support and Verify Material Fate.',
      caption: 'HEMOSTAT-R · Concept questions for a temporary repair material: limit active effects, preserve necessary support and verify removal or resorption. No material has been validated.',
    },
    {
      id: 'hemostat-r',
      src: 'assets/hemostat-r-trauma-repair-scaffold.jpg',
      alt: 'HEMOSTAT-R speculative temporary trauma-repair scaffold artwork depicting an open wound bridged by a translucent filament mesh.',
      caption: 'HEMOSTAT-R · AI-generated trauma-repair scaffold visualization. No demonstrated bleeding-control capability, clinical outcomes or approved use.',
    },
    {
      id: 'echo-rx',
      src: 'assets/echo-rx-responsive-cell-platform.webp',
      alt: 'ECHO-Rx Medicine made by cells concept poster illustrating a proposed cell-based responsive biologic-production platform.',
      caption: 'ECHO-Rx · Responsive biologic-production concept artwork; no demonstrated biological production or clinical efficacy.',
    },
    {
      id: 'echo-rx',
      src: 'assets/echo-rx-contained-cell-research.webp',
      alt: 'ECHO-Rx contained-cell research poster showing a laboratory chamber under a microscope and the phrase Stop production. Measure what remains.',
      caption: 'ECHO-Rx · Contained-cell measurement concept emphasizing secretion shutoff and residual activity. No ECHO-Rx biological results or validated containment are reported.',
    },
    {
      id: 'echo-genome-echogenome',
      src: 'assets/echo-genome-v02-concept.webp',
      alt: 'ECHO Genome v0.2 conceptual cell illustration showing host chromosomes beside a proposed nonintegrating artificial chromosome and memory modules.',
      caption: 'ECHO Genome v0.2 · Supplied host-coupled genome concept poster. Replication, nonintegration, sensing and containment are design aspirations, not experimental results.',
    },
    {
      id: 'echo-genome-echogenome',
      src: 'assets/echo-genome-v03-deterrent-concept.webp',
      alt: 'ECHO Genome v0.3 Deterrent Edition poster depicting host-coupled artificial chromosome modules and a proposed human-deterrent interface.',
      caption: 'ECHO Genome v0.3 · Historical deterrent concept poster only. Human-response, exposure and safety claims are unverified; no deployed or validated deterrent system is implied.',
    },
    {
      id: 'echo-protocell-resonant-and-provisioned-seed',
      src: 'assets/echo-protocell-v03-resonant-seed.webp',
      alt: 'ECHO Protocell v0.3 Resonant Seed concept with proposed ambient-energy harvesting, membrane construction and autonomous cellular machinery.',
      caption: 'ECHO Protocell v0.3 · Resonant Seed speculative architecture. Ambient harvesting sufficient for cellular self-maintenance has not been demonstrated.',
    },
    {
      id: 'echo-protocell-resonant-and-provisioned-seed',
      src: 'assets/echo-protocell-v04-provisioned-seed.webp',
      alt: 'ECHO Protocell v0.4 Provisioned Seed concept with defined nutrient feedstock, packaged artificial chromosome, preloaded expression machinery and chemical energy module.',
      caption: 'ECHO Protocell v0.4 · Provisioned Seed concept; no built minimal cell or validated autonomous persistence, division or containment.',
    },
    {
      id: 'x07-skipjack-integration',
      src: 'assets/skipjack-large-craft-concept.webp',
      alt: 'Tentatively identified SKIPJACK large-vehicle hover concept showing a dark angular craft above multiple blue glowing lift zones in a hangar.',
      caption: 'SKIPJACK family · Tentative identification supplied from project memory. Speculative vehicle-scale concept art; no hover or lift performance demonstrated.',
    },
    {
      id: 'x07-skipjack-integration',
      src: 'assets/skipjack-6-ehd-lift-plate.webp',
      alt: 'SKIPJACK 6 electrohydrodynamic lift-plate concept showing a sealed plate, cutaway, stacked architecture and unverified performance specifications.',
      caption: 'SKIPJACK 6 · Early lift-plate architecture artwork. Illustrated performance figures and operating conditions are not measured or accepted engineering ratings.',
    },
    {
      id: 'x07-skipjack-integration',
      src: 'assets/skipjack-vehicle-integration.webp',
      alt: 'Dark passenger-car concept with glowing electrohydrodynamic plates beneath its body and wheels.',
      caption: 'SKIPJACK 6 · Vehicle-integration concept artwork only. No demonstrated vehicle-scale support, roadworthiness or flight.',
    },
    {
      id: 'x07-skipjack-integration',
      src: 'assets/skipjack-sj6-ead-c2-grid1.webp',
      alt: 'SJ6-EAD-C2 GRID-1 v0.1 test-stand architecture poster with segmented electrodes, independent timing and impulse-to-energy measurement plan.',
      caption: 'SKIPJACK / SJ6-EAD-C2 · Proposed free-air segmented electrohydrodynamic cassette test program; experimental draft, not a validated apparatus or thrust result.',
    },
    {
      id: 'x07-skipjack-integration',
      src: 'assets/x07-strix-rev-e-court-verdict.webp',
      alt: 'X-07 STRIX revision E Court engineering verdict rejecting free-air hover, withdrawing the 80 kilogram-force at 30 millimeter and 11 kilowatt rating, and specifying ground-cushion measurements.',
      caption: 'X-07 STRIX · Court review: free-air hover rejected, prior vehicle-scale rating withdrawn. Ground-cushion tests are proposed only; no lift claim is established.',
    },
    {
      id: 'rewind-ii-plasma-concept',
      src: 'assets/rewind-ii-solid-state-axial-fan.webp',
      alt: 'REWIND-II solid-state axial-fan concept with magnet arrays, traveling plasma pressure sheets, airflow arrows and proposed energy and noise goals.',
      caption: 'REWIND-II · Speculative ducted-airflow concept; no measured mass-flow, efficiency, noise, propulsion or solid-state fan performance.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-v03-cover.webp',
      alt: 'RAVEN-P1 v0.3 Court of the Synthetic cover, with orange and teal protein-ribbon illustration and the question Can 38 changes keep the fold?',
      caption: 'RAVEN-P1 · Supplied v0.3-labeled cover artwork. Computational study and concept illustration; a corresponding published v0.3 research release is not verified here.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-v02-sequence-questions.webp',
      alt: 'RAVEN-P1 v0.2 From Sequence to Questions cover with a luminous blue protein ribbon and stated 279-nucleotide, 92-amino-acid, eight-prediction computational scope.',
      caption: 'RAVEN-P1 · v0.2 sequence-to-questions illustration; computational concept only, unsynthesized and untested.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-structure-math.webp',
      alt: 'RAVEN-P1 computational structure comparison poster with candidate sequence, aligned C-alpha trace, RMSD 0.781 angstrom and mean model confidence 96.90 of 100.',
      caption: 'RAVEN-P1 · Computed structure and mathematical summary. Values describe a model-to-reference comparison, not experimental folding, stability or function.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-v02-controls.webp',
      alt: 'RAVEN-P1 v0.2 controls study chart, comparing predicted structure and target with mutation-path RMSD and local-confidence scores.',
      caption: 'RAVEN-P1 · v0.2 computational controls; intermediate mutation paths are correlated and do not establish general mutation tolerance.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-contact-maps.webp',
      alt: 'RAVEN-P1 computational folding contact maps comparing original and reassigned residue letters, showing 108 of 124 versus 34 of 124 long-range contacts recovered.',
      caption: 'RAVEN-P1 · AlphaFold2 predicted-contact comparison under a specific sequence reassignment; the figures do not constitute laboratory validation.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-folded-protein-concept.webp',
      alt: 'Luminous teal-and-gold protein ribbon representing RAVEN-P1 as an artistic folding concept.',
      caption: 'RAVEN-P1 · Luminous folded-protein concept art, not an atomic model or measured structure.',
    },
    {
      id: 'raven-p1',
      src: 'assets/raven-p1-feather-concept.webp',
      alt: 'RAVEN-P1 feather-shaped teal-and-copper protein ribbon with the title The twelve-site folding test.',
      caption: 'RAVEN-P1 · Twelve-site folding-test concept illustration, not an experimentally determined structure.',
    },
    {
      id: 'signature-selective-receiver-detection-and-error-bounds',
      src: 'assets/nulling-boundary-receiver-mathematics.webp',
      alt: 'The Nulling Boundary concept poster showing a signature-selective receiver board and the observation, worst-case margin, minimax receiver, and synthetic full-nulling threshold equations.',
      caption: 'The Nulling Boundary · Supplied mathematical concept poster. The full-nulling threshold belongs to a chosen synthetic fixture, not a universal constant; receiver hardware is not demonstrated.',
    },
    {
      id: 'ndsm-01-neutrino-feasibility-study',
      src: 'assets/ndsm-01-neutrino-conversion-poster.webp',
      alt: 'NDSM-01 neutrino-induced nuclear conversion concept poster depicting a schematic indium target and prompt-plus-delayed readout, with an illustrative capture-rate equation and delayed lifetime.',
      caption: 'NDSM-01 · Supplied neutrino-conversion research poster; hypothetical apparatus only. Atomic addressing and directed conversion are unresolved, and no device or conversion yield has been demonstrated.',
    },
    {
      id: 'echo-m',
      src: 'assets/echo-m-cellular-flight-recorder-v04.webp',
      alt: 'ECHO-M v0.4 A Cellular Flight Recorder concept poster depicting an artificial chromosome within an illustrated cultured cell, labeled research concept and combined system unvalidated.',
      caption: 'ECHO-M v0.4 · Supplied host-coupled artificial chromosome research poster; conceptual illustration for cultured-cell research only. The combined system has not been validated.',
    },
    {
      id: 'veil-e-edison-01',
      src: 'assets/veil-e-edison-01-quiet-receiver-poster.webp',
      alt: 'VEIL-E / EDISON-01 The Quiet Receiver concept poster showing an enclosed sensor instrument, fusion display, calibration channels, and rules for evaluating residual signals.',
      caption: 'VEIL-E / EDISON-01 · Historical concept poster; proposed residual-detection apparatus only. No built receiver, validated anomaly, communication or source identity.',
    },
    {
      id: 'triple-nitinol-spine',
      src: 'assets/triple-nitinol-spine-concept.webp',
      alt: 'Triple-Nitinol Spine research concept with three parallel curved nickel-titanium flexure rods supported by machined spacer collars and precision mounting hardware.',
      caption: 'Triple-Nitinol Spine · AI-generated speculative mechanical-flexure illustration; no prototype or performance validation.',
    },
    {
      id: 'triple-nitinol-spine',
      src: 'assets/triple-nitinol-spine-blueprint.webp',
      alt: 'Triple Nitinol Spine supplied concept blueprint on a robotic torso, showing distinct load, torsion and recovery columns with explanatory callouts.',
      caption: 'Triple Nitinol Spine · Supplied three-column concept blueprint (load, torsion, recovery); illustrative architecture, not a validated implant or prototype.',
    },
    {
      id: 'chihuahua-sphere-cs-1',
      src: 'assets/chihuahua-sphere-cs1-concept.webp',
      alt: 'Chihuahua Sphere CS-1 concept laboratory: adjustable dark collector panels surround a calibrated light source, with separate input and measurement instruments.',
      caption: 'Chihuahua Sphere / CS-1 · AI-generated optical test-rig illustration; calculation-only concept, no built or tested apparatus.',
    },
    {
      id: 'field-medic-guided-hand-support',
      src: 'assets/field-medic-assistive-backpack.webp',
      alt: 'FIELD MEDIC assistive backpack concept showing a medic with robotic support braces and a guided-hand glove.',
      caption: 'FIELD MEDIC v0.5 · AI-generated concept illustration, not tested equipment.',
    },
    {
      id: 'hippo-mag-01-magnetic-compensation-experiment',
      src: 'assets/hippo-mag-01-tabletop.webp',
      alt: 'HIPPO-MAG-01 governed magnetic-compensation tabletop experiment concept with copper coils, sensors and a control box.',
      caption: 'HIPPO-MAG-01 · AI-generated concept render; hardware untested.',
    },
    {
      id: 'skeptic-1',
      src: 'assets/skeptic-1-probe-bench.webp',
      alt: 'SKEPTIC-1 concept bench illustration with three sliding masses, four springs, a detachable stiffness probe and optical sensors.',
      caption: 'SKEPTIC-1 · AI-generated concept illustration; instrument not built or validated.',
    },
    {
      id: 'skeptic-1',
      src: 'assets/skeptic-1-probe-frequency-poster.webp',
      alt: 'Corrected SKEPTIC-1 concept poster: three sliding masses, spring-coupled test hardware and a removable probe, comparing ideal modeled frequencies of 11.4314 Hz before the probe and 12.7509 Hz or 12.3489 Hz with the probe.',
      caption: 'SKEPTIC-1 · Supplied corrected probe-frequency poster; ideal-model values are illustrative, not measured; hardware unbuilt.',
    },
    {
      id: 'aegis-twin-v0-6',
      src: 'assets/aegis-twin-v06-exterior.webp',
      alt: 'AEGIS-TWIN bilateral protective exosleeve concept shown worn over both intact arms.',
      caption: 'AEGIS-TWIN v0.6 · AI-generated concept render; not tested on humans.',
    },
    {
      id: 'fqsc-01',
      src: 'assets/fqsc-01-concept.webp',
      alt: 'FQSC-01 concept rendering of a confined-ion measurement instrument with sealed chamber, optical modules and separate spectral and motion response displays.',
      caption: 'FQSC-01 · AI-generated concept visualization; no built or validated instrument.',
    },
    {
      id: 'herdminder-hm-01',
      src: 'assets/herdminder-hm01-concept.webp',
      alt: 'HerdMinder farm observation drone concept above a cattle pasture, with a stockperson operating the controller.',
      caption: 'HerdMinder / HM-01 · AI-generated concept illustration; no field-tested drone or welfare detection.',
    },
    {
      id: 'atlas-cistern',
      src: 'assets/atlas-cistern-concept.webp',
      alt: 'Atlas Cistern concept cutaway of a civic water-storage reservoir beneath landscaped public spaces.',
      caption: 'Atlas Cistern · AI-generated civic-infrastructure concept; no approved or built facility.',
    },
    {
      id: 'lifeguard-lance-rescue-drone-and-fleet',
      src: 'assets/lifeguard-lance-concept.webp',
      alt: 'Lifeguard Lance rescue-drone concept carrying a flotation ring toward a swimmer as shore lifeguards respond.',
      caption: 'Lifeguard Lance · AI-generated rescue concept; not certified or available for emergency use.',
    },
    {
      id: 'radio-echo-chamber',
      src: 'assets/radio-echo-chamber-concept.webp',
      alt: 'Radio Echo Chamber concept illustration of a copper RF test cavity and oscilloscope showing a decaying ringdown trace.',
      caption: 'Radio Echo Chamber · AI-generated passive RF measurement concept; no demonstrated signal recovery.',
    },
    {
      id: 'fluffy-01',
      src: 'assets/fluffy-01-concept.webp',
      alt: 'FLUFFY-01 unarmed, wolf-inspired research quadruped concept in an outdoor test area with a human supervisor.',
      caption: 'FLUFFY-01 · AI-generated unarmed research-robot concept; no physical prototype built.',
    },
    {
      id: 'fluffy-01',
      src: 'assets/fluffy-01-bridge-recon-concept.jpg',
      alt: 'FLUFFY-01 concept poster showing an unarmed mechanical wolf scout and a human operator with tablet surveying a damaged bridge from a snow-dusted rocky overlook.',
      caption: 'FLUFFY-01 · Eyes ahead, human in command. AI-generated recon-only, semi-autonomous robotic scout concept; no prototype, navigation, bridge assessment or field performance is validated.',
    },
    {
      id: 'knock-moth-pool-tile-mapping',
      src: 'assets/knock-moth-concept.webp',
      alt: 'Knock-Moth conceptual closed-case handheld pool-tile inspection aid held against a tiled wall, without internal engineering detail.',
      caption: 'Knock-Moth · AI-generated exterior-only inspection concept; no validated defect-detection performance.',
    },
    {
      id: 'silt-harp-manual-muddy-water-prefiltration',
      src: 'assets/silt-harp-concept.webp',
      alt: 'SILT HARP manual muddy-water prefiltration concept with a coarse solids rack, sediment basin and a caretaker removing collected silt.',
      caption: 'SILT HARP · AI-generated solids-prefilter concept, not verified potable-water treatment.',
    },

    {
      id: 'inkheal',
      src: 'assets/inkheal-grid-tattoo-printing.jpg',
      alt: 'INKHEAL Grid concept poster showing a flexible translucent tattoo-printing patch across a tattooed back, with a tablet interface and pigment controller.',
      caption: 'INKHEAL Grid · AI-generated tattoo-printing illustration. Proposed microneedle, pigment delivery and control features are untested; no functioning device is established.',
    },
    {
      id: 'inkheal',
      src: 'assets/inkheal-grid-master-ink-bank.jpg',
      alt: 'INKHEAL Grid concept art of a large electronic pigment bank displaying many colored cartridge rows and multiple tube connections.',
      caption: 'INKHEAL Grid · Master Ink Bank concept illustration. Cartridge counts, mixing accuracy and operating figures shown are artistic placeholders, not verified specifications.',
    },
    {
      id: 'inkheal',
      src: 'assets/inkheal-grid-studio-concept.jpg',
      alt: 'Conceptual futuristic tattoo studio with multiple customers, tablet-guided artists, pigment banks and body-fitting tattoo applicator patches.',
      caption: 'INKHEAL Grid · Imagined studio workflow, not a real facility or a demonstrated tattoo procedure.',
    },
    {
      id: 'invisible-ink-printing-and-removal',
      src: 'assets/invisible-ink-removal-platform.jpg',
      alt: 'Invisible Ink AI-guided tattoo removal platform concept poster showing a large back-mounted treatment patch, controller, tablet and hypothetical depth mapping.',
      caption: 'Invisible Ink · English-language AI-generated removal-platform diagram. Pigment targeting, clearing, tissue protection and any performance figures are unvalidated proposals.',
    },
    {
      id: 'invisible-ink-printing-and-removal',
      src: 'assets/invisible-ink-removal-platform-jp.jpg',
      alt: 'Japanese-language Invisible Ink concept poster showing the proposed back-mounted tattoo-removal patch, external controller, tablet and layered skin graphic.',
      caption: 'Invisible Ink · Japanese-language artwork variant of the same speculative removal concept; not clinical evidence or a tested system.',
    },
  ];
  illustrations.forEach(({ id, src, alt, caption }) => {
    const card = document.querySelector(`.card[data-record-id="${id}"]`);
    if (!card || [...card.querySelectorAll('.concept-art')].some(figure => figure.dataset.src === src)) return;
    const note = card.querySelector('p');
    if (!note) return;
    const figure = document.createElement('figure');
    figure.className = 'concept-art';
    figure.dataset.src = src;
    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `View full-size concept illustration: ${alt}`);
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    const label = document.createElement('figcaption');
    label.textContent = caption;
    link.append(image);
    figure.append(link, label);
    const previousArt = [...card.querySelectorAll('.concept-art')].at(-1);
    (previousArt || note).after(figure);
  });
})();
