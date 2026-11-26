import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  SYSTEM_DARK_QUERY,
  applyThemeToDocument,
  getSystemTheme,
  readStoredThemePreference,
  resolveTheme,
  runThemeTransition,
  writeStoredThemePreference,
  type ResolvedTheme,
  type ThemePreference,
  type ThemeTransitionOrigin,
} from './theme';

export interface ThemeContextValue {
  /** User's explicit preference: 'light', 'dark', or 'system'. */
  preference: ThemePreference;
  /** Effective theme currently rendered: 'light' or 'dark'. */
  resolvedTheme: ResolvedTheme;
  /** Updates the persisted preference without overwriting 'system' with a resolved value. */
  setPreference: (next: ThemePreference, origin?: ThemeTransitionOrigin) => void;
  /** Quick-toggles between light and dark based on the currently resolved theme. */
  toggleTheme: (origin?: ThemeTransitionOrigin) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultPreference?: ThemePreference;
}

export function ThemeProvider({ children, defaultPreference }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const stored = readStoredThemePreference();
    if (stored !== 'system') return stored;
    return defaultPreference ?? stored;
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

  const resolvedTheme = useMemo(
    () => resolveTheme(preference, systemTheme),
    [preference, systemTheme]
  );

  const lastAppliedThemeRef = useRef<ResolvedTheme | null>(null);

  // Sync DOM attributes whenever the resolved theme changes (skip duplicate writes after setPreference)
  useEffect(() => {
    if (lastAppliedThemeRef.current === resolvedTheme) return;
    lastAppliedThemeRef.current = resolvedTheme;
    applyThemeToDocument(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for OS color-scheme changes while preserving the user's preference
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia(SYSTEM_DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const setPreference = useCallback(
    (next: ThemePreference, origin?: ThemeTransitionOrigin) => {
      const nextResolved = resolveTheme(next, getSystemTheme());
      writeStoredThemePreference(next);

      if (nextResolved === resolvedTheme) {
        setPreferenceState(next);
        return;
      }

      runThemeTransition(() => {
        lastAppliedThemeRef.current = nextResolved;
        applyThemeToDocument(nextResolved);
        setPreferenceState(next);
      }, origin);
    },
    [resolvedTheme]
  );

  const toggleTheme = useCallback(
    (origin?: ThemeTransitionOrigin) => {
      const next: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      setPreference(next, origin);
    },
    [resolvedTheme, setPreference]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
      toggleTheme,
    }),
    [preference, resolvedTheme, setPreference, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
