import { Download, Share, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (!showIOSGuide) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowIOSGuide(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIOSGuide]);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        aria-label="Instalar aplicación"
        title="Instalar aplicación (PWA)"
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-2.5 sm:px-3 text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap shrink-0 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/70"
      >
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Instalar app</span>
        <span className="sm:hidden">App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          aria-label="Instalar en iOS"
          title="Instalar en iPhone o iPad"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Smartphone className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span className="hidden sm:inline">Instalar app</span>
          <span className="sm:hidden">App</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-pwa-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <h3 id="ios-pwa-title" className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Instalar en iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Cerrar instrucciones de instalación"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-xs font-bold text-blue-700 dark:text-blue-300">
                    1
                  </span>
                  <span>
                    Pulsa el botón <strong className="inline-flex items-center gap-1 text-slate-900 dark:text-white">Compartir <Share className="h-3.5 w-3.5" aria-hidden="true" /></strong> en la barra de Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-xs font-bold text-blue-700 dark:text-blue-300">
                    2
                  </span>
                  <span>
                    Desplázate y selecciona <strong className="text-slate-900 dark:text-white">Añadir a pantalla de inicio</strong>.
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 dark:bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
