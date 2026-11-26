import { memo } from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { NAV_ITEMS, PROFILE } from '../../data/profile';
import { Container } from './Container';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = memo(function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--footer-background)] py-10 sm:py-12">
      <Container>
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          {/* Brand & copyright */}
          <div className="space-y-2">
            <a
              href="#home"
              className="group inline-flex min-h-[40px] items-center gap-2.5 text-[var(--text-primary)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/30 bg-emerald-500/10 font-mono-tech text-xs font-semibold text-emerald-700 transition-transform duration-200 group-hover:scale-105 dark:border-emerald-500/35 dark:text-emerald-300">
                {PROFILE.initials}
              </span>
              <span className="font-semibold tracking-tight">{PROFILE.shortName}</span>
            </a>
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {CURRENT_YEAR} {PROFILE.name}. Crafted with precision &amp; performance.
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-underline inline-flex min-h-[36px] items-center text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Socials & back to top */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-accent)] hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-accent)] hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              aria-label="Email Ritik Kumar Sahoo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-accent)] hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="#home"
              aria-label="Back to top"
              className="group ml-auto inline-flex h-11 items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 font-mono-tech text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-accent)] hover:text-emerald-700 sm:ml-2 cursor-pointer dark:hover:text-emerald-300"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span>Top</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
});
