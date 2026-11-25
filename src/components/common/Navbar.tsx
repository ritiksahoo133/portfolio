import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { NAV_ITEMS, PROFILE } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EASE_EDITORIAL } from '../../lib/motion';
import { Container } from './Container';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

const DesktopNav = memo(function DesktopNav() {
  const activeSection = useActiveSection(SECTION_IDS, 'home');

  return (
    <nav
      aria-label="Primary navigation"
      className="isolate hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--navbar-pill-background)] px-2 py-1 lg:flex"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? 'page' : undefined}
            className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeNavPill"
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-full bg-emerald-500/12 ring-1 ring-emerald-600/25 dark:bg-emerald-500/10 dark:ring-emerald-500/25"
              />
            )}
            <span>{item.label}</span>
            {isActive && (
              <motion.span
                layoutId="activeNavUnderline"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="absolute inset-x-3.5 -bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400"
              />
            )}
          </a>
        );
      })}
    </nav>
  );
});

const MobileNavDrawer = memo(function MobileNavDrawer({
  onClose,
}: {
  onClose: () => void;
}) {
  const activeSection = useActiveSection(SECTION_IDS, 'home');
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[var(--modal-backdrop)] sm:top-[72px] lg:hidden"
      />

      <motion.nav
        id="mobile-nav-drawer"
        aria-label="Mobile navigation"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: EASE_EDITORIAL }}
        className="relative z-50 max-h-[calc(100dvh-64px)] overflow-y-auto border-b border-[var(--border)] bg-[var(--background)] px-4 pb-6 pt-3 shadow-xl sm:max-h-[calc(100dvh-72px)] sm:px-6 lg:hidden"
      >
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={onClose}
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.025, duration: 0.18 }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-[46px] items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-600/25 dark:text-emerald-300 dark:ring-emerald-500/25'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </motion.a>
            );
          })}
        </div>

        <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-4">
          <div>
            <p className="mb-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Appearance
            </p>
            <ThemeToggle variant="full" />
          </div>

          <Button
            href={PROFILE.resumeUrl}
            download={PROFILE.resumeFileName}
            variant="primary"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            <Download className="h-4 w-4" />
            <span>Download Resume</span>
          </Button>
        </div>
      </motion.nav>
    </>
  );
});

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const scrolledRef = useRef(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let cachedScrollable = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

    const updateOnFrame = () => {
      rafId = 0;
      const y = window.scrollY;
      const nextScrolled = y > 20;
      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (progressBarRef.current) {
        const progress =
          cachedScrollable > 0 ? Math.min(1, Math.max(0, y / cachedScrollable)) : 0;
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateOnFrame);
      }
    };

    const recalcScrollable = () => {
      cachedScrollable = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scheduleUpdate();
    };

    updateOnFrame();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', recalcScrollable, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(recalcScrollable);
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', recalcScrollable);
      resizeObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-[var(--border)] bg-[var(--navbar-background)] shadow-[var(--shadow-navbar)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-emerald-500 dark:focus:text-slate-950"
      >
        Skip to content
      </a>

      <Container>
        <div
          className={`flex items-center justify-between gap-3 transition-[height] duration-300 ${
            scrolled ? 'h-15 sm:h-16 lg:h-[66px]' : 'h-16 sm:h-[72px] lg:h-[76px]'
          }`}
        >
          {/* Brand */}
          <a
            href="#home"
            onClick={handleNavClick}
            className="group inline-flex min-h-[44px] items-center gap-2.5 text-[var(--text-primary)] transition-colors hover:text-emerald-600 dark:hover:text-emerald-300"
            aria-label={`${PROFILE.shortName} - Home`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-600/30 bg-emerald-500/10 font-mono-tech text-xs font-semibold tracking-wider text-emerald-700 transition-transform duration-200 group-hover:scale-105 group-hover:border-emerald-500/60 group-hover:bg-emerald-500/18 dark:border-emerald-500/35 dark:text-emerald-300 dark:group-hover:border-emerald-400/70 dark:group-hover:bg-emerald-500/20">
              {PROFILE.initials}
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)] sm:text-base">
              {PROFILE.shortName}
            </span>
          </a>

          {/* Isolated Desktop navigation */}
          <DesktopNav />

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle variant="segmented" />
            <Button
              href={PROFILE.resumeUrl}
              download={PROFILE.resumeFileName}
              variant="secondary"
              size="sm"
              aria-label="Download Resume PDF"
              className="group"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 transition-transform duration-200 group-hover:translate-y-0.5 dark:text-emerald-400" />
              <span>Resume</span>
            </Button>
          </div>

          {/* Mobile right controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle variant="icon" />

            <a
              href={PROFILE.resumeUrl}
              download={PROFILE.resumeFileName}
              aria-label="Download Resume PDF"
              className="hidden h-11 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 px-3 font-mono-tech text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 min-[420px]:inline-flex dark:hover:text-emerald-300"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Resume</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text-primary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 active:scale-95 cursor-pointer dark:hover:text-emerald-300"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* GPU-composited hairline scroll progress bar (zero Framer Motion RAF overhead) */}
      {!reducedMotion && (
        <div
          ref={progressBarRef}
          aria-hidden="true"
          style={{ transform: 'scaleX(0)' }}
          className="h-[1.5px] w-full origin-left bg-gradient-to-r from-emerald-600/90 via-cyan-600/90 to-emerald-500/80 opacity-85 will-change-transform dark:from-emerald-400/90 dark:via-cyan-400/90 dark:to-emerald-300/80"
        />
      )}

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && <MobileNavDrawer onClose={handleNavClick} />}
      </AnimatePresence>
    </header>
  );
}
