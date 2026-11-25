import { Reveal } from '../animations/Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  /** Optional editorial chapter index (e.g., "01", "02") */
  chapter?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  chapter,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <Reveal
      className={`relative mb-9 sm:mb-12 md:mb-16 ${
        isCentered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'
      }`}
    >
      {chapter && !isCentered && (
        <span
          aria-hidden="true"
          className="chapter-watermark absolute -left-2 -top-7 hidden text-7xl font-bold tracking-tighter sm:block md:-top-9 md:text-8xl"
        >
          {chapter}
        </span>
      )}

      <div
        className={`relative z-10 mb-2.5 inline-flex items-center gap-2.5 font-mono-tech text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 sm:mb-3 sm:text-xs ${
          isCentered ? 'justify-center' : ''
        }`}
      >
        {chapter && (
          <span className="rounded-md border border-emerald-600/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
            {chapter}
          </span>
        )}
        <span
          className="h-px w-5 bg-emerald-600/70 dark:bg-emerald-400/70 sm:w-6"
          aria-hidden="true"
        />
        <span>{eyebrow}</span>
      </div>
      <h2 className="heading-section relative z-10 font-bold tracking-tight text-[var(--text-primary)]">
        {title}
      </h2>
      {description && (
        <p className="relative z-10 mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-base md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
