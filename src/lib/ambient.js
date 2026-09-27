// Original, generated-in-the-browser cinematic score (Web Audio API, no audio files).
// Organ-like chords over a deep drone, a riser for the intro warp, an impact on arrival,
// then a quiet ambient loop under the site. Browsers only allow sound after a click,
// so start() must be called from a user gesture.

let ctx = null;
let master = null;
let musicBus = null;
let loopTimer = null;
let muted = false;
const listeners = new Set();

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Slow cinematic progression (A minor): Am(add9) – F(maj7) – C – G(sus4)
const CHORDS = [
  [45, 57, 60, 64, 71],
  [41, 53, 57, 64, 69],
  [48, 55, 60, 64, 67],
  [43, 55, 60, 62, 67],
];
const CHORD_SECONDS = 8;

function makeReverb(seconds = 4.5) {
  const rate = ctx.sampleRate;
  const len = rate * seconds;
  const ir = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6;
  }
  const conv = ctx.createConvolver();
  conv.buffer = ir;
  return conv;
}

function noiseBuffer(seconds) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// One organ-ish voice: sine fundamental + soft octave/fifth harmonics, slow swell.
function organNote(freq, start, dur, level) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(level, start + dur * 0.35);
  g.gain.setValueAtTime(level, start + dur * 0.7);
  g.gain.linearRampToValueAtTime(0, start + dur + 1.5);
  g.connect(musicBus);
  [[1, 1], [2, 0.35], [3, 0.12], [4, 0.08]].forEach(([mult, amp]) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq * mult;
    o.detune.value = (Math.random() - 0.5) * 6;
    const og = ctx.createGain();
    og.gain.value = amp;
    o.connect(og).connect(g);
    o.start(start);
    o.stop(start + dur + 1.6);
  });
}

function playChord(chord, start, level) {
  chord.forEach((n, i) => organNote(hz(n), start, CHORD_SECONDS, level * (i === 0 ? 1.2 : 0.55)));
}

function scheduleLoop(level) {
  let i = 0;
  const tick = () => {
    playChord(CHORDS[i % CHORDS.length], ctx.currentTime + 0.05, level);
    i++;
  };
  tick();
  loopTimer = setInterval(tick, CHORD_SECONDS * 1000);
}

export function isMuted() {
  return muted;
}

export function onMuteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setMuted(value) {
  muted = value;
  if (master) master.gain.setTargetAtTime(value ? 0 : 0.9, ctx.currentTime, 0.3);
  listeners.forEach((fn) => fn(value));
}

export function isStarted() {
  return !!ctx;
}

// Call from a click. Starts the drone + first chord.
export function start() {
  if (ctx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);

  const reverb = makeReverb();
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.16;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2600;
  musicBus.connect(tone);
  tone.connect(master);
  tone.connect(reverb).connect(wet).connect(master);

  // Sub drone on A1 with a slow breathing tremolo.
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = hz(33);
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0;
  droneGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 3);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(droneGain.gain);
  drone.connect(droneGain).connect(master);
  drone.start();
  lfo.start();

  scheduleLoop(0.5);

  // Don't play to an empty room: pause while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}

// Rising whoosh + pitch sweep for the warp.
export function riser(seconds = 3) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(seconds + 0.5);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 6;
  bp.frequency.setValueAtTime(200, t);
  bp.frequency.exponentialRampToValueAtTime(6000, t + seconds);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + seconds);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.4);
  src.connect(bp).connect(g).connect(master);
  src.start(t);

  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(hz(45), t);
  o.frequency.exponentialRampToValueAtTime(hz(69), t + seconds);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(300, t);
  lp.frequency.exponentialRampToValueAtTime(3000, t + seconds);
  const og = ctx.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.08, t + seconds);
  og.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.3);
  o.connect(lp).connect(og).connect(master);
  o.start(t);
  o.stop(t + seconds + 0.5);
}

// Deep hit on arrival, then the music settles into a quiet background loop.
export function impact() {
  if (!ctx) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(32, t + 1.2);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 2.3);

  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(1.5);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.35, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  n.connect(lp).connect(ng).connect(master);
  n.start(t);

  // Big chord on arrival, then fade the bed down to a gentle level.
  playChord(CHORDS[0], t, 0.9);
  musicBus.gain.setTargetAtTime(0.09, t + 4, 3);
}
