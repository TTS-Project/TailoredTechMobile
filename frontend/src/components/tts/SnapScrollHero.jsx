import React, { useEffect, useRef, useState } from 'react';

const IMAGES = [
  '/hero/Gemini_Generated_Image_31m5uu31m5uu31m5.jpeg',
  '/hero/Gemini_Generated_Image_5eb8nq5eb8nq5eb8.jpeg',
  '/hero/Gemini_Generated_Image_9q6xun9q6xun9q6x.jpeg',
  '/hero/Gemini_Generated_Image_kvdguxkvdguxkvdg.jpeg',
  '/hero/Gemini_Generated_Image_m862yym862yym862.jpeg',
  '/hero/Gemini_Generated_Image_whv98mwhv98mwhv9.jpeg',
  '/hero/Gemini_Generated_Image_wmwb6uwmwb6uwmwb.jpeg',
];

const SECTIONS = [
  { step: 'Step 01 — Ignition', title: ['Initiating', 'Tailoring'], sub: 'Every transformation begins with a single point of contact. Your vision, our precision — the sequence starts now.' },
  { step: 'Step 02 — Build', title: ['Fabricating', 'Circuits'], sub: 'Precision-etched logic meets custom architecture. We construct the intelligence layer your business demands.' },
  { step: 'Step 03 — Power', title: ['Energizing', 'Modules'], sub: 'Core systems brought online. AI modules initialize, drawing power from a purpose-built infrastructure.' },
  { step: 'Step 04 — Deploy', title: ['Transporting', 'Completed Module'], sub: 'Finished systems moved into position. Deployment is not the end — it is the moment your product becomes real.' },
  { step: 'Step 05 — Install', title: ['Mounting', 'Completed Module'], sub: 'Integration executed. Your tailored solution locked into the environment it was built to serve.' },
  { step: 'Step 06 — Sync', title: ['Calibrating', 'Biometric Link'], sub: 'Signal integrity confirmed. System and operator achieve full synchronization — man and machine, aligned.' },
  { step: 'Step 07 — Ready', title: ['Calibration', 'Complete'], sub: 'Bio-gel matrix optimized and locked. Suit deployment readiness: optimal. Link stable at 100%. You are ready.' },
];

export function SnapScrollHero() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.idx);
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.intersectionRatio > 0.5) setActive(idx);
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (i) => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="snap-hero-root" id="top" style={{ scrollSnapType: 'y mandatory' }}>
      <nav className="progress-rail" aria-label="Section progress">
        {SECTIONS.map((_, i) => (
          <button key={i} className={`progress-dot ${i === active ? 'active' : ''}`} onClick={() => scrollTo(i)} aria-label={`Go to section ${i + 1}`} />
        ))}
      </nav>
      <div className="section-counter">
        <span>{String(active + 1).padStart(2, '0')}</span> / {String(SECTIONS.length).padStart(2, '0')}
      </div>
      {SECTIONS.map((s, i) => {
        const Heading = i === 0 ? 'h1' : 'h2';
        return (
          <section key={i} ref={(el) => (sectionRefs.current[i] = el)} data-idx={i} className="section">
            <div className="section__bg" style={{ backgroundImage: `url(${IMAGES[i]})` }} />
            <div className="section__content">
              <div className="section__step">{s.step}</div>
              <div className="section__line" />
              {i === 0 ? (
                <h1 className="section__title">Tailored Tech Solutions — Bespoke AI Software Studio</h1>
              ) : (
                <Heading className="section__title">{s.title[0]}<br />{s.title[1]}</Heading>
              )}
              <p className="section__sub">{s.sub}</p>
            </div>
            {i === 0 && (
              <div className={`scroll-hint ${active !== 0 ? 'hidden' : ''}`}>
                <span className="scroll-hint__label">Scroll</span>
                <span className="scroll-hint__arrow" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
