import { memo } from 'react';
import { NAV_ITEMS } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * Minimal right-edge vertical section indicator on large desktop screens.
 */
export const SectionRail = memo(function SectionRail() {
  const activeSection = useActiveSection(SECTION_IDS, 'home');

  return (
    <aside
      aria-label="Section progress navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={`Jump to ${item.label}`}
            aria-current={isActive ? 'location' : undefined}
            className="group flex items-center gap-2.5 py-1"
          >
            <span
              className={`font-mono-tech text-[10px] uppercase tracking-[0.16em] transition-all duration-200 ${
                isActive
                  ? 'translate-x-0 text-emerald-700 opacity-100 dark:text-emerald-300'
                  : 'translate-x-1 text-[var(--text-muted)] opacity-0 group-hover:translate-x-0 group-hover:text-[var(--text-primary)] group-hover:opacity-100'
              }`}
            >
              {item.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-2.5 w-2.5 bg-emerald-600 shadow-[0_0_12px_rgba(5,150,105,0.65)] dark:bg-emerald-400 dark:shadow-[0_0_12px_rgba(16,185,129,0.85)]'
                  : 'h-1.5 w-1.5 bg-slate-300 group-hover:bg-slate-500 dark:bg-slate-700 dark:group-hover:bg-slate-400'
              }`}
            />
          </a>
        );
      })}
    </aside>
  );
});
