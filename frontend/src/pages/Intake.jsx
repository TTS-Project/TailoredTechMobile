import React from 'react';
import { Nav } from '../components/tts/Nav';
import { IntakeForm } from '../components/tts/IntakeForm';
import { Footer } from '../components/tts/Footer';

export default function IntakePage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-24 bg-void">
        <div className="absolute inset-0 circuit-grid opacity-[0.45] pointer-events-none" />
        <div className="absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(212,168,67,0.12), transparent 60%)', filter:'blur(40px)'}} />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="eyebrow">Intake</div>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-chrome">
              AI Readiness <span className="gold-text-gradient">Diagnostic.</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-secondary-soft leading-relaxed">
              21 questions across 7 dimensions — designed to reveal exactly where AI will deliver the highest ROI for your operation. No wrong answers.
            </p>
          </div>
          <div className="mt-10 sm:mt-12">
            <IntakeForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
