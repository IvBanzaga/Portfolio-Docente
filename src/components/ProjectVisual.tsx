import { useState } from 'react';
import { Project } from '../types/portfolio';

interface ProjectVisualProps {
  project: Project;
  compact?: boolean;
}

const ACCENT_GRADIENTS: Record<Project['accentColor'], string> = {
  blue: 'from-blue-50 via-sky-50 to-indigo-100 dark:from-slate-800 dark:via-blue-950/60 dark:to-indigo-950/80',
  orange: 'from-orange-50 via-amber-50 to-rose-100 dark:from-slate-800 dark:via-orange-950/50 dark:to-amber-950/70',
  teal: 'from-teal-50 via-emerald-50 to-cyan-100 dark:from-slate-800 dark:via-teal-950/50 dark:to-emerald-950/70',
  indigo: 'from-indigo-50 via-blue-50 to-violet-100 dark:from-slate-800 dark:via-indigo-950/60 dark:to-violet-950/70',
  emerald: 'from-emerald-50 via-teal-50 to-lime-100 dark:from-slate-800 dark:via-emerald-950/50 dark:to-teal-950/70',
  rose: 'from-rose-50 via-orange-50 to-amber-100 dark:from-slate-800 dark:via-rose-950/50 dark:to-orange-950/70',
};

export function ProjectVisual({ project, compact = false }: ProjectVisualProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (project.image && !imgFailed) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={project.image}
          alt={`Captura de pantalla de ${project.title}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  const bgGradient = ACCENT_GRADIENTS[project.accentColor];

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br ${bgGradient} p-4 select-none`}
      aria-hidden="true"
    >
      {/* Window chrome bar */}
      <div className="flex items-center justify-between rounded-lg bg-white/85 dark:bg-slate-900/85 px-3 py-1.5 shadow-xs backdrop-blur-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        <span className="truncate max-w-[70%] font-mono text-[0.625rem] text-slate-500 dark:text-slate-400">
          {project.demoUrl
            ? project.demoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
            : project.id}
        </span>
      </div>

      {/* Domain-specific visual representation */}
      <div className={`my-auto flex flex-col justify-center ${compact ? 'py-2' : 'py-3'}`}>
        {renderArtwork(project)}
      </div>

      {/* Bottom subtle caption */}
      <div className="flex items-center justify-between text-[0.6875rem] font-medium text-slate-600/90 dark:text-slate-300/90">
        <span className="truncate">{project.subtitle}</span>
      </div>
    </div>
  );
}

