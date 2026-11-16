import { ArrowUpRight, Workflow } from 'lucide-react';
import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import { SKILL_GROUPS } from '../data/skills';
import { Project } from '../types/portfolio';

interface SkillsMatrixProps {
  onSelectProject: (project: Project) => void;
  onFilterCatalogByTech: (techName: string) => void;
}

interface SkillColorTheme {
  tabActive: string;
  tabHover: string;
  cardActive: string;
  cardHover: string;
  titleHover: string;
  badgeText: string;
  panelFrame: string;
  filterBtn: string;
  projectHover: string;
  projectTitleHover: string;
}

const SKILL_COLOR_THEMES: SkillColorTheme[] = [
  {
    tabActive: 'bg-blue-600 text-white shadow-sm shadow-blue-500/25',
    tabHover:
      'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950/60 dark:hover:text-blue-300 dark:hover:border-blue-700',
    cardActive:
      'border-blue-500 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/50 ring-2 ring-blue-500/25 shadow-sm',
    cardHover:
      'hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
    badgeText: 'text-blue-700 dark:text-blue-300',
    panelFrame: 'border-blue-200 dark:border-blue-800/80 bg-blue-50/35 dark:bg-blue-950/20',
    filterBtn:
      'border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60',
    projectHover: 'hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-950/40',
    projectTitleHover: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
  },
  {
    tabActive: 'bg-rose-600 text-white shadow-sm shadow-rose-500/25',
    tabHover:
      'hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 dark:hover:border-rose-700',
    cardActive:
      'border-rose-500 dark:border-rose-400 bg-rose-50/80 dark:bg-rose-950/50 ring-2 ring-rose-500/25 shadow-sm',
    cardHover:
      'hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
    badgeText: 'text-rose-700 dark:text-rose-300',
    panelFrame: 'border-rose-200 dark:border-rose-800/80 bg-rose-50/35 dark:bg-rose-950/20',
    filterBtn:
      'border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60',
    projectHover: 'hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/60 dark:hover:bg-rose-950/40',
    projectTitleHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
  },
  {
    tabActive: 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25',
    tabHover:
      'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 dark:hover:border-indigo-700',
    cardActive:
      'border-indigo-500 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 ring-2 ring-indigo-500/25 shadow-sm',
    cardHover:
      'hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-indigo-700 dark:group-hover:text-indigo-300',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    panelFrame: 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/35 dark:bg-indigo-950/20',
    filterBtn:
      'border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60',
    projectHover: 'hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40',
    projectTitleHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
  },
  {
    tabActive: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25',
    tabHover:
      'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 dark:hover:border-emerald-700',
    cardActive:
      'border-emerald-500 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/50 ring-2 ring-emerald-500/25 shadow-sm',
    cardHover:
      'hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    panelFrame: 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/35 dark:bg-emerald-950/20',
    filterBtn:
      'border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60',
    projectHover: 'hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40',
    projectTitleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
  },
  {
    tabActive: 'bg-teal-600 text-white shadow-sm shadow-teal-500/25',
    tabHover:
      'hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 dark:hover:bg-teal-950/60 dark:hover:text-teal-300 dark:hover:border-teal-700',
    cardActive:
      'border-teal-500 dark:border-teal-400 bg-teal-50/80 dark:bg-teal-950/50 ring-2 ring-teal-500/25 shadow-sm',
    cardHover:
      'hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-teal-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-teal-700 dark:group-hover:text-teal-300',
    badgeText: 'text-teal-700 dark:text-teal-300',
    panelFrame: 'border-teal-200 dark:border-teal-800/80 bg-teal-50/35 dark:bg-teal-950/20',
    filterBtn:
      'border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/60',
    projectHover: 'hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-teal-950/40',
    projectTitleHover: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
  },
  {
    tabActive: 'bg-purple-600 text-white shadow-sm shadow-purple-500/25',
    tabHover:
      'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-950/60 dark:hover:text-purple-300 dark:hover:border-purple-700',
    cardActive:
      'border-purple-500 dark:border-purple-400 bg-purple-50/80 dark:bg-purple-950/50 ring-2 ring-purple-500/25 shadow-sm',
    cardHover:
      'hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/60 dark:hover:bg-purple-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
    badgeText: 'text-purple-700 dark:text-purple-300',
    panelFrame: 'border-purple-200 dark:border-purple-800/80 bg-purple-50/35 dark:bg-purple-950/20',
    filterBtn:
      'border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/60',
    projectHover: 'hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/60 dark:hover:bg-purple-950/40',
    projectTitleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
  },
  {
    tabActive: 'bg-orange-500 text-white shadow-sm shadow-orange-500/25',
    tabHover:
      'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:hover:bg-orange-950/60 dark:hover:text-orange-300 dark:hover:border-orange-700',
    cardActive:
      'border-orange-500 dark:border-orange-400 bg-orange-50/80 dark:bg-orange-950/50 ring-2 ring-orange-500/25 shadow-sm',
    cardHover:
      'hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/60 dark:hover:bg-orange-950/35 hover:-translate-y-0.5 hover:shadow-sm',
    titleHover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
    badgeText: 'text-orange-700 dark:text-orange-300',
    panelFrame: 'border-orange-200 dark:border-orange-800/80 bg-orange-50/35 dark:bg-orange-950/20',
    filterBtn:
      'border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-900 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/60',
    projectHover: 'hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/60 dark:hover:bg-orange-950/40',
    projectTitleHover: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
  },
];

