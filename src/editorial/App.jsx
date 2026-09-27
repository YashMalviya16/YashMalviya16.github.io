import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { startSmoothScroll } from '../lib/smoothScroll.js';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Work from './Work.jsx';
import { Achievements, Contact, Experience, Footer, Intro, Orgs, Process, Toolkit } from './Sections.jsx';
import './editorial.css';

export default function EditorialApp() {
  useEffect(() => startSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="ed">
        <Hero />
        <Orgs />
        <Intro />
        <Work />
        <Process />
        <Experience />
        <Achievements />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
