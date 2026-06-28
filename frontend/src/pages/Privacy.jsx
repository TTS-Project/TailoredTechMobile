import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Nav } from '../components/tts/Nav';
import { Footer } from '../components/tts/Footer';

const LAST_UPDATED = 'February 28, 2026';

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="relative pt-32 sm:pt-36 pb-24 bg-void">
        <div className="max-w-[860px] mx-auto px-5 sm:px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-chrome-mid hover:text-gold mb-6" data-testid="legal-back-home"><ArrowLeft size={14} /> Back to home</Link>
          <div className="eyebrow">Legal</div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-chrome">Privacy <span className="gold-text-gradient">Policy.</span></h1>
          <p className="mt-3 text-sm font-mono text-chrome-mid">Last updated: {LAST_UPDATED}</p>

          <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-chrome-mid">
            <Section title="1. Who we are">
              Tailored Tech Solutions is operated by <strong className="text-chrome">Digital Cartel Global LLC</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), headquartered in Nipomo, California, USA. This Privacy Policy explains what information we collect when you use <span className="text-chrome">tailoredtechsolutions.org</span> and our services, why we collect it, and how it is handled.
            </Section>

            <Section title="2. Information we collect">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-chrome">Account data</strong> — when you sign up, we store your name, email address, and a bcrypt-hashed password. We never store passwords in plain text.</li>
                <li><strong className="text-chrome">Intake form responses</strong> — answers to the AI Readiness Diagnostic, plus the contact details you provide.</li>
                <li><strong className="text-chrome">Order data</strong> — when you check out, we store the services in your cart, the deposit amount, the PayPal order ID, and the capture confirmation returned by PayPal. We do <em>not</em> store your credit card number or PayPal credentials — PayPal handles those directly.</li>
                <li><strong className="text-chrome">Authentication tokens</strong> — short-lived JWT tokens (15 minute access, 7 day refresh) stored in httpOnly cookies. A fallback Bearer token is stored in browser localStorage to support cross-origin scenarios.</li>
                <li><strong className="text-chrome">Browser storage preferences</strong> — your cart contents and favourite project IDs are saved locally in your browser&apos;s localStorage. These never leave your device unless you check out.</li>
                <li><strong className="text-chrome">Technical logs</strong> — we keep server-side logs of failed login attempts (for brute-force protection) and basic request metadata (IP, user-agent, timestamp).</li>
              </ul>
            </Section>

            <Section title="3. Why we collect it">
              <ul className="list-disc pl-5 space-y-2">
                <li>To create and authenticate your account.</li>
                <li>To process the 50% deposit for services you purchase.</li>
                <li>To deliver the services you ordered and follow up about your project.</li>
                <li>To analyse intake submissions so we can tailor proposals.</li>
                <li>To detect abuse (5 failed logins per email triggers a 15-minute lockout).</li>
                <li>To comply with our legal, accounting, and tax obligations.</li>
              </ul>
            </Section>

            <Section title="4. How long we keep it">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-chrome">Account data</strong> — until you delete your account.</li>
                <li><strong className="text-chrome">Order records</strong> — retained for at least 7 years to satisfy US tax and accounting law, after which they are anonymised or destroyed.</li>
                <li><strong className="text-chrome">Intake submissions</strong> — retained for 2 years from submission, then deleted.</li>
                <li><strong className="text-chrome">Failed-login records</strong> — automatically expire 15 minutes after the last attempt.</li>
              </ul>
            </Section>

            <Section title="5. Third parties we share data with">
              We only share what is strictly necessary to operate the service:
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li><strong className="text-chrome">PayPal</strong> — for payment processing. PayPal receives the amount, currency, and an internal reference id. See PayPal&apos;s privacy policy at <a href="https://www.paypal.com/us/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">paypal.com/us/legalhub/privacy-full</a>.</li>
                <li><strong className="text-chrome">MongoDB Atlas</strong> — encrypted-at-rest database hosting our user, order, and intake data.</li>
                <li><strong className="text-chrome">Email provider (SMTP)</strong> — used only to notify our team about new intake submissions; messages are transmitted over TLS.</li>
              </ul>
              We <strong className="text-chrome">do not sell</strong> your personal data to anyone, ever.
            </Section>

            <Section title="6. AI processing">
              Some services we offer (AI chatbots, voice assistants, automation) involve sending data to third-party AI providers (OpenAI, Anthropic, Google) <em>only when you commission such a service</em> and <em>only with the data you choose to provide for that engagement</em>. We will always tell you which providers will see the data before work begins, and we obtain explicit written consent for AI processing of any personal or sensitive information.
            </Section>

            <Section title="7. Your rights">
              You have the right to:
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>Access the personal data we hold about you.</li>
                <li>Correct any inaccurate data.</li>
                <li>Request deletion of your account and personal data at any time.</li>
                <li>Receive an export of your data in a portable format.</li>
                <li>Object to specific processing activities.</li>
              </ul>
              You can delete your account directly from the avatar dropdown menu after signing in, or by emailing us. Account deletion is irreversible and removes all your personal data within 30 days, except where we are legally required to retain certain order records.
            </Section>

            <Section title="8. Security">
              We use HTTPS for all traffic, bcrypt for password hashing, JWTs in httpOnly cookies, brute-force lockouts on the login endpoint, parameterised database queries, and least-privilege server access. No system is perfectly secure — if we ever discover a breach affecting your data, we will notify you within 72 hours.
            </Section>

            <Section title="9. Children">
              The Service is not directed to children under 16. We do not knowingly collect personal data from anyone under 16. If you believe a child has provided us data, please contact us and we will delete it.
            </Section>

            <Section title="10. Changes to this policy">
              We may update this policy when our services change. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision. If a change materially affects your rights, we will notify account holders by email at least 30 days before the change takes effect.
            </Section>

            <Section title="11. Contact us">
              For any privacy question, deletion request, or data subject request:
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)' }}>
                <Mail size={14} className="text-gold" />
                <a href="mailto:support@tailoredtechsolutions.org" className="text-chrome font-mono hover:text-gold">support@tailoredtechsolutions.org</a>
              </div>
            </Section>
          </article>

          <div className="mt-12 rounded-2xl p-5 flex items-start gap-3" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid var(--gold-dim)' }}>
            <ShieldCheck size={18} className="text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-chrome-mid leading-relaxed">
              By using Tailored Tech Solutions you agree to this Privacy Policy. Read also our <Link to="/terms" className="text-gold hover:underline">Terms of Service</Link>.
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
