import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-emerald-600 text-white font-semibold hover:bg-emerald-500 active:bg-emerald-500 shadow-[0_10px_28px_-10px_rgba(5,150,105,0.55)] hover:shadow-[0_14px_32px_-8px_rgba(5,150,105,0.65)] dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:active:bg-emerald-400 dark:shadow-[0_0_28px_-6px_rgba(16,185,129,0.55)] dark:hover:shadow-[0_0_34px_-4px_rgba(16,185,129,0.7)]',
  secondary:
    'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xs hover:border-[var(--border-accent)] hover:bg-[var(--surface-elevated)] hover:text-emerald-700 active:border-emerald-500/60 dark:bg-slate-900/80 dark:text-slate-100 dark:border-slate-700/80 dark:shadow-none dark:hover:border-emerald-400/50 dark:hover:bg-slate-800/80 dark:hover:text-emerald-200',
  ghost:
    'text-[var(--text-secondary)] border border-[var(--border)] sm:border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] dark:text-slate-300 dark:border-slate-800/70 dark:sm:border-transparent dark:hover:border-slate-700/70 dark:hover:bg-slate-800/50 dark:hover:text-slate-100',
};

const sizeStyles: Record<Size, string> = {
  sm: 'min-h-[40px] px-3.5 py-2 text-xs gap-1.5',
  md: 'min-h-[44px] px-5 py-2.5 text-sm gap-2',
  lg: 'min-h-[48px] px-5 sm:px-6 py-3 text-sm sm:text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-xl font-medium transition-[transform,color,background-color,border-color,box-shadow] duration-200 active:scale-[0.98] cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
