import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  accent?: 'emerald' | 'cyan';
  maxTilt?: number;
  /** Enables illuminated emerald-to-cyan perimeter border */
  conicBorder?: boolean;
  /** Enables elevated featured surface styling */
  featuredGlass?: boolean;
}

/**
 * Restrained 3D perspective + pointer-tracked radial spotlight + specular light reflection card.
 * Coalesces high-frequency pointer events into a single requestAnimationFrame per frame and
 * caches bounding rect on pointer entry to eliminate forced reflows and style thrashing.
 */
export function TiltCard({
  children,
  className = '',
  accent = 'emerald',
  maxTilt = 4.5,
  conicBorder = false,
  featuredGlass = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const interactive = finePointer && !reducedMotion;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!interactive || !cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
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
      const rect = rectRef.current ?? el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const lx = pointerRef.current.x - rect.left;
      const ly = pointerRef.current.y - rect.top;
      const px = lx / rect.width;
      const py = ly / rect.height;

      rotateY.set((px - 0.5) * maxTilt * 2);
      rotateX.set((0.5 - py) * maxTilt * 2);

      el.style.setProperty('--spot-x', `${lx}px`);
      el.style.setProperty('--spot-y', `${ly}px`);
      el.style.setProperty('--glare-x', `${(1 - px) * 100}%`);
      el.style.setProperty('--glare-y', `${(1 - py) * 100}%`);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    rotateX.set(0);
    rotateY.set(0);
  };

  const spotColor = accent === 'cyan' ? 'var(--spot-cyan)' : 'var(--spot-emerald)';
  const surfaceClasses = [
    'glass-card',
    featuredGlass ? 'glass-featured' : '',
    'spotlight-surface',
    conicBorder ? 'conic-border' : 'border-beam',
    'tilt-card-host relative overflow-hidden rounded-2xl',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!interactive) {
    return (
      <div
        className={surfaceClasses}
        style={{ '--spot-color': spotColor } as React.CSSProperties}
      >
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          '--spot-color': spotColor,
        } as React.CSSProperties}
        className={`h-full ${surfaceClasses}`}
      >
        <div aria-hidden="true" className="tilt-glare" />
        {children}
      </motion.div>
    </div>
  );
}
