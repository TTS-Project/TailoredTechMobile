import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Nav } from '../components/tts/Nav';
import { IntakeForm } from '../components/tts/IntakeForm';
import { Footer } from '../components/tts/Footer';

export default function IntakePage() {
  const [params] = useSearchParams();
  const paid = params.get('paid') === 'true';
  const orderId = params.get('order') || '';
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-24 bg-void">
        <div className="absolute inset-0 circuit-grid opacity-[0.45] pointer-events-none" />
        <div className="absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(212,168,67,0.12), transparent 60%)', filter:'blur(40px)'}} />
        <div className="relative max-w-[1100px] mx-auto px-5 sm:px-6 md:px-12">
          {paid && (
            <div
              data-testid="intake-payment-success"
              className="mb-8 sm:mb-10 rounded-2xl p-5 sm:p-6 flex items-start gap-4 tts-gate-fade-in"
              style={{
                background: 'linear-gradient(135deg, rgba(122,196,98,0.10), rgba(13,13,26,0.6))',
                border: '1px solid rgba(122,196,98,0.45)',
              }}
            >
              <div className="shrink-0 w-11 h-11 rounded-full inline-flex items-center justify-center"
                style={{ background: 'rgba(122,196,98,0.15)', border: '1px solid rgba(122,196,98,0.55)' }}>
                <CheckCircle2 size={20} className="text-[#7ac462]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#7ac462]">Payment Received</div>
                <h2 className="mt-1 font-display text-lg sm:text-xl font-semibold text-chrome">Thank you — your deposit is secured.</h2>
                <p className="mt-1.5 text-sm text-chrome-mid leading-relaxed">
                  Now please complete this short Intake so we can start your project the right way.
                  {orderId && <span className="block mt-1 font-mono text-[11px] text-gold-dim">Order #{orderId.slice(0, 8).toUpperCase()}</span>}
                </p>
              </div>
            </div>
          )}
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
