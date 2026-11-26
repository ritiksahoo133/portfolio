import { useEffect, useRef } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../theme/useTheme';
import { THEME_TOKENS } from '../../theme/themeTokens';

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number; // 0.45 (far) | 0.75 (mid) | 1.0 (near)
  phase: number;
  phaseSpeed: number;
  isSecondary: boolean;
}

interface SignalPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  isSecondary: boolean;
}

const IDLE_FRAME_MS = 38; // ~26 FPS — silky slow ambient drift at low CPU cost
const ACTIVE_FRAME_MS = 26; // ~38 FPS while pointer is actively moving inside Hero
const MAX_CONNECT_DIST = 160;
const MAX_CONNECT_DIST_SQ = MAX_CONNECT_DIST * MAX_CONNECT_DIST;
const POINTER_RADIUS = 185;
const POINTER_RADIUS_SQ = POINTER_RADIUS * POINTER_RADIUS;

/**
 * Precision depth-layered neural/systems flow field for the Hero background.
 * - Runs only on desktop fine-pointer devices when prefers-reduced-motion is false.
 * - Uses 1x backing resolution (55%+ less fill-rate bandwidth than 1.5x/2x Retina buffers).
 * - Caches bounding rect on resize/scroll while visible (ZERO getBoundingClientRect calls in pointermove).
 * - Detaches pointer/scroll listeners and stops rAF whenever Hero scrolls out of view or tab is hidden.
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
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rafId = 0;
    let isVisible = true;
    let pointerListenersAttached = false;
    let width = 0;
    let height = 0;
    let rectLeft = 0;
    let rectTop = 0;
    let lastDrawTime = 0;
    let frameCounter = 0;

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      lastMove: 0,
    };

    const syncRect = () => {
      const rect = canvas.getBoundingClientRect();
      rectLeft = rect.left;
      rectTop = rect.top;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      // Soft ambient nodes do not require high-DPR backing stores (massive fill-rate savings)
      canvas.width = width;
      canvas.height = height;
      syncRect();
    };

    resize();

    const depths = [0.45, 0.75, 1.0];
    const count = width > 1200 ? 22 : 18;
    const particles: NodeParticle[] = Array.from({ length: count }, (_, idx) => {
      const depth = depths[idx % depths.length];
      const baseSpeed = 0.22 + depth * 0.2;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        r: (0.95 + Math.random() * 1.05) * (0.65 + depth * 0.45),
        depth,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.02,
        isSecondary: idx % 3 === 0,
      };
    });

    const pulses: SignalPulse[] = [];

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const lx = e.clientX - rectLeft;
      const ly = e.clientY - rectTop;
      if (lx >= 0 && lx <= width && ly >= 0 && ly <= height) {
        pointer.x = lx;
        pointer.y = ly;
        pointer.active = true;
        pointer.lastMove = performance.now();
      } else {
        pointer.active = false;
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onScrollSync = () => {
      // Hero sits at y=0, so rectTop tracks -window.scrollY without forcing layout
      rectTop = -window.scrollY;
    };

    const attachPointerListeners = () => {
      if (pointerListenersAttached) return;
      pointerListenersAttached = true;
      syncRect();
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('scroll', onScrollSync, { passive: true });
      document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    };

    const detachPointerListeners = () => {
      if (!pointerListenersAttached) return;
      pointerListenersAttached = false;
      pointer.active = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScrollSync);
      document.removeEventListener('mouseleave', onPointerLeave);
    };

    const draw = (now: number) => {
      if (!isVisible || document.hidden) {
        rafId = 0;
        return;
      }

      const pointerRecentlyActive = pointer.active && now - pointer.lastMove < 1000;
      const interval = pointerRecentlyActive ? ACTIVE_FRAME_MS : IDLE_FRAME_MS;

      if (now - lastDrawTime >= interval) {
        lastDrawTime = now;
        frameCounter++;
        const palette = THEME_TOKENS[themeRef.current].canvas;
        ctx.clearRect(0, 0, width, height);

        // 1. Update positions with gentle harmonic drift & subtle pointer repulsion
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.phase += p.phaseSpeed;
          p.x += p.vx + Math.sin(p.phase * 0.5) * 0.06 * p.depth;
          p.y += p.vy + Math.cos(p.phase * 0.5) * 0.06 * p.depth;

          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > 16 && distSq < POINTER_RADIUS_SQ) {
              const dist = Math.sqrt(distSq);
              const push = (1 - dist / POINTER_RADIUS) * 0.4 * p.depth;
              p.x += (dx / dist) * push;
              p.y += (dy / dist) * push;
            }
          }

          if (p.x < -16) p.x = width + 16;
          if (p.x > width + 16) p.x = -16;
          if (p.y < -16) p.y = height + 16;
          if (p.y > height + 16) p.y = -16;
        }

        // 2. Draw inter-node connections & occasionally spawn traveling signal pulses
        ctx.lineWidth = 0.75;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < MAX_CONNECT_DIST_SQ) {
              const dist = Math.sqrt(distSq);
              const depthFactor = (p.depth + q.depth) * 0.5;
              const lineAlpha = (1 - dist / MAX_CONNECT_DIST) * palette.lineMaxAlpha * depthFactor;
              if (lineAlpha < 0.015) continue;

              const rgb =
                p.isSecondary && q.isSecondary ? palette.secondaryRgb : palette.primaryRgb;

              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(${rgb},${lineAlpha})`;
              ctx.stroke();

              if (pulses.length < 3 && frameCounter % 24 === 0 && Math.random() < 0.14) {
                pulses.push({
                  fromIdx: i,
                  toIdx: j,
                  progress: 0,
                  speed: 0.024 + Math.random() * 0.016,
                  isSecondary: p.isSecondary || q.isSecondary,
                });
              }
            }
          }

          if (pointer.active) {
            const pdx = p.x - pointer.x;
            const pdy = p.y - pointer.y;
            const pDistSq = pdx * pdx + pdy * pdy;
            if (pDistSq < POINTER_RADIUS_SQ) {
              const pDist = Math.sqrt(pDistSq);
              const pAlpha = (1 - pDist / POINTER_RADIUS) * palette.pointerLineAlpha * p.depth;
              if (pAlpha >= 0.015) {
                const rgb = p.isSecondary ? palette.secondaryRgb : palette.primaryRgb;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pointer.x, pointer.y);
                ctx.strokeStyle = `rgba(${rgb},${pAlpha})`;
                ctx.stroke();
              }
            }
          }
        }

        // 3. Draw traveling signal pulses
        for (let k = pulses.length - 1; k >= 0; k--) {
          const pulse = pulses[k];
          pulse.progress += pulse.speed;
          const from = particles[pulse.fromIdx];
          const to = particles[pulse.toIdx];
          if (!from || !to || pulse.progress >= 1) {
            pulses.splice(k, 1);
            continue;
          }
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          if (dx * dx + dy * dy > MAX_CONNECT_DIST_SQ * 1.4) {
            pulses.splice(k, 1);
            continue;
          }

          const px = from.x + dx * pulse.progress;
          const py = from.y + dy * pulse.progress;
          const env = Math.sin(pulse.progress * Math.PI);
          const rgb = pulse.isSecondary ? palette.secondaryRgb : palette.pulseRgb;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${env * 0.22})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 1.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${env * 0.72})`;
          ctx.fill();
        }

        // 4. Draw depth-layered nodes with soft halo + crisp core
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const breath = 0.72 + Math.sin(p.phase) * 0.28;
          const alpha = (palette.nodeAlphaMin + breath * palette.nodeAlphaRange) * p.depth;
          const rgb = p.isSecondary ? palette.secondaryRgb : palette.primaryRgb;

          if (p.depth >= 0.75) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${alpha * 0.18})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${alpha})`;
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const startIfActive = () => {
      if (isVisible && !document.hidden) {
        attachPointerListeners();
        if (!rafId) {
          rafId = requestAnimationFrame(draw);
        }
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      detachPointerListeners();
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
      { threshold: 0.02 }
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-85"
    />
  );
}
