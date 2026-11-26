import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Cpu,
  Database,
  Download,
  Github,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Server,
} from 'lucide-react';
import { PROFILE } from '../../data/profile';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL, badgeItem, staggerContainer } from '../../lib/motion';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { MagneticButton } from '../animations/MagneticButton';
import { MaskedText } from '../animations/MaskedText';
import { AmbientField } from '../animations/AmbientField';
import { TiltCard } from '../animations/TiltCard';

const SYSTEM_LAYERS = [
  {
    id: 'ai',
    code: '01',
    label: 'AI & RAG Intelligence',
    stack: 'LLMs · Machine Learning · RAG · AI Assistants',
    detail:
      'Context-aware assistants for business-data retrieval, contextual Q&A and operational decision support.',
    pipeline: ['Business Data', 'RAG Retrieval', 'LLM Assistant'],
    relatedTech: ['LLMs & RAG', 'Python / Django'],
    icon: Cpu,
    accent:
      'text-emerald-700 border-emerald-600/25 bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/35 dark:bg-emerald-500/10',
  },
  {
    id: 'erp',
    code: '02',
    label: 'Full-Stack & ERP Core',
    stack: 'React.js · Python · Django · SAP · Tally ERP',
    detail:
      'Full-stack ERP features across Procurement, Sales, Finance and Payment Management with SAP & Tally ERP sync.',
    pipeline: ['React.js UI', 'Django APIs', 'SAP / Tally ERP'],
    relatedTech: ['React.js', 'Python / Django', 'SAP & Tally ERP'],
    icon: Layers,
    accent:
      'text-cyan-700 border-cyan-600/25 bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/35 dark:bg-cyan-500/10',
  },
  {
    id: 'backend',
    code: '03',
    label: 'Backend & Cloud Scale',
    stack: 'Node.js · NestJS · Redis · Docker · AWS EC2/S3',
    detail:
      'High-throughput APIs, inbound-email pipelines, Redis caching, Docker containers & AWS infrastructure supporting 50K+ users.',
    pipeline: ['Node.js / NestJS', 'Redis Cache', 'AWS EC2 & S3'],
    relatedTech: ['Node.js', 'AWS & Docker', 'Redis'],
    icon: Server,
    accent:
      'text-emerald-700 border-emerald-600/25 bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 dark:bg-emerald-500/10',
  },
];

