import { memo, useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Tactile, ultra-lightweight desktop ambient cursor aura.
 * - Renders only on fine-pointer desktop devices when prefers-reduced-motion is false.
 * - Uses a compact 420x420 fixed compositor layer driven by `translate3d`.
 * - Dynamically toggles `will-change: transform` only during active motion and
 *   auto-sleeps its rAF loop within 0.25px of the pointer (0% idle CPU & minimal VRAM).
 */
export const CursorSpotlight = memo(function CursorSpotlight() {
  const auraRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!finePointer || reducedMotion || !auraRef.current) return;

    const el = auraRef.current;
    let rafId = 0;
    let visible = false;
    let targetX = -999;
    let targetY = -999;
    let currentX = -999;
    let currentY = -999;

    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) {
        currentX = targetX;
        currentY = targetY;
        el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
        el.style.willChange = 'auto';
        rafId = 0;
        return;
      }

      currentX += dx * 0.14;
      currentY += dy * 0.14;
      el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
        el.style.opacity = '1';
      }

      if (!rafId) {
        el.style.willChange = 'transform';
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerLeave = () => {
      visible = false;
      el.style.opacity = '0';
      el.style.willChange = 'auto';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return <div ref={auraRef} aria-hidden="true" className="cursor-aura" />;
});
