import { useMemo } from 'react';

// "Gen-AI style" project thumbnails, drawn in code: a glowing gradient backdrop (cheap CSS blobs + grain)
// under a glass-and-light hero object per project. Deterministic per project id; animations respect
// reduced motion (CSS) and SMIL motion is omitted for reduced-motion users.

const W = 480;
const H = 360;

function rng(seedStr) {
  let s = [...seedStr].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared SVG defs: glass fill, glass edge, soft glow.
function Defs({ id, c1, c2 }) {
  return (
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={c1} />
        <stop offset="1" stopColor={c2} />
      </linearGradient>
      <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>
  );
}

function Glass({ id, x, y, w, h, r = 14, ...rest }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${id}-glass)`} stroke={`url(#${id}-edge)`} strokeWidth="1.2" {...rest} />;
}

function Bars({ x, y, widths, gap = 12, h = 5, fill = '#fff', opacity = 0.55 }) {
  return widths.map((w, i) => <rect key={i} x={x} y={y + i * gap} width={w} height={h} rx={h / 2} fill={fill} opacity={opacity} />);
}

/* ---------- 1. LLM data agent: glowing orb with orbit rings + glass chat panel ---------- */
function Agent({ id }) {
  return (
    <g>
      <circle cx="165" cy="185" r="95" fill="#ff6a3d" opacity="0.55" filter={`url(#${id}-soft)`} />
      <radialGradient id={`${id}-orb`} cx="0.36" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.12" stopColor="#ffe0cf" />
        <stop offset="0.42" stopColor="#ff6a3d" />
        <stop offset="0.78" stopColor="#b3126e" />
        <stop offset="1" stopColor="#2b0a3d" />
      </radialGradient>
      <g transform="translate(165 185)">
        <ellipse rx="128" ry="36" transform="rotate(-18)" fill="none" stroke={`url(#${id}-accent)`} strokeWidth="2" opacity="0.8" />
        <ellipse rx="104" ry="28" transform="rotate(26)" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 7" opacity="0.5" className="gc-dash" />
        <circle r="64" fill={`url(#${id}-orb)`} />
        <ellipse cx="-20" cy="-26" rx="22" ry="12" fill="#fff" opacity="0.35" transform="rotate(-30)" />
        <g transform="rotate(-18) scale(1 0.28)">
          <g>
            {!reduced && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite" />}
            <circle cx="128" cy="0" r="7" fill="#fff" filter={`url(#${id}-glow)`} />
          </g>
        </g>
        <g transform="rotate(26) scale(1 0.27)">
          <g>
            {!reduced && <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="13s" repeatCount="indefinite" />}
            <circle cx="-104" cy="0" r="6" fill="#ffb199" filter={`url(#${id}-glow)`} />
          </g>
        </g>
      </g>

      <g transform="translate(292 58)">
        <Glass id={id} x="0" y="0" w="160" h="238" r="16" />
        <rect x="14" y="14" width="64" height="18" rx="9" fill="#fff" opacity="0.14" />
        <text x="46" y="27" textAnchor="middle" className="gc-label" fontSize="9">✦ AGENT</text>
        <rect x="58" y="46" width="88" height="30" rx="10" fill={`url(#${id}-accent)`} opacity="0.9" />
        <Bars x={68} y={55} widths={[64, 44]} gap={9} h={4} opacity={0.85} />
        <Glass id={id} x="14" y="88" w="132" h="104" r="10" />
        <Bars x={24} y={100} widths={[96, 72]} gap={10} h={4} />
        {[26, 42, 58, 34, 70].map((bh, i) => (
          <rect key={i} x={26 + i * 22} y={182 - bh} width="14" height={bh} rx="3" fill={`url(#${id}-accent)`} className="gc-grow" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
        <g transform="translate(24 214)">
          {[0, 1, 2].map((i) => <circle key={i} cx={i * 10} cy="0" r="3" fill="#fff" className="gc-blink" style={{ animationDelay: `${i * 0.2}s` }} />)}
        </g>
      </g>
    </g>
  );
}

/* ---------- 2. Geospatial optimization: isometric city of data blocks + optimized route ---------- */
function IsoMap({ id, seed }) {
  const blocks = useMemo(() => {
    const r = rng(seed);
    const out = [];
    const N = 7;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) out.push({ i, j, h: 6 + Math.pow(r(), 2.2) * 70, hub: r() < 0.13 });
    return out.sort((a, b) => a.i + a.j - (b.i + b.j));
  }, [seed]);
  const w = 30, hh = 17, ox = 240, oy = 92;
  const pos = (b) => ({ x: ox + (b.i - b.j) * w, y: oy + (b.i + b.j) * hh - b.h });
  const hubs = blocks.filter((b) => b.hub).slice(0, 5).sort((a, b) => a.i - a.j - (b.i - b.j));
  const route = hubs.map((b, k) => { const p = pos(b); return `${k ? 'L' : 'M'}${p.x} ${p.y}`; }).join(' ');

  return (
    <g>
      <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e6fffb" />
        <stop offset="1" stopColor="#5eead4" />
      </linearGradient>
      {blocks.map((b, k) => {
        const { x, y } = pos(b);
        const top = `M${x} ${y - hh} L${x + w} ${y} L${x} ${y + hh} L${x - w} ${y} Z`;
        const left = `M${x - w} ${y} L${x} ${y + hh} L${x} ${y + hh + b.h} L${x - w} ${y + b.h} Z`;
        const right = `M${x + w} ${y} L${x} ${y + hh} L${x} ${y + hh + b.h} L${x + w} ${y + b.h} Z`;
        return (
          <g key={k}>
            <path d={left} fill={b.hub ? '#c2410c' : '#0f3b4a'} />
            <path d={right} fill={b.hub ? '#ea580c' : '#155e6e'} />
            <path d={top} fill={b.hub ? '#ffb38f' : `url(#${id}-top)`} opacity={b.hub ? 1 : 0.85} />
          </g>
        );
      })}
      <path d={route} fill="none" stroke="#ff6a3d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 7" className="gc-flow" filter={`url(#${id}-glow)`} />
      {hubs.map((b, k) => {
        const { x, y } = pos(b);
        return (
          <g key={k} transform={`translate(${x} ${y})`}>
            <circle r="14" fill="none" stroke="#ffd2bf" strokeWidth="1.5" className="gc-ping" style={{ animationDelay: `${k * 0.4}s` }} />
            <circle r="6" fill="#fff" filter={`url(#${id}-glow)`} />
          </g>
        );
      })}
      <g transform="translate(24 24)">
        <Glass id={id} x="0" y="0" w="128" h="46" r="12" />
        <text x="14" y="20" className="gc-label" fontSize="9" opacity="0.8">OPTIMAL ALLOCATION</text>
        <text x="14" y="37" className="gc-label" fontSize="14">LP + MILP ✓</text>
      </g>
    </g>
  );
}

/* ---------- 3. NLP incident pipeline: ticket cards flow into glowing topic clusters ---------- */
function Pipeline({ id, seed }) {
  const r = useMemo(() => rng(seed), [seed]);
  const dots = useMemo(() => Array.from({ length: 3 }, () => Array.from({ length: 11 }, () => [r() * 2 - 1, r() * 2 - 1])), [r]);
  const clusters = [{ x: 372, y: 90, c: '#22d3ee', t: 'ROOT CAUSE' }, { x: 395, y: 190, c: '#a78bfa', t: 'SENTIMENT' }, { x: 360, y: 285, c: '#ff6a3d', t: 'COST' }];
  const paths = clusters.map((c) => `M170 180 C 250 180, 260 ${c.y}, ${c.x - 34} ${c.y}`);

  return (
    <g>
      {[0, 1, 2, 3].map((k) => (
        <g key={k} transform={`translate(${40 + k * 16} ${88 + k * 26}) skewY(-6)`}>
          <Glass id={id} x="0" y="0" w="124" h="68" r="10" />
          <circle cx="16" cy="16" r="5" fill={['#22d3ee', '#a78bfa', '#ff6a3d', '#fbbf24'][k]} />
          <Bars x={28} y={13} widths={[70, 88, 54]} gap={14} h={5} />
        </g>
      ))}
      {paths.map((d, k) => (
        <g key={k}>
          <path d={d} fill="none" stroke={clusters[k].c} strokeWidth="2" opacity="0.55" strokeDasharray="4 6" className="gc-flow" />
          {!reduced && (
            <circle r="4" fill="#fff" filter={`url(#${id}-glow)`}>
              <animateMotion dur={`${2.4 + k * 0.5}s`} repeatCount="indefinite" path={d} />
            </circle>
          )}
        </g>
      ))}
      {clusters.map((c, k) => (
        <g key={k} transform={`translate(${c.x} ${c.y})`}>
          <circle r="46" fill={c.c} opacity="0.35" filter={`url(#${id}-soft)`} />
          <circle r="32" fill="none" stroke={c.c} strokeWidth="1.2" strokeDasharray="2 5" className="gc-spin" />
          {dots[k].map(([dx, dy], i) => <circle key={i} cx={dx * 22} cy={dy * 22} r={i % 4 ? 2.4 : 3.6} fill="#fff" opacity={0.85} />)}
          <text y="50" textAnchor="middle" className="gc-label" fontSize="8.5" opacity="0.85">{c.t}</text>
        </g>
      ))}
    </g>
  );
}

/* ---------- 4. Document AI: glass document with highlighted clauses, a scanning beam and extracted entities ---------- */
function DocumentAI({ id }) {
  const lines = [120, 150, 96, 140, 150, 110, 146, 84, 132, 150, 100];
  const hl = { 2: '#ff6a3d', 5: '#fbbf24', 8: '#fb7185' };
  return (
    <g>
      <clipPath id={`${id}-doc`}><rect x="0" y="0" width="190" height="250" rx="14" /></clipPath>
      <g transform="translate(70 58) rotate(-6)">
        <rect x="14" y="14" width="190" height="250" rx="14" fill="#000" opacity="0.35" filter={`url(#${id}-soft)`} />
        <Glass id={id} x="0" y="0" w="190" h="250" r="14" />
        <rect x="18" y="18" width="70" height="8" rx="4" fill="#fff" opacity="0.9" />
        {lines.map((w, i) => (
          <g key={i}>
            {hl[i] && <rect x="14" y={40 + i * 18} width={w + 8} height="12" rx="4" fill={hl[i]} opacity="0.45" />}
            <rect x="18" y={43 + i * 18} width={w} height="6" rx="3" fill="#fff" opacity={hl[i] ? 0.95 : 0.45} />
          </g>
        ))}
        <g clipPath={`url(#${id}-doc)`}>
          <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff6a3d" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffd2bf" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff6a3d" stopOpacity="0" />
          </linearGradient>
          <rect x="0" y="-40" width="190" height="40" fill={`url(#${id}-beam)`} className="gc-scan" />
        </g>
      </g>
      {[{ y: 92, c: '#ff6a3d', t: 'DATA SCOPE' }, { y: 150, c: '#fbbf24', t: 'RETENTION' }, { y: 208, c: '#fb7185', t: 'RISK: MED' }].map((e, k) => (
        <g key={k} transform={`translate(304 ${e.y})`}>
          <g className="gc-float" style={{ animationDelay: `${k * 0.5}s` }}>
            <path d={`M-38 ${14 + (k - 1) * 18} C -20 14, -12 14, 0 14`} fill="none" stroke={e.c} strokeWidth="1.5" opacity="0.7" />
            <Glass id={id} x="0" y="0" w="128" h="28" r="14" />
            <circle cx="16" cy="14" r="5" fill={e.c} filter={`url(#${id}-glow)`} />
            <text x="28" y="18" className="gc-label" fontSize="9.5">{e.t}</text>
          </g>
        </g>
      ))}
      <g transform="translate(404 272)">
        <path d="M0 -26 L20 -18 L20 2 C20 14 10 22 0 26 C-10 22 -20 14 -20 2 L-20 -18 Z" fill={`url(#${id}-accent)`} filter={`url(#${id}-glow)`} />
        <path d="M-8 0 L-2 7 L10 -7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/* ---------- 5. Geospatial dashboards: glass app window with map, pins, bars and a donut ---------- */
function Dashboard({ id }) {
  const pins = [[92, 150], [150, 118], [196, 176], [124, 206], [228, 136]];
  return (
    <g>
      <g transform="translate(36 44)">
        <rect x="10" y="14" width="408" height="276" rx="18" fill="#000" opacity="0.35" filter={`url(#${id}-soft)`} />
        <Glass id={id} x="0" y="0" w="408" h="272" r="18" />
        {[0, 1, 2].map((i) => <circle key={i} cx={20 + i * 14} cy="18" r="4" fill="#fff" opacity={0.5 - i * 0.12} />)}
        <Glass id={id} x="14" y="36" w="236" h="222" r="12" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${30 + i * 8} ${150 + i * 10} C ${70} ${60 + i * 16}, ${190 - i * 6} ${70 + i * 12}, ${230 - i * 10} ${130 + i * 8} S ${150} ${250 - i * 12}, ${30 + i * 8} ${150 + i * 10}`}
            fill="none" stroke="#7dd3fc" strokeWidth="1" opacity={0.25 + i * 0.12} />
        ))}
        {pins.map(([x, y], k) => (
          <g key={k} transform={`translate(${x} ${y})`}>
            <circle r="12" fill="none" stroke="#ffd2bf" strokeWidth="1.4" className="gc-ping" style={{ animationDelay: `${k * 0.35}s` }} />
            <circle r="5" fill={k === 2 ? '#fff' : '#ff6a3d'} filter={`url(#${id}-glow)`} />
          </g>
        ))}
        <path d="M204 184 l0 16 l5 -4 l4 8 l3 -1 l-4 -8 l6 0 z" fill="#fff" stroke="#0b1020" strokeWidth="1" />
        <Glass id={id} x="262" y="36" w="132" h="104" r="12" />
        {[40, 62, 50, 78, 66].map((bh, i) => (
          <rect key={i} x={276 + i * 22} y={128 - bh} width="13" height={bh} rx="3" fill={`url(#${id}-accent)`} className="gc-grow" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
        <Glass id={id} x="262" y="150" w="132" h="108" r="12" />
        <g transform="translate(328 204)">
          <circle r="32" fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="10" />
          <circle r="32" fill="none" stroke={`url(#${id}-accent)`} strokeWidth="10" strokeDasharray="140 201" strokeLinecap="round" transform="rotate(-90)" className="gc-donut" />
          <text y="5" textAnchor="middle" className="gc-label" fontSize="14">70%</text>
        </g>
      </g>
    </g>
  );
}

/* ---------- 6. Agentic loop: glossy spheres linked by a glowing perceive → decide → act loop ---------- */
function Loop({ id }) {
  const nodes = [{ x: 130, y: 220, t: 'PERCEIVE', c: '#22d3ee' }, { x: 240, y: 100, t: 'DECIDE', c: '#a78bfa' }, { x: 350, y: 220, t: 'ACT', c: '#ff6a3d' }];
  const loop = 'M130 220 C 130 130, 190 100, 240 100 C 290 100, 350 130, 350 220 C 350 300, 130 300, 130 220 Z';
  return (
    <g>
      <path d={loop} fill="none" stroke={`url(#${id}-accent)`} strokeWidth="3" opacity="0.9" filter={`url(#${id}-glow)`} />
      <path d={loop} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 10" className="gc-flow" opacity="0.7" />
      {!reduced && (
        <circle r="6" fill="#fff" filter={`url(#${id}-glow)`}>
          <animateMotion dur="4s" repeatCount="indefinite" path={loop} />
        </circle>
      )}
      {nodes.map((n, k) => (
        <g key={k} transform={`translate(${n.x} ${n.y})`}>
          <radialGradient id={`${id}-s${k}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.25" stopColor={n.c} />
            <stop offset="1" stopColor="#1a0b2e" />
          </radialGradient>
          <circle r="54" fill={n.c} opacity="0.35" filter={`url(#${id}-soft)`} />
          <circle r="36" fill={`url(#${id}-s${k})`} />
          <ellipse cx="-10" cy="-14" rx="12" ry="7" fill="#fff" opacity="0.45" transform="rotate(-25)" />
          <text y="58" textAnchor="middle" className="gc-label" fontSize="10">{n.t}</text>
        </g>
      ))}
    </g>
  );
}

const ART = { agent: Agent, isomap: IsoMap, pipeline: Pipeline, document: DocumentAI, dashboard: Dashboard, loop: Loop };
const ACCENT = {
  agent: ['#ff6a3d', '#ff2e88'],
  isomap: ['#ff6a3d', '#fbbf24'],
  pipeline: ['#22d3ee', '#a78bfa'],
  document: ['#ff6a3d', '#fbbf24'],
  dashboard: ['#38bdf8', '#ff6a3d'],
  loop: ['#22d3ee', '#ff6a3d'],
};

export default function GenCover({ type, seed }) {
  const Art = ART[type] ?? Agent;
  const id = `gc-${seed}`.replace(/[^a-z0-9-]/gi, '');
  const [c1, c2] = ACCENT[type] ?? ACCENT.agent;
  return (
    <div className={`gc gc-${type}`} aria-hidden="true">
      <i className="gc-blob b1" /><i className="gc-blob b2" /><i className="gc-blob b3" />
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <Defs id={id} c1={c1} c2={c2} />
        <Art id={id} seed={seed} />
      </svg>
      <span className="gc-grain" />
    </div>
  );
}
