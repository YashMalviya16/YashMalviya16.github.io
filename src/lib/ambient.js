// Original, generated-in-the-browser uplifting score (Web Audio API, no audio files).
// A major, 96 BPM, vi–IV–I–V loop (F#m – D – A – E): piano arpeggios + warm string pad
// during the intro; bass, kick, claps and hats drop in on arrival. Browsers only allow
// sound after a click, so start() must be called from a user gesture.

let ctx = null;
let master = null;
let musicBus = null;
let reverbSend = null;
let timer = null;
let muted = false;
const listeners = new Set();

const BPM = 96;
const EIGHTH = 60 / BPM / 2; // seconds per 8th note
const STEPS_PER_BAR = 8;

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// vi – IV – I – V in A major. pad: string voicing, arp: piano notes, bass: root.
const PROGRESSION = [
  { pad: [54, 57, 61, 66], arp: [66, 69, 73, 78], bass: 42 }, // F#m
  { pad: [50, 57, 62, 66], arp: [62, 66, 69, 74], bass: 38 }, // D
  { pad: [52, 57, 61, 64], arp: [64, 69, 73, 76], bass: 45 }, // A (E in the voicing for smooth motion)
  { pad: [52, 56, 59, 64], arp: [64, 68, 71, 76], bass: 40 }, // E
];
const ARP = [0, 2, 1, 3, 2, 1, 3, 2]; // index into the 4 arp notes, one per 8th

const layers = { pad: true, piano: true, bass: false, drums: false };
let step = 0;
let nextTime = 0;

/* ---------- building blocks ---------- */

function makeReverb(seconds = 3.2) {
  const len = ctx.sampleRate * seconds;
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;
  return conv;
}

let noise = null;
function noiseBuffer() {
  if (noise) return noise;
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

function out(node, wet = 0.3) {
  node.connect(musicBus);
  if (wet) {
    const s = ctx.createGain();
    s.gain.value = wet;
    node.connect(s).connect(reverbSend);
  }
}

// Soft piano-like pluck: triangle + sine overtone, fast attack, ringing decay.
function piano(midi, t, vel = 0.22) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(4200, t);
  lp.frequency.exponentialRampToValueAtTime(1200, t + 0.8);
  [['triangle', 1, 1], ['sine', 2, 0.35], ['sine', 3, 0.08]].forEach(([type, mult, amp]) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = hz(midi) * mult;
    const og = ctx.createGain();
    og.gain.value = amp;
    o.connect(og).connect(lp);
    o.start(t);
    o.stop(t + 1.7);
  });
  lp.connect(g);
  out(g, 0.35);
}

// Warm string pad: detuned saws through a soft lowpass, slow swell per bar.
function pad(notes, t, dur) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.06, t + dur * 0.35);
  g.gain.setValueAtTime(0.06, t + dur * 0.85);
  g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1500;
  lp.Q.value = 0.4;
  notes.forEach((n) => {
    [-7, 7].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = hz(n);
      o.detune.value = cents;
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.7);
    });
  });
  lp.connect(g);
  out(g, 0.5);
}

// Pulsing 8th-note bass.
function bass(midi, t) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.28, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + EIGHTH * 0.95);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.value = hz(midi);
  const s = ctx.createOscillator();
  s.type = 'sine';
  s.frequency.value = hz(midi - 12);
  o.connect(lp);
  s.connect(lp);
  lp.connect(g);
  o.start(t); s.start(t);
  o.stop(t + EIGHTH); s.stop(t + EIGHTH);
  out(g, 0);
}

function kick(t) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.7, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
  o.connect(g);
  out(g, 0);
  o.start(t);
  o.stop(t + 0.4);
}

function clap(t) {
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1400;
  bp.Q.value = 0.9;
  const g = ctx.createGain();
  // three quick bursts = hand clap
  [0, 0.012, 0.024].forEach((d, i) => {
    g.gain.setValueAtTime(i === 2 ? 0.32 : 0.22, t + d);
    g.gain.exponentialRampToValueAtTime(0.01, t + d + 0.01);
  });
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer();
  n.connect(bp).connect(g);
  out(g, 0.25);
  n.start(t);
  n.stop(t + 0.25);
}

function hat(t, vel = 0.05) {
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vel, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer();
  n.connect(hp).connect(g);
  out(g, 0);
  n.start(t, Math.random());
  n.stop(t + 0.06);
}

/* ---------- sequencer (lookahead scheduler) ---------- */

function scheduleStep(s, t) {
  const barIndex = Math.floor(s / STEPS_PER_BAR) % PROGRESSION.length;
  const pos = s % STEPS_PER_BAR;
  const chord = PROGRESSION[barIndex];

  if (layers.pad && pos === 0) pad(chord.pad, t, EIGHTH * STEPS_PER_BAR);
  if (layers.piano) piano(chord.arp[ARP[pos]], t, pos === 0 ? 0.26 : 0.17);
  if (layers.bass) bass(chord.bass, t);
  if (layers.drums) {
    if (pos === 0 || pos === 4) kick(t);
    if (pos === 2 || pos === 6) clap(t);
    hat(t, pos % 2 ? 0.06 : 0.03);
  }
}

function tick() {
  while (nextTime < ctx.currentTime + 0.25) {
    scheduleStep(step, nextTime);
    nextTime += EIGHTH;
    step++;
  }
}

/* ---------- public API ---------- */

export function isMuted() {
  return muted;
}

export function onMuteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMuted(value) {
  muted = value;
  if (master) master.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.25);
  listeners.forEach((fn) => fn(value));
}

export function isStarted() {
  return !!ctx;
}

// Call from a click. Starts the soft intro layer (pad + piano).
export function start() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();

  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  master.connect(comp).connect(ctx.destination);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0.8;
  musicBus.connect(master);
  reverbSend = ctx.createGain();
  reverbSend.gain.value = 1;
  const rev = makeReverb();
  const revOut = ctx.createGain();
  revOut.gain.value = 0.5;
  reverbSend.connect(rev).connect(revOut).connect(musicBus);

  step = 0;
  nextTime = ctx.currentTime + 0.1;
  timer = setInterval(tick, 50);
  tick();

  if (import.meta.env.DEV) window.__ambient = { ctx, master }; // for inspecting the mix in dev tools

  // Don't play to an empty room: pause while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}

// Full groove without the arrival hit (used when sound is switched on after the intro).
export function groove() {
  layers.bass = true;
  layers.drums = true;
}

// Rising whoosh for the warp.
export function riser(seconds = 3) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer();
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 4;
  bp.frequency.setValueAtTime(300, t);
  bp.frequency.exponentialRampToValueAtTime(7000, t + seconds);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.28, t + seconds);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.25);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + seconds + 0.3);
}

// Arrival: impact + cymbal swell, then the full groove drops in on the downbeat.
export function impact() {
  if (!ctx) return;
  const t = ctx.currentTime;

  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(35, t + 0.9);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.8, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 1.7);

  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 5000;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.18, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  n.connect(hp).connect(ng).connect(master);
  n.start(t);
  n.stop(t + 2.3);

  // Restart the progression on this downbeat with everything in.
  layers.bass = true;
  layers.drums = true;
  step = 0;
  nextTime = t;
  tick();

  // After the first minute, settle to a comfortable background level.
  musicBus.gain.setTargetAtTime(0.45, t + 45, 8);
}
