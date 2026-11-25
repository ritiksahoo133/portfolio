import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Compass,
  Cpu,
  Download,
  Github,
  Layers,
  Linkedin,
  Mail,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { PROFILE } from '../../data/profile';
import {
  ABOUT_STORY,
  CAREER_HIGHLIGHTS,
  ENGINEERING_PHILOSOPHY,
  EXPLORING_TOPICS,
  IDENTITY_DOMAINS,
  WORKING_PROCESS,
} from '../../data/about';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL } from '../../lib/motion';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MagneticButton } from '../animations/MagneticButton';
import { Reveal } from '../animations/Reveal';
import { SpotlightCard } from '../animations/SpotlightCard';
import { TiltCard } from '../animations/TiltCard';

const DOMAIN_ICONS = {
  fullstack: Layers,
  ai: BrainCircuit,
  backend: Server,
  erp: Building2,
} as const;

const PHILOSOPHY_ICONS = [Compass, Workflow, Cpu, ShieldCheck];

const HEADLINE_WORDS = [
  { text: 'Turning', highlight: false },
  { text: 'Complex', highlight: false },
  { text: 'Workflows', highlight: false },
  { text: 'Into', highlight: false },
  { text: 'Reliable', highlight: true },
  { text: 'Production', highlight: true },
  { text: 'Software.', highlight: false },
];

