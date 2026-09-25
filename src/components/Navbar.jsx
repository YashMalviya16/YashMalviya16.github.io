import { useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { nav, profile } from '../data.js';
import { Close, Menu } from './Icons.jsx';

export default function Navbar({ ready = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // Solid background once scrolled; slide away when scrolling down, come back when scrolling up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    if (y > prev && y > 400) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...nav.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <motion.header
      className={`nav${scrolled || open ? ' scrolled' : ''}`}
      initial={{ y: '-100%' }}
      animate={{ y: ready && !(hidden && !open) ? '0%' : '-100%' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: ready && !scrolled ? 0.9 : 0 }}
    >
      <nav className="container" aria-label="Main">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          {profile.name.split(' ')[0]}<span>.</span>
        </a>

        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close /> : <Menu />}
        </button>

        <ul id="nav-links" className="nav-links" data-open={open}>
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? 'active' : undefined}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {active === item.id && (
                  <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a className="btn btn-primary nav-cta" href={profile.resume} target="_blank" rel="noopener">
              Résumé
            </a>
          </li>
        </ul>
      </nav>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
    </motion.header>
  );
}
