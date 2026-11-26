import { useEffect, type RefObject } from 'react';

let sharedOffscreenObserver: IntersectionObserver | null = null;
const observedCount = new WeakMap<Element, boolean>();

function getSharedOffscreenObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  if (!sharedOffscreenObserver) {
    sharedOffscreenObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.setAttribute('data-offscreen', entry.isIntersecting ? 'false' : 'true');
        }
      },
      { rootMargin: '140px 0px', threshold: 0.01 }
    );
  }

  return sharedOffscreenObserver;
}

/**
 * Shared singleton IntersectionObserver that sets `data-offscreen="true|false"`
 * on decorative hosts so CSS animations pause and release GPU layers offscreen.
 * Replaces per-section observer allocations with 1 shared observer app-wide.
 */
export function useOffscreenPause(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    const observer = getSharedOffscreenObserver();
    if (!el || !observer) return;

    if (!observedCount.has(el)) {
      observedCount.set(el, true);
      observer.observe(el);
    }

    return () => {
      observedCount.delete(el);
      observer.unobserve(el);
    };
  }, [ref]);
}
