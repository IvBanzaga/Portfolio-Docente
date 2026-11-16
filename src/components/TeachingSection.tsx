import { ArrowUpRight, BookOpen, Bot, CheckSquare, ExternalLink, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { TEACHING_PILLARS } from '../data/teachingAndTimeline';
import { Project, TeachingPillar } from '../types/portfolio';

interface TeachingSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onJumpToLab: () => void;
}

const CATEGORIES: ('Todas' | TeachingPillar['category'])[] = [
  'Todas',
  'Programaciones',
  'Recursos digitales',
  'Práctica y evaluación',
  'IA en enseñanza',
];

const TEACHING_CARD_THEMES = [
  {
    tabActive: 'bg-blue-600 text-white shadow-sm shadow-blue-500/25',
    tabHover:
      'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300',
    cardActive:
      '-translate-y-1.5 bg-blue-50/95 dark:bg-blue-950/55 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/15',
    accentText: 'text-blue-600 dark:text-blue-400',
    titleActive: 'text-blue-700 dark:text-blue-300',
    actionBtn: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    tabActive: 'bg-orange-500 text-white shadow-sm shadow-orange-500/25',
    tabHover:
      'hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-950/60 dark:hover:text-orange-300',
    cardActive:
      '-translate-y-1.5 bg-orange-50/95 dark:bg-orange-950/55 border-orange-500 dark:border-orange-400 ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/15',
    accentText: 'text-orange-600 dark:text-orange-400',
    titleActive: 'text-orange-700 dark:text-orange-300',
    actionBtn: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    tabActive: 'bg-teal-600 text-white shadow-sm shadow-teal-500/25',
    tabHover:
      'hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/60 dark:hover:text-teal-300',
    cardActive:
      '-translate-y-1.5 bg-teal-50/95 dark:bg-teal-950/55 border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/30 shadow-xl shadow-teal-500/15',
    accentText: 'text-teal-600 dark:text-teal-400',
    titleActive: 'text-teal-700 dark:text-teal-300',
    actionBtn: 'bg-teal-600 hover:bg-teal-700',
  },
  {
    tabActive: 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25',
    tabHover:
      'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300',
    cardActive:
      '-translate-y-1.5 bg-indigo-50/95 dark:bg-indigo-950/55 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/15',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    titleActive: 'text-indigo-700 dark:text-indigo-300',
    actionBtn: 'bg-indigo-600 hover:bg-indigo-700',
  },
];

