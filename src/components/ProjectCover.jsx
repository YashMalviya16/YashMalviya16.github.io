import { useMemo } from 'react';

// Generated, animated SVG covers for projects that have no screenshot (most government work can't
// be shown). Each `art` type is a small motif in the same visual language as the hero network.
// Deterministic: the same project id always draws the same picture.

const W = 480;
const H = 300;

function rng(seedStr) {
  let s = [...seedStr].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function Grid() {
  return (
    <g className="pc-grid">
      {Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={H} />)}
      {Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2={W} y2={i * 40} />)}
    </g>
  );
}

function Agent({ r }) {
  const cx = W / 2, cy = H / 2;
  const nodes = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + r() * 0.3;
    const d = 85 + r() * 45;
    return { x: cx + Math.cos(a) * d * 1.35, y: cy + Math.sin(a) * d * 0.8 };
  });
  return (
    <g>
      <circle className="pc-ring pc-spin" cx={cx} cy={cy} r="54" />
      <circle className="pc-ring pc-spin-rev" cx={cx} cy={cy} r="78" />
      {nodes.map((n, i) => (
        <g key={i}>
          <line className="pc-link" x1={cx} y1={cy} x2={n.x} y2={n.y} />
          <circle className="pc-pulse" r="3.5" style={{ '--x': `${n.x - cx}px`, '--y': `${n.y - cy}px`, animationDelay: `${i * 0.35}s` }} cx={cx} cy={cy} />
          <circle className="pc-node" cx={n.x} cy={n.y} r="5" />
        </g>
      ))}
      <circle className="pc-hub" cx={cx} cy={cy} r="22" />
      <text className="pc-label" x={cx} y={cy + 4} textAnchor="middle">AI</text>
    </g>
  );
}

function MapArt({ r }) {
  const contours = Array.from({ length: 7 }, (_, k) => {
    const y0 = 40 + k * 36;
    let d = `M -10 ${y0}`;
    for (let x = 0; x <= W + 40; x += 40) d += ` Q ${x + 20} ${y0 + (r() - 0.5) * 40} ${x + 40} ${y0 + (r() - 0.5) * 18}`;
    return d;
  });
  const pts = Array.from({ length: 18 }, () => ({ x: 30 + r() * (W - 60), y: 30 + r() * (H - 60) }));
  const route = pts.slice(0, 6).map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  return (
    <g>
      {contours.map((d, i) => <path key={i} className="pc-contour" d={d} />)}
      <path className="pc-route" d={route} />
      {pts.map((p, i) => (
        <circle key={i} className={i < 6 ? 'pc-node pc-blink' : 'pc-dot'} cx={p.x} cy={p.y} r={i < 6 ? 5 : 3} style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </g>
  );
}

function Clusters({ r }) {
  const centers = [{ x: 130, y: 110 }, { x: 330, y: 90 }, { x: 250, y: 210 }, { x: 390, y: 220 }];
  return (
    <g>
      {centers.map((c, k) => (
        <g key={k} className="pc-cluster" style={{ animationDelay: `${k * 0.6}s` }}>
          <ellipse className="pc-hull" cx={c.x} cy={c.y} rx="62" ry="44" />
          {Array.from({ length: 14 }, (_, i) => {
            const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 40;
            return <circle key={i} className={k === 0 ? 'pc-node' : 'pc-dot'} cx={c.x + Math.cos(a) * d * 1.3} cy={c.y + Math.sin(a) * d * 0.9} r={k === 0 ? 3.6 : 3} />;
          })}
        </g>
      ))}
    </g>
  );
}

function DocumentArt() {
  return (
    <g>
      {[2, 1, 0].map((k) => (
        <g key={k} transform={`translate(${120 + k * 22} ${48 + k * 14})`} className={k === 0 ? 'pc-doc-front' : 'pc-doc'}>
          <rect width="150" height="190" rx="10" />
          {k === 0 && Array.from({ length: 8 }, (_, i) => (
            <rect key={i} className={i === 2 || i === 5 ? 'pc-hl' : 'pc-line'} x="18" y={24 + i * 19} width={i % 3 === 2 ? 70 : 114} height="7" rx="3" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </g>
      ))}
      <g transform="translate(330 70)">
        {[[0, 0, 70, 50], [70, 50, 30, 120], [70, 50, 110, 110], [0, 0, 110, 110]].map(([x1, y1, x2, y2], i) => (
          <line key={i} className="pc-link" x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
        {[[0, 0], [70, 50], [30, 120], [110, 110]].map(([x, y], i) => <circle key={i} className="pc-node pc-blink" cx={x} cy={y} r="7" style={{ animationDelay: `${i * 0.4}s` }} />)}
      </g>
    </g>
  );
}

function Pins({ r }) {
  const pins = Array.from({ length: 7 }, () => ({ x: 50 + r() * (W - 100), y: 70 + r() * (H - 110) }));
  return (
    <g>
      {Array.from({ length: 12 * 7 }, (_, i) => (
        <circle key={i} className="pc-dot" cx={20 + (i % 12) * 40} cy={20 + Math.floor(i / 12) * 40} r="1.6" />
      ))}
      {pins.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <ellipse className="pc-shadow" cx="0" cy="2" rx="9" ry="3" />
          <g className="pc-pin" style={{ animationDelay: `${i * 0.25}s` }}>
            <path d="M0 0 C -12 -16 -12 -30 0 -32 C 12 -30 12 -16 0 0 Z" />
            <circle cx="0" cy="-20" r="4" />
          </g>
        </g>
      ))}
    </g>
  );
}

function Loop() {
  const steps = [{ x: 120, y: 150, t: 'Perceive' }, { x: 240, y: 80, t: 'Decide' }, { x: 360, y: 150, t: 'Act' }];
  return (
    <g>
      <path className="pc-cycle" d="M 120 150 Q 150 70 240 80 Q 330 70 360 150 Q 240 280 120 150" />
      {steps.map((s) => (
        <g key={s.t}>
          <circle className="pc-hub" cx={s.x} cy={s.y} r="34" />
          <text className="pc-label" x={s.x} y={s.y + 4} textAnchor="middle">{s.t}</text>
        </g>
      ))}
    </g>
  );
}

const ART = { agent: Agent, map: MapArt, clusters: Clusters, document: DocumentArt, pins: Pins, loop: Loop };

export default function ProjectCover({ art, seed }) {
  const Art = ART[art] ?? Agent;
  const r = useMemo(() => rng(seed), [seed]);
  // Drawing order must not depend on re-renders, so memoize the whole motif.
  const motif = useMemo(() => <Art r={r} />, [Art, r]);

  return (
    <svg className="project-cover" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`pc-glow-${seed}`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} className="pc-bg" />
      <rect width={W} height={H} fill={`url(#pc-glow-${seed})`} />
      <Grid />
      {motif}
    </svg>
  );
}
