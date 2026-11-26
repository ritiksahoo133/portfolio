import { memo, useRef } from 'react';
import { useOffscreenPause } from '../../hooks/useOffscreenPause';

export type SectionBackdropVariant =
  | 'meridian'
  | 'prism'
  | 'blueprint'
  | 'horizon'
  | 'beacon';

interface SectionBackdropProps {
  variant: SectionBackdropVariant;
}

/**
 * Curated, self-pausing editorial atmospheric backdrops for portfolio chapters.
 * - Pure CSS radial gradients & lightweight SVG hairlines (zero blur filters, zero JS animation loops).
 * - Uses the shared singleton offscreen IntersectionObserver so animations pause AND release
 *   GPU layers (`will-change: auto`) whenever the section is outside the viewport.
 */
export const SectionBackdrop = memo(function SectionBackdrop({
  variant,
}: SectionBackdropProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  useOffscreenPause(hostRef);

  return (
    <div
      ref={hostRef}
      data-offscreen="true"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {variant === 'meridian' && (
        <>
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--section-hairline) 1px, transparent 1px)',
              backgroundSize: '140px 100%',
              maskImage:
                'radial-gradient(ellipse 80% 70% at 50% 45%, #000 35%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 70% at 50% 45%, #000 35%, transparent 100%)',
            }}
          />
          <div
            className="section-ambient-orb absolute -right-32 top-16 hidden h-[380px] w-[380px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(circle, var(--section-glow-emerald) 0%, transparent 70%)',
            }}
          />
          <div
            className="section-ambient-orb section-ambient-orb-alt absolute -left-36 bottom-10 hidden h-[360px] w-[360px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(circle, var(--section-glow-cyan) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {variant === 'prism' && (
        <>
          <div
            className="absolute inset-0 opacity-40 dark:opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)',
              backgroundSize: '32px 32px',
              maskImage:
                'radial-gradient(ellipse 78% 68% at 50% 45%, #000 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 78% 68% at 50% 45%, #000 30%, transparent 100%)',
            }}
          />
          <div
            className="section-ambient-orb absolute left-[10%] top-8 hidden h-[340px] w-[440px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--section-glow-cyan) 0%, transparent 72%)',
            }}
          />
          <div
            className="section-ambient-orb section-ambient-orb-alt absolute bottom-0 right-[6%] hidden h-[340px] w-[420px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(ellipse at center, var(--section-glow-emerald) 0%, transparent 72%)',
            }}
          />
        </>
      )}

      {variant === 'blueprint' && (
        <>
          <div
            className="architectural-grid absolute inset-0 opacity-50"
            style={{
              maskImage:
                'radial-gradient(ellipse 84% 72% at 50% 50%, #000 28%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 84% 72% at 50% 50%, #000 28%, transparent 100%)',
            }}
          />
          <div
            className="section-ambient-orb absolute -left-28 top-[18%] hidden h-[400px] w-[400px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(circle, var(--section-glow-emerald) 0%, transparent 70%)',
            }}
          />
          <div
            className="section-ambient-orb section-ambient-orb-alt absolute -right-28 bottom-[12%] hidden h-[400px] w-[400px] rounded-full md:block"
            style={{
              background:
                'radial-gradient(circle, var(--section-glow-cyan) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {variant === 'horizon' && (
        <div
          className="section-ambient-orb absolute inset-x-0 top-1/2 mx-auto -mt-[150px] h-[300px] w-[min(90vw,680px)] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, var(--section-glow-emerald) 0%, var(--section-glow-cyan) 42%, transparent 72%)',
          }}
        />
      )}

      {variant === 'beacon' && (
        <>
          <div
            className="section-ambient-orb absolute inset-x-0 bottom-0 mx-auto h-[380px] max-w-4xl sm:h-[460px]"
            style={{
              background:
                'radial-gradient(ellipse 68% 60% at 50% 92%, var(--section-glow-emerald) 0%, var(--section-glow-cyan) 42%, transparent 74%)',
            }}
          />
          <svg
            viewBox="0 0 800 800"
            fill="none"
            className="absolute left-1/2 top-1/2 hidden h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 opacity-75 md:block"
          >
            <g className="beacon-orbit-slow">
              <circle
                cx="400"
                cy="400"
                r="240"
                stroke="var(--section-ring-stroke)"
                strokeWidth="1"
                strokeDasharray="6 10"
              />
              <circle cx="400" cy="160" r="3" fill="var(--accent-primary)" opacity="0.55" />
            </g>
            <g className="beacon-orbit-reverse">
              <circle
                cx="400"
                cy="400"
                r="340"
                stroke="var(--section-ring-stroke)"
                strokeWidth="1"
                strokeDasharray="3 14"
              />
              <circle cx="740" cy="400" r="2.5" fill="var(--accent-secondary)" opacity="0.5" />
            </g>
          </svg>
        </>
      )}
    </div>
  );
});
