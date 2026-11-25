import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'emerald' | 'cyan';
  className?: string;
}

const styles = {
  default:
    'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:border-emerald-600/40 hover:text-emerald-700 hover:bg-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-200 dark:hover:bg-emerald-500/10',
  emerald:
    'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 hover:border-emerald-600/45 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:border-emerald-400/50',
  cyan: 'border-cyan-600/25 bg-cyan-500/10 text-cyan-800 hover:border-cyan-600/45 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:border-cyan-400/50',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono-tech text-xs transition-colors duration-200 ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
