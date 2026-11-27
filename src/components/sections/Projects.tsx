import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Github,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PROJECTS, type ProjectItem } from '../../data/projects';
import { useOffscreenPause } from '../../hooks/useOffscreenPause';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL } from '../../lib/motion';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Reveal } from '../animations/Reveal';
import { SectionBackdrop } from '../animations/SectionBackdrop';
import { TiltCard } from '../animations/TiltCard';

function ProjectVisual({
  type,
  interactive = false,
  tall = false,
}: {
  type: ProjectItem['visualType'];
  interactive?: boolean;
  tall?: boolean;
}) {
  const scaleClass = interactive
    ? 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]'
    : '';
  const heightClass = tall ? 'min-h-[16rem] lg:h-full lg:min-h-[21rem]' : 'min-h-[13.5rem] sm:h-56';

  if (type === 'medist') {
    return (
      <div
        aria-hidden="true"
        className={`relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] dark:border-slate-800/80 dark:bg-[#070c17] ${heightClass}`}
      >
        <div
          className={`relative flex h-full w-full flex-col justify-between gap-5 p-4 sm:p-6 ${scaleClass}`}
        >
          <div
            className="absolute inset-0 opacity-75"
            style={{
              background:
                'radial-gradient(circle at 18% 22%, rgba(16, 185, 129, 0.16), transparent 55%), radial-gradient(circle at 86% 78%, rgba(8, 145, 178, 0.14), transparent 52%)',
            }}
          />
          <div className="architectural-grid absolute inset-0 opacity-65" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-1 font-mono-tech text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              DRF API Architecture
            </span>
            <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
              REST · Location Routing · Razorpay
            </span>
          </div>

          {/* Animated SVG pipeline flow backdrop connecting nodes on sm+ */}
          <div className="relative z-10 my-auto">
            <svg
              viewBox="0 0 600 26"
              fill="none"
              className="pointer-events-none mb-2 hidden h-5 w-full text-emerald-600/60 sm:block dark:text-emerald-400/65"
            >
              <path
                d="M95 13 H505"
                stroke="currentColor"
                strokeWidth="1.5"
                className="svg-signal-flow"
              />
              <circle cx="95" cy="13" r="3.5" fill="currentColor" />
              <circle cx="300" cy="13" r="4" fill="var(--accent-secondary)" />
              <circle cx="505" cy="13" r="3.5" fill="currentColor" />
            </svg>

            <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-3 min-[480px]:gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-2xs min-[480px]:block min-[480px]:p-3.5 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-600 min-[480px]:mb-2 dark:text-emerald-400" />
                <div className="min-w-0">
                  <p className="font-mono-tech text-[11px] font-medium text-[var(--text-primary)]">
                    Store Discovery
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                    Location-based lookup
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-600/35 bg-[var(--surface)] p-3 shadow-[0_8px_22px_-12px_rgba(5,150,105,0.3)] min-[480px]:block min-[480px]:p-3.5 dark:border-emerald-500/35 dark:bg-slate-900/95 dark:shadow-[0_0_24px_-10px_rgba(16,185,129,0.5)]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-600 min-[480px]:mb-2 dark:text-cyan-400" />
                <div className="min-w-0">
                  <p className="font-mono-tech text-[11px] font-medium text-[var(--text-primary)]">
                    Auth &amp; Orders
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                    Store &amp; Order APIs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-2xs min-[480px]:block min-[480px]:p-3.5 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
                <CreditCard className="h-4 w-4 shrink-0 text-emerald-600 min-[480px]:mb-2 dark:text-emerald-400" />
                <div className="min-w-0">
                  <p className="font-mono-tech text-[11px] font-medium text-[var(--text-primary)]">
                    Checkout
                  </p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Razorpay gateway</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-[var(--border)]/70 pt-3 font-mono-tech text-[10px] text-[var(--text-muted)]">
            <span className="truncate">System Overview · Location &amp; Order Flow</span>
            <span className="shrink-0 font-medium text-emerald-700 dark:text-emerald-400/90">
              DRF · Razorpay
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] dark:border-slate-800/80 dark:bg-[#070c17] ${heightClass}`}
    >
      <div
        className={`relative flex h-full w-full flex-col justify-between gap-5 p-4 sm:p-6 ${scaleClass}`}
      >
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background:
              'radial-gradient(circle at 82% 20%, rgba(8, 145, 178, 0.16), transparent 55%), radial-gradient(circle at 18% 82%, rgba(16, 185, 129, 0.14), transparent 52%)',
          }}
        />
        <div className="architectural-grid absolute inset-0 opacity-65" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-600/25 bg-cyan-500/10 px-2.5 py-1 font-mono-tech text-[10px] font-medium uppercase tracking-wider text-cyan-800 dark:border-cyan-500/30 dark:text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
            Django Web App
          </span>
          <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
            CRUD · Validation · SQLite
          </span>
        </div>

        <div className="relative z-10 my-auto">
          <svg
            viewBox="0 0 600 26"
            fill="none"
            className="pointer-events-none mb-2 hidden h-5 w-full text-cyan-600/60 sm:block dark:text-cyan-400/65"
          >
            <path
              d="M140 13 H460"
              stroke="currentColor"
              strokeWidth="1.5"
              className="svg-signal-flow"
            />
            <circle cx="140" cy="13" r="3.5" fill="currentColor" />
            <circle cx="460" cy="13" r="3.5" fill="var(--accent-primary)" />
          </svg>

          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3.5 shadow-2xs sm:p-4 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
              <BookOpen className="mb-2 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <p className="font-mono-tech text-xs font-medium text-[var(--text-primary)]">
                Book Catalog
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Create · Read · Update · Delete
              </p>
            </div>
            <div className="rounded-xl border border-cyan-600/35 bg-[var(--surface)] p-3.5 shadow-[0_8px_22px_-12px_rgba(8,145,178,0.28)] sm:p-4 dark:border-cyan-500/35 dark:bg-slate-900/95 dark:shadow-none">
              <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="font-mono-tech text-xs font-medium text-[var(--text-primary)]">
                Data Integrity
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Validation &amp; Error Handling
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-[var(--border)]/70 pt-3 font-mono-tech text-[10px] text-[var(--text-muted)]">
          <span className="truncate">System Overview · Catalog &amp; Validation</span>
          <span className="shrink-0 font-medium text-cyan-700 dark:text-cyan-400/90">
            Django · SQLite
          </span>
        </div>
      </div>
    </div>
  );
}

