import React from 'react';
import { Nav } from '../components/tts/Nav';
import { SnapScrollHero } from '../components/tts/SnapScrollHero';
import { Hero } from '../components/tts/Hero';
import { Marquee } from '../components/tts/Marquee';
import { Services } from '../components/tts/Services';
import { Projects } from '../components/tts/Projects';
import { Terra } from '../components/tts/Terra';
import { Founders } from '../components/tts/Founders';
import { Markets } from '../components/tts/Markets';
import { Frameworks } from '../components/tts/Frameworks';
import { Stack } from '../components/tts/Stack';
import { Testimonials } from '../components/tts/Testimonials';
import { Contact } from '../components/tts/Contact';
import { Footer } from '../components/tts/Footer';

export default function Home() {
  return (
    <div>
      <Nav />
      <SnapScrollHero />
      <Hero />
      <Marquee />
      <Services />
      <Projects />
      <Terra />
      <Founders />
      <Markets />
      <Frameworks />
      <Stack />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
