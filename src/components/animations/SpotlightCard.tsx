import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  accent?: 'emerald' | 'cyan';
}

/**
 * Elevated surface with rAF-throttled pointer-tracked radial illumination on desktop.
 * Caches bounding rect on pointer entry and coalesces high-polling mousemove events.
 */
export function SpotlightCard({
  children,
  className = '',
  accent = 'emerald',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rectScrollYRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const interactive = finePointer && !reducedMotion;

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!interactive || !cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
    rectScrollYRef.current = window.scrollY;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = cardRef.current;
      if (!el) return;
      if (!rectRef.current || rectScrollYRef.current !== window.scrollY) {
        rectRef.current = el.getBoundingClientRect();
        rectScrollYRef.current = window.scrollY;
      }
      const rect = rectRef.current;
      el.style.setProperty('--spot-x', `${pointerRef.current.x - rect.left}px`);
      el.style.setProperty('--spot-y', `${pointerRef.current.y - rect.top}px`);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
  };

  const spotColor = accent === 'cyan' ? 'var(--spot-cyan)' : 'var(--spot-emerald)';

  return (
    <div
      ref={cardRef}
      onMouseEnter={interactive ? handleMouseEnter : undefined}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      className={`glass-card spotlight-surface border-beam relative overflow-hidden rounded-2xl ${className}`}
      style={{ '--spot-color': spotColor } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
