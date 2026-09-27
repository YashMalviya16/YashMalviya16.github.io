import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { profile } from '../data.js';
import { lockScroll } from '../lib/smoothScroll.js';
import { ease, Plus } from './ui.jsx';

const links = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

function Menu({ onClose }) {
  useEffect(() => {
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="ed-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: 'circle(0% at calc(100% - 48px) 36px)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 48px) 36px)', transition: { duration: 0.9, ease } }}
      exit={{ clipPath: 'circle(0% at calc(100% - 48px) 36px)', transition: { duration: 0.6, ease } }}
      data-lenis-prevent
    >
      <div className="ed-wrap ed-menu-grid">
        <nav aria-label="Menu">
          <ul className="ed-menu-links">
            {links.map((l, i) => (
              <li key={l.href} className="mask">
                <motion.a
                  href={l.href}
                  // Unlock scrolling before the smooth-scroll anchor handler runs (it fires right after).
                  onClick={() => { lockScroll(false); onClose(); }}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%', transition: { duration: 0.8, ease, delay: 0.25 + i * 0.07 } }}
                  exit={{ y: '110%', transition: { duration: 0.3 } }}
                >
                  <span>{l.label}</span>
                  <Plus />
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.aside
          className="ed-menu-info"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.8, ease, delay: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div><small>Email</small><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
          {profile.showPhone && <div><small>Phone</small><a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a></div>}
          <div><small>Based in</small><span>{profile.location}</span></div>
          <div><small>Currently</small><span>{profile.role}, {profile.orgShort}</span></div>
          <div className="ed-menu-social">
            <a href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn</a>
            <a href={profile.links.github} target="_blank" rel="noopener">GitHub</a>
            <a href={profile.resume} target="_blank" rel="noopener">Résumé</a>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const [onHero, setOnHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const hero = document.getElementById('top');
    setOnHero(y < (hero?.offsetHeight ?? 600) - 80);
    if (y > prev && y > 500) setHidden(true);
    else if (y < prev) setHidden(false);
  });

  return (
    <>
      <motion.header
        className={`ed-header ${onHero && !open ? 'on-hero' : ''} ${open ? 'menu-open' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: hidden && !open ? -80 : 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="ed-wrap ed-header-row">
          <a href="#top" className="ed-logo">{profile.name}<sup>●</sup></a>
          <nav className="ed-header-links" aria-label="Main">
            {links.slice(1).map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
          <button
            className="ed-burger"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </motion.header>
      <AnimatePresence>{open && <Menu onClose={close} />}</AnimatePresence>
    </>
  );
}
