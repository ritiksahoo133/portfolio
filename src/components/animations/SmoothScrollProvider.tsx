import { useEffect, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Native compositor-thread scrolling provider with clean hash anchor navigation.
 * Eliminates scroll-jacking, non-passive wheel listeners, and continuous idle rAF loops
 * so scrolling stays responsive on the browser compositor thread even during UI updates.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const destination = document.querySelector<HTMLElement>(href);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });

      if (window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