function renderArtwork(project: Project) {
  switch (project.visualKind) {
    case 'map-incidents':
      return (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-8 relative h-28 rounded-xl bg-white/90 dark:bg-slate-900/90 p-2.5 shadow-xs overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
            <svg viewBox="0 0 180 90" className="relative h-full w-full">
              <path d="M10 65 Q 60 20, 110 50 T 170 25" fill="none" stroke="#93C5FD" strokeWidth="4" />
              <path d="M20 25 L 155 75" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 4" />
              <circle cx="52" cy="42" r="7" fill="#2563EB" />
              <circle cx="108" cy="50" r="7" fill="#F97316" />
              <circle cx="145" cy="30" r="6" fill="#0D9488" />
            </svg>
          </div>
          <div className="col-span-4 flex flex-col gap-1.5">
            <div className="rounded-lg bg-white/90 dark:bg-slate-900/90 p-2 shadow-xs">
              <div className="h-1.5 w-10 rounded bg-blue-600" />
              <div className="mt-1.5 h-1.5 w-14 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="rounded-lg bg-white/90 dark:bg-slate-900/90 p-2 shadow-xs">
              <div className="h-1.5 w-8 rounded bg-orange-500" />
              <div className="mt-1.5 h-1.5 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="rounded-lg bg-white/90 dark:bg-slate-900/90 p-2 shadow-xs">
              <div className="h-1.5 w-9 rounded bg-teal-600" />
              <div className="mt-1.5 h-1.5 w-11 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      );

    case 'catalog-data':
      return (
        <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="h-6 flex-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 flex items-center text-[0.625rem] font-mono text-slate-500 dark:text-slate-300">
              SEPE · 7.586 especialidades
            </div>
            <div className="h-6 rounded-md bg-emerald-600 px-2 flex items-center text-[0.625rem] font-semibold text-white">
              Excel
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[0.625rem]">
            <div className="rounded bg-orange-50 dark:bg-orange-950/70 py-1.5 text-orange-800 dark:text-orange-200 font-semibold">26 Familias</div>
            <div className="rounded bg-blue-50 dark:bg-blue-950/70 py-1.5 text-blue-800 dark:text-blue-200 font-semibold">14.456 Mód.</div>
            <div className="rounded bg-teal-50 dark:bg-teal-950/70 py-1.5 text-teal-800 dark:text-teal-200 font-semibold">58.600 C.</div>
          </div>
        </div>
      );

    case 'email-studio':
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-900 p-2.5 font-mono text-[0.5625rem] leading-relaxed text-indigo-200 shadow-xs">
            <div>&lt;Section&gt;</div>
            <div className="pl-2 text-amber-300">{`Hola {{nombre}},`}</div>
            <div className="pl-2 text-slate-300">{`{{empresa}}`}</div>
            <div>&lt;/Section&gt;</div>
          </div>
          <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xs space-y-1.5">
            <div className="h-2.5 w-16 rounded bg-indigo-600" />
            <div className="h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-2 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-5 w-20 rounded bg-indigo-600/90" />
          </div>
        </div>
      );

    case 'grants-panel':
      return (
        <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-3 shadow-xs space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="rounded-lg bg-teal-50 dark:bg-teal-950/70 p-2">
              <div className="text-[0.5625rem] font-semibold text-teal-700 dark:text-teal-300">Abiertas</div>
              <div className="mt-1 h-2 w-8 rounded bg-teal-500" />
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/70 p-2">
              <div className="text-[0.5625rem] font-semibold text-amber-700 dark:text-amber-300">Próximas</div>
              <div className="mt-1 h-2 w-6 rounded bg-amber-500" />
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/70 p-2">
              <div className="text-[0.5625rem] font-semibold text-blue-700 dark:text-blue-300">Continuas</div>
              <div className="mt-1 h-2 w-10 rounded bg-blue-500" />
            </div>
          </div>
          <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-2 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      );

    case 'ecommerce-books':
      return (
        <div className="grid grid-cols-3 gap-2">
          {['bg-rose-500', 'bg-blue-600', 'bg-amber-500'].map((tone, idx) => (
            <div key={idx} className="rounded-lg bg-white/95 dark:bg-slate-900/95 p-2 shadow-xs">
              <div className={`h-12 w-full rounded ${tone}/85`} />
              <div className="mt-2 h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-1 h-1.5 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
            </div>
          ))}
        </div>
      );

    case 'html-builder':
    case 'forms-tutorial':
      return (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-5 space-y-1.5">
            {['<header>', '<nav>', '<main>', '<footer>'].map((tag) => (
              <div
                key={tag}
                className="rounded-md bg-white/95 dark:bg-slate-900/95 px-2 py-1 font-mono text-[0.625rem] font-semibold text-orange-700 dark:text-orange-300 shadow-xs"
              >
                {tag}
              </div>
            ))}
          </div>
          <div className="col-span-7 rounded-xl bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xs flex flex-col justify-between">
            <div className="h-3 w-full rounded bg-orange-100 dark:bg-orange-950/80" />
            <div className="my-1.5 h-10 w-full rounded bg-slate-100 dark:bg-slate-800 border border-dashed border-orange-300 dark:border-orange-700" />
            <div className="h-2.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      );

    case 'template-blueprint':
      return (
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 rounded-xl bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xs space-y-1.5 border border-emerald-200/80 dark:border-emerald-800/60">
            <div className="text-[0.5625rem] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Mapa semántico
            </div>
            {[
              { n: '1', tag: 'HEADER', tone: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200' },
              { n: '2', tag: 'NAV', tone: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200' },
              { n: '3', tag: 'MAIN', tone: 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-200' },
              { n: '4', tag: 'FOOTER', tone: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' },
            ].map((row) => (
              <div
                key={row.tag}
                className={`flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[0.5625rem] font-semibold ${row.tone}`}
              >
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[0.5rem] text-white">
                  {row.n}
                </span>
                <span>{row.tag}</span>
              </div>
            ))}
          </div>
          <div className="col-span-6 flex flex-col justify-between gap-1.5">
            {['inicio.html', 'cursos.html', 'contacto.html'].map((file) => (
              <div
                key={file}
                className="rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1.5 font-mono text-[0.625rem] font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs"
              >
                {file}
              </div>
            ))}
          </div>
        </div>
      );

    case 'moodle-design':
      return (
        <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-3 shadow-xs space-y-2">
          <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50/90 dark:bg-blue-950/60 px-2.5 py-1.5">
            <div className="text-[0.625rem] font-bold text-blue-800 dark:text-blue-200">
              Aviso informativo · Moodle
            </div>
            <div className="mt-1 h-1.5 w-4/5 rounded bg-blue-200 dark:bg-blue-800" />
          </div>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-8 rounded-lg border-l-4 border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/50 px-2.5 py-1.5">
              <div className="text-[0.5625rem] font-semibold text-emerald-800 dark:text-emerald-200">
                Tarjeta de actividad
              </div>
              <div className="mt-1 h-1.5 w-3/4 rounded bg-emerald-200 dark:bg-emerald-800" />
            </div>
            <div className="col-span-4 rounded-lg bg-blue-600 py-1.5 text-center font-mono text-[0.5625rem] font-bold text-white">
              &lt;HTML/&gt;
            </div>
          </div>
        </div>
      );

    case 'nasa-apod':
    case 'astro-community':
      return (
        <div className="rounded-xl bg-slate-950 p-3 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.625rem] text-sky-300">
              {project.visualKind === 'nasa-apod' ? 'IMÁGENES · NASA' : 'COMUNIDAD · ASTROTENERIFE'}
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          </div>
          <svg viewBox="0 0 180 56" className="mt-2 h-14 w-full">
            <circle cx="28" cy="18" r="1.5" fill="#fff" />
            <circle cx="64" cy="10" r="1" fill="#BAE6FD" />
            <circle cx="112" cy="22" r="2" fill="#FDE68A" />
            <circle cx="150" cy="14" r="1.5" fill="#fff" />
            <circle cx="90" cy="36" r="14" fill="url(#planetGrad)" opacity="0.85" />
            <defs>
              <linearGradient id="planetGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    default:
      return (
        <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-24 rounded bg-slate-800/80 dark:bg-slate-200/80" />
            <div className="h-2.5 w-10 rounded bg-blue-500/80" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="h-12 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      );
  }
}
