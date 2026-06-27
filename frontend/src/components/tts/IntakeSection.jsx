import React from 'react';
import { IntakeForm } from './IntakeForm';

export function IntakeSection() {
  return (
    <section id="contact" className="relative py-20 sm:py-24 md:py-32 bg-void overflow-hidden">
      <div className="absolute inset-0 circuit-grid opacity-[0.45]" />
      <div className="absolute -top-40 left-1/3 w-[520px] h-[520px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(212,168,67,0.12), transparent 60%)', filter:'blur(40px)'}} />
      <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="eyebrow">Begin</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold tracking-tight text-chrome">
            AI Readiness <span className="gold-text-gradient">Diagnostic.</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-secondary-soft leading-relaxed">
            21 questions across 7 dimensions — designed to reveal exactly where AI will deliver the highest ROI for your operation. No wrong answers.
          </p>
        </div>
        <div className="mt-10 sm:mt-12">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
