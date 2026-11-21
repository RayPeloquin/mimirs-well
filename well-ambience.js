/* Mimir's Well: original procedural cavern ambience.
   No audio files, third-party services, rhythm track, melody, analytics, or autoplay.
   Starts only after a visitor clicks; stops when they pause or leave the tab. */
(function () {
  'use strict';
  const button = document.getElementById('well-sound-toggle');
  const volume = document.getElementById('well-sound-volume');
  const status = document.getElementById('well-sound-status');
  if (!button || !volume || !status) return;

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  let engine = null;
  let nextDrop = null;
  let generation = 0;
  let starting = false;

  const volumeLevel = () => Math.max(0, Math.min(0.52, (Number(volume.value) / 100) * 0.52));

  function showState(playing, notice) {
    button.setAttribute('aria-pressed', String(playing));
    button.textContent = playing ? '◌ Silence the Well' : '◌ Listen to the Well';
    status.textContent = notice || '';
  }

  function drone(ctx, output, frequency, level) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = level;
    oscillator.connect(gain).connect(output);
    oscillator.start();
    return oscillator;
  }

  function wind(ctx, output) {
    // Soft, slow-moving cavern air made from filtered noise; no recorded sound.
    const length = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 105;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 570;
    const gain = ctx.createGain();
    gain.gain.value = 0.042;
    const swell = ctx.createOscillator();
    swell.type = 'sine';
    swell.frequency.value = 0.065;
    const swellDepth = ctx.createGain();
    swellDepth.gain.value = 0.014;
    swell.connect(swellDepth).connect(gain.gain);
    source.connect(highpass).connect(lowpass).connect(gain).connect(output);
    source.start();
    swell.start();
    return { source, swell };
  }

  function drop(e, when, strength) {
    if (e.ctx.state === 'closed') return;
    const ctx = e.ctx;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const f = 680 + Math.random() * 420;
    const t = Math.max(ctx.currentTime + 0.008, when);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(f, t);
    oscillator.frequency.exponentialRampToValueAtTime(f * (0.28 + Math.random() * 0.15), t + 0.22);
    envelope.gain.setValueAtTime(0.0001, t);
    envelope.gain.exponentialRampToValueAtTime(0.11 * strength, t + 0.014);
    envelope.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    oscillator.connect(envelope).connect(e.dropBus);
    oscillator.start(t);
    oscillator.stop(t + 0.46);
    oscillator.onended = function () { oscillator.disconnect(); envelope.disconnect(); };
  }

  function scheduleDrops(e, token) {
    if (engine !== e || generation !== token) return;
    const now = e.ctx.currentTime;
    drop(e, now + 0.035, 0.55 + Math.random() * 0.45);
    if (Math.random() < 0.20) drop(e, now + 0.18 + Math.random() * 0.19, 0.25);
    nextDrop = window.setTimeout(function () {
      scheduleDrops(e, token);
    }, 2100 + Math.random() * 4100);
  }

  function stop() {
    generation += 1;
    if (nextDrop !== null) window.clearTimeout(nextDrop);
    nextDrop = null;
    const previous = engine;
    engine = null;
    starting = false;
    if (previous) {
      // Silence gently, then release the AudioContext and all its nodes.
      const ctx = previous.ctx;
      try {
        const t = ctx.currentTime;
        previous.master.gain.cancelScheduledValues(t);
        previous.master.gain.setTargetAtTime(0, t, 0.07);
      } catch (_) { /* An inactive context can already be silent. */ }
      window.setTimeout(function () {
        ctx.close().catch(function () { /* Ignore already closed contexts. */ });
      }, 420);
    }
    showState(false, '');
  }

  async function start() {
    if (!AudioCtor || engine || starting) return;
    starting = true;
    let ctx;
    try {
      // Browser audio permissions require this to be called from the user's click.
      ctx = new AudioCtor();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      const dropBus = ctx.createGain();
      dropBus.connect(master);
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.31;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.19;
      const echo = ctx.createGain();
      echo.gain.value = 0.22;
      dropBus.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(echo).connect(master);

      // Two low, non-melodic resonances, like a quiet stone chamber.
      drone(ctx, master, 77, 0.022);
      drone(ctx, master, 115.5, 0.011);
      wind(ctx, master);

      const current = { ctx, master, dropBus };
      const token = ++generation;
      engine = current;
      if (ctx.state === 'suspended') await ctx.resume();
      if (engine !== current || generation !== token) return;
      master.gain.setTargetAtTime(volumeLevel(), ctx.currentTime, 0.5);
      starting = false;
      showState(true, '');
      scheduleDrops(current, token);
    } catch (_) {
      // Audio support varies with browsers and device preferences.
      if (ctx) ctx.close().catch(function () {});
      engine = null;
      starting = false;
      showState(false, 'Sound could not start on this browser.');
    }
  }

  button.addEventListener('click', function () {
    if (engine) stop();
    else void start();
  });

  volume.addEventListener('input', function () {
    if (!engine) return;
    const t = engine.ctx.currentTime;
    engine.master.gain.setTargetAtTime(volumeLevel(), t, 0.04);
  });

  // No persistent preference: every new visit begins silent.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && engine) stop();
  });
  window.addEventListener('pagehide', function () {
    if (engine) stop();
  });

  if (!AudioCtor) {
    button.disabled = true;
    showState(false, 'This browser does not support interactive audio.');
  }
})();