export const Projects = memo(function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useOffscreenPause(sectionRef);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProject]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-divider relative overflow-x-clip border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      <SectionBackdrop variant="blueprint" />
      <Container className="relative z-10">
        <SectionHeading
          chapter="04"
          eyebrow="Featured Projects"
          title="Selected engineering work & backend applications."
          description="Practical applications built with Python, Django, Django REST Framework, SQLite, and payment gateway integrations."
        />

        {/* Alternating asymmetric 12-column editorial project showcases */}
        <div className="space-y-6 lg:space-y-8">
          {PROJECTS.map((project, idx) => {
            const isReversed = idx % 2 === 1;
            const caseNumber = String(idx + 1).padStart(2, '0');

            return (
              <Reveal key={project.id} delay={idx * 0.08} direction={isReversed ? 'right' : 'left'}>
                <TiltCard
                  accent={isReversed ? 'cyan' : 'emerald'}
                  maxTilt={2.2}
                  conicBorder
                  featuredGlass
                  className="group p-4 sm:p-6 lg:p-7"
                >
                  <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Architectural visual panel */}
                    <div
                      className={`min-w-0 lg:col-span-7 ${
                        isReversed ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <ProjectVisual type={project.visualType} interactive tall />
                    </div>

                    {/* Editorial specification panel */}
                    <div
                      className={`flex min-w-0 flex-col justify-between lg:col-span-5 ${
                        isReversed ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Case {caseNumber} · {project.date}
                          </span>
                        </div>

                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-emerald-700 sm:text-3xl dark:group-hover:text-emerald-200">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
                          {project.tagline}
                        </p>

                        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {project.summary}
                        </p>

                        <ul className="mt-4 space-y-2 border-t border-[var(--border)]/70 pt-4">
                          {project.highlights.slice(0, 2).map((item, hIdx) => (
                            <li
                              key={hIdx}
                              className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="default">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center min-[420px]:justify-between">
                        <Button
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="secondary"
                          size="md"
                          className="group/btn w-full min-[420px]:w-auto"
                          aria-label={`View ${project.title} repository (${project.githubLabel}) on GitHub`}
                        >
                          <Github className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="truncate">GitHub: {project.githubLabel}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Button>

                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="group/details inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl px-3 font-mono-tech text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-emerald-700 cursor-pointer dark:hover:bg-slate-800/50 dark:hover:text-emerald-300"
                        >
                          <span>Case Breakdown</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/details:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </Container>

      {/* Accessible Project Detail Modal rendered via Portal to escape section layout containment & stacking context */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--modal-backdrop)] p-3 backdrop-blur-xs sm:p-4"
              >
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5 shadow-2xl sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono-tech text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {selectedProject.date}
                      </p>
                      <h3
                        id="project-modal-title"
                        className="mt-1 text-xl font-bold text-[var(--text-primary)] sm:text-2xl"
                      >
                        {selectedProject.title}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {selectedProject.tagline}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      aria-label="Close project details"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5">
                    <ProjectVisual type={selectedProject.visualType} />
                  </div>

                  <div className="mt-5">
                    <p className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Key Capabilities
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {selectedProject.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="emerald">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                    <Button
                      variant="ghost"
                      size="md"
                      className="w-full sm:w-auto"
                      onClick={() => setSelectedProject(null)}
                    >
                      Close
                    </Button>
                    <Button
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="md"
                      className="group/modal w-full sm:w-auto"
                    >
                      <Github className="h-4 w-4" />
                      <span>Open {selectedProject.githubLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/modal:-translate-y-0.5 group-hover/modal:translate-x-0.5" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
});
