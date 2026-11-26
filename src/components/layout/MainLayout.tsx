import type { ReactNode } from 'react';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { SectionRail } from '../common/SectionRail';
import { AtmosphericCanvas } from '../animations/AtmosphericCanvas';
import { CursorSpotlight } from '../animations/CursorSpotlight';
import { PageTransition } from '../animations/PageTransition';
import { SmoothScrollProvider } from '../animations/SmoothScrollProvider';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
        <AtmosphericCanvas />
        <CursorSpotlight />
        <Navbar />
        <SectionRail />
        <PageTransition>
          <main id="main-content" className="relative z-20">
            {children}
          </main>
        </PageTransition>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
