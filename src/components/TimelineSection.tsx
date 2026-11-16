import { CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { PROJECTS } from '../data/projects';
import { TIMELINE_ENTRIES } from '../data/teachingAndTimeline';
import { Project, TimelineEntry } from '../types/portfolio';

interface TimelineSectionProps {
  onSelectProject: (project: Project) => void;
}

type TimelineFilter = 'all' | 'verified' | 'pending-slot';

const TIMELINE_HOVER_THEMES = [
  {
    cardActive:
      '-translate-y-1 border-blue-500 dark:border-blue-400 bg-blue-50/85 dark:bg-blue-950/45 ring-2 ring-blue-500/25 shadow-lg shadow-blue-500/10',
    dotActive: 'border-blue-500 bg-blue-600 text-white scale-110',
    titleActive: 'text-blue-700 dark:text-blue-300',
  },
  {
    cardActive:
      '-translate-y-1 border-indigo-500 dark:border-indigo-400 bg-indigo-50/85 dark:bg-indigo-950/45 ring-2 ring-indigo-500/25 shadow-lg shadow-indigo-500/10',
    dotActive: 'border-indigo-500 bg-indigo-600 text-white scale-110',
    titleActive: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    cardActive:
      '-translate-y-1 border-orange-500 dark:border-orange-400 bg-orange-50/85 dark:bg-orange-950/45 ring-2 ring-orange-500/25 shadow-lg shadow-orange-500/10',
    dotActive: 'border-orange-500 bg-orange-500 text-white scale-110',
    titleActive: 'text-orange-700 dark:text-orange-300',
  },
  {
    cardActive:
      '-translate-y-1 border-teal-500 dark:border-teal-400 bg-teal-50/85 dark:bg-teal-950/45 ring-2 ring-teal-500/25 shadow-lg shadow-teal-500/10',
    dotActive: 'border-teal-500 bg-teal-600 text-white scale-110',
    titleActive: 'text-teal-700 dark:text-teal-300',
  },
];

export function TimelineSection({ onSelectProject }: TimelineSectionProps) {
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(
    TIMELINE_ENTRIES[0]?.id ?? null
  );

  const filteredEntries: TimelineEntry[] =
    filter === 'all'
      ? TIMELINE_ENTRIES
      : TIMELINE_ENTRIES.filter((entry) => entry.kind === filter);

  const activeEntryId = filteredEntries.some((e) => e.id === hoveredEntryId)
    ? hoveredEntryId
    : (filteredEntries[0]?.id ?? null);

  return (
    <section
      id="trayectoria"
      className="py-16 sm:py-20 bg-[#E9EEF5] dark:bg-slate-950 border-b border-slate-300/70 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
              Evolución y transparencia curricular
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Trayectoria y bloques formativos
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Recorrido basado en hitos reales de proyectos publicados y espacios reservados para
              incorporar titulaciones oficiales y certificaciones verificadas.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar línea temporal"
            className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 self-start"
          >
            {(
              [
                { id: 'all', label: 'Todo', hover: 'hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300' },
                { id: 'verified', label: 'Hitos documentados', hover: 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300' },
                { id: 'pending-slot', label: 'Por completar', hover: 'hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/60 dark:hover:text-teal-300' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'bg-slate-900 dark:bg-blue-600 text-white'
                    : `text-slate-600 dark:text-slate-300 ${tab.hover}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-10 relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800 sm:before:left-6"
          onMouseLeave={() => setHoveredEntryId(filteredEntries[0]?.id ?? null)}
        >
          {filteredEntries.map((entry, idx) => {
            const isPending = entry.kind === 'pending-slot';
            const linkedProjects = entry.relatedProjectIds
              ? PROJECTS.filter((p) => entry.relatedProjectIds?.includes(p.id))
              : [];
            const theme = TIMELINE_HOVER_THEMES[idx % TIMELINE_HOVER_THEMES.length];
            const isActive = activeEntryId === entry.id;
            const isDimmed = activeEntryId !== null && !isActive;

            return (
              <div
                key={entry.id}
                className="relative pl-12 sm:pl-16"
                onMouseEnter={() => setHoveredEntryId(entry.id)}
                onFocus={() => setHoveredEntryId(entry.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredEntryId(filteredEntries[0]?.id ?? null);
                  }
                }}
              >
                <div
                  className={`absolute left-2 top-5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200 sm:left-3 ${
                    isActive
                      ? theme.dotActive
                      : isPending
                        ? 'border-amber-400 bg-white dark:bg-slate-950 text-amber-600 dark:text-amber-400'
                        : 'border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {isPending ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <div
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                    isActive
                      ? theme.cardActive
                      : isDimmed
                        ? isPending
                          ? 'border-dashed border-amber-300/70 dark:border-amber-800/70 bg-amber-50/25 dark:bg-amber-950/15 opacity-60'
                          : 'border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 opacity-60'
                        : isPending
                          ? 'border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {entry.period}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        isPending
                          ? 'font-semibold text-amber-700 dark:text-amber-400'
                          : 'font-semibold text-blue-600 dark:text-blue-400'
                      }
                    >
                      {entry.scope}
                    </span>
                  </div>

                  <h3
                    className={`mt-1.5 font-display text-xl font-bold transition-colors ${
                      isActive ? theme.titleActive : 'text-slate-950 dark:text-white'
                    }`}
                  >
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {entry.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {entry.highlights.map((item, hIdx) => (
                      <li key={hIdx}>• {item}</li>
                    ))}
                  </ul>

                  {linkedProjects.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Proyectos asociados:</span>
                      {linkedProjects.map((proj) => (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => onSelectProject(proj)}
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {proj.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
