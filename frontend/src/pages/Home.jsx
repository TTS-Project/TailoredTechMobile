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
      {/* Public lead-in: the 7-section calibration scroll. */}
      <SnapScrollHero />
      {/* Everything below — including the "We Build Intelligence Tailored" hero
          — is gated behind authentication. Users see Calibration Complete and
          then the sign-in/sign-up gate. After auth, the brand hero is the FIRST
          thing they see. */}
      <AuthGate>
        <Hero />
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
