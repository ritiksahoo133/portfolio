import { memo, useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Global scroll-choreographed atmospheric backdrop.
 * - Desktop fine-pointer only so mobile GPUs never alpha-blend extra full-viewport fixed layers.
 * - Caches scrollable document height via ResizeObserver (ZERO forced scrollHeight reads during scroll).
 * - Uses a single passive scroll listener coalesced into requestAnimationFrame (zero React re-renders).
 */
export const AtmosphericCanvas = memo(function AtmosphericCanvas() {
  const washARef = useRef<HTMLDivElement>(null);
  const washBRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    let rafId = 0;
    let cachedMaxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );

    const syncToScroll = () => {
      rafId = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / cachedMaxScroll));

      const waveA = Math.sin(progress * Math.PI * 1.6);
      const waveB = Math.cos(progress * Math.PI * 1.4);

      if (washARef.current) {
        const xA = waveA * 6;
        const yA = progress * 14 - 4;
        washARef.current.style.transform = `translate3d(${xA.toFixed(2)}vw, ${yA.toFixed(2)}vh, 0)`;
      }

      if (washBRef.current) {
        const xB = -waveB * 7;
        const yB = (1 - progress) * 12 - 5;
        washBRef.current.style.transform = `translate3d(${xB.toFixed(2)}vw, ${yB.toFixed(2)}vh, 0)`;
      }
    };

    const scheduleSync = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(syncToScroll);
      }
    };

    const recalcBounds = () => {
      cachedMaxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scheduleSync();
    };

    syncToScroll();
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', recalcBounds, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(recalcBounds);
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', recalcBounds);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer) return null;

  return (
    <div aria-hidden="true" className="atmospheric-backdrop hidden md:block">
      <div
        ref={washARef}
        className="atmospheric-wash -left-[10vw] top-[14vh] h-[46vh] w-[44vw] max-w-[560px]"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--atmo-wash-a) 0%, transparent 68%)',
        }}
      />
      <div
        ref={washBRef}
        className="atmospheric-wash -right-[10vw] bottom-[12vh] h-[44vh] w-[42vw] max-w-[540px]"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--atmo-wash-b) 0%, var(--atmo-wash-c) 38%, transparent 70%)',
        }}
      />
    </div>
  );
});
