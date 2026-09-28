import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { archive, projects } from '../data.js';
import { lockScroll } from '../lib/smoothScroll.js';
import useMediaQuery from '../lib/useMediaQuery.js';
import ProjectCover from '../components/ProjectCover.jsx';
import GenCover from './GenCover.jsx';
import { ArrowUpRight, BlurHeading, ease, Pill, Plus } from './ui.jsx';

function Media({ p, where = 'card' }) {
  if (p.image) return <img src={p.image} alt="" width="960" height="720" loading="lazy" decoding="async" />;
  if (p.gen) return <GenCover type={p.gen} seed={`${where}-${p.id}`} />;
  return <ProjectCover art={p.art} seed={p.id} />;
}

export function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div className="ed-modal-backdrop" onClick={onClose} data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="ed-modal" role="dialog" aria-modal="true" aria-labelledby="ed-modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.7, ease }}
      >
        <button ref={closeRef} className="ed-modal-close" onClick={onClose} aria-label="Close project">
          <Plus />
        </button>
        <div className="ed-modal-media"><Media p={project} where="modal" /></div>
        <div className="ed-modal-body">
          <span className="ed-kicker">{project.kicker}</span>
          <h3 id="ed-modal-title">{project.title}</h3>
          <p className="ed-modal-summary">{project.summary}</p>
          <ul className="ed-modal-points">{project.details.map((d) => <li key={d}>{d}</li>)}</ul>
          <ul className="ed-tags">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          {project.link
            ? <a className="ed-btn" href={project.link} target="_blank" rel="noopener">View on GitHub <ArrowUpRight /></a>
            : project.linkLabel && <p className="ed-note">{project.linkLabel}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Card({ p, i, onOpen }) {
  return (
    <motion.article
      className="ed-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease }}
    >
      <button className="ed-card-hit" onClick={() => onOpen(p.id)} aria-haspopup="dialog" aria-label={`Open ${p.title}`} />
      <div className="ed-card-media">
        <Media p={p} />
        <span className="ed-card-view" aria-hidden="true">View <ArrowUpRight /></span>
      </div>
      <div className="ed-card-label">
        <span><i aria-hidden="true" /> {p.title}</span>
        <span>{String(i + 1).padStart(2, '0')}</span>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);
  const open = [...projects, ...archive].find((p) => p.id === openId);
  const wide = useMediaQuery('(min-width: 800px)');

  // Two columns that scroll at different speeds.
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const slow = useTransform(scrollYProgress, [0, 1], [120, -120]);

  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <section id="work" className="ed-section">
      <div className="ed-wrap">
        <Pill>Portfolio</Pill>
        <BlurHeading text="Selected|projects." />

        <div className="ed-work" ref={ref}>
          {wide ? (
            <>
              <div className="ed-work-col">{left.map((p) => <Card key={p.id} p={p} i={projects.indexOf(p)} onOpen={setOpenId} />)}</div>
              <motion.div className="ed-work-col is-offset" style={{ y: slow }}>
                {right.map((p) => <Card key={p.id} p={p} i={projects.indexOf(p)} onOpen={setOpenId} />)}
              </motion.div>
            </>
          ) : (
            <div className="ed-work-col">{projects.map((p, i) => <Card key={p.id} p={p} i={i} onOpen={setOpenId} />)}</div>
          )}
        </div>
      </div>

      <EarlierWork onOpen={setOpenId} />

      <AnimatePresence>{open && <ProjectModal project={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}

// FAQ-style accordion for older projects.
function EarlierWork({ onOpen }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="ed-wrap ed-earlier">
      <div className="ed-earlier-head">
        <Pill>Archive</Pill>
        <BlurHeading text="Earlier|work" />
      </div>
      <ul className="ed-accordion">
        {archive.map((p, i) => {
          const isOpen = expanded === p.id;
          return (
            <motion.li key={p.id} className={isOpen ? 'is-open' : undefined}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}>
              <button className="ed-acc-q" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : p.id)}>
                <span>{p.title}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div className="ed-acc-a"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease }}>
                    <div className="ed-acc-inner">
                      <p>{p.summary}</p>
                      <button className="ed-link" onClick={() => onOpen(p.id)}>See details <ArrowUpRight /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
