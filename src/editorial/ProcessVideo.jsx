import { useCallback, useEffect, useRef, useState } from 'react';
import { process, profile } from '../data.js';
import NeuralField from '../components/NeuralField.jsx';

// A ~24s "promo video" for the process, rendered live in code (not a video file).
// One clock drives every scene, so it can be played, paused and scrubbed like a real video.

const SCENES = [
  { key: 'title', label: 'Intro', dur: 3.5 },
  { key: 's0', label: '01', dur: 4.5 },
  { key: 's1', label: '02', dur: 4.5 },
  { key: 's2', label: '03', dur: 4.5 },
  { key: 's3', label: '04', dur: 4.5 },
  { key: 'end', label: 'Outro', dur: 3 },
];
const TOTAL = SCENES.reduce((s, x) => s + x.dur, 0);
const STARTS = SCENES.reduce((acc, s, i) => [...acc, i ? acc[i - 1] + SCENES[i - 1].dur : 0], []);

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// progress of p within [a, b], eased
const seg = (p, a, b, ease = easeOut) => ease(clamp((p - a) / (b - a)));
const fmt = (s) => `0:${String(Math.floor(s)).padStart(2, '0')}`;

/* ---------- scenes (each receives p = 0..1 through its own duration) ---------- */

function Title({ p }) {
  const a = seg(p, 0.02, 0.3), b = seg(p, 0.12, 0.42), c = seg(p, 0.4, 0.65);
  return (
    <div className="pv-center">
      <div className="pv-kicker" style={{ opacity: c, transform: `translateY(${(1 - c) * 12}px)` }}>{profile.name} · How I work</div>
      <h3 className="pv-title">
        <span className="mask"><span className="mask-inner" style={{ transform: `translateY(${(1 - a) * 110}%)` }}>A process</span></span>
        <br />
        <span className="mask"><span className="mask-inner pv-accent" style={{ transform: `translateY(${(1 - b) * 110}%)` }}>that ships</span></span>
      </h3>
      <p className="pv-sub" style={{ opacity: c }}>Idea → production in four steps</p>
    </div>
  );
}

function StepText({ i, p }) {
  const step = process[i];
  const n = seg(p, 0, 0.18), t = seg(p, 0.06, 0.26), d = seg(p, 0.14, 0.34);
  return (
    <div className="pv-step-text">
      <div className="pv-num" style={{ opacity: n, transform: `translateX(${(1 - n) * -40}px)` }}>0{i + 1}</div>
      <h4 className="mask"><span className="mask-inner" style={{ transform: `translateY(${(1 - t) * 110}%)` }}>{step.title}</span></h4>
      <p style={{ opacity: d, transform: `translateY(${(1 - d) * 14}px)` }}>{step.text}</p>
    </div>
  );
}

// 01: a decision tree draws itself, one leaf lights up.
function VisFrame({ p }) {
  const draw = (a, b) => 1 - seg(p, a, b, easeInOut);
  const edges = [
    ['M200 60 L120 150', 0.15, 0.3], ['M200 60 L280 150', 0.18, 0.33],
    ['M120 150 L80 240', 0.32, 0.46], ['M120 150 L160 240', 0.35, 0.49],
    ['M280 150 L240 240', 0.38, 0.52], ['M280 150 L320 240', 0.41, 0.55],
  ];
  const nodes = [[200, 60, 0.12], [120, 150, 0.3], [280, 150, 0.33], [80, 240, 0.46], [160, 240, 0.49], [240, 240, 0.52], [320, 240, 0.55]];
  const win = seg(p, 0.62, 0.78);
  return (
    <svg viewBox="0 0 400 300" className="pv-vis">
      {edges.map(([d, a, b], k) => (
        <path key={k} d={d} stroke={k === 4 || k === 1 ? '#ff6a3d' : '#fff'} strokeOpacity={k === 4 || k === 1 ? 0.3 + win * 0.7 : 0.45} strokeWidth="2.5" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={draw(a, b)} />
      ))}
      {nodes.map(([x, y, at], k) => {
        const s = seg(p, at, at + 0.08);
        const chosen = k === 5;
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
            {chosen && <circle r={26 + win * 10} fill="#ff6a3d" opacity={win * 0.35} />}
            <circle r={k === 0 ? 16 : 12} fill={chosen && win > 0 ? '#ff6a3d' : '#16161a'} stroke={chosen ? '#ff6a3d' : '#fff'} strokeWidth="2" />
            {k === 0 && <text y="5" textAnchor="middle" className="pv-svg-label" fontSize="14">?</text>}
          </g>
        );
      })}
      <g opacity={win} transform={`translate(240 ${280 - win * 6})`}>
        <rect x="-44" y="-14" width="88" height="24" rx="12" fill="#ff6a3d" />
        <text y="3" textAnchor="middle" className="pv-svg-label" fontSize="10">DECISION</text>
      </g>
    </svg>
  );
}

