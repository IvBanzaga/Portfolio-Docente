import {
  ArrowRight,
  BookOpen,
  Code2,
  Command,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers,
  Workflow,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import lensDesarrolloImg from '../assets/images/lens_desarrollo_n8n_1794772508311.jpg';
import lensDocenciaImg from '../assets/images/lens_docencia_edtech_1794772509368.jpg';
import lensSintesisImg from '../assets/images/lens_sintesis_dual_1794772508391.jpg';
import { PROFILE } from '../data/profile';
import { Project } from '../types/portfolio';

interface HeroProps {
  featuredProjects: Project[];
  onNavigate: (sectionId: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenCommandPalette: () => void;
}

type LensMode = 'dual' | 'web' | 'docencia';

export function Hero({
  featuredProjects,
  onNavigate,
  onSelectProject,
  onOpenCommandPalette,
}: HeroProps) {
  const [lens, setLens] = useState<LensMode>('docencia');
  const [avatarError, setAvatarError] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<'projects' | 'scopes' | 'n8n' | 'fullstack'>(
    'projects'
  );

  const webSpotlight =
    featuredProjects.find((p) => p.id === 'urban-manager') || featuredProjects[0];
  const teachingSpotlight =
    featuredProjects.find((p) => p.id === 'htmlab') || featuredProjects[0];
  const dualSpotlight =
    featuredProjects.find((p) => p.id === 'catalogo-sepe') || featuredProjects[0];

  const activeSpotlight =
    lens === 'web'
      ? webSpotlight
      : lens === 'docencia'
        ? teachingSpotlight
        : dualSpotlight;

  const lensVisual =
    lens === 'web'
      ? {
          src: lensDesarrolloImg,
          alt: 'Ilustración de arquitectura web full-stack y flujos automatizados con n8n',
        }
      : lens === 'docencia'
        ? {
            src: lensDocenciaImg,
            alt: 'Ilustración de docencia tecnológica, laboratorio HTML5 interactivo y tutor con inteligencia artificial',
          }
        : {
            src: lensSintesisImg,
            alt: 'Ilustración de puente entre la enseñanza tecnológica y el desarrollo de software web',
          };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-luminous-grid pt-10 pb-14 sm:pt-14 sm:pb-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Editorial Identity & Actions */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              {/* Circular High-Clarity Avatar + Kicker Metadata */}
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 via-teal-500 to-orange-500 p-[3px] shadow-md">
                  <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-slate-900 ring-2 ring-white dark:ring-slate-950">
                    {PROFILE.avatarUrl && !avatarError ? (
                      <img
                        src={PROFILE.avatarUrl}
                        alt={`Retrato profesional de ${PROFILE.name}`}
                        referrerPolicy="no-referrer"
                        decoding="sync"
                        onError={() => setAvatarError(true)}
                        className="h-full w-full rounded-full object-cover object-[50%_15%]"
                        style={{ transform: 'translateZ(0)' }}
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-orange-500 font-display text-2xl font-extrabold text-white"
                        aria-label={`Iniciales de ${PROFILE.name}`}
                      >
                        IB
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-400">
                    {PROFILE.dualIdentity.webLabel} · {PROFILE.dualIdentity.teachingLabel}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
                    {PROFILE.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    React · Next.js · PHP · Workflows n8n · EdTech
                  </p>
                </div>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
                Construyo aplicaciones web, automatizo con n8n y{' '}
                <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-orange-500 dark:from-blue-400 dark:via-teal-400 dark:to-orange-400 bg-clip-text text-transparent">
                  diseño experiencias para enseñar tecnología.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {PROFILE.shortBio}
              </p>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('docencia')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-orange-600 active:scale-[0.98]"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Docencia y EdTech</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('proyectos')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:scale-[0.98]"
              >
                <span>Explorar proyectos</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Resumen CV</span>
              </a>

              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 px-3.5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200/70 dark:hover:bg-slate-800"
                title="Abrir buscador rápido"
              >
                <Command className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                <span>Índice rápido (Ctrl+K)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Dual-Lens Switcher Card */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
                lens === 'web'
                  ? 'hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/90 dark:hover:from-slate-900 dark:hover:to-blue-950/35 hover:shadow-blue-500/15'
                  : lens === 'docencia'
                    ? 'hover:border-orange-400 dark:hover:border-orange-500 hover:bg-gradient-to-br hover:from-white hover:to-orange-50/90 dark:hover:from-slate-900 dark:hover:to-orange-950/35 hover:shadow-orange-500/15'
                    : 'hover:border-teal-400 dark:hover:border-teal-500 hover:bg-gradient-to-br hover:from-white hover:to-teal-50/90 dark:hover:from-slate-900 dark:hover:to-teal-950/35 hover:shadow-teal-500/15'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Explora la doble faceta
                  </span>

                  {/* Interactive Segmented Lens Selector */}
                  <div
                    role="tablist"
                    aria-label="Seleccionar enfoque profesional"
                    className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={lens === 'dual'}
                      onClick={() => setLens('dual')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                        lens === 'dual'
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Síntesis
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={lens === 'web'}
                      onClick={() => setLens('web')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                        lens === 'web'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Desarrollo
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={lens === 'docencia'}
                      onClick={() => setLens('docencia')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                        lens === 'docencia'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Docencia
                    </button>
                  </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="mt-5 rounded-xl bg-gradient-to-br from-slate-50 via-blue-50/50 to-orange-50/50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-900 p-4 border border-slate-100 dark:border-slate-700/70">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
                        lens === 'web'
                          ? 'bg-blue-600'
                          : lens === 'docencia'
                            ? 'bg-orange-500'
                            : 'bg-teal-600'
                      }`}
                    >
                      {lens === 'web' ? (
                        <Code2 className="h-5 w-5" />
                      ) : lens === 'docencia' ? (
                        <GraduationCap className="h-5 w-5" />
                      ) : (
                        <Layers className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                        {lens === 'web'
                          ? 'Ingeniería web y automatización n8n'
                          : lens === 'docencia'
                            ? 'Diseño instruccional y laboratorios'
                            : 'Enseñar tecnología construyéndola'}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {lens === 'web'
                          ? 'Arquitecturas full-stack con autenticación, bases de datos relacionales, flujos n8n, mapas, pagos Stripe y despliegue en Vercel.'
                          : lens === 'docencia'
                            ? 'Herramientas prácticas en vivo, recursos HTML5/CSS3 y tutores con IA para aprender haciendo sin barreras técnicas.'
                            : 'Cada herramienta formativa y flujo automatizado nace de un problema real resuelto con código limpio, accesible y verificable.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lens Visual Illustration */}
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950">
                  <img
                    src={lensVisual.src}
                    alt={lensVisual.alt}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    className="h-44 sm:h-48 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Spotlight Project Preview Trigger */}
              {activeSpotlight && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Proyecto de referencia en este enfoque · {activeSpotlight.status}
                  </p>
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-bold text-slate-900 dark:text-white">
                        {activeSpotlight.title}
                      </p>
                      <p className="truncate text-xs text-slate-600 dark:text-slate-400">
                        {activeSpotlight.technologies.slice(0, 4).join(' · ')}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProject(activeSpotlight)}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap"
                      >
                        Abrir ficha
                      </button>
                      {activeSpotlight.demoUrl && (
                        <a
                          href={activeSpotlight.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600 dark:hover:bg-blue-500 whitespace-nowrap"
                        >
                          <span>Abrir aplicación</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Full-Width 4-Column Summary Strip below Hero Split */}
        <div
          className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-300/70 dark:border-slate-800 pt-8 sm:grid-cols-4"
          onMouseLeave={() => setHoveredStat('projects')}
        >
          <div
            onMouseEnter={() => setHoveredStat('projects')}
            className={`rounded-xl p-4 border transition-all duration-200 cursor-default ${
              hoveredStat === 'projects'
                ? '-translate-y-1 border-blue-400 dark:border-blue-500 bg-blue-50/95 dark:bg-blue-950/55 shadow-lg shadow-blue-500/15 ring-1 ring-blue-400/40'
                : hoveredStat !== null
                  ? 'border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/75 opacity-60 saturate-[0.75]'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-50/95 hover:shadow-lg hover:shadow-blue-500/15'
            }`}
          >
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Code2 className="h-4 w-4" />
              <span className="font-display text-2xl font-extrabold text-slate-950 dark:text-white tabular-nums">
                17
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Proyectos web y formativos documentados
            </p>
          </div>

          <div
            onMouseEnter={() => setHoveredStat('scopes')}
            className={`rounded-xl p-4 border transition-all duration-200 cursor-default ${
              hoveredStat === 'scopes'
                ? '-translate-y-1 border-orange-400 dark:border-orange-500 bg-orange-50/95 dark:bg-orange-950/55 shadow-lg shadow-orange-500/15 ring-1 ring-orange-400/40'
                : hoveredStat !== null
                  ? 'border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/75 opacity-60 saturate-[0.75]'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:-translate-y-1 hover:border-orange-400 hover:bg-orange-50/95 hover:shadow-lg hover:shadow-orange-500/15'
            }`}
          >
            <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400">
              <BookOpen className="h-4 w-4" />
              <span className="font-display text-2xl font-extrabold text-slate-950 dark:text-white tabular-nums">
                2
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Ámbitos integrados: desarrollo y docencia
            </p>
          </div>

          <div
            onMouseEnter={() => setHoveredStat('n8n')}
            className={`rounded-xl p-4 border transition-all duration-200 cursor-default ${
              hoveredStat === 'n8n'
                ? '-translate-y-1 border-teal-400 dark:border-teal-500 bg-teal-50/95 dark:bg-teal-950/55 shadow-lg shadow-teal-500/15 ring-1 ring-teal-400/40'
                : hoveredStat !== null
                  ? 'border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/75 opacity-60 saturate-[0.75]'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:-translate-y-1 hover:border-teal-400 hover:bg-teal-50/95 hover:shadow-lg hover:shadow-teal-500/15'
            }`}
          >
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
              <Workflow className="h-4 w-4" />
              <span className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">
                n8n
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Workflows, webhooks y automatizaciones con IA
            </p>
          </div>

          <div
            onMouseEnter={() => setHoveredStat('fullstack')}
            className={`rounded-xl p-4 border transition-all duration-200 cursor-default ${
              hoveredStat === 'fullstack'
                ? '-translate-y-1 border-indigo-400 dark:border-indigo-500 bg-indigo-50/95 dark:bg-indigo-950/55 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-400/40'
                : hoveredStat !== null
                  ? 'border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/75 opacity-60 saturate-[0.75]'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50/95 hover:shadow-lg hover:shadow-indigo-500/15'
            }`}
          >
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
              <span className="font-display text-2xl font-extrabold text-slate-950 dark:text-white">
                Full-Stack
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              React · Next.js · PHP · Laravel · Astro
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Editorial Marquee Divider */}
      <div className="mt-12 overflow-hidden border-y border-slate-200/80 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 py-2.5">
        <div className="animate-marquee text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center gap-6 px-3 whitespace-nowrap">
              <span>Aplicaciones web full-stack</span>
              <span aria-hidden="true">·</span>
              <span>Workflows y automatizaciones n8n</span>
              <span aria-hidden="true">·</span>
              <span>Recursos educativos digitales</span>
              <span aria-hidden="true">·</span>
              <span>React, TypeScript, Next.js y PHP</span>
              <span aria-hidden="true">·</span>
              <span>Laboratorios interactivos HTML5</span>
              <span aria-hidden="true">·</span>
              <span>IA aplicada a la formación</span>
              <span aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
