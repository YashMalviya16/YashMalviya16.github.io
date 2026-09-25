import { useEffect, useRef } from 'react';

// Animated "neural network" canvas used as the hero background: drifting nodes, links between
// nearby nodes, signal pulses travelling along links, and a cursor that gently pulls nodes in.
// Pauses when off-screen or the tab is hidden; draws a single still frame for reduced-motion users.
export default function NeuralField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5eead4';
    const rgb = hexToRgb(accent);

    let w = 0, h = 0, dpr = 1, nodes = [], pulses = [], raf = 0, visible = true, t = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    const LINK = 150;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 11000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        phase: Math.random() * Math.PI * 2,
      }));
      pulses = [];
    }

    function spawnPulse() {
      const a = nodes[(Math.random() * nodes.length) | 0];
      let best = null, bestD = LINK;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < bestD && Math.random() > 0.4) { best = b; bestD = d; }
      }
      if (best) pulses.push({ a, b: best, p: 0, speed: 0.012 + Math.random() * 0.02 });
    }

    function frame() {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (mouse.active) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
          if (d < 220 && d > 1) { n.vx += (dx / d) * 0.012; n.vy += (dy / d) * 0.012; }
        }
        n.vx *= 0.985; n.vy *= 0.985;
        n.vx += (Math.random() - 0.5) * 0.02; n.vy += (Math.random() - 0.5) * 0.02;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.35;
          ctx.strokeStyle = `rgba(${rgb},${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d > 200) continue;
          ctx.strokeStyle = `rgba(${rgb},${(1 - d / 200) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }

      for (const n of nodes) {
        const glow = 0.55 + Math.sin(t * 0.03 + n.phase) * 0.35;
        ctx.fillStyle = `rgba(${rgb},${glow})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }

      if (t % 9 === 0 && pulses.length < 26) spawnPulse();
      pulses = pulses.filter((s) => (s.p += s.speed) < 1);
      for (const s of pulses) {
        const x = s.a.x + (s.b.x - s.a.x) * s.p, y = s.a.y + (s.b.y - s.a.y) * s.p;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, `rgba(${rgb},0.95)`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      }

      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function play() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= r.height;
    };
    const onLeave = () => { mouse.active = false; };
    const onVis = () => { if (!document.hidden && visible && !reduce) play(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduce) play(); });
    const ro = new ResizeObserver(() => { resize(); if (reduce) frame(); });

    resize();
    if (reduce) frame(); else play();
    io.observe(canvas);
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="neural-field" aria-hidden="true" />;
}

function hexToRgb(hex) {
  const m = hex.replace('#', '');
  const v = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
}
