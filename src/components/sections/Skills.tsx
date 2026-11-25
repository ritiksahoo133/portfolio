import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Cloud,
  Code2,
  CreditCard,
  Database,
  Layout,
  Server,
  Sparkles,
} from 'lucide-react';
import { SKILL_CATEGORIES, type SkillCategory } from '../../data/skills';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../animations/Reveal';
import { SpotlightCard } from '../animations/SpotlightCard';
import { TiltCard } from '../animations/TiltCard';

const ICON_MAP: Record<SkillCategory['icon'], typeof Code2> = {
  code: Code2,
  layout: Layout,
  server: Server,
  sparkles: Sparkles,
  database: Database,
  cloud: Cloud,
  building: Building2,
  creditCard: CreditCard,
};

const SKILL_FILTERS = [
  { id: 'all', label: 'All Domains', ids: null as string[] | null },
  { id: 'ai-backend', label: 'AI & Backend', ids: ['ai-ml', 'backend'] },
  { id: 'web', label: 'Languages & Frontend', ids: ['languages', 'frontend'] },
  { id: 'cloud-data', label: 'Cloud & Databases', ids: ['tools-cloud', 'databases'] },
  {
    id: 'enterprise',
    label: 'ERP & Payments',
    ids: ['erp-integrations', 'payments-notifications'],
  },
];

export const Skills = memo(function Skills() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const visibleCategories = useMemo(() => {
    const currentFilter =
      SKILL_FILTERS.find((f) => f.id === activeFilter) ?? SKILL_FILTERS[0];
    return currentFilter.ids
      ? SKILL_CATEGORIES.filter((cat) => currentFilter.ids?.includes(cat.id))
      : SKILL_CATEGORIES;
  }, [activeFilter]);

  return (
    <section
      id="skills"
      className="relative border-t border-[var(--border)] py-16 sm:py-24 lg:py-28"
    >
      <Container>
        <SectionHeading
          chapter="03"
          eyebrow="Technical Skills"
          title="A full-stack, cloud & AI engineering toolkit."
          description="Technologies, frameworks, enterprise ERP platforms, and infrastructure tools applied in production."
        />

        {/* Single-row crisp interactive domain focus bar */}
        <div
          role="tablist"
          aria-label="Filter skills by engineering domain"
          className="isolate mb-7 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 sm:mb-9 dark:bg-slate-950/60"
        >
          {SKILL_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`relative min-h-[40px] whitespace-nowrap rounded-xl px-3.5 py-2 font-mono-tech text-[11px] font-medium transition-colors sm:px-4 sm:text-xs cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-200'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skillFilterActive"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-600/35 dark:bg-emerald-500/18 dark:ring-emerald-500/40"
                  />
                )}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {visibleCategories.map((category, idx) => {
            const Icon = ICON_MAP[category.icon];
            const isFeatured = category.span === 'wide';
            const colSpan =
              activeFilter !== 'all'
                ? 'lg:col-span-3'
                : isFeatured
                  ? 'lg:col-span-3'
                  : 'lg:col-span-2';
            const accent = idx % 2 === 1 ? 'cyan' : 'emerald';
            const code = String(idx + 1).padStart(2, '0');

            const cardContent = (
              <>
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-emerald-700 transition-all duration-200 group-hover:scale-105 group-hover:-rotate-3 group-hover:border-emerald-600/40 group-hover:bg-emerald-500/12 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-emerald-400 dark:group-hover:border-emerald-500/40">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2 font-mono-tech text-[11px] text-[var(--text-muted)]">
                      <span>{category.skills.length} items</span>
                      <span className="text-[var(--border)]">/</span>
                      <span className="text-emerald-700/80 dark:text-emerald-400/80">{code}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {category.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5 font-mono-tech text-xs text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-600/45 hover:bg-emerald-500/10 hover:text-emerald-800 sm:px-3 dark:border-slate-800 dark:bg-slate-950/65 dark:text-slate-200 dark:hover:border-emerald-400/45 dark:hover:text-emerald-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            );

            return (
              <Reveal
                key={category.id}
                delay={activeFilter === 'all' ? idx * 0.03 : 0}
                className={`h-full ${colSpan}`}
              >
                {isFeatured ? (
                  <TiltCard
                    accent={accent}
                    maxTilt={2.6}
                    conicBorder
                    className="group flex h-full flex-col justify-between p-5 sm:p-6"
                  >
                    {cardContent}
                  </TiltCard>
                ) : (
                  <SpotlightCard
                    accent={accent}
                    className="group flex h-full flex-col justify-between p-5 sm:p-6"
                  >
                    {cardContent}
                  </SpotlightCard>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
});
