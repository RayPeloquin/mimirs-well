/* Mimir's Well: a deliberately small, title-matched concept-art index. */
(() => {
  'use strict';
  const illustrations = [
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
      id: 'aegis-twin-v0-6',
      src: 'assets/aegis-twin-v06-exterior.webp',
      alt: 'AEGIS-TWIN bilateral protective exosleeve concept shown worn over both intact arms.',
      caption: 'AEGIS-TWIN v0.6 · AI-generated concept render; not tested on humans.',
    },
  ];
  illustrations.forEach(({ id, src, alt, caption }) => {
    const card = document.querySelector(`.card[data-record-id="${id}"]`);
    if (!card || card.querySelector('.concept-art')) return;
    const note = card.querySelector('p');
    if (!note) return;
    const figure = document.createElement('figure');
    figure.className = 'concept-art';
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
