import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { startSmoothScroll } from '../lib/smoothScroll.js';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Intro, { shouldPlayIntro, SoundToggle } from './Intro.jsx';
import Work from './Work.jsx';
import { Achievements, Contact, Experience, Footer, Intro as About, Kpis, Orgs, Process, Toolkit } from './Sections.jsx';
import './editorial.css';

export default function EditorialApp() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  // The hero mounts at the moment of "arrival" so its entrance animation plays as the portal opens.
  const [revealed, setRevealed] = useState(!intro);
  const reveal = useCallback(() => setRevealed(true), []);
  const done = useCallback(() => setIntro(false), []);

  useEffect(() => startSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{intro && <Intro key="intro" onReveal={reveal} onDone={done} />}</AnimatePresence>
      <a className="skip-link" href="#main">Skip to content</a>
      {revealed && <Header />}
      <main id="main" className="ed">
        {revealed ? <Hero /> : <section id="top" className="ed-hero" aria-hidden="true" />}
        <Orgs />
        <About />
        <Kpis />
        <Experience />
        <Achievements />
        <Work />
        <Process />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
      {!intro && <SoundToggle />}
    </MotionConfig>
  );
}
