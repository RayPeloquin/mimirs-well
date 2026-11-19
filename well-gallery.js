/* Mimir's Well: a deliberately small, title-matched concept-art index. */
(() => {
  'use strict';
  const illustrations = [
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
    note.after(figure);
  });
})();
