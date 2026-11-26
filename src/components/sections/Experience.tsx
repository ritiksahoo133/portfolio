import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronDown, MapPin } from 'lucide-react';
import { EXPERIENCES } from '../../data/experience';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL, badgeItem, staggerContainer } from '../../lib/motion';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Badge } from '../common/Badge';
import { Reveal } from '../animations/Reveal';
import { SectionBackdrop } from '../animations/SectionBackdrop';
import { SpotlightCard } from '../animations/SpotlightCard';

export const Experience = memo(function Experience() {
  const [expandedIds, setExpandedIds] = useState<string[]>([
    EXPERIENCES[0].id,
    EXPERIENCES[1].id,
  ]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();

  // Zero-reflow GPU scaleY progress spine: caches geometry on resize/expand, pure arithmetic on scroll
  useEffect(() => {
    const timeline = timelineRef.current;
    const progressEl = progressBarRef.current;
    if (!timeline || !progressEl) return;

    if (reducedMotion || !finePointer) {
      progressEl.style.transform = 'scaleY(1)';
      return;
    }

    let inView = false;
    let rafId = 0;
    let cachedDocTop = 0;
    let cachedHeight = 1;
    let cachedViewportH = window.innerHeight || 1;

    const measureGeometry = () => {
      const rect = timeline.getBoundingClientRect();
      cachedDocTop = rect.top + window.scrollY;
      cachedHeight = Math.max(1, rect.height);
      cachedViewportH = window.innerHeight || 1;
    };

    const updateProgress = () => {
      rafId = 0;
      const topInViewport = cachedDocTop - window.scrollY;
      const start = cachedViewportH * 0.76;
      const raw = (start - topInViewport) / cachedHeight;
      const clamped = Math.min(1, Math.max(0, raw));
      progressEl.style.transform = `scaleY(${clamped})`;
    };

    const schedule = () => {
      if (inView && !rafId) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    const onResize = () => {
      measureGeometry();
      schedule();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        inView = Boolean(entries[0]?.isIntersecting);
        if (inView) {
          measureGeometry();
          schedule();
        }
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(timeline);
    measureGeometry();
    updateProgress();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(timeline);
    }

    return () => {
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, finePointer, expandedIds]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allExpanded = expandedIds.length === EXPERIENCES.length;

  const toggleAll = () => {
    setExpandedIds(allExpanded ? [EXPERIENCES[0].id] : EXPERIENCES.map((e) => e.id));
  };

  return (
    <section
      id="experience"
      className="section-divider relative overflow-x-clip border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      <SectionBackdrop variant="meridian" />
      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            chapter="02"
            eyebrow="Professional Experience"
            title="Engineering impact across enterprise & high-scale systems."
            description="From AI-powered ERP solutions and SAP/Tally integrations to 50K+ user backend platforms and live-sports delivery."
          />
          <div className="mb-8 sm:mb-12 md:mb-16">
            <button
              type="button"
              onClick={toggleAll}
              className="min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 font-mono-tech text-xs text-[var(--text-secondary)] shadow-2xs transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 cursor-pointer dark:shadow-none dark:hover:text-emerald-300"
            >
              {allExpanded ? 'Compact View' : 'Expand All Roles'}
            </button>
          </div>
        </div>

        <div ref={timelineRef} className="relative pl-6 sm:pl-11">
          {/* GPU-composited timeline spine (scaleY transform — zero SVG strokeDashoffset repaint) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-[7px] top-2 w-[2px] overflow-hidden rounded-full bg-[var(--border)] sm:left-[15px]"
          >
            <div
              ref={progressBarRef}
              style={{
                transform: reducedMotion || !finePointer ? 'scaleY(1)' : 'scaleY(0)',
                background:
                  'linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 55%, rgba(16, 185, 129, 0.35) 100%)',
              }}
              className="h-full w-full origin-top will-change-transform"
            />
          </div>

          <div className="space-y-5 sm:space-y-6">
            {EXPERIENCES.map((exp, index) => {
              const isExpanded = expandedIds.includes(exp.id);

              return (
                <Reveal key={exp.id} delay={index * 0.06} className="relative">
                  {/* Timeline node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[24px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors sm:-left-[36px] sm:top-7 ${
                      exp.isCurrent
                        ? 'border-emerald-600 bg-emerald-500/20 shadow-[0_0_14px_rgba(5,150,105,0.45)] dark:border-emerald-400 dark:bg-emerald-500/30 dark:shadow-[0_0_16px_rgba(16,185,129,0.75)]'
                        : isExpanded
                          ? 'border-cyan-600/80 bg-[var(--background)] dark:border-cyan-400/80'
                          : 'border-slate-400 bg-[var(--background)] dark:border-slate-600'
                    }`}
                  >
                    {exp.isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-300" />
                    )}
                  </span>

                  <SpotlightCard accent={exp.isCurrent ? 'emerald' : 'cyan'}>
                    {/* Header / Expand trigger */}
                    <button
                      type="button"
                      onClick={() => toggleItem(exp.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`exp-panel-${exp.id}`}
                      className="flex w-full flex-col gap-3.5 p-4 text-left transition-colors hover:bg-[var(--surface-elevated)]/50 sm:gap-4 sm:p-6 lg:p-7 cursor-pointer dark:hover:bg-slate-900/25"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] sm:text-xl md:text-2xl">
                              {exp.company}
                            </h3>
                            {exp.isCurrent && <Badge variant="emerald">Current Role</Badge>}
                          </div>
                          <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 sm:text-base dark:text-emerald-300">
                            <Briefcase className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400/90" />
                            <span>{exp.position}</span>
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {/* Desktop right-aligned date/location */}
                          <div className="hidden space-y-1 text-right sm:block">
                            <p className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-[var(--text-secondary)]">
                              <Calendar className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                              <span>{exp.duration}</span>
                            </p>
                            <p className="flex items-center justify-end gap-1.5 font-mono-tech text-xs text-[var(--text-muted)]">
                              <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                              <span>{exp.location}</span>
                            </p>
                          </div>

                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-transform duration-200 ${
                              isExpanded
                                ? 'rotate-180 border-emerald-600/40 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300'
                                : ''
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </div>
                      </div>

                      {/* Mobile date & location row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono-tech text-[11px] text-[var(--text-secondary)] sm:hidden">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                          <span>{exp.duration}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{exp.location}</span>
                        </span>
                      </div>

                      <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
                        {exp.summary}
                      </p>
                    </button>

                    {/* Expandable responsibilities & staggered tech tags */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`exp-panel-${exp.id}`}
                          initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE_EDITORIAL }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[var(--border)] px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:px-7 lg:pb-7">
                            <p className="mb-3 font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                              Key Responsibilities
                            </p>
                            <ul className="space-y-2.5 sm:space-y-3">
                              {exp.responsibilities.map((point, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)] sm:gap-3"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600/90 dark:bg-emerald-400/90"
                                  />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>

                            <motion.div
                              variants={staggerContainer(0.03, 0.04)}
                              initial={reducedMotion ? false : 'hidden'}
                              animate="visible"
                              className="mt-5 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-4 sm:mt-6 sm:gap-2 sm:pt-5"
                            >
                              {exp.technologies.map((tech) => (
                                <motion.span key={tech} variants={badgeItem}>
                                  <Badge variant="default">{tech}</Badge>
                                </motion.span>
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
});
