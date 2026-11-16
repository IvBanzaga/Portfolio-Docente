import { Mail } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { SocialLinks } from './SocialLinks';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-300/70 dark:border-slate-800 bg-[#E9EEF5] dark:bg-slate-950 py-10 no-print transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between sm:px-6">
        <div>
          <p className="font-display text-base font-bold text-slate-950 dark:text-white">
            {PROFILE.name}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} {PROFILE.name} · Desarrollo web, automatización n8n y
            docencia tecnológica.
          </p>
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>{PROFILE.email}</span>
          </a>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => onNavigate('docencia')}
              className="hover:text-slate-950 dark:hover:text-white"
            >
              Docencia
            </button>
            <button
              type="button"
              onClick={() => onNavigate('proyectos')}
              className="hover:text-slate-950 dark:hover:text-white"
            >
              Proyectos
            </button>
            <button
              type="button"
              onClick={() => onNavigate('laboratorio')}
              className="hover:text-slate-950 dark:hover:text-white"
            >
              Laboratorio
            </button>
            <button
              type="button"
              onClick={() => onNavigate('competencias')}
              className="hover:text-slate-950 dark:hover:text-white"
            >
              Competencias
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contacto')}
              className="hover:text-slate-950 dark:hover:text-white"
            >
              Contacto
            </button>
          </nav>

          <SocialLinks variant="footer" />
        </div>
      </div>
    </footer>
  );
}
