import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './theme/ThemeProvider';
import { MainLayout } from './components/layout/MainLayout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Education } from './components/sections/Education';
import { Contact } from './components/sections/Contact';

export function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <MainLayout>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Education />
          <Contact />
        </MainLayout>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
