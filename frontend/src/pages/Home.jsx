import React from 'react';
import { Nav } from '../components/tts/Nav';
import { SnapScrollHero } from '../components/tts/SnapScrollHero';
import { Hero } from '../components/tts/Hero';
import { Marquee } from '../components/tts/Marquee';
import { Services } from '../components/tts/Services';
import { Projects } from '../components/tts/Projects';
import { Founders } from '../components/tts/Founders';
import { Markets } from '../components/tts/Markets';
import { Frameworks } from '../components/tts/Frameworks';
import { Stack } from '../components/tts/Stack';
import { Testimonials } from '../components/tts/Testimonials';
import { IntakeSection } from '../components/tts/IntakeSection';
import { Footer } from '../components/tts/Footer';
import { AuthGate } from '../components/tts/AuthGate';

export default function Home() {
  return (
    <div>
      <Nav />
      {/* Hero stays fully visible to everyone. */}
      <SnapScrollHero />
      <Hero />
      {/* Everything below the Hero is gated behind authentication. */}
      <AuthGate>
        <Marquee />
        <Services />
        <Projects />
        <Founders />
        <Markets />
        <Frameworks />
        <Stack />
        <Testimonials />
        <IntakeSection />
        <Footer />
      </AuthGate>
    </div>
  );
}
