import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.22,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rectScrollYRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const enabled = finePointer && !reducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!enabled || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
    rectScrollYRef.current = window.scrollY;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = ref.current;
      if (!el) return;
      if (!rectRef.current || rectScrollYRef.current !== window.scrollY) {
        rectRef.current = el.getBoundingClientRect();
        rectScrollYRef.current = window.scrollY;
      }
      const rect = rectRef.current;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((pointerRef.current.x - centerX) * strength);
      y.set((pointerRef.current.y - centerY) * strength);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  if (!enabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
