import { useEffect, useState } from 'react';

interface SectionStore {
  active: string;
  listeners: Set<(id: string) => void>;
  observer: IntersectionObserver | null;
  refCount: number;
  cleanup: () => void;
}

const stores = new Map<string, SectionStore>();

function acquireSectionStore(sectionIds: string[], defaultId: string): SectionStore {
  const key = sectionIds.join('|');
  const existing = stores.get(key);
  if (existing) {
    existing.refCount += 1;
    return existing;
  }

  const visibleEntries = new Map<string, { ratio: number; top: number }>();

  const store: SectionStore = {
    active: defaultId,
    listeners: new Set(),
    observer: null,
    refCount: 1,
    cleanup() {
      store.observer?.disconnect();
      store.observer = null;
      visibleEntries.clear();
      stores.delete(key);
    },
  };

  if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length > 0) {
      store.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id;
            if (entry.isIntersecting) {
              // Read boundingClientRect from the async observer entry (zero forced layout reflow)
              visibleEntries.set(id, {
                ratio: entry.intersectionRatio,
                top: entry.boundingClientRect.top,
              });
            } else {
              visibleEntries.delete(id);
            }
          }

          if (visibleEntries.size === 0) return;

          const viewportH = window.innerHeight || 1;
          let bestId = store.active;
          let bestScore = -Infinity;

          visibleEntries.forEach(({ ratio, top }, id) => {
            const distancePenalty = Math.abs(top - viewportH * 0.25) / viewportH;
            const score = ratio - distancePenalty * 0.6;
            if (score > bestScore) {
              bestScore = score;
              bestId = id;
            }
          });

          if (bestId !== store.active) {
            store.active = bestId;
            store.listeners.forEach((listener) => listener(bestId));
          }
        },
        {
          rootMargin: '-18% 0px -45% 0px',
          threshold: [0, 0.25],
        }
      );

      elements.forEach((el) => store.observer?.observe(el));
    }
  }

  stores.set(key, store);
  return store;
}

/**
 * Shared IntersectionObserver-backed active section tracker.
 * Multiple consumers (Navbar, SectionRail) share one observer with zero forced layout reflows.
 */
export function useActiveSection(sectionIds: string[], defaultId = 'home'): string {
  const [activeSection, setActiveSection] = useState<string>(defaultId);
  const key = sectionIds.join('|');

  useEffect(() => {
    const store = acquireSectionStore(sectionIds, defaultId);
    setActiveSection(store.active);

    const listener = (nextId: string) => setActiveSection(nextId);
    store.listeners.add(listener);

    return () => {
      store.listeners.delete(listener);
      store.refCount -= 1;
      if (store.refCount <= 0) {
        store.cleanup();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, defaultId]);

  return activeSection;
}
