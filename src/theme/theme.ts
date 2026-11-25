import { THEME_TOKENS } from './themeTokens';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeTransitionOrigin {
  x: number;
  y: number;
}

export const THEME_STORAGE_KEY = 'portfolio-theme-preference';
export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

export function isValidThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readStoredThemePreference(): ThemePreference {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'system';
    }
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidThemePreference(raw) ? raw : 'system';
  } catch {
    return 'system';
  }
}

export function writeStoredThemePreference(preference: ThemePreference): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore storage errors (private browsing / restricted storage)
  }
}

export function getSystemTheme(): ResolvedTheme {
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia(SYSTEM_DARK_QUERY).matches ? 'dark' : 'light';
    }
  } catch {
    // Fallback to dark when matchMedia is unavailable
  }
  return 'dark';
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme = getSystemTheme()
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference;
}

export function applyThemeToDocument(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.classList.toggle('dark', resolved === 'dark');
  root.classList.toggle('light', resolved === 'light');
  root.style.colorScheme = resolved;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', THEME_TOKENS[resolved].themeColor);
  }
}

let themeRafId: number | null = null;

/**
 * Applies a theme update cleanly in a single frame without triggering hundreds of
 * simultaneous descendant CSS transitions or View Transition raster snapshots.
 */
export function runThemeTransition(
  updateDom: () => void,
  _origin?: ThemeTransitionOrigin
): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    updateDom();
    return;
  }

  const root = document.documentElement;
  if (themeRafId !== null) {
    cancelAnimationFrame(themeRafId);
    themeRafId = null;
  }

  root.classList.add('theme-switching');
  updateDom();

  themeRafId = requestAnimationFrame(() => {
    themeRafId = requestAnimationFrame(() => {
      root.classList.remove('theme-switching');
      themeRafId = null;
    });
  });
}
