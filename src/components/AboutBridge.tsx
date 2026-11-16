import { ArrowLeftRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { BRIDGE_CONCEPTS } from '../data/teachingAndTimeline';
import { Project } from '../types/portfolio';

interface AboutBridgeProps {
  onSelectProject: (project: Project) => void;
}

const BRIDGE_COLOR_THEMES = [
  {
    active: 'border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/25',
    hover:
      'hover:border-orange-400 hover:bg-orange-50 hover:text-orange-800 dark:hover:border-orange-500 dark:hover:bg-orange-950/55 dark:hover:text-orange-200',
  },
  {
    active: 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-500/25',
    hover:
      'hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/55 dark:hover:text-teal-200',
  },
  {
    active: 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-500/25',
    hover:
      'hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/55 dark:hover:text-indigo-200',
  },
  {
    active: 'border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-500/25',
    hover:
      'hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800 dark:hover:border-rose-500 dark:hover:bg-rose-950/55 dark:hover:text-rose-200',
  },
];

export function AboutBridge({ onSelectProject }: AboutBridgeProps) {
  const [selectedConceptId, setSelectedConceptId] = useState(BRIDGE_CONCEPTS[0].id);

  const activeConcept =
    BRIDGE_CONCEPTS.find((c) => c.id === selectedConceptId) || BRIDGE_CONCEPTS[0];

  const linkedProject = PROJECTS.find((p) => p.id === activeConcept.exampleProjectId);

  return (
    <section
      id="sobre-mi"
      className="py-16 sm:py-20 bg-[#F2F5F9] dark:bg-slate-900 border-b border-slate-300/70 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Narrative Bio */}
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
              Sobre mí y filosofía de trabajo
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Desarrollo web, tecnología y aprendizaje continuo.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {PROFILE.aboutParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Interactive Pedagogy <-> Engineering Bridge */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-[#E9EEF5] dark:bg-slate-950 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Puente Pedagogía ↔ Ingeniería
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Selecciona un principio educativo para ver cómo se traduce en código real.
                  </p>
                </div>
                <ArrowLeftRight className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {BRIDGE_CONCEPTS.map((concept, idx) => {
                  const isActive = concept.id === activeConcept.id;
                  const theme = BRIDGE_COLOR_THEMES[idx % BRIDGE_COLOR_THEMES.length];

                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => setSelectedConceptId(concept.id)}
                      className={`text-left rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? theme.active
                          : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:-translate-y-0.5 ${theme.hover}`
                      }`}
                    >
                      {concept.pedagogyTitle}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-orange-200/80 dark:border-orange-900/60 bg-white dark:bg-slate-900 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/75 dark:hover:bg-orange-950/40 hover:shadow-md">
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    En formación / Aprendizaje
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-white">
                    {activeConcept.pedagogyTitle}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {activeConcept.pedagogyDetail}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-white dark:bg-slate-900 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/75 dark:hover:bg-blue-950/40 hover:shadow-md">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    En desarrollo web
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-white">
                    {activeConcept.engineeringTitle}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {activeConcept.engineeringDetail}
                  </p>
                </div>
              </div>

              {linkedProject && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Aplicado en:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {linkedProject.title}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectProject(linkedProject)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <span>Ver ficha técnica</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
