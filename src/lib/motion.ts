import type { Variants } from 'framer-motion';

/**
 * Centralized motion system — single source of truth for easing, timing, and viewport thresholds.
 */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.22,
  normal: 0.48,
  editorial: 0.65,
  slow: 0.85,
} as const;

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.16,
} as const;

export const staggerContainer = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const fadeUpItem = (y = 18, duration = DURATION.normal): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: EASE_EDITORIAL,
    },
  },
});

export const badgeItem: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: EASE_EDITORIAL,
    },
  },
};
