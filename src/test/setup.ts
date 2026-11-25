import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Polyfill IntersectionObserver for jsdom
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '0px';
    readonly thresholds: ReadonlyArray<number> = [0];
    disconnect = vi.fn();
    observe = vi.fn();
    takeRecords = vi.fn(() => []);
    unobserve = vi.fn();
  }
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

// Polyfill ResizeObserver for jsdom
if (typeof globalThis.ResizeObserver === 'undefined') {
  class MockResizeObserver implements ResizeObserver {
    disconnect = vi.fn();
    observe = vi.fn();
    unobserve = vi.fn();
  }
  globalThis.ResizeObserver = MockResizeObserver;
}

// Default matchMedia mock (can be overridden per test)
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
}
