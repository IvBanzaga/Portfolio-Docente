import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { AccessibilityMenu, AccessibilityPrefs } from './AccessibilityMenu';
import { SocialLinks } from './SocialLinks';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  a11yPrefs: AccessibilityPrefs;
  onChangeA11yPrefs: (next: AccessibilityPrefs) => void;
}

const NAV_LINKS = [
  { id: 'docencia', label: 'Docencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'sobre-mi', label: 'Sobre mí' },
];

export function Navbar({
  onNavigate,
  theme,
  onToggleTheme,
  a11yPrefs,
  onChangeA11yPrefs,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md no-print transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 lg:gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('inicio');
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          Iván Bazaga
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className="relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-slate-950 dark:hover:text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Social Icons + Theme Switch + Contact CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center">
            <SocialLinks variant="nav" />
          </div>

          <AccessibilityMenu prefs={a11yPrefs} onChangePrefs={onChangeA11yPrefs} />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-amber-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('contacto')}
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 px-4 py-2 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.98]"
          >
            Contactar
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 lg:hidden hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Menú móvil"
          className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <SocialLinks variant="nav" />
              <button
                type="button"
                onClick={() => handleLinkClick('contacto')}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Contactar
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
