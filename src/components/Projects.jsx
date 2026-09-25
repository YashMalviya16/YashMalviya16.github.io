import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import { archive, profile, projects } from '../data.js';
import { lockScroll } from '../lib/smoothScroll.js';
import useMediaQuery from '../lib/useMediaQuery.js';
import { ArrowRight, Close, External, GitHub } from './Icons.jsx';
import ProjectCover from './ProjectCover.jsx';
import Reveal, { SplitHeading, ease } from './Reveal.jsx';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'Agentic & LLM' },
  { id: 'data', label: 'Data & Geo' },
  { id: 'research', label: 'Research' },
];
const allProjects = [...projects, ...archive];

function Media({ p, eager }) {
  return p.image
    ? <img src={p.image} alt="" width="960" height="600" loading={eager ? undefined : 'lazy'} decoding="async" />
    : <ProjectCover art={p.art} seed={p.id} />;
}

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      data-lenis-prevent
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 60, clipPath: 'inset(20% 10% 20% 10% round 20px)' }}
        animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 20px)' }}
        exit={{ opacity: 0, y: 30, clipPath: 'inset(10% 5% 10% 5% round 20px)' }}
        transition={{ duration: 0.55, ease }}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close project details">
          <Close />
        </button>
        <div className="modal-media">
          <motion.div className="modal-media-inner" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.1, ease }}>
            <Media p={project} eager />
          </motion.div>
        </div>
        <motion.div
          className="modal-body"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
        >
          {[
            <span className="card-kind" key="k">{project.kicker}</span>,
            <h3 id="modal-title" key="t">{project.title}</h3>,
            <p key="s">{project.summary}</p>,
            <ul key="d">{project.details.map((d) => <li key={d}>{d}</li>)}</ul>,
            <ul className="chips" aria-label="Tools" key="c">{project.tags.map((t) => <li className="chip" key={t}>{t}</li>)}</ul>,
            <div className="modal-actions" key="a">
              {project.link ? (
                <a className="btn btn-primary" href={project.link} target="_blank" rel="noopener">
                  <GitHub /> View on GitHub <External />
                </a>
              ) : (
                project.linkLabel && <span className="muted-note">{project.linkLabel}</span>
              )}
            </div>,
          ].map((el) => (
            <motion.div key={el.key} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
              {el}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ p, index, onOpen }) {
  return (
    <motion.article
      layout
      className="card"
      data-cursor="View"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.07 }}
    >
      <div className="card-media">
        <Media p={p} />
        <span className="card-num">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="card-body">
        <span className="card-kind">{p.kicker}</span>
        <h3>
          <button className="card-link" onClick={() => onOpen(p.id)} aria-haspopup="dialog">
            {p.title}
          </button>
        </h3>
        <p>{p.summary}</p>
        <ul className="chips">
          {p.tags.slice(0, 3).map((t) => <li className="chip" key={t}>{t}</li>)}
        </ul>
        <span className="card-more" aria-hidden="true">Details <ArrowRight /></span>
      </div>
    </motion.article>
  );
}

// Compact list of earlier projects. On desktop, hovering a row shows a floating preview that follows the cursor.
function Archive({ onOpen }) {
  const fine = useMediaQuery('(pointer: fine)');
  const [hover, setHover] = useState(null);
  const x = useSpring(0, { stiffness: 250, damping: 28 });
  const y = useSpring(0, { stiffness: 250, damping: 28 });
  const hovered = archive.find((p) => p.id === hover);

  return (
    <section className="archive" aria-labelledby="archive-title" onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY); }}>
      <div className="container">
        <Reveal as="h3" id="archive-title" className="col-title">Earlier work</Reveal>
        <ul className="archive-list" onPointerLeave={() => setHover(null)}>
          {archive.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease, delay: i * 0.05 }}
            >
              <button className="archive-row" onClick={() => onOpen(p.id)} onPointerEnter={() => setHover(p.id)} data-cursor="View" aria-haspopup="dialog">
                <span className="archive-title">{p.title}</span>
                <span className="archive-kind">{p.kicker}</span>
                <ArrowRight />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {fine && (
        <motion.div className="archive-preview" style={{ x, y }} aria-hidden="true">
          <AnimatePresence>
            {hovered && (
              <motion.img
                key={hovered.id}
                src={hovered.image}
                alt=""
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);
  const shown = projects.filter((p) => filter === 'all' || p.category === filter);
  const openProject = allProjects.find((p) => p.id === openId);

  // Desktop with a mouse: pin the section and move the cards sideways as you scroll down.
  const horizontal = useMediaQuery('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return;
    const measure = () => {
      const track = trackRef.current;
      if (track) setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [horizontal, filter]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -distance]), { stiffness: 140, damping: 30, mass: 0.4 });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  return (
    <>
    <section
      id="projects"
      ref={sectionRef}
      className={horizontal ? 'projects-horizontal' : undefined}
      style={horizontal ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={horizontal ? 'projects-sticky' : undefined}>
        <div className="container projects-top">
          <div className="section-head">
            <Reveal as="span" className="eyebrow">Projects</Reveal>
            <SplitHeading text="Selected work." />
            <Reveal as="p" className="lead" delay={0.1}>Agentic AI, data platforms and published research. Select a project for details.</Reveal>
          </div>

          <Reveal className="filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {filter === f.id && (
                  <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                <span>{f.label}</span>
              </button>
            ))}
          </Reveal>
        </div>

        <div className="project-viewport">
          <motion.div ref={trackRef} className="project-track" style={horizontal ? { x } : undefined} layout={!horizontal}>
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => <ProjectCard key={p.id} p={p} index={i} onOpen={setOpenId} />)}
            </AnimatePresence>
            <motion.a
              layout
              key="more"
              className="card card-end"
              href={profile.links.github}
              target="_blank"
              rel="noopener"
              data-cursor="Open"
            >
              <GitHub />
              <strong>More on GitHub</strong>
              <span>Code, notebooks and experiments</span>
            </motion.a>
          </motion.div>
        </div>

        {horizontal && (
          <div className="container">
            <div className="track-progress" aria-hidden="true"><motion.i style={{ scaleX: progress }} /></div>
          </div>
        )}
      </div>

    </section>

    <Archive onOpen={setOpenId} />

    <AnimatePresence>
      {openProject && <ProjectModal project={openProject} onClose={close} />}
    </AnimatePresence>
    </>
  );
}
