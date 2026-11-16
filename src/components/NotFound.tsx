import { ArrowLeft, Compass } from 'lucide-react';

interface NotFoundProps {
  pathname: string;
  onGoHome: () => void;
}

export function NotFound({ pathname, onGoHome }: NotFoundProps) {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-luminous-grid px-4 py-16">
      <div className="max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
          <Compass className="h-6 w-6" />
        </div>
        <p className="mt-4 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
          Error 404
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950 dark:text-white">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          La ruta <code className="font-mono text-slate-900 dark:text-white">{pathname}</code> no
          existe en este portafolio. Puedes volver al inicio para explorar los 17 proyectos, el
          espacio docente o el laboratorio interactivo.
        </p>
        <button
          type="button"
          onClick={onGoHome}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al portafolio principal</span>
        </button>
      </div>
    </main>
  );
}
