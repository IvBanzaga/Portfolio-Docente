import { ArrowRight, Compass, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Project } from '../types/portfolio';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (sectionId: string) => void;
}

const SECTIONS = [
  { id: 'proyectos', label: 'Catálogo de 17 proyectos' },
  { id: 'docencia', label: 'Docencia y formación tecnológica' },
  { id: 'laboratorio', label: 'Laboratorio interactivo (HTML5, Email, CSV y n8n)' },
  { id: 'competencias', label: 'Mapa de competencias, n8n y tecnologías' },
  { id: 'trayectoria', label: 'Trayectoria y bloques formativos' },
  { id: 'sobre-mi', label: 'Sobre mí y puente pedagogía-código' },
  { id: 'contacto', label: 'Contacto y resumen CV' },
];

export function CommandPalette({
  open,
  onClose,
  projects,
  onSelectProject,
  onNavigate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const matchingProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.slice(0, 6);
    return projects.filter((p) =>
      `${p.title} ${p.category} ${p.technologies.join(' ')}`.toLowerCase().includes(q)
    );
  }, [projects, query]);

  const matchingSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter((s) => s.label.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador rápido del portafolio"
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 pt-16 px-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ir a una sección o buscar proyecto (ej. n8n, React, PHP, SEPE)..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador rápido"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {matchingSections.length > 0 && (
            <div>
              <p className="px-2 text-xs font-semibold text-slate-400">Secciones</p>
              <div className="mt-1 space-y-1">
                {matchingSections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(sec.id);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>{sec.label}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="px-2 text-xs font-semibold text-slate-400">
              Proyectos ({matchingProjects.length})
            </p>
            <div className="mt-1 space-y-1">
              {matchingProjects.length === 0 ? (
                <p className="px-3 py-4 text-xs text-slate-500 dark:text-slate-400">
                  No se encontraron proyectos con "{query}".
                </p>
              ) : (
                matchingProjects.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectProject(proj);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-blue-50/70 dark:hover:bg-blue-950/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {proj.title}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {proj.category} · {proj.technologies.slice(0, 3).join(' · ')}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Abrir
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
