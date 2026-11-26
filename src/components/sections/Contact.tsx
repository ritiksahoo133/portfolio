import { memo, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { MagneticButton } from '../animations/MagneticButton';
import { Reveal } from '../animations/Reveal';
import { SectionBackdrop } from '../animations/SectionBackdrop';
import { SpotlightCard } from '../animations/SpotlightCard';

const RECIPIENT_EMAIL = 'ritiksahoo133@gmail.com';
/** Serverless function (api/contact.ts) that emails the owner via Gmail SMTP. */
const CONTACT_ENDPOINT = '/api/contact';

export const Contact = memo(function Contact() {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const mailtoHref = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    subject.trim() || 'Portfolio Inquiry — Ritik Kumar Sahoo'
  )}${
    message.trim()
      ? `&body=${encodeURIComponent(
          `From: ${name.trim() || 'Portfolio Visitor'} (${senderEmail.trim() || 'No email provided'})\n\n${message.trim()}`
        )}`
      : ''
  }`;

  const scheduleCopiedReset = () => {
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    setCopied(true);
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 2400);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(RECIPIENT_EMAIL);
      scheduleCopiedReset();
    } catch {
      const input = document.createElement('input');
      input.value = RECIPIENT_EMAIL;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      scheduleCopiedReset();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !senderEmail.trim() || !message.trim()) return;

    setStatus('submitting');
    setErrorText('');

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: senderEmail.trim(),
          subject: subject.trim(),
          message: message.trim(),
          website: honeypot,
        }),
      });

      // Non-JSON responses (e.g. a static server returning HTML for /api) count as failures.
      const data: { success?: boolean; error?: string } = await response
        .json()
        .catch(() => ({ success: false }));

      if (response.ok && data.success === true) {
        setStatus('sent');
        setName('');
        setSenderEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorText(data.error ?? 'The message could not be delivered automatically.');
      }
    } catch {
      setStatus('error');
      setErrorText(
        'Network error while sending. Please use the Mail app option below instead.'
      );
    }
  };

  return (
    <section
      id="contact"
      className="section-divider relative overflow-hidden border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      {/* Subtle closing noise texture */}
      <div aria-hidden="true" className="noise-overlay absolute inset-0" />

      {/* Closing convergence aurora & slow orbital beacon rings (auto-paused offscreen) */}
      <SectionBackdrop variant="beacon" />

      <Container className="relative z-10">
        <SectionHeading
          chapter="06"
          eyebrow="Contact"
          title="Let's Build Something Meaningful."
          description="Open to discussing software engineering roles, AI-powered enterprise applications, backend architecture, and full-stack collaboration."
        />

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Direct Channels & Social Profiles */}
          <Reveal direction="left" distance={18} className="min-w-0 lg:col-span-5">
            <SpotlightCard className="flex h-full flex-col justify-between p-5 sm:p-7">
              <div>
                <div className="mb-5 border-b border-[var(--border)] pb-4">
                  <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 sm:text-xs dark:text-emerald-400">
                    Direct Channels
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                    {PROFILE.name}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {/* Email row with Copy interaction */}
                  <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-3.5 transition-colors hover:border-[var(--border-accent)] min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between sm:p-4 dark:bg-slate-950/55">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                          Email
                        </p>
                        <a
                          href={`mailto:${RECIPIENT_EMAIL}`}
                          className="link-underline block break-all text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          {RECIPIENT_EMAIL}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address to clipboard"
                      className="inline-flex min-h-[40px] w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono-tech text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 min-[460px]:w-auto cursor-pointer dark:hover:text-emerald-300"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location row */}
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-3.5 sm:p-4 dark:bg-slate-950/55">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                        Location
                      </p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {PROFILE.fullAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-5">
                <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
                  <a
                    href={PROFILE.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[46px] items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 dark:bg-slate-950/60 dark:hover:text-emerald-300"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>LinkedIn</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  </a>
                  <a
                    href={PROFILE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[46px] items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 dark:bg-slate-950/60 dark:hover:text-emerald-300"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Github className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>GitHub</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
                  </a>
                </div>

                <Button
                  href={PROFILE.resumeUrl}
                  download={PROFILE.resumeFileName}
                  variant="secondary"
                  size="md"
                  className="group w-full"
                >
                  <Download className="h-4 w-4 text-emerald-600 transition-transform duration-200 group-hover:translate-y-0.5 dark:text-emerald-400" />
                  <span>Download Resume PDF</span>
                </Button>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Right: Direct Email Form (always delivers to ritiksahoo133@gmail.com) */}
          <Reveal direction="right" distance={18} delay={0.08} className="min-w-0 lg:col-span-7">
            <SpotlightCard accent="cyan" className="conic-border h-full p-5 sm:p-7 lg:p-8">
              <div className="mb-5 border-b border-[var(--border)] pb-4">
                <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-700 sm:text-xs dark:text-cyan-400">
                  Send a Message
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                  Start a Conversation
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot: hidden from people and assistive tech; bots tend to fill it in */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label htmlFor="contact-website">Leave this field empty</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-emerald-600/60 focus:outline-none dark:focus:border-emerald-500/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Your Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-emerald-600/60 focus:outline-none dark:focus:border-emerald-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Software Engineering Role / Project Inquiry"
                    className="min-h-[44px] w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-emerald-600/60 focus:outline-none dark:focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block font-mono-tech text-[11px] uppercase tracking-wider text-[var(--text-secondary)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about the role, project, or architecture challenge..."
                    className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-emerald-600/60 focus:outline-none dark:focus:border-emerald-500/60"
                  />
                </div>

                {status === 'sent' && (
                  <div
                    role="status"
                    className="flex items-center gap-2.5 rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/35 dark:text-emerald-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      Message sent to <strong>{RECIPIENT_EMAIL}</strong>. Thank you for reaching
                      out!
                    </span>
                  </div>
                )}

                {status === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-amber-600/35 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/35 dark:text-amber-200"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      {errorText} Your message is still in the form—you can also use{' '}
                      <strong>Open in Mail app</strong> to send it to{' '}
                      <strong>{RECIPIENT_EMAIL}</strong>.
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <MagneticButton className="w-full sm:w-auto">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={status === 'submitting'}
                      className="group w-full sm:w-auto"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </MagneticButton>

                  <a
                    href={mailtoHref}
                    className="link-underline inline-flex min-h-[44px] items-center justify-center gap-1.5 font-mono-tech text-xs text-[var(--text-secondary)] transition-colors hover:text-emerald-700 sm:min-h-[40px] dark:hover:text-emerald-300"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Open in Mail app</span>
                  </a>
                </div>
              </form>
            </SpotlightCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
});
