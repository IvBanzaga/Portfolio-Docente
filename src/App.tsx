/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import {
  A11Y_STORAGE_KEY,
  AccessibilityPrefs,
  applyAccessibilityPrefs,
  DEFAULT_A11Y_PREFS,
} from './components/AccessibilityMenu';
import { AboutBridge } from './components/AboutBridge';
import { CommandPalette } from './components/CommandPalette';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { InteractiveLab } from './components/InteractiveLab';
import { Navbar } from './components/Navbar';
import { NotFound } from './components/NotFound';
import { ProjectModal } from './components/ProjectModal';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsMatrix } from './components/SkillsMatrix';
import { TeachingSection } from './components/TeachingSection';
import { TimelineSection } from './components/TimelineSection';
import { PROJECTS } from './data/projects';
import { Project } from './types/portfolio';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [externalTechFilter, setExternalTechFilter] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const [a11yPrefs, setA11yPrefs] = useState<AccessibilityPrefs>(() => {
    if (typeof window === 'undefined') return DEFAULT_A11Y_PREFS;
    try {
      const raw = localStorage.getItem(A11Y_STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_A11Y_PREFS, ...JSON.parse(raw) };
      }
    } catch {
      // Ignore storage restrictions
    }
    return DEFAULT_A11Y_PREFS;
  });

  useEffect(() => {
    applyAccessibilityPrefs(a11yPrefs);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(a11yPrefs));
    } catch {
      // Ignore storage restrictions
    }
  }, [a11yPrefs]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
      return 'dark';
    }
    return 'light';
  });

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Ignore storage restrictions
      }
      return next;
    });
  }, []);

  const isNotFound = pathname !== '/' && pathname !== '/index.html';

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (isNotFound) {
        window.history.pushState({}, '', '/');
        setPathname('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
        return;
      }
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    },
    [isNotFound]
  );

  const handleFilterCatalogByTech = useCallback(
    (techName: string) => {
      setExternalTechFilter(techName);
      navigateToSection('proyectos');
    },
    [navigateToSection]
  );

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 360);
    };

    handleScroll();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: a11yPrefs.pauseAnimations ? 'auto' : 'smooth',
    });
  };

  const handleGoHome = () => {
    window.history.pushState({}, '', '/');
    setPathname('/');
  };

  return (
    <MotionConfig reducedMotion={a11yPrefs.pauseAnimations ? 'always' : 'user'}>
      <div className="min-h-screen flex flex-col bg-[#E9EEF5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido principal
        </a>

        <Navbar
          onNavigate={navigateToSection}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          a11yPrefs={a11yPrefs}
          onChangeA11yPrefs={setA11yPrefs}
        />

        {isNotFound ? (
          <NotFound pathname={pathname} onGoHome={handleGoHome} />
        ) : (
          <main id="main-content" className="flex-1">
            <Hero
              featuredProjects={PROJECTS.filter((p) => p.featured)}
              onNavigate={navigateToSection}
              onSelectProject={setSelectedProject}
              onOpenCommandPalette={() => setCommandOpen(true)}
            />

            <TeachingSection
              projects={PROJECTS}
              onSelectProject={setSelectedProject}
              onJumpToLab={() => navigateToSection('laboratorio')}
            />

            <ProjectsSection
              projects={PROJECTS}
              onSelectProject={setSelectedProject}
              externalTechFilter={externalTechFilter}
              onClearExternalTechFilter={() => setExternalTechFilter(null)}
            />

            <InteractiveLab />

            <SkillsMatrix
              onSelectProject={setSelectedProject}
              onFilterCatalogByTech={handleFilterCatalogByTech}
            />

            <TimelineSection onSelectProject={setSelectedProject} />

            <AboutBridge onSelectProject={setSelectedProject} />

            <ContactSection />
          </main>
        )}

        <Footer onNavigate={navigateToSection} />

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

        <CommandPalette
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
          projects={PROJECTS}
          onSelectProject={setSelectedProject}
          onNavigate={navigateToSection}
        />

        {showScrollTop && (
          <button
            type="button"
            onClick={handleScrollToTop}
            aria-label="Volver arriba"
            title="Volver arriba"
            className="fixed bottom-5 right-5 z-40 inline-flex h-11 items-center gap-2 rounded-full border border-slate-200/30 dark:border-slate-700 bg-slate-900 dark:bg-blue-600 px-4 text-xs font-semibold text-white shadow-lg shadow-slate-900/20 dark:shadow-blue-950/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="hidden sm:inline">Arriba</span>
          </button>
        )}
      </div>
    </MotionConfig>
  );
}