export function TeachingSection({
  projects,
  onSelectProject,
  onJumpToLab,
}: TeachingSectionProps) {
  const [selectedPillarCat, setSelectedPillarCat] = useState<'Todas' | TeachingPillar['category']>('Todas');
  const [hoveredPillarId, setHoveredPillarId] = useState<string | null>(null);
  const [hoveredEdProjectId, setHoveredEdProjectId] = useState<string | null>(null);

  const edProjects = projects.filter(
    (p) => p.domain === 'docencia' || p.domain === 'dual'
  );

  const visiblePillars =
    selectedPillarCat === 'Todas'
      ? TEACHING_PILLARS
      : TEACHING_PILLARS.filter((p) => p.category === selectedPillarCat);

  return (
    <section
      id="docencia"
      className="py-16 sm:py-20 bg-gradient-to-b from-orange-50/45 via-white to-white dark:from-orange-950/15 dark:via-slate-900 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-orange-600 dark:text-orange-400">
              Ámbito formativo y diseño instruccional
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Docencia, recursos digitales e innovación educativa
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Desarrollo mis propias herramientas didácticas para que el alumnado aprenda web,
              semántica, automatización e inteligencia artificial practicando directamente en el navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={onJumpToLab}
            className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            <span>Probar demos didácticas en el Lab</span>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-1.5" role="group" aria-label="Filtrar áreas docentes">
          {CATEGORIES.map((cat, idx) => {
            const theme = TEACHING_CARD_THEMES[idx % TEACHING_CARD_THEMES.length];
            const isSelected = selectedPillarCat === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedPillarCat(cat)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? cat === 'Todas'
                      ? 'bg-orange-500 text-white'
                      : theme.tabActive
                    : `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 ${theme.tabHover}`
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          onMouseLeave={() => setHoveredPillarId(null)}
        >
          {visiblePillars.map((pillar, idx) => {
            const linked = projects.find((p) => p.id === pillar.projectId);
            const isActive = hoveredPillarId === pillar.id;
            const isDimmed = hoveredPillarId !== null && !isActive;
            const theme = TEACHING_CARD_THEMES[idx % TEACHING_CARD_THEMES.length];

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredPillarId(pillar.id)}
                onFocus={() => setHoveredPillarId(pillar.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredPillarId(null);
                  }
                }}
                className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                  isActive
                    ? theme.cardActive
                    : isDimmed
                      ? 'border-slate-200/70 dark:border-slate-800/70 bg-[#F8FAFC] dark:bg-slate-950 opacity-50 saturate-[0.65] scale-[0.99]'
                      : 'border-slate-200/90 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-950 opacity-95'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span
                      className={`font-semibold transition-colors ${
                        isActive ? theme.accentText : 'text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      {pillar.category}
                    </span>
                    {pillar.category === 'Programaciones' && (
                      <FileSpreadsheet className={`h-4 w-4 transition-colors ${isActive ? theme.accentText : 'text-slate-400'}`} />
                    )}
                    {pillar.category === 'Recursos digitales' && (
                      <BookOpen className={`h-4 w-4 transition-colors ${isActive ? theme.accentText : 'text-slate-400'}`} />
                    )}
                    {pillar.category === 'Práctica y evaluación' && (
                      <CheckSquare className={`h-4 w-4 transition-colors ${isActive ? theme.accentText : 'text-slate-400'}`} />
                    )}
                    {pillar.category === 'IA en enseñanza' && (
                      <Bot className={`h-4 w-4 transition-colors ${isActive ? theme.accentText : 'text-slate-400'}`} />
                    )}
                  </div>

                  <h3
                    className={`mt-2 font-display text-lg font-bold transition-colors ${
                      isActive ? theme.titleActive : 'text-slate-950 dark:text-white'
                    }`}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                  <p className="text-slate-600 dark:text-slate-400">{pillar.statusNote}</p>
                  {linked && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectProject(linked)}
                        className={`font-semibold whitespace-nowrap transition-colors ${
                          isActive
                            ? theme.accentText
                            : 'text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400'
                        }`}
                      >
                        Ver {linked.title} →
                      </button>
                      {linked.demoUrl && (
                        <a
                          href={linked.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold text-white whitespace-nowrap transition-colors ${
                            isActive ? theme.actionBtn : 'bg-orange-500 hover:bg-orange-600'
                          }`}
                        >
                          <span>Abrir aplicación</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Plataformas y herramientas desarrolladas para formación
          </h3>
          <div
            className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2"
            onMouseLeave={() => setHoveredEdProjectId(null)}
          >
            {edProjects.map((project, idx) => {
              const isActive = hoveredEdProjectId === project.id;
              const isDimmed = hoveredEdProjectId !== null && !isActive;
              const theme = TEACHING_CARD_THEMES[(idx + 1) % TEACHING_CARD_THEMES.length];

              return (
                <article
                  key={project.id}
                  onMouseEnter={() => setHoveredEdProjectId(project.id)}
                  onFocus={() => setHoveredEdProjectId(project.id)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setHoveredEdProjectId(null);
                    }
                  }}
                  className={`group flex flex-col justify-between rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                    isActive
                      ? theme.cardActive
                      : isDimmed
                        ? 'border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-br from-white to-orange-50/40 dark:from-slate-950 dark:to-orange-950/20 opacity-50 saturate-[0.65] scale-[0.99]'
                        : 'border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-orange-50/40 dark:from-slate-950 dark:to-orange-950/20 opacity-95'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span
                        className={`font-semibold transition-colors ${
                          isActive ? theme.accentText : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {project.category}
                      </span>
                      <span>{project.status}</span>
                    </div>
                    <h4
                      className={`mt-2 font-display text-xl font-bold transition-colors ${
                        isActive ? theme.titleActive : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {project.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {project.shortDescription}
                    </p>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <strong className="text-slate-700 dark:text-slate-200">Objetivo didáctico:</strong>{' '}
                      {project.objective}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className={`text-xs font-semibold transition-colors ${
                        isActive
                          ? theme.accentText
                          : 'text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      Abrir ficha completa
                    </button>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition-colors ${
                          isActive
                            ? theme.actionBtn
                            : 'bg-slate-900 dark:bg-orange-500 hover:bg-orange-500 dark:hover:bg-orange-600'
                        }`}
                      >
                        <span>Probar plataforma</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
