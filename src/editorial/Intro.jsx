import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
import { profile } from '../data.js';
import * as ambient from '../lib/ambient.js';
import { lockScroll } from '../lib/smoothScroll.js';
import { ease } from './ui.jsx';

// Cinematic "step into the future" intro, played once per browser session:
//   gate (drifting stars, Enter button) → warp (stars streak, boot lines, counter)
//   → arrival (flash + orange circle that opens onto the orange hero).

const BOOT = ['Initializing neural network', 'Loading 2M+ synthetic records', 'Deploying agents', 'Arriving'];
const WARP_MS = 3200;

export function shouldPlayIntro() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (new URLSearchParams(location.search).has('nointro')) return false;
    return !sessionStorage.getItem('ed-intro-seen');
  } catch {
    return false;
  }
}

// Starfield: stars drift slowly at the gate; speed ramps up into light-speed streaks on warp.
function useStarfield(canvasRef, speedRef) {
  useEffect(() => {
    const c = canvasRef.current;
    const g = c.getContext('2d');
    let w = 0, h = 0, raf = 0;
    const N = 700;
    const stars = [];

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (s, far) => {
      s.x = (Math.random() - 0.5) * 2;
      s.y = (Math.random() - 0.5) * 2;
      s.z = far ? 1 : Math.random();
      s.pz = s.z;
      s.warm = Math.random() < 0.18;
    };
    for (let i = 0; i < N; i++) { const s = {}; spawn(s, false); stars.push(s); }
    resize();

    const frame = () => {
      const speed = speedRef.current;
      g.fillStyle = `rgba(5,5,7,${speed > 0.02 ? 0.35 : 1})`;
      g.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, f = Math.max(w, h) * 0.5;
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0.01) { spawn(s, true); continue; }
        const x = cx + (s.x / s.z) * f, y = cy + (s.y / s.z) * f;
        const px = cx + (s.x / s.pz) * f, py = cy + (s.y / s.pz) * f;
        if (x < -50 || x > w + 50 || y < -50 || y > h + 50) { spawn(s, true); continue; }
        const a = Math.min(1, (1 - s.z) * 1.4);
        g.strokeStyle = s.warm ? `rgba(255,140,90,${a})` : `rgba(235,240,255,${a})`;
        g.lineWidth = Math.max(0.6, (1 - s.z) * 2.4);
        g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, [canvasRef, speedRef]);
}

export default function Intro({ onReveal, onDone }) {
  const [phase, setPhase] = useState('gate'); // gate | warp | arrive
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(0);
  const canvasRef = useRef(null);
  const speedRef = useRef(0.0009);
  const enterRef = useRef(null);
  useStarfield(canvasRef, speedRef);

  useEffect(() => {
    lockScroll(true);
    enterRef.current?.focus();
    return () => lockScroll(false);
  }, []);

  const finish = useCallback(() => {
    try { sessionStorage.setItem('ed-intro-seen', '1'); } catch { /* storage blocked */ }
    onDone();
  }, [onDone]);

  const arrive = useCallback(() => {
    setPhase('arrive');
    ambient.impact();
    onReveal();
    setTimeout(finish, 1100);
  }, [onReveal, finish]);

  const enter = useCallback((withSound) => {
    if (phase !== 'gate') return;
    if (withSound) { ambient.start(); ambient.riser(WARP_MS / 1000); } else ambient.setMuted(true);
    setPhase('warp');
    // Accelerate the stars into streaks.
    animate(speedRef.current, 0.06, { duration: WARP_MS / 1000, ease: [0.7, 0, 0.84, 0], onUpdate: (v) => { speedRef.current = v; } });
    animate(0, 100, { duration: WARP_MS / 1000, ease: 'easeIn', onUpdate: (v) => setPct(Math.round(v)) });
    BOOT.forEach((_, i) => setTimeout(() => setLine(i), (i * WARP_MS) / BOOT.length));
    setTimeout(arrive, WARP_MS);
  }, [phase, arrive]);

  // Skip straight to the site (Esc or the Skip button).
  const skip = useCallback(() => {
    if (phase === 'arrive') return;
    onReveal();
    finish();
  }, [phase, onReveal, finish]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && skip();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [skip]);

  return (
    <motion.div
      className="ed-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Intro"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <canvas ref={canvasRef} className="ed-intro-stars" aria-hidden="true" />

      <AnimatePresence>
        {phase === 'gate' && (
          <motion.div
            className="ed-intro-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)', transition: { duration: 0.6, ease } }}
          >
            <motion.span className="ed-intro-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
              {profile.name} · Portfolio {new Date().getFullYear()}
            </motion.span>
            <h1 className="ed-intro-title">
              {['Step', 'into', 'the', 'future'].map((w, i) => (
                <span key={w}>
                  <span className="mask">
                    <motion.span className="mask-inner" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ delay: 0.5 + i * 0.12, duration: 1, ease }}>
                      {w}
                    </motion.span>
                  </span>
                  {i < 3 && ' '}
                </span>
              ))}
            </h1>
            <motion.div className="ed-intro-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8, ease }}>
              <button ref={enterRef} className="ed-intro-enter" onClick={() => enter(true)} aria-label="Enter with sound">
                <span className="ed-intro-ring" aria-hidden="true" />
                Enter
                <small>with sound</small>
              </button>
              <button className="ed-intro-silent" onClick={() => enter(false)}>Enter without sound</button>
            </motion.div>
            <motion.p className="ed-intro-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              Best with headphones
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'warp' && (
        <div className="ed-intro-boot" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={line} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }} transition={{ duration: 0.35 }}>
              {BOOT[line]}<span className="ed-intro-dots" />
            </motion.p>
          </AnimatePresence>
          <div className="ed-intro-pct">{String(pct).padStart(3, '0')}</div>
        </div>
      )}

      {phase !== 'arrive' && phase !== 'gate' && (
        <button className="ed-intro-skip" onClick={skip}>Skip intro</button>
      )}
      {phase === 'gate' && (
        <button className="ed-intro-skip" onClick={skip}>Skip</button>
      )}

      {phase === 'arrive' && (
        <>
          <motion.div className="ed-intro-flash" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />
          <motion.div
            className="ed-intro-portal"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}
    </motion.div>
  );
}

// Floating speaker toggle. If the visitor skipped sound, turning it on starts the music
// (the click counts as the user gesture browsers require).
export function SoundToggle() {
  const [muted, setMuted] = useState(!ambient.isStarted() || ambient.isMuted());
  useEffect(() => ambient.onMuteChange(setMuted), []);

  const toggle = () => {
    if (!ambient.isStarted()) {
      ambient.setMuted(false);
      ambient.start();
      ambient.groove();
      return;
    }
    ambient.setMuted(!muted);
  };

  return (
    <motion.button
      className={`ed-sound ${muted ? 'is-muted' : ''}`}
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6, ease }}
    >
      <span className="ed-sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      {muted ? 'Sound off' : 'Sound on'}
    </motion.button>
  );
}
