import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../useTheme';
import { THEME_STORAGE_KEY } from '../theme';

type MatchMediaListener = (event: MediaQueryListEvent) => void;

function createControllableMatchMedia(initialDark: boolean) {
  let darkMatches = initialDark;
  const listeners = new Set<MatchMediaListener>();

  const mock = vi.fn((query: string) => ({
    get matches() {
      if (query === '(prefers-color-scheme: dark)') return darkMatches;
      return false;
    },
    media: query,
    onchange: null,
    addEventListener: (_event: string, listener: MatchMediaListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: MatchMediaListener) => {
      listeners.delete(listener);
    },
    addListener: (listener: MatchMediaListener) => {
      listeners.add(listener);
    },
    removeListener: (listener: MatchMediaListener) => {
      listeners.delete(listener);
    },
    dispatchEvent: vi.fn(() => false),
  }));

  return {
    mock,
    setSystemDark(nextDark: boolean) {
      darkMatches = nextDark;
      const event = { matches: nextDark, media: '(prefers-color-scheme: dark)' } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function ThemeInspector() {
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="pref">{preference}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button type="button" onClick={() => setPreference('light')}>
        Set Light
      </button>
      <button type="button" onClick={() => setPreference('dark')}>
        Set Dark
      </button>
      <button type="button" onClick={() => setPreference('system')}>
        Set System
      </button>
      <button type="button" onClick={() => toggleTheme()}>
        Quick Toggle
      </button>
    </div>
  );
}

describe('ThemeProvider & theme preference management', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'light');
    document.head.innerHTML = '<meta name="theme-color" content="#080D18" />';
  });

  it('detects system dark preference by default without overwriting system preference', () => {
    const media = createControllableMatchMedia(true);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    expect(screen.getByTestId('pref')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('detects system light preference by default', () => {
    const media = createControllableMatchMedia(false);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    expect(screen.getByTestId('pref')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#F8FAFC'
    );
  });

  it('switches between explicit light, dark, and system modes and persists preference', async () => {
    const user = userEvent.setup();
    const media = createControllableMatchMedia(true);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Set Light' }));
    expect(screen.getByTestId('pref')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(screen.getByTestId('pref')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await user.click(screen.getByRole('button', { name: 'Set System' }));
    expect(screen.getByTestId('pref')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });

  it('reacts to OS system preference changes only when preference is system', async () => {
    const user = userEvent.setup();
    const media = createControllableMatchMedia(true);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );

    // Live OS change dark -> light while preference === 'system'
    act(() => {
      media.setSystemDark(false);
    });
    expect(screen.getByTestId('pref')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    // Lock explicit dark mode; subsequent OS changes must not override it
    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    act(() => {
      media.setSystemDark(false);
    });
    expect(screen.getByTestId('pref')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('restores persisted dark or light preference across remounts (simulated refresh)', () => {
    const media = createControllableMatchMedia(false);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const first = render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );
    expect(screen.getByTestId('pref')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    first.unmount();

    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    render(
      <ThemeProvider>
        <ThemeInspector />
      </ThemeProvider>
    );
    expect(screen.getByTestId('pref')).toHaveTextContent('light');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('handles unavailable or throwing localStorage gracefully', async () => {
    const user = userEvent.setup();
    const media = createControllableMatchMedia(true);
    window.matchMedia = media.mock as unknown as typeof window.matchMedia;

    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    try {
      render(
        <ThemeProvider>
          <ThemeInspector />
        </ThemeProvider>
      );

      expect(screen.getByTestId('pref')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved')).toHaveTextContent('dark');

      await user.click(screen.getByRole('button', { name: 'Quick Toggle' }));
      expect(screen.getByTestId('pref')).toHaveTextContent('light');
      expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    } finally {
      getItemSpy.mockRestore();
      setItemSpy.mockRestore();
    }
  });
});