// 02: bronze / silver / gold layers drop in and stack; an RBAC shield locks on.
function VisFoundation({ p }) {
  const layers = [
    { label: 'GOLD', c: '#fbbf24', at: 0.46 },
    { label: 'SILVER', c: '#cbd5e1', at: 0.32 },
    { label: 'BRONZE', c: '#d97706', at: 0.18 },
  ];
  const shield = seg(p, 0.62, 0.74);
  return (
    <svg viewBox="0 0 400 300" className="pv-vis">
      {layers.map((l, k) => {
        const s = seg(p, l.at, l.at + 0.14, (t) => 1 - Math.pow(1 - t, 4));
        const y = 190 - (2 - k) * 52 - (1 - s) * 180;
        return (
          <g key={l.label} transform={`translate(200 ${y})`} opacity={s}>
            <path d="M-120 0 L0 -40 L120 0 L0 40 Z" fill={l.c} opacity="0.95" />
            <path d="M-120 0 L0 40 L0 58 L-120 18 Z" fill={l.c} opacity="0.55" />
            <path d="M120 0 L0 40 L0 58 L120 18 Z" fill={l.c} opacity="0.75" />
            <text x="0" y="5" textAnchor="middle" className="pv-svg-label" fontSize="12" fill="#111">{l.label}</text>
          </g>
        );
      })}
      <g transform={`translate(335 70) scale(${0.6 + shield * 0.4})`} opacity={shield}>
        <path d="M0 -30 L24 -20 L24 4 C24 18 12 27 0 32 C-12 27 -24 18 -24 4 L-24 -20 Z" fill="#ff6a3d" />
        <path d="M-9 1 L-2 9 L12 -7" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <text y="52" textAnchor="middle" className="pv-svg-label" fontSize="10">RBAC</text>
      </g>
    </svg>
  );
}

// 03: an LLM orb powers up; capability chips orbit; a prompt types out.
function VisModel({ p }) {
  const on = seg(p, 0.12, 0.35);
  const chips = ['LLM', 'AGENTS', 'LP / MILP', 'ML'];
  const prompt = 'Which regions need more capacity next quarter?';
  const typed = prompt.slice(0, Math.floor(seg(p, 0.45, 0.8, (t) => t) * prompt.length));
  const spin = p * 140;
  return (
    <svg viewBox="0 0 400 300" className="pv-vis">
      <defs>
        <radialGradient id="pv-orb" cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.15" stopColor="#ffe0cf" />
          <stop offset="0.5" stopColor="#ff6a3d" />
          <stop offset="1" stopColor="#6b0f3a" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="130" r={90 * on} fill="#ff6a3d" opacity={0.18 + 0.1 * Math.sin(p * 20)} />
      <ellipse cx="200" cy="130" rx="118" ry="34" fill="none" stroke="#fff" strokeOpacity={0.35 * on} strokeWidth="1.5" transform={`rotate(-14 200 130)`} />
      <circle cx="200" cy="130" r={54 * on} fill="url(#pv-orb)" />
      {chips.map((c, k) => {
        const a = ((k / chips.length) * 360 + spin) * (Math.PI / 180);
        const s = seg(p, 0.22 + k * 0.06, 0.34 + k * 0.06);
        const x = 200 + Math.cos(a) * 118, y = 130 + Math.sin(a) * 34 * 1.2;
        return (
          <g key={c} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-38" y="-13" width="76" height="26" rx="13" fill="#16161a" stroke="#ff6a3d" strokeWidth="1.5" />
            <text y="4" textAnchor="middle" className="pv-svg-label" fontSize="10">{c}</text>
          </g>
        );
      })}
      <g opacity={seg(p, 0.4, 0.5)} transform="translate(60 240)">
        <rect width="280" height="36" rx="18" fill="#16161a" stroke="#fff" strokeOpacity="0.25" />
        <text x="18" y="23" className="pv-svg-mono" fontSize="12">{typed}<tspan fill="#ff6a3d">{p < 0.9 ? '▍' : ''}</tspan></text>
      </g>
    </svg>
  );
}

