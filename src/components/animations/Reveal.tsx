import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { DURATION } from '../../lib/motion';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  distance?: number;
  className?: string;
}

type RevealCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, RevealCallback>();

function getSharedRevealObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = observedElements.get(entry.target);
            if (cb) {
              cb();
              observedElements.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );
  }
  return sharedObserver;
}

/**
 * GPU-composited scroll reveal powered by a single shared IntersectionObserver
 * and native CSS transform/opacity transitions (zero JS animation frames during scroll).
 */
export function Reveal({
  children,
  delay = 0,
  duration = DURATION.editorial,
  direction = 'up',
  distance = 20,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const [visible, setVisible] = useState<boolean>(reducedMotion);

  useEffect(() => {
    if (reducedMotion || visible) {
      if (reducedMotion && !visible) setVisible(true);
      return;
    }

    const el = ref.current;
    const observer = getSharedRevealObserver();
    if (!el || !observer) {
      setVisible(true);
      return;
    }

    observedElements.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      observedElements.delete(el);
      observer.unobserve(el);
    };
  }, [reducedMotion, visible]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDirection =
    !finePointer && (direction === 'left' || direction === 'right') ? 'up' : direction;
  const effectiveDistance = finePointer ? distance : Math.min(distance, 14);
  const effectiveDuration = finePointer ? duration : Math.min(duration, 0.42);
  const effectiveDelay = finePointer ? delay : Math.min(delay, 0.1);

  const hiddenTransform =
    effectiveDirection === 'up'
      ? `translate3d(0, ${effectiveDistance}px, 0)`
      : effectiveDirection === 'left'
        ? `translate3d(-${effectiveDistance}px, 0, 0)`
        : effectiveDirection === 'right'
          ? `translate3d(${effectiveDistance}px, 0, 0)`
          : 'translate3d(0, 0, 0)';

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate3d(0, 0, 0)' : hiddenTransform,
    transitionProperty: 'opacity, transform',
    transitionDuration: `${effectiveDuration}s`,
    transitionDelay: `${effectiveDelay}s`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
