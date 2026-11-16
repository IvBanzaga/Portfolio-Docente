import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Figma,
  Github,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Project } from '../types/portfolio';
import { ProjectVisual } from './ProjectVisual';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

type ModalTab = 'overview' | 'features' | 'architecture';

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!project) return;
    setActiveTab('overview');
    setLightboxOpen(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, lightboxOpen, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{project.category}</span>
              <span aria-hidden="true">·</span>
              <span>{project.status}</span>
              {project.dateLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{project.dateLabel}</span>
                </>
              )}
            </div>
            <h2
              id="project-modal-title"
              className="mt-1 font-display text-2xl font-bold text-slate-950 dark:text-white"
            >
              {project.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{project.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha del proyecto"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className={lightboxOpen ? 'h-80 sm:h-96' : 'h-56 sm:h-64'}>
              <ProjectVisual project={project} />
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen((prev) => !prev)}
              className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-slate-900"
            >
              {lightboxOpen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Reducir vista</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Ampliar vista</span>
                </>
              )}
            </button>
          </div>

          {project.galleryCaptions && project.galleryCaptions.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {project.galleryCaptions.map((caption, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="font-mono font-semibold text-slate-400 mr-1.5">
                    0{i + 1}
                  </span>
                  {caption}
                </div>
              ))}
            </div>
          )}

          <div
            role="tablist"
            aria-label="Secciones de la ficha técnica"
            className="inline-flex flex-wrap rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1"
          >
            {(
              [
                { id: 'overview', label: 'Problema y objetivo' },
                { id: 'features', label: 'Funcionalidades' },
                { id: 'architecture', label: 'Arquitectura y aprendizajes' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 p-4">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Problema que resuelve
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.problemSolved}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 p-4">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Objetivo del proyecto
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.objective}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                Funcionalidades documentadas
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {project.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Decisiones y arquitectura
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {project.architectureNotes.map((note, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Retos y aprendizajes
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {project.challengesAndLearnings.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tecnologías y capacidades identificadas
            </p>
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {project.technologies.join(' · ')}
            </p>
          </div>

          {project.verificationNote && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 dark:border-amber-900/70 bg-amber-50/70 dark:bg-amber-950/40 p-3.5 text-xs text-amber-950 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-semibold">Nota de documentación: </span>
                <span>{project.verificationNote}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <span>Abrir aplicación</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Repositorio</span>
              </a>
            )}
            {project.docsUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ficha original</span>
              </a>
            )}
            {project.figmaUrl && (
              <a
                href={project.figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Figma className="h-3.5 w-3.5" />
                <span>Diseño Figma</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
          >
            Cerrar (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}
