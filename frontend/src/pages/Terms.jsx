import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { Nav } from '../components/tts/Nav';
import { Footer } from '../components/tts/Footer';

const LAST_UPDATED = 'February 28, 2026';

export default function TermsPage() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-24 bg-void">
        <div className="max-w-[860px] mx-auto px-5 sm:px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-chrome-mid hover:text-gold mb-6" data-testid="legal-back-home"><ArrowLeft size={14} /> Back to home</Link>
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-chrome">Terms of <span className="gold-text-gradient">Service.</span></h1>
          <p className="mt-3 text-sm font-mono text-chrome-mid">Last updated: {LAST_UPDATED}</p>

          <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-chrome-mid">
            <Section title="1. Acceptance">
              By accessing or using Tailored Tech Solutions (the &ldquo;Service&rdquo;), operated by Digital Cartel Global LLC (&ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to these Terms of Service. If you do not agree, please do not use the Service.
            </Section>

            <Section title="2. Your account">
              You are responsible for keeping your account credentials secure and for all activity that occurs under your account. You must be at least 18 years old (or the age of legal majority in your jurisdiction) to create an account. Provide accurate information when registering and keep it current.
            </Section>

            <Section title="3. Acceptable use">
              You agree not to:
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Reverse engineer, scrape, or interfere with the Service.</li>
                <li>Use the Service to send spam, malware, or unlawful content.</li>
                <li>Attempt to access another user&apos;s account or data.</li>
                <li>Resell or sublicense the Service without our written consent.</li>
                <li>Use automated systems (bots) without prior authorization.</li>
              </ul>
              We may suspend or terminate accounts that violate these rules at our sole discretion.
            </Section>

            <Section title="4. Services and deliverables">
              We provide custom software, AI, engineering, marketing, web, and business intelligence services. Specific scope, deliverables, milestones, and timelines for each engagement are defined in a separate written proposal or statement of work, which forms part of your agreement with us.
            </Section>

            <Section title="5. Payments — 50% deposit model">
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>A non-refundable <strong className="text-chrome">50% deposit</strong> of the Total Project Value is required before work begins. A $49.95 AI Project Consultation fee is automatically included with every order.</li>
                <li>The remaining 50% balance is invoiced upon completion and is due prior to final delivery of the work product.</li>
                <li>All amounts are denominated in US Dollars (USD).</li>
                <li>Payments are processed by PayPal. We do not store your card or PayPal credentials.</li>
                <li>Late payments accrue interest at 1.5% per month or the maximum permitted by law, whichever is lower.</li>
              </ul>
            </Section>

            <Section title="6. Refunds and cancellations">
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Because we begin allocating engineering capacity immediately upon receipt of the deposit, <strong className="text-chrome">deposits are non-refundable</strong> once work has commenced.</li>
                <li>Digital products (templates, prompt libraries, courses) are non-refundable once downloaded or accessed.</li>
                <li>If we materially fail to deliver agreed work, we will issue a pro-rated refund of any unearned balance within 30 days of cancellation.</li>
                <li>Cancellation must be requested in writing to <a href="mailto:support@tailoredtechsolutions.org" className="text-gold hover:underline">support@tailoredtechsolutions.org</a>.</li>
              </ul>
            </Section>

            <Section title="7. Intellectual property">
              Upon final payment, custom-developed deliverables (code, designs, documents) we produce specifically for your engagement become your property, unless otherwise specified in the statement of work. We retain ownership of our pre-existing tools, libraries, methodologies, and the Service itself. We may use anonymised, non-confidential aspects of your project for case studies and portfolio examples unless you opt out in writing.
            </Section>

            <Section title="8. Confidentiality">
              We treat all non-public information you share in connection with an engagement as confidential and protect it with the same care we use for our own confidential information. We will not disclose it to third parties except contractors operating under equivalent confidentiality terms.
            </Section>

            <Section title="9. Disclaimer of warranties">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee uninterrupted or error-free operation of the Service or any specific business outcome from our deliverables.
            </Section>

            <Section title="10. Limitation of liability">
              To the maximum extent permitted by law, our total cumulative liability for any claim arising out of or relating to the Service or any engagement shall not exceed the amount you paid us in the twelve (12) months preceding the claim. In no event shall we be liable for indirect, incidental, special, consequential, or punitive damages.
            </Section>

            <Section title="11. Account termination">
              You may close your account at any time from the avatar menu after signing in, or by emailing support. We may suspend or terminate your access immediately, with or without notice, if you breach these Terms, if required by law, or if continued operation poses a security risk. Sections that by their nature should survive (e.g., IP, confidentiality, limitations of liability) will survive any termination.
            </Section>

            <Section title="12. Changes to these terms">
              We may update these Terms when the Service changes. We will notify account holders of material changes by email at least 30 days before they take effect. Continued use of the Service after the effective date constitutes acceptance of the revised Terms.
            </Section>

            <Section title="13. Governing law">
              These Terms are governed by the laws of the State of California, USA, without regard to conflict-of-laws principles. Any dispute will be resolved exclusively in the state or federal courts located in San Luis Obispo County, California, unless otherwise required by applicable consumer protection law.
            </Section>

            <Section title="14. Contact">
              Questions about these Terms? Reach us at <a href="mailto:support@tailoredtechsolutions.org" className="text-gold hover:underline">support@tailoredtechsolutions.org</a> or by phone at (940) 601-5260.
            </Section>
          </article>

          <div className="mt-12 rounded-2xl p-5 flex items-start gap-3" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid var(--gold-dim)' }}>
            <Scale size={18} className="text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-chrome-mid leading-relaxed">
              By using Tailored Tech Solutions you agree to these Terms. See also our <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl sm:text-2xl font-semibold text-chrome">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
