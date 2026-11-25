import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/useTheme';
import { THEME_TOKENS } from '../../theme/themeTokens';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alphaSeed: number;
  isSecondary: boolean;
}

const FRAME_INTERVAL_MS = 42; // ~24 FPS — silky for slow ambient drift at <40% of 60Hz CPU cost

/**
 * Lightweight ambient data-node particles for the Hero background.
 * - Runs only on desktop fine-pointer devices when prefers-reduced-motion is false.
 * - Uses 1x backing resolution and ~24fps frame pacing for minimal GPU/CPU footprint.
 * - Automatically pauses its rAF loop whenever Hero scrolls out of view or tab is hidden.
 */
export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => {
    themeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!finePointer || reducedMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let lastDrawTime = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      // Soft ambient particles do not need 2x Retina backing buffers (4x less pixel fill)
      canvas.width = width;
      canvas.height = height;
    };

    resize();

    const count = 16;
    const particles: Particle[] = Array.from({ length: count }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.1 + Math.random() * 1.3,
      alphaSeed: Math.random(),
      isSecondary: idx % 3 === 0,
    }));

    const draw = (now: number) => {
      if (!isVisible || document.hidden) {
        rafId = 0;
        return;
      }

      if (now - lastDrawTime >= FRAME_INTERVAL_MS) {
        lastDrawTime = now;
        const palette = THEME_TOKENS[themeRef.current].canvas;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          const alpha = palette.nodeAlphaMin + p.alphaSeed * palette.nodeAlphaRange;
          const rgb = p.isSecondary ? palette.secondaryRgb : palette.primaryRgb;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 21000) {
              const lineAlpha = (1 - Math.sqrt(distSq) / 145) * palette.lineMaxAlpha;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${palette.primaryRgb}, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const startIfActive = () => {
      if (isVisible && !document.hidden && !rafId) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nextVisible = Boolean(entry?.isIntersecting);
        if (nextVisible && !isVisible) {
          isVisible = true;
          startIfActive();
        } else if (!nextVisible && isVisible) {
          isVisible = false;
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startIfActive();
      }
    };

    observer.observe(canvas);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    startIfActive();

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-75"
    />
  );
}
