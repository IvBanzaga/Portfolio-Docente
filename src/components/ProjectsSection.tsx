import { ArrowUpRight, ExternalLink, Filter, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Project, ProjectCategory, ProjectDomain, ProjectStatus } from '../types/portfolio';
import { ProjectVisual } from './ProjectVisual';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  externalTechFilter?: string | null;
  onClearExternalTechFilter?: () => void;
}

const CATEGORIES: ('Todas' | ProjectCategory)[] = [
  'Todas',
  'Aplicaciones de gestión',
  'Formación y herramientas educativas',
  'Herramientas profesionales y productividad',
  'Webs corporativas y comercio electrónico',
  'Proyectos personales y experimentales',
];

const STATUSES: ('Todos' | ProjectStatus)[] = [
  'Todos',
  'Publicado',
  'En desarrollo',
  'Plantilla / Base',
];

export function ProjectsSection({
  projects,
  onSelectProject,
  externalTechFilter,
  onClearExternalTechFilter,
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Todas' | ProjectCategory>('Todas');
  const [selectedDomain, setSelectedDomain] = useState<'all' | ProjectDomain>('all');
  const [selectedStatus, setSelectedStatus] = useState<'Todos' | ProjectStatus>('Todos');
  const [selectedTech, setSelectedTech] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredFeaturedId, setHoveredFeaturedId] = useState<string | null>(null);
  const [hoveredCatalogId, setHoveredCatalogId] = useState<string | null>(null);

  const ACCENT_SPOTLIGHT: Record<Project['accentColor'], string> = {
    blue: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/15 dark:shadow-blue-500/20',
    orange: 'border-orange-500 dark:border-orange-400 ring-2 ring-orange-500/30 shadow-xl shadow-orange-500/15 dark:shadow-orange-500/20',
    teal: 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/30 shadow-xl shadow-teal-500/15 dark:shadow-teal-500/20',
    indigo: 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 shadow-xl shadow-indigo-500/15 dark:shadow-indigo-500/20',
    emerald: 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/30 shadow-xl shadow-emerald-500/15 dark:shadow-emerald-500/20',
    rose: 'border-rose-500 dark:border-rose-400 ring-2 ring-rose-500/30 shadow-xl shadow-rose-500/15 dark:shadow-rose-500/20',
  };

  const effectiveTech = externalTechFilter || selectedTech;

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured),
    [projects]
  );

  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return ['Todas', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedCategory !== 'Todas' && project.category !== selectedCategory) return false;
      if (selectedDomain !== 'all') {
        if (selectedDomain === 'docencia' && project.domain === 'web') return false;
        if (selectedDomain === 'web' && project.domain === 'docencia') return false;
      }
      if (selectedStatus !== 'Todos' && project.status !== selectedStatus) return false;
      if (effectiveTech !== 'Todas') {
        const needle = effectiveTech.toLowerCase();
        const matchesTech = project.technologies.some(
          (t) => t.toLowerCase().includes(needle) || needle.includes(t.toLowerCase())
        );
        if (!matchesTech) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          project.title,
          project.subtitle,
          project.shortDescription,
          project.category,
          ...project.technologies,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [projects, selectedCategory, selectedDomain, selectedStatus, effectiveTech, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== 'Todas' ||
    selectedDomain !== 'all' ||
    selectedStatus !== 'Todos' ||
    effectiveTech !== 'Todas' ||
    searchQuery.trim() !== '';

  const handleReset = () => {
    setSelectedCategory('Todas');
    setSelectedDomain('all');
    setSelectedStatus('Todos');
    setSelectedTech('Todas');
    setSearchQuery('');
    onClearExternalTechFilter?.();
  };

  return (
    <section
      id="proyectos"
      className="py-16 sm:py-20 bg-[#E9EEF5] dark:bg-slate-950 border-b border-slate-300/70 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Featured Bento Grid */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
              Selección principal · Proyectos de extremo a extremo
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Proyectos destacados
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
            Aplicaciones reales con autenticación, bases de datos, generación de código y
            herramientas formativas en producción.
          </p>
        </div>

        <div
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setHoveredFeaturedId(null)}
        >
          {featuredProjects.map((project, index) => {
            const isHeroBento = index === 0 || index === 3;
            const isActive = hoveredFeaturedId === project.id;
            const isDimmed = hoveredFeaturedId !== null && !isActive;

            return (
              <article
                key={project.id}
                onMouseEnter={() => setHoveredFeaturedId(project.id)}
                onFocus={() => setHoveredFeaturedId(project.id)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setHoveredFeaturedId(null);
                  }
                }}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-200 ${
                  isHeroBento ? 'lg:col-span-2' : 'lg:col-span-1'
                } ${
                  isActive
                    ? `-translate-y-1.5 brightness-[1.03] dark:brightness-110 ${ACCENT_SPOTLIGHT[project.accentColor]}`
                    : isDimmed
                      ? 'border-slate-200/70 dark:border-slate-800/70 opacity-50 saturate-[0.65] scale-[0.99]'
                      : 'border-slate-200/90 dark:border-slate-800 opacity-95'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="flex flex-1 flex-col text-left focus:outline-none"
                >
                  <div
                    className={`w-full overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-all duration-200 ${
                      isHeroBento ? 'h-52 sm:h-60' : 'h-48'
                    } ${isActive ? 'brightness-105' : ''}`}
                  >
                    <ProjectVisual project={project} />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {project.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{project.status}</span>
                        {project.dateLabel && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{project.dateLabel}</span>
                          </>
                        )}
                      </div>

                      <div className="mt-2 flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>

                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {project.shortDescription}
                      </p>
                    </div>

                    <p className="mt-4 font-mono text-xs text-slate-500 dark:text-slate-400 truncate">
                      {project.technologies.slice(0, 4).join(' · ')}
                    </p>
                  </div>
                </button>

                <div className="px-5 py-3.5 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors"
                  >
                    Ver ficha técnica
                  </button>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 font-semibold text-white whitespace-nowrap transition-colors hover:bg-blue-700"
                    >
                      <span>Abrir aplicación</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Full 17-Project Interactive Catalog */}
        <div className="mt-20 pt-14 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-orange-600 dark:text-orange-400">
                Inventario completo verificado
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Catálogo completo de proyectos ({filteredProjects.length} de {projects.length})
              </h3>
            </div>

            {/* Domain Quick Switch */}
            <div
              role="group"
              aria-label="Filtrar por ámbito"
              className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 self-start"
            >
              {(
                [
                  { id: 'all', label: 'Todos los ámbitos' },
                  { id: 'web', label: 'Desarrollo web' },
                  { id: 'docencia', label: 'Docencia y EdTech' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedDomain(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDomain === item.id
                      ? 'bg-slate-900 dark:bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por categoría">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
              <div className="relative sm:col-span-5">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, funcionalidad o tecnología..."
                  aria-label="Buscar proyectos"
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  aria-label="Filtrar por tecnología"
                  value={effectiveTech}
                  onChange={(e) => {
                    onClearExternalTechFilter?.();
                    setSelectedTech(e.target.value);
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  {allTechnologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech === 'Todas' ? 'Tecnología: Todas' : tech}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  aria-label="Filtrar por estado"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as 'Todos' | ProjectStatus)}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === 'Todos' ? 'Estado: Todos' : status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasActiveFilters}
                  className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-45 disabled:pointer-events-none"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            {externalTechFilter && (
              <div className="flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-950/60 px-3.5 py-2 text-xs text-blue-900 dark:text-blue-200">
                <span className="flex items-center gap-2 font-medium">
                  <Filter className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Filtrado desde el mapa de competencias: <strong>{externalTechFilter}</strong>
                </span>
                <button
                  type="button"
                  onClick={onClearExternalTechFilter}
                  className="font-semibold text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-white"
                >
                  Quitar filtro
                </button>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {filteredProjects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
              <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Ningún proyecto coincide con los filtros actuales
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Prueba a limpiar la búsqueda o seleccionar otra tecnología.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div
              className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              onMouseLeave={() => setHoveredCatalogId(null)}
            >
              {filteredProjects.map((project) => {
                const isActive = hoveredCatalogId === project.id;
                const isDimmed = hoveredCatalogId !== null && !isActive;

                return (
                  <article
                    key={project.id}
                    onMouseEnter={() => setHoveredCatalogId(project.id)}
                    onFocus={() => setHoveredCatalogId(project.id)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setHoveredCatalogId(null);
                      }
                    }}
                    className={`group flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-200 ${
                      isActive
                        ? `-translate-y-1.5 brightness-[1.03] dark:brightness-110 ${ACCENT_SPOTLIGHT[project.accentColor]}`
                        : isDimmed
                          ? 'border-slate-200/70 dark:border-slate-800/70 opacity-50 saturate-[0.65] scale-[0.99]'
                          : 'border-slate-200/90 dark:border-slate-800 opacity-90'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="flex flex-1 flex-col text-left focus:outline-none"
                    >
                      <div
                        className={`h-40 w-full overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-all duration-200 ${
                          isActive ? 'brightness-105' : ''
                        }`}
                      >
                        <ProjectVisual project={project} compact />
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5 pb-4">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                              {project.category}
                            </span>
                            <span
                              className={`shrink-0 font-semibold ${
                                project.status === 'En desarrollo'
                                  ? 'text-amber-700 dark:text-amber-400'
                                  : project.status === 'Plantilla / Base'
                                    ? 'text-indigo-700 dark:text-indigo-400'
                                    : 'text-emerald-700 dark:text-emerald-400'
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>

                          <h4 className="mt-2 font-display text-lg font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h4>

                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {project.shortDescription}
                          </p>
                        </div>

                        <p className="mt-4 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
                          {project.technologies.slice(0, 3).join(' · ')}
                        </p>
                      </div>
                    </button>

                    <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors"
                      >
                        Ver detalle →
                      </button>

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white whitespace-nowrap transition-colors hover:bg-blue-700"
                        >
                          <span>Abrir aplicación</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        project.docsUrl && (
                          <a
                            href={project.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <span>Documentación</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
