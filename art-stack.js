/* Mimir's Well: progressive-enhancement image stacks.
   Plain HTML remains readable with JavaScript disabled. Images are never discarded. */
(() => {
  'use strict';

  function makeStack(figures, label, kind) {
    if (figures.length < 2) return null;
    const stack = document.createElement('div');
    stack.className = 'art-stack art-stack--' + kind;
    stack.setAttribute('role', 'region');
    stack.setAttribute('aria-roledescription', 'carousel');
    stack.setAttribute('aria-label', label + ' — image gallery');
    stack.dataset.imageCount = String(figures.length);

    const stage = document.createElement('div');
    stage.className = 'art-stack__stage';

    const controls = document.createElement('div');
    controls.className = 'art-stack__controls';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'art-stack__arrow';
    previous.textContent = '←';
    previous.setAttribute('aria-label', 'Previous image in ' + label);

    const status = document.createElement('span');
    status.className = 'art-stack__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'art-stack__arrow';
    next.textContent = '→';
    next.setAttribute('aria-label', 'Next image in ' + label);

    controls.append(previous, status, next);
    stack.append(stage, controls);

    // Every original figure and its caption is kept, only moved into one stack.
    figures.forEach(figure => stage.append(figure));

    let current = 0;
    function show(position) {
      current = (position + figures.length) % figures.length;
      figures.forEach((figure, index) => {
        figure.hidden = index !== current;
      });
      status.textContent = 'Image ' + (current + 1) + ' of ' + figures.length;
    }

    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    stack.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    show(0);
    return stack;
  }

  // Homepage project cards: the source illustrations are inserted by well-gallery.js.
  document.querySelectorAll('.card').forEach(card => {
    const figures = [...card.querySelectorAll(':scope > figure.concept-art')];
    if (figures.length < 2) return;
    const label = card.querySelector('h3')?.textContent?.trim() || 'Project';
    const stack = makeStack(figures, label, 'card');
    const anchor = card.querySelector('p');
    if (anchor) anchor.after(stack);
    else card.append(stack);
  });

  // Dedicated project pages: preserve themed galleries but show one figure at a time.
  document.querySelectorAll('.artgrid').forEach(grid => {
    const figures = [...grid.querySelectorAll(':scope > figure.artcard')];
    if (figures.length < 2) return;
    const section = grid.closest('section');
    const label = section?.querySelector('h2')?.textContent?.trim() || 'Project artwork';
    const stack = makeStack(figures, label, 'page');
    grid.replaceWith(stack);
  });
})();