// 04: CI/CD ticks through, a monitoring line draws, SHIPPED stamp.
function VisShip({ p }) {
  const stages = ['BUILD', 'TEST', 'DEPLOY'];
  const line = seg(p, 0.5, 0.75, easeInOut);
  const stamp = seg(p, 0.76, 0.86, (t) => 1 - Math.pow(1 - t, 4));
  const pts = [0, 18, 10, 26, 20, 34, 30, 44, 38, 40, 52, 60].map((v, i) => `${30 + i * 31},${230 - v * 1.4}`).join(' ');
  return (
    <svg viewBox="0 0 400 300" className="pv-vis">
      {stages.map((s, k) => {
        const on = seg(p, 0.1 + k * 0.12, 0.2 + k * 0.12);
        const x = 70 + k * 130;
        return (
          <g key={s}>
            {k < 2 && <line x1={x + 40} y1="80" x2={x + 90} y2="80" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 5" />}
            {k < 2 && <line x1={x + 40} y1="80" x2={x + 40 + 50 * seg(p, 0.2 + k * 0.12, 0.26 + k * 0.12)} y2="80" stroke="#ff6a3d" strokeWidth="2.5" />}
            <circle cx={x} cy="80" r="30" fill={on > 0.5 ? '#ff6a3d' : '#16161a'} stroke={on > 0.5 ? '#ff6a3d' : '#fff'} strokeOpacity={on > 0.5 ? 1 : 0.3} strokeWidth="2" />
            <path d={`M${x - 11} 80 L${x - 3} 89 L${x + 12} 71`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - on} />
            <text x={x} y="132" textAnchor="middle" className="pv-svg-label" fontSize="11" opacity={0.5 + on * 0.5}>{s}</text>
          </g>
        );
      })}
      <polyline points={pts} fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="2.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} />
      <text x="30" y="264" className="pv-svg-mono" fontSize="10" opacity={line * 0.7}>monitored · alerting · documented</text>
      <g transform={`translate(292 196) rotate(-12) scale(${stamp ? 1.6 - stamp * 0.6 : 0})`} opacity={stamp}>
        <rect x="-70" y="-22" width="140" height="44" rx="6" fill="none" stroke="#ff6a3d" strokeWidth="4" />
        <text y="9" textAnchor="middle" className="pv-svg-label" fontSize="24" fill="#ff6a3d">SHIPPED</text>
      </g>
    </svg>
  );
}

function End({ p }) {
  const a = seg(p, 0.05, 0.35), b = seg(p, 0.25, 0.55);
  return (
    <div className="pv-center">
      <h3 className="pv-title pv-end-name">
        <span className="mask"><span className="mask-inner" style={{ transform: `translateY(${(1 - a) * 110}%)` }}>{profile.name}</span></span>
      </h3>
      <p className="pv-sub" style={{ opacity: b }}>{profile.role} · {profile.orgShort}</p>
      <a className="pv-cta" href="#contact" style={{ opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>Let's build together →</a>
    </div>
  );
}

const VISUALS = [VisFrame, VisFoundation, VisModel, VisShip];

/* ---------- player ---------- */

export default function ProcessVideo() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const raf = useRef(0);
  const last = useRef(0);
  const userPaused = useRef(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Clock
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const loop = (now) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setT((prev) => {
        const next = prev + dt;
        if (next >= TOTAL) { setPlaying(false); return TOTAL; }
        return next;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  // Autoplay while on screen (not for reduced-motion users or after a manual pause).
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) {
        if (!reduce && !userPaused.current) {
          setStarted(true);
          setT((prev) => (prev >= TOTAL ? 0 : prev));
          setPlaying(true);
        }
      } else setPlaying(false);
    }, { threshold: [0, 0.55] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  const toggle = useCallback(() => {
    setStarted(true);
    if (t >= TOTAL) { setT(0); setPlaying(true); userPaused.current = false; return; }
    setPlaying((pl) => { userPaused.current = pl; return !pl; });
  }, [t]);

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setStarted(true);
    setT(clamp((e.clientX - r.left) / r.width) * TOTAL);
  };

  let idx = 0;
  STARTS.forEach((s, i) => { if (t >= s) idx = i; });
  const scene = SCENES[idx];
  let p = clamp((t - STARTS[idx]) / scene.dur);
  // Cross-fade at scene edges (the last scene holds at the end).
  const lin = (x) => x;
  let sceneOpacity = idx === SCENES.length - 1 ? seg(p, 0, 0.08, lin) : Math.min(seg(p, 0, 0.08, lin), 1 - seg(p, 0.92, 1, lin));
  // Before first play, show the title as a poster frame.
  if (!started) { p = 0.75; sceneOpacity = 1; }

  let content;
  if (scene.key === 'title') content = <Title p={p} />;
  else if (scene.key === 'end') content = <End p={p} />;
  else {
    const i = Number(scene.key.slice(1));
    const Vis = VISUALS[i];
    content = (
      <div className="pv-step">
        <StepText i={i} p={p} />
        <div className="pv-step-vis"><Vis p={p} /></div>
      </div>
    );
  }

  return (
    <figure className="pv" ref={ref} aria-label="Promo video: a process that ships">
      <div className="pv-frame">
        <div className="pv-bg" aria-hidden="true">
          <NeuralField color="#ff8a5c" strength={0.55} className="pv-net" />
          <i className="pv-glow" style={{ transform: `translate(${Math.sin(t * 0.4) * 8}%, ${Math.cos(t * 0.3) * 6}%)` }} />
        </div>
        <div className="pv-scene" style={{ opacity: sceneOpacity }} aria-hidden={!started}>{content}</div>
        <div className="pv-letterbox top" aria-hidden="true" />
        <div className="pv-letterbox bottom" aria-hidden="true" />
        {!started && (
          <button className="pv-bigplay" onClick={toggle} aria-label="Play video">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </button>
        )}
        <span className="pv-chapter" aria-live="polite">{scene.key.startsWith('s') ? `Step ${scene.label}` : scene.label}</span>
      </div>

      <div className="pv-controls">
        <button className="pv-btn" onClick={toggle} aria-label={t >= TOTAL ? 'Replay' : playing ? 'Pause' : 'Play'}>
          {t >= TOTAL
            ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor" /></svg>
            : playing
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" /></svg>
              : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>}
        </button>
        <div className="pv-track" onClick={seek} role="slider" aria-label="Seek" aria-valuemin={0} aria-valuemax={Math.round(TOTAL)} aria-valuenow={Math.round(t)} tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'ArrowRight') setT((v) => clamp(v + 2, 0, TOTAL)); if (e.key === 'ArrowLeft') setT((v) => clamp(v - 2, 0, TOTAL)); }}>
          {SCENES.map((s, i) => (
            <span key={s.key} className="pv-seg" style={{ flexGrow: s.dur }}>
              <i style={{ transform: `scaleX(${clamp((t - STARTS[i]) / s.dur)})` }} />
            </span>
          ))}
        </div>
        <span className="pv-time">{fmt(t)} / {fmt(TOTAL)}</span>
      </div>
    </figure>
  );
}
