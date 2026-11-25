import { useSyncExternalStore } from 'react';

function createMediaQueryStore(query: string, fallback = false) {
  let mediaQuery: MediaQueryList | null = null;
  let currentValue = fallback;
  const listeners = new Set<() => void>();

  const ensureInit = () => {
    if (mediaQuery || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    mediaQuery = window.matchMedia(query);
    currentValue = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      if (currentValue !== event.matches) {
        currentValue = event.matches;
        listeners.forEach((listener) => listener());
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
    }
  };

  return {
    subscribe(listener: () => void) {
      ensureInit();
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      ensureInit();
      return currentValue;
    },
    getServerSnapshot() {
      return fallback;
    },
  };
}

const reducedMotionStore = createMediaQueryStore('(prefers-reduced-motion: reduce)', false);
const finePointerStore = createMediaQueryStore('(pointer: fine)', false);

/**
 * Shared singleton media-query subscription (1 listener app-wide instead of 1 per component).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot
  );
}

/**
 * Shared singleton pointer-precision subscription (1 listener app-wide).
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    finePointerStore.subscribe,
    finePointerStore.getSnapshot,
    finePointerStore.getServerSnapshot
  );
}
