import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme/useTheme';
import type { ThemePreference } from '../../theme/theme';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ThemeToggleProps {
  /**
   * - 'segmented': compact 3-state Light / Dark / System control (desktop navbar)
   * - 'full': labeled 3-state Light / Dark / System bar (mobile navigation drawer)
   * - 'icon': single-tap Sun/Moon quick toggle (compact mobile header)
   */
  variant?: 'segmented' | 'full' | 'icon';
  className?: string;
}

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  title: string;
  icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', title: 'Switch to Light theme', icon: Sun },
  { value: 'dark', label: 'Dark', title: 'Switch to Dark theme', icon: Moon },
  { value: 'system', label: 'System', title: 'Follow system color scheme', icon: Monitor },
];

export const ThemeToggle = memo(function ThemeToggle({
  variant = 'segmented',
  className = '',
}: ThemeToggleProps) {
  const { preference, resolvedTheme, setPreference, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  if (variant === 'icon') {
    const isDark = resolvedTheme === 'dark';
    const nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    return (
      <button
        type="button"
        onClick={() => toggleTheme()}
        aria-label={nextLabel}
        title={nextLabel}
        aria-pressed={!isDark}
        data-testid="theme-quick-toggle"
        className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/90 text-[var(--text-secondary)] transition-colors duration-200 hover:border-[var(--border-accent)] hover:text-[var(--accent-primary)] active:scale-95 cursor-pointer ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolvedTheme}
            initial={reducedMotion ? false : { rotate: -35, opacity: 0, scale: 0.75 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { rotate: 35, opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }

  const isFull = variant === 'full';

  return (
    <div
      role="radiogroup"
      aria-label="Theme preference"
      data-testid={isFull ? 'theme-switcher-mobile' : 'theme-switcher-desktop'}
      className={`isolate inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--navbar-pill-background)] p-1 ${
        isFull ? 'grid w-full grid-cols-3 gap-1' : 'gap-0.5'
      } ${className}`}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = preference === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.title}
            title={option.title}
            data-theme-option={option.value}
            onClick={() => setPreference(option.value)}
            className={`relative inline-flex items-center justify-center gap-1.5 rounded-lg font-mono-tech text-xs font-medium transition-colors duration-200 cursor-pointer ${
              isFull ? 'min-h-[42px] px-3 py-2' : 'h-8 w-8'
            } ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={isFull ? 'activeThemePillMobile' : 'activeThemePillDesktop'}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 32 }
                }
                className="absolute inset-0 -z-10 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/35 dark:bg-emerald-500/15 dark:ring-emerald-400/35"
              />
            )}
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {isFull && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
});
