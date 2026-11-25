import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Renders main content immediately without blocking First/Largest Contentful Paint.
 * Section-level motion (Hero MaskedText & viewport Reveals) handles visual entrance choreography.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}