export function SkillsMatrix({
  onSelectProject,
  onFilterCatalogByTech,
}: SkillsMatrixProps) {
  const [activeGroupId, setActiveGroupId] = useState<string>(SKILL_GROUPS[0].id);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const activeGroupIndex = Math.max(
    0,
    SKILL_GROUPS.findIndex((g) => g.id === activeGroupId)
  );
  const activeGroup = SKILL_GROUPS[activeGroupIndex] || SKILL_GROUPS[0];

  const selectedSkillIndex = Math.max(
    0,
    activeGroup.items.findIndex((i) => i.name === selectedSkillName)
  );
  const selectedSkill = activeGroup.items[selectedSkillIndex] || activeGroup.items[0];
  const selectedSkillTheme =
    SKILL_COLOR_THEMES[(activeGroupIndex + selectedSkillIndex) % SKILL_COLOR_THEMES.length];

  const relatedProjects = selectedSkill
    ? PROJECTS.filter((p) => selectedSkill.projectIds.includes(p.id))
    : [];

  return (
    <section
      id="competencias"
      className="py-16 sm:py-20 bg-[#F2F5F9] dark:bg-slate-900 border-b border-slate-300/70 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
            Competencias técnicas, automatización n8n y docencia
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Mapa de tecnologías y capacidades
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Sin porcentajes ficticios: cada tecnología, flujo de automatización o competencia
            pedagógica muestra su contexto real de aplicación.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Categorías de competencias">
          {SKILL_GROUPS.map((group, groupIndex) => {
            const isActive = group.id === activeGroup.id;
            const groupTheme = SKILL_COLOR_THEMES[groupIndex % SKILL_COLOR_THEMES.length];

            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveGroupId(group.id);
                  setSelectedSkillName(group.items[0]?.name || null);
                }}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? `border-transparent ${groupTheme.tabActive}`
                    : `border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 ${groupTheme.tabHover}`
                }`}
              >
                {group.title}
              </button>
            );
          })}
        </div>

        {/* Interactive Split */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">{activeGroup.summary}</p>
            <div className="space-y-2.5">
              {activeGroup.items.map((item, itemIndex) => {
                const active = selectedSkill?.name === item.name;
                const itemTheme =
                  SKILL_COLOR_THEMES[(activeGroupIndex + itemIndex) % SKILL_COLOR_THEMES.length];

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedSkillName(item.name)}
                    className={`group w-full text-left rounded-2xl border p-4 transition-all duration-150 ${
                      active
                        ? itemTheme.cardActive
                        : `border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 ${itemTheme.cardHover}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-display text-base font-bold transition-colors ${
                          active
                            ? 'text-slate-950 dark:text-white'
                            : `text-slate-950 dark:text-white ${itemTheme.titleHover}`
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`font-mono text-xs tabular-nums shrink-0 font-semibold transition-colors ${
                          active ? itemTheme.badgeText : `text-slate-500 dark:text-slate-400 ${itemTheme.titleHover}`
                        }`}
                      >
                        {item.projectIds.length > 0
                          ? `${item.projectIds.length} proyectos`
                          : 'Workflows'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.context}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6">
            {selectedSkill && (
              <div
                className={`h-full rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${selectedSkillTheme.panelFrame}`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className={`text-xs font-semibold ${selectedSkillTheme.badgeText}`}>
                        Evidencia y aplicación práctica
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-slate-950 dark:text-white">
                        {selectedSkill.name}
                      </h3>
                    </div>

                    {relatedProjects.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          onFilterCatalogByTech(selectedSkill.name.split('&')[0].trim())
                        }
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${selectedSkillTheme.filterBtn}`}
                      >
                        Filtrar catálogo completo
                      </button>
                    )}
                  </div>

                  {relatedProjects.length > 0 ? (
                    <div className="mt-5 space-y-2.5">
                      {relatedProjects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => onSelectProject(project)}
                          className={`group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-left transition-colors ${selectedSkillTheme.projectHover}`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {project.category} · {project.status}
                            </p>
                            <p
                              className={`mt-0.5 truncate font-display text-sm font-bold text-slate-950 dark:text-white transition-colors ${selectedSkillTheme.projectTitleHover}`}
                            >
                              {project.title}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
                      <div className={`flex items-center gap-2 ${selectedSkillTheme.badgeText}`}>
                        <Workflow className="h-5 w-5" />
                        <span className="font-display text-sm font-bold text-slate-900 dark:text-white">
                          Automatización operativa y orquestación n8n
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {selectedSkill.context}. Puedes probar una simulación interactiva paso a
                        paso en la pestaña <strong>4. Workflows n8n</strong> dentro de la sección
                        Laboratorio.
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  {relatedProjects.length > 0
                    ? 'Haz clic en cualquier proyecto vinculado para abrir su ficha técnica, demos y repositorio.'
                    : 'Espacio preparado para enlazar flujos públicos exportados en JSON o capturas de workflows n8n.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