export const Hero = memo(function Hero() {
  const [activeLayerId, setActiveLayerId] = useState<string>('ai');
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();

  const currentLayer =
    SYSTEM_LAYERS.find((layer) => layer.id === activeLayerId) ?? SYSTEM_LAYERS[0];

  // Pause Hero's decorative CSS animations as soon as Hero scrolls out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = Boolean(entries[0]?.isIntersecting);
        el.setAttribute('data-offscreen', inView ? 'false' : 'true');
      },
      { threshold: 0.02 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-10 pt-22 sm:pb-12 sm:pt-28 lg:pb-14 lg:pt-24"
    >
      {/* Subtle editorial film-grain noise overlay */}
      <div aria-hidden="true" className="noise-overlay absolute inset-0" />

      {/* Layered cinematic gradient mesh (pauses offscreen) */}
      <div
        aria-hidden="true"
        className="hero-mesh pointer-events-none absolute -inset-12 will-change-transform"
      />

      {/* Slowly drifting architectural grid (GPU translate3d layer, paused offscreen) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_78%_68%_at_50%_30%,#000_50%,transparent_100%)]"
      >
        <div className="architectural-grid animate-grid-drift absolute -inset-[56px] will-change-transform" />
      </div>

      {/* Lightweight desktop-only ambient data-node particles (pauses offscreen) */}
      <AmbientField />

      {/* Soft ambient radial lighting (pure CSS radial gradient, zero GPU blur filter) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-[420px] max-w-5xl opacity-72 sm:-top-28 sm:h-[620px]"
        style={{
          background:
            'radial-gradient(circle at 28% 38%, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.05) 32%, transparent 62%), radial-gradient(circle at 76% 32%, rgba(8, 145, 178, 0.12) 0%, rgba(8, 145, 178, 0.04) 30%, transparent 58%)',
        }}
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left column: Cinematic typography & CTAs */}
          <div className="min-w-0 lg:col-span-7">
            {/* Step 1: Brand & location */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.02, ease: EASE_EDITORIAL }}
              className="mb-4 flex flex-wrap items-center gap-2.5 sm:mb-5 sm:gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1.5 font-mono-tech text-[11px] font-medium text-emerald-700 sm:px-3.5 sm:text-xs dark:border-emerald-500/30 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse-soft dark:bg-emerald-400" />
                <span>{PROFILE.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] text-[var(--text-secondary)] sm:text-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                <span>{PROFILE.location}</span>
              </span>
            </motion.div>

            {/* Step 2: Fluid masked word-by-word headline */}
            <h1 className="heading-hero font-bold tracking-tight text-[var(--text-primary)]">
              <MaskedText
                text={PROFILE.headline}
                highlightWords={['Intelligent', 'Systems']}
                delay={0.05}
                stagger={finePointer ? 0.032 : 0.024}
              />
            </h1>

            {/* Step 3: Supporting introduction */}
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.18, ease: EASE_EDITORIAL }}
              className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-5 sm:text-base md:text-lg"
            >
              {PROFILE.subheadline}
            </motion.p>

            {/* Step 4: Role tags */}
            <motion.div
              variants={staggerContainer(0.028, 0.24)}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
              className="mt-5 flex flex-wrap items-center gap-2"
              aria-label="Specializations"
            >
              {PROFILE.roles.map((role) => (
                <motion.span
                  key={role}
                  variants={badgeItem}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/90 px-2.5 py-1 font-mono-tech text-[11px] text-[var(--text-secondary)] shadow-2xs transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 sm:px-3 sm:text-xs dark:bg-slate-900/75 dark:shadow-none dark:hover:text-emerald-200"
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>

            {/* Step 5: Touch-friendly responsive CTAs */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.28, ease: EASE_EDITORIAL }}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
            >
              <MagneticButton className="w-full sm:w-auto">
                <Button href="#projects" variant="primary" size="lg" className="group w-full sm:w-auto">
                  <span>View My Work</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </MagneticButton>

              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:items-center sm:gap-3.5">
                <MagneticButton className="w-full sm:w-auto">
                  <Button
                    href={PROFILE.resumeUrl}
                    download={PROFILE.resumeFileName}
                    variant="secondary"
                    size="lg"
                    className="group w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 text-emerald-600 transition-transform duration-200 group-hover:translate-y-0.5 dark:text-emerald-400" />
                    <span>Download Resume</span>
                  </Button>
                </MagneticButton>

                <Button
                  href="#contact"
                  variant="ghost"
                  size="lg"
                  className="group w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 text-cyan-600 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-cyan-400" />
                  <span>Contact Me</span>
                </Button>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.38, delay: 0.36, ease: EASE_EDITORIAL }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--border)] pt-5 sm:mt-7 sm:gap-x-5"
            >
              <a
                href={PROFILE.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline group inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                <Linkedin className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                <span>LinkedIn</span>
              </a>
              <span className="text-[var(--border)]" aria-hidden="true">
                /
              </span>
              <a
                href={PROFILE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline group inline-flex min-h-[40px] items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                <Github className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                <span>GitHub</span>
              </a>
              <span className="hidden text-[var(--border)] sm:inline" aria-hidden="true">
                /
              </span>
              <a
                href={`mailto:${PROFILE.email}`}
                className="link-underline inline-flex min-h-[40px] items-center break-all font-mono-tech text-xs text-[var(--text-secondary)] transition-colors hover:text-cyan-700 sm:break-normal sm:text-sm dark:hover:text-cyan-300"
              >
                {PROFILE.email}
              </a>
            </motion.div>
          </div>

          {/* Step 6: Upgraded 3D Interactive Engineering Profile Card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.16, ease: EASE_EDITORIAL }}
            className="relative min-w-0 lg:col-span-5"
          >
            {/* Subtle floating labels on md+ screens (GPU translate3d, paused offscreen) */}
            <div
              aria-hidden="true"
              className="animate-float-slow pointer-events-none absolute -top-4 right-5 z-20 hidden rounded-lg border border-emerald-600/25 bg-[var(--surface)]/95 px-3 py-1.5 font-mono-tech text-[11px] font-medium text-emerald-700 shadow-md md:block dark:border-emerald-500/30 dark:bg-[#0d1524]/95 dark:text-emerald-300 dark:shadow-lg"
            >
              RAG · LLMs · AI Assistants
            </div>
            <div
              aria-hidden="true"
              className="animate-float-delayed pointer-events-none absolute -bottom-4 left-5 z-20 hidden rounded-lg border border-cyan-600/25 bg-[var(--surface)]/95 px-3 py-1.5 font-mono-tech text-[11px] font-medium text-cyan-700 shadow-md md:block dark:border-cyan-500/30 dark:bg-[#0d1524]/95 dark:text-cyan-300 dark:shadow-lg"
            >
              AWS · Redis · Docker
            </div>

            <TiltCard maxTilt={4.5} conicBorder featuredGlass className="p-4 sm:p-6 lg:p-7">
              {/* Top identity header */}
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-600/30 bg-gradient-to-br from-emerald-500/20 to-cyan-500/12 font-mono-tech text-xs font-bold text-emerald-700 sm:h-11 sm:w-11 sm:text-sm dark:border-emerald-500/40 dark:text-emerald-300">
                    {PROFILE.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {PROFILE.name}
                    </p>
                    <p className="truncate font-mono-tech text-[11px] text-[var(--text-muted)]">
                      AI &amp; Full-Stack Developer
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-500/8 px-2 py-1 dark:border-emerald-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse-soft dark:bg-emerald-400" />
                  <span className="font-mono-tech text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                    {currentLayer.code}/03
                  </span>
                  <Database
                    className="h-3.5 w-3.5 text-emerald-600/80 dark:text-emerald-400/80"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Dynamic active pipeline preview strip with animated SVG connectors */}
              <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2.5 dark:bg-slate-950/65">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentLayer.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: EASE_EDITORIAL }}
                    className="w-full overflow-x-auto font-mono-tech text-[8px] [scrollbar-width:none] min-[400px]:text-[10px] [&::-webkit-scrollbar]:hidden"
                  >
                    <div className="inline-flex min-w-full flex-nowrap items-center">
                    {currentLayer.pipeline.map((node, idx) => {
                      const isLast = idx === currentLayer.pipeline.length - 1;
                      return (
                        <div
                          key={node}
                          className={`flex items-center ${isLast ? 'shrink-0' : 'grow shrink-0'}`}
                        >
                          <span className="shrink-0 whitespace-nowrap rounded-md border border-emerald-600/25 bg-emerald-500/10 px-1 py-0.5 font-medium text-emerald-800 min-[400px]:px-1.5 dark:border-emerald-500/25 dark:text-emerald-200">
                            {node}
                          </span>
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className="mx-0.5 flex min-w-[14px] flex-1 items-center text-emerald-600/80 min-[400px]:mx-1 min-[400px]:min-w-[18px] dark:text-emerald-400/80"
                            >
                              <span className="relative h-[2px] flex-1 overflow-hidden rounded-full">
                                <span className="pipeline-signal-dash absolute inset-y-0 left-0 w-[200%]" />
                              </span>
                              <svg
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                                className="ml-px shrink-0"
                              >
                                <path
                                  d="M1.2 1.2L5.6 4L1.2 6.8"
                                  stroke="currentColor"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Interactive architecture categories */}
              <div
                className="space-y-2.5 sm:space-y-3"
                role="tablist"
                aria-label="Engineering architecture layers"
              >
                {SYSTEM_LAYERS.map((layer) => {
                  const Icon = layer.icon;
                  const isSelected = activeLayerId === layer.id;

                  return (
                    <button
                      key={layer.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveLayerId(layer.id)}
                      onMouseEnter={finePointer ? () => setActiveLayerId(layer.id) : undefined}
                      className={`relative min-h-[52px] w-full overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4 cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600/40 bg-[var(--surface)] shadow-[0_12px_28px_-18px_rgba(5,150,105,0.35)] dark:border-emerald-500/45 dark:bg-slate-900/90 dark:shadow-[0_12px_32px_-18px_rgba(16,185,129,0.45)]'
                          : 'border-[var(--border)] bg-[var(--surface-elevated)]/65 hover:border-slate-300 dark:bg-slate-950/45 dark:hover:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="heroLayerAccent"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                          className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400"
                        />
                      )}

                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 ${
                            isSelected ? 'scale-105' : ''
                          } ${layer.accent}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                              {layer.label}
                            </span>
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                                isSelected
                                  ? 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.7)] dark:bg-emerald-400 dark:shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                                  : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            />
                          </div>
                          <p className="mt-1 font-mono-tech text-[11px] leading-snug text-emerald-700 dark:text-emerald-300/85">
                            {layer.stack}
                          </p>
                          <AnimatePresence initial={false}>
                            {isSelected && (
                              <motion.p
                                initial={reducedMotion ? false : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
                                transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
                                className="mt-2 overflow-hidden text-xs leading-relaxed text-[var(--text-secondary)]"
                              >
                                {layer.detail}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic highlighted tech strip synced to active category */}
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4 sm:mt-5">
                {PROFILE.floatingTech.map((tech) => {
                  const isHighlighted = currentLayer.relatedTech.includes(tech);
                  return (
                    <span
                      key={tech}
                      className={`rounded-md border px-2 py-1 font-mono-tech text-[10px] transition-all duration-200 ${
                        isHighlighted
                          ? 'border-emerald-600/35 bg-emerald-500/12 font-medium text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-200'
                          : 'border-transparent bg-[var(--surface-elevated)] text-[var(--text-muted)] dark:bg-slate-900/90 dark:text-slate-400'
                      }`}
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Custom minimal scroll indicator */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8 flex justify-center lg:mt-10"
        >
          <a
            href="#about"
            aria-label="Scroll to About section"
            className="group inline-flex min-h-[44px] flex-col items-center justify-center gap-2 px-3 text-[var(--text-muted)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.24em]">
              Scroll to explore
            </span>
            <span className="flex h-7 w-5 items-start justify-center rounded-full border border-[var(--border)] p-1 transition-colors group-hover:border-emerald-600/60 dark:group-hover:border-emerald-400/60">
              <span className="animate-scroll-bounce h-1.5 w-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            </span>
          </a>
        </motion.div>
      </Container>
    </section>
  );
});
