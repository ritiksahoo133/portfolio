import { memo } from 'react';
import { Award, Calendar, GraduationCap, MapPin } from 'lucide-react';
import { EDUCATION } from '../../data/education';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../animations/Reveal';
import { SpotlightCard } from '../animations/SpotlightCard';
import { TiltCard } from '../animations/TiltCard';

export const Education = memo(function Education() {
  return (
    <section
      id="education"
      className="relative border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          chapter="05"
          eyebrow="Education"
          title="Academic foundation in computer science."
          description="Undergraduate engineering training underpinning practical systems architecture, algorithms, and full-stack development."
        />

        <div className="space-y-6">
          {EDUCATION.map((edu) => (
            <div key={edu.id} className="grid items-stretch gap-5 lg:grid-cols-12 lg:gap-6">
              {/* Primary institution & degree card */}
              <Reveal direction="left" className="lg:col-span-8">
                <SpotlightCard className="conic-border flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8">
                  <div
                    aria-hidden="true"
                    className="decorative-layer pointer-events-none absolute -right-16 -top-16 hidden h-64 w-64 rounded-full sm:block"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 68%)',
                    }}
                  />

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-700 sm:h-14 sm:w-14 dark:border-emerald-500/35 dark:text-emerald-400">
                      <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                        Undergraduate Degree
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)] sm:text-2xl lg:text-[1.65rem]">
                        {edu.institution}
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-[var(--text-secondary)] sm:text-base">
                        {edu.degree}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-5 font-mono-tech text-xs text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                      <span>{edu.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{edu.location}</span>
                    </span>
                  </div>
                </SpotlightCard>
              </Reveal>

              {/* Editorial CGPA highlight card */}
              <Reveal direction="right" delay={0.08} className="lg:col-span-4">
                <TiltCard
                  accent="cyan"
                  maxTilt={3.5}
                  conicBorder
                  featuredGlass
                  className="flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      Academic Record
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/35 dark:text-emerald-400">
                      <Award className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="my-5">
                    <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                      CGPA
                    </p>
                    <p className="mt-1 font-mono-tech text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                      {edu.cgpa}
                    </p>
                  </div>

                  <p className="border-t border-[var(--border)] pt-4 font-mono-tech text-[11px] text-[var(--text-muted)]">
                    {edu.degree} · {edu.duration}
                  </p>
                </TiltCard>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
});