export const About = memo(function About() {
  const [activeDomainId, setActiveDomainId] = useState<string>(IDENTITY_DOMAINS[0].id);
  const [activeStepId, setActiveStepId] = useState<string>(WORKING_PROCESS[0].id);

  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const introInView = useInView(introRef, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = Boolean(entries[0]?.isIntersecting);
        el.setAttribute('data-offscreen', inView ? 'false' : 'true');
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentDomainIndex = Math.max(
    0,
    IDENTITY_DOMAINS.findIndex((d) => d.id === activeDomainId),
  );
  const currentDomain = IDENTITY_DOMAINS[currentDomainIndex] ?? IDENTITY_DOMAINS[0];
  const CurrentDomainIcon =
    DOMAIN_ICONS[currentDomain.id as keyof typeof DOMAIN_ICONS] ?? Layers;

  const activeStepIndex = Math.max(
    0,
    WORKING_PROCESS.findIndex((s) => s.id === activeStepId),
  );
  const processProgress =
    WORKING_PROCESS.length > 1 ? activeStepIndex / (WORKING_PROCESS.length - 1) : 0;

  const handleJumpToDomain = (domainId: string) => {
    setActiveDomainId(domainId);
    dashboardRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-x-clip border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      {/* Subtle architectural dot grid + drifting ambient radial orbs (auto-paused when offscreen) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45 dark:opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)',
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(ellipse 85% 75% at 50% 35%, #000 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 35%, #000 35%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="about-ambient-orb pointer-events-none absolute -left-36 top-20 hidden h-[460px] w-[460px] rounded-full md:block"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.11) 0%, rgba(16, 185, 129, 0.03) 45%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="about-ambient-orb pointer-events-none absolute -right-40 top-[44%] hidden h-[500px] w-[500px] rounded-full md:block"
        style={{
          animationDelay: '-7s',
          background:
            'radial-gradient(circle, rgba(8, 145, 178, 0.1) 0%, rgba(8, 145, 178, 0.025) 45%, transparent 72%)',
        }}
      />

      <Container className="relative z-10 space-y-16 sm:space-y-24">
        {/* 1. PERSONAL INTRODUCTION + CONNECTED MY STORY RAIL */}
        <div>
          <SectionHeading
            chapter="01"
            eyebrow="About Me"
            title="More Than Just Writing Code."
          />

          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: Sticky Editorial Introduction with Word-by-Word Masked Reveal */}
            <div ref={introRef} className="space-y-6 lg:sticky lg:top-28 lg:col-span-6">
              <h3 className="flex flex-wrap gap-x-[0.3em] gap-y-1 text-2xl font-bold leading-[1.2] tracking-tight text-[var(--text-primary)] sm:text-3xl lg:text-[2rem]">
                {HEADLINE_WORDS.map((word, idx) => (
                  <span key={`${word.text}-${idx}`} className="inline-block overflow-hidden py-0.5">
                    <motion.span
                      className={`inline-block ${
                        word.highlight
                          ? 'about-shimmer-text bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-emerald-400'
                          : ''
                      }`}
                      initial={reducedMotion ? false : { y: '105%', opacity: 0 }}
                      animate={introInView ? { y: '0%', opacity: 1 } : undefined}
                      transition={{
                        duration: 0.55,
                        delay: reducedMotion ? 0 : idx * 0.045,
                        ease: EASE_EDITORIAL,
                      }}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </h3>

              <Reveal direction="up" delay={0.12}>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base md:text-lg">
                  Across enterprise ERP platforms, high-traffic cloud backends, and real-time web
                  products, my priority is architecture that holds up under real operational
                  load—combining clean interfaces, profiled APIs, and context-aware AI retrieval.
                </p>
              </Reveal>

              {/* Verified Career Context Pills (distinct from Home location/name pills) */}
              <Reveal direction="up" delay={0.18}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono-tech text-xs font-medium text-emerald-700 shadow-[0_6px_20px_-10px_rgba(16,185,129,0.5)] dark:border-emerald-500/35 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    <span>Currently · De-maithan Ispat Limited</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 font-mono-tech text-xs text-[var(--text-secondary)]">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                    <span>Previously Logic Square &amp; Hyscaler</span>
                  </span>
                </div>
              </Reveal>

              {/* Interactive Capability Navigator — Quick jump to Identity Dashboard pillars */}
              <Reveal direction="up" delay={0.24}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-background)]/90 p-4 shadow-[var(--shadow)]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono-tech text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Explore Capabilities
                    </span>
                    <span className="font-mono-tech text-[10px] text-emerald-700 dark:text-emerald-400">
                      Jump to pillar ↓
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {IDENTITY_DOMAINS.map((domain) => {
                      const Icon = DOMAIN_ICONS[domain.id as keyof typeof DOMAIN_ICONS] ?? Layers;
                      const isCurrent = domain.id === activeDomainId;
                      return (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => handleJumpToDomain(domain.id)}
                          className={`group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono-tech text-[11px] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                            isCurrent
                              ? 'border-emerald-600/40 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/45 dark:text-emerald-300'
                              : 'border-[var(--border)] bg-[var(--surface-elevated)]/80 text-[var(--text-secondary)] hover:border-emerald-600/35 hover:text-[var(--text-primary)] dark:bg-slate-950/60 dark:hover:border-emerald-500/35'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-emerald-600 transition-transform duration-200 group-hover:scale-110 dark:text-emerald-400" />
                          <span>{domain.shortLabel}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Connected Vertical Editorial Story Rail (What I Do / What I Build / Engineering Mindset) */}
            <div className="relative pl-5 sm:pl-7 lg:col-span-6">
              {/* Vertical gradient narrative rail */}
              <div
                aria-hidden="true"
                className="absolute bottom-6 left-1.5 top-6 w-[2px] rounded-full bg-gradient-to-b from-emerald-500/70 via-cyan-500/50 to-emerald-500/15 sm:left-2"
              />

              <div className="space-y-4">
                {ABOUT_STORY.map((block, idx) => (
                  <Reveal key={block.id} direction="right" delay={idx * 0.08}>
                    <div className="relative">
                      {/* Glowing milestone dot on narrative rail */}
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[22px] top-6 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--bg-primary)] sm:-left-[26px] ${
                          idx % 2 === 1
                            ? 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.75)]'
                            : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.75)]'
                        }`}
                      />

                      <SpotlightCard
                        accent={idx % 2 === 1 ? 'cyan' : 'emerald'}
                        className="card-top-accent group p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`font-mono-tech text-[10px] font-semibold uppercase tracking-[0.22em] ${
                              idx % 2 === 1
                                ? 'text-cyan-700 dark:text-cyan-400'
                                : 'text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {block.eyebrow}
                          </p>
                          <span className="font-mono-tech text-[11px] font-medium text-[var(--text-muted)]">
                            0{idx + 1}
                          </span>
                        </div>
                        <h4 className="mt-1.5 text-base font-bold text-[var(--text-primary)] sm:text-lg">
                          {block.title}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                          {block.body}
                        </p>
                      </SpotlightCard>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. DEVELOPER IDENTITY DASHBOARD — Signature Interactive 4-Pillar 3D Card */}
        <div ref={dashboardRef}>
          <Reveal className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
                Developer Identity Dashboard
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                Interactive capability breakdown across four core pillars.
              </h3>
            </div>
            <p className="font-mono-tech text-xs text-[var(--text-muted)]">
              Select a domain to inspect deliverables &amp; stack
            </p>
          </Reveal>

          <Reveal direction="up">
            <TiltCard
              accent={currentDomain.accent}
              maxTilt={2.2}
              conicBorder
              featuredGlass
              className="overflow-hidden p-4 sm:p-6 lg:p-8"
            >
              {/* Sleek Architectural Top Bar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                    Profile Matrix · {currentDomain.code} / 04
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {IDENTITY_DOMAINS.map((domain, i) => (
                    <button
                      key={domain.id}
                      type="button"
                      aria-label={`Select ${domain.label}`}
                      onClick={() => setActiveDomainId(domain.id)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === currentDomainIndex
                          ? 'w-7 bg-gradient-to-r from-emerald-500 to-cyan-500'
                          : 'w-2 bg-[var(--border)] hover:bg-emerald-500/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Left: Interactive category tabs with floating spring highlight */}
                <div
                  role="tablist"
                  aria-label="Developer identity domains"
                  className="grid gap-2.5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
                >
                  {IDENTITY_DOMAINS.map((domain) => {
                    const Icon =
                      DOMAIN_ICONS[domain.id as keyof typeof DOMAIN_ICONS] ?? Layers;
                    const isActive = domain.id === currentDomain.id;

                    return (
                      <button
                        key={domain.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveDomainId(domain.id)}
                        className={`group relative flex min-h-[64px] w-full items-center gap-3.5 overflow-hidden rounded-xl border p-3.5 text-left transition-colors duration-200 cursor-pointer ${
                          isActive
                            ? 'border-emerald-600/40 dark:border-emerald-500/45'
                            : 'border-[var(--border)] bg-[var(--surface-elevated)]/65 hover:border-slate-300 dark:bg-slate-950/40 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Floating spring surface behind active tab */}
                        {isActive && (
                          <motion.span
                            layoutId="aboutIdentityCardBg"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="absolute inset-0 -z-0 bg-[var(--surface)] shadow-[0_12px_30px_-18px_rgba(5,150,105,0.45)] dark:bg-slate-900/95"
                          />
                        )}
                        {isActive && (
                          <motion.span
                            layoutId="aboutIdentityAccent"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="absolute inset-y-2 left-0 z-10 w-[3px] rounded-r-full bg-gradient-to-b from-emerald-500 to-cyan-500"
                          />
                        )}

                        <span
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                            isActive
                              ? 'scale-105 border-emerald-600/35 bg-emerald-500/15 text-emerald-700 shadow-[0_0_20px_-6px_rgba(16,185,129,0.65)] dark:border-emerald-400/40 dark:text-emerald-300'
                              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] group-hover:scale-105 group-hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="relative z-10 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-[var(--text-primary)]">
                              {domain.label}
                            </span>
                            <span
                              className={`font-mono-tech text-[10px] ${
                                isActive
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-[var(--text-muted)]'
                              }`}
                            >
                              {domain.code}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate font-mono-tech text-[11px] text-[var(--text-muted)]">
                            {domain.technologies.slice(0, 3).join(' · ')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Active domain detail panel with staggered spring cascade */}
                <div className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-5 sm:p-6 lg:col-span-7 dark:bg-slate-950/65">
                  {/* Subtle accent corner glow matching active domain */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full transition-opacity duration-500"
                    style={{
                      background:
                        currentDomain.accent === 'cyan'
                          ? 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
                    }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDomain.id}
                      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
                      className="relative z-10 flex h-full flex-col justify-between gap-5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                          <div className="flex items-center gap-3.5">
                            <motion.span
                              initial={reducedMotion ? false : { scale: 0.85, rotate: -6 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                              className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-600/30 bg-emerald-500/12 text-emerald-700 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.55)] dark:border-emerald-500/35 dark:text-emerald-300"
                            >
                              <CurrentDomainIcon className="h-5 w-5" />
                            </motion.span>
                            <div>
                              <p className="font-mono-tech text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                                Pillar {currentDomain.code} / 04
                              </p>
                              <h4 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                                {currentDomain.label}
                              </h4>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-base font-semibold leading-snug text-[var(--text-primary)]">
                          {currentDomain.headline}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {currentDomain.description}
                        </p>

                        <ul className="mt-4 space-y-2.5">
                          {currentDomain.deliverables.map((item, idx) => (
                            <motion.li
                              key={item}
                              initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.26,
                                delay: reducedMotion ? 0 : 0.05 + idx * 0.055,
                                ease: EASE_EDITORIAL,
                              }}
                              className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-[var(--border)] pt-4">
                        <p className="mb-2.5 font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Verified Stack
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentDomain.technologies.map((tech, idx) => (
                            <motion.span
                              key={tech}
                              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.2,
                                delay: reducedMotion ? 0 : 0.08 + idx * 0.035,
                                ease: EASE_EDITORIAL,
                              }}
                            >
                              <Badge
                                variant={currentDomain.accent === 'cyan' ? 'cyan' : 'emerald'}
                              >
                                {tech}
                              </Badge>
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>

        {/* 3. MY ENGINEERING PHILOSOPHY — Elevated 4-Card Editorial Grid with Watermark Indices */}
        <div>
          <Reveal className="mb-6">
            <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              Engineering Philosophy
            </p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
              Principles behind every architecture decision.
            </h3>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ENGINEERING_PHILOSOPHY.map((principle, idx) => {
              const Icon = PHILOSOPHY_ICONS[idx % PHILOSOPHY_ICONS.length];
              return (
                <Reveal key={principle.id} delay={idx * 0.06} className="h-full">
                  <motion.div
                    whileHover={reducedMotion ? undefined : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    className="h-full"
                  >
                    <SpotlightCard
                      accent={principle.accent}
                      className="card-top-accent group relative flex h-full flex-col justify-between overflow-hidden p-5 sm:p-6"
                    >
                      {/* Recessed editorial numeral watermark */}
                      <span
                        aria-hidden="true"
                        className="chapter-watermark pointer-events-none absolute -right-1 -top-3 text-6xl font-bold leading-none opacity-65 transition-transform duration-300 group-hover:scale-105"
                      >
                        {principle.index}
                      </span>

                      <div className="relative z-10">
                        <div className="mb-5 flex items-center justify-between">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3 ${
                              principle.accent === 'cyan'
                                ? 'border-cyan-600/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-500/35 dark:text-cyan-400'
                                : 'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/35 dark:text-emerald-400'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[var(--text-primary)]">
                          {principle.title}
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                          {principle.description}
                        </p>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* 4. PERSONAL WORKING APPROACH — Interactive 6-Stage Workflow with Live Progress Spine */}
        <div>
          <Reveal className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
                Working Approach
              </p>
              <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                A structured 6-stage engineering workflow.
              </h3>
            </div>
            <p className="font-mono-tech text-xs text-[var(--text-muted)]">
              Stage {WORKING_PROCESS[activeStepIndex]?.step} / 06 ·{' '}
              <span className="text-emerald-700 dark:text-emerald-400">
                {WORKING_PROCESS[activeStepIndex]?.title}
              </span>
            </p>
          </Reveal>

          <Reveal direction="up">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-background)] p-5 shadow-[var(--shadow)] sm:p-7">
              {/* Desktop horizontal animated progress + signal spine */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-12 right-12 top-[3.15rem] hidden h-4 lg:block"
              >
                <svg
                  viewBox="0 0 1000 16"
                  fill="none"
                  preserveAspectRatio="none"
                  className="h-full w-full text-emerald-600/40 dark:text-emerald-400/45"
                >
                  <line
                    x1="0"
                    y1="8"
                    x2="1000"
                    y2="8"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="0"
                    y1="8"
                    x2="1000"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="svg-signal-flow"
                  />
                </svg>
                {/* Live spring-filled progress bar tracking the active stage */}
                <motion.div
                  className="absolute left-0 top-[7px] h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                  animate={{ scaleX: processProgress }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              </div>

              <ol className="relative grid gap-3.5 sm:grid-cols-2 lg:grid-cols-6">
                {WORKING_PROCESS.map((item, idx) => {
                  const isActive = activeStepId === item.id;
                  const isCompleted = idx <= activeStepIndex;

                  return (
                    <li key={item.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveStepId(item.id)}
                        onMouseEnter={() => setActiveStepId(item.id)}
                        className={`relative flex h-full w-full flex-col overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-250 cursor-pointer ${
                          isActive
                            ? '-translate-y-1 border-emerald-600/50 bg-[var(--surface)] shadow-[0_14px_30px_-18px_rgba(5,150,105,0.45)] dark:border-emerald-400/50 dark:bg-slate-900/95'
                            : 'border-[var(--border)] bg-[var(--surface-elevated)]/70 hover:-translate-y-0.5 hover:border-slate-300 dark:bg-slate-950/45 dark:hover:border-slate-700'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="aboutProcessTopGlow"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="absolute inset-x-3 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                          />
                        )}

                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border font-mono-tech text-xs font-semibold transition-all duration-200 ${
                            isActive
                              ? 'scale-105 border-emerald-600/45 bg-emerald-500/18 text-emerald-700 shadow-[0_0_16px_-4px_rgba(16,185,129,0.65)] dark:border-emerald-400/50 dark:text-emerald-300'
                              : isCompleted
                                ? 'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400'
                                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
                          }`}
                        >
                          {item.step}
                        </span>
                        <span className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {item.detail}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>

        {/* 5. CAREER HIGHLIGHTS + WHAT I'M EXPLORING + CONNECT WITH ME */}
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal direction="left" className="lg:col-span-7">
            <SpotlightCard className="h-full p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Career Highlights
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)] sm:text-xl">
                    Verified production milestones
                  </h3>
                </div>
                <a
                  href="#experience"
                  className="link-underline group inline-flex items-center gap-1 font-mono-tech text-xs text-emerald-700 dark:text-emerald-300"
                >
                  <span>Full Timeline</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="space-y-3.5">
                {CAREER_HIGHLIGHTS.map((hl, idx) => (
                  <div
                    key={hl.id}
                    className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/70 p-4 pl-5 transition-all duration-250 hover:border-[var(--border-accent)] hover:bg-[var(--surface)] dark:bg-slate-950/50 dark:hover:bg-slate-900/75"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2.5 left-0 w-[3px] rounded-r-full transition-all duration-250 group-hover:inset-y-1.5 ${
                        idx % 2 === 1
                          ? 'bg-cyan-500/60 group-hover:bg-cyan-400'
                          : 'bg-emerald-500/60 group-hover:bg-emerald-400'
                      }`}
                    />
                    <p className="font-mono-tech text-[10px] font-medium uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                      {hl.domain}
                    </p>
                    <h4 className="mt-1 text-sm font-semibold text-[var(--text-primary)] transition-transform duration-200 group-hover:translate-x-0.5 sm:text-base">
                      {hl.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                      {hl.detail}
                    </p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal direction="right" delay={0.08} className="flex flex-col gap-6 lg:col-span-5">
            {/* What I'm Exploring */}
            <SpotlightCard accent="cyan" className="card-top-accent p-5 sm:p-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-600/25 bg-cyan-500/10 text-cyan-700 dark:border-cyan-500/35 dark:text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-mono-tech text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                    Continuous Focus
                  </p>
                  <h3 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                    What I&apos;m Exploring
                  </h3>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                Areas where I actively deepen architectural patterns alongside my day-to-day AI,
                backend, and ERP engineering work:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {EXPLORING_TOPICS.map((topic, idx) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/85 px-2.5 py-1 font-mono-tech text-xs text-[var(--text-secondary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:text-[var(--text-primary)] dark:bg-slate-950/60"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        idx % 2 === 0 ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                    />
                    <span>{topic}</span>
                  </span>
                ))}
              </div>
            </SpotlightCard>

            {/* 6. CONNECT WITH ME — Elevated Editorial CTA Card */}
            <SpotlightCard
              accent="emerald"
              className="conic-border relative flex-1 overflow-hidden p-5 sm:p-7"
            >
              {/* Soft internal radial glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Let&apos;s Connect
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                    Great Ideas Deserve{' '}
                    <span className="about-shimmer-text bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-emerald-400">
                      Great Engineering.
                    </span>
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                    Interested in building intelligent applications, scalable systems, or
                    enterprise software products? Let&apos;s connect.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <MagneticButton>
                      <Button href="#contact" variant="primary" size="sm" className="group">
                        <span>Contact Me</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Button>
                    </MagneticButton>
                    <Button
                      href={PROFILE.resumeUrl}
                      download={PROFILE.resumeFileName}
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Resume PDF</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
                  <a
                    href={PROFILE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 font-mono-tech text-xs text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                  <span className="text-[var(--border)]">/</span>
                  <a
                    href={PROFILE.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 font-mono-tech text-xs text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                  <span className="text-[var(--border)]">/</span>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="link-underline inline-flex items-center gap-1.5 font-mono-tech text-xs text-[var(--text-secondary)] hover:text-cyan-700 dark:hover:text-cyan-300"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
});
