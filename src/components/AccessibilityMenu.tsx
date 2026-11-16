import {
  Accessibility,
  Contrast,
  Link2,
  PauseCircle,
  RotateCcw,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface AccessibilityPrefs {
  fontSizePercent: number;
  highContrast: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
}

export const A11Y_STORAGE_KEY = 'a11y-preferences';

export const DEFAULT_A11Y_PREFS: AccessibilityPrefs = {
  fontSizePercent: 100,
  highContrast: false,
  highlightLinks: false,
  pauseAnimations: false,
};

const FONT_MIN = 87.5;
const FONT_MAX = 125;
const FONT_STEP = 12.5;

export function applyAccessibilityPrefs(prefs: AccessibilityPrefs) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.fontSize = `${prefs.fontSizePercent}%`;
  document.body.classList.toggle('alto-contraste', prefs.highContrast);
  document.body.classList.toggle('resaltar-enlaces', prefs.highlightLinks);
  document.body.classList.toggle('pausar-animaciones', prefs.pauseAnimations);
  document.documentElement.classList.toggle('pausar-animaciones', prefs.pauseAnimations);
}

interface AccessibilityMenuProps {
  prefs: AccessibilityPrefs;
  onChangePrefs: (next: AccessibilityPrefs) => void;
}

export function AccessibilityMenu({ prefs, onChangePrefs }: AccessibilityMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hasCustomPrefs =
    prefs.fontSizePercent !== DEFAULT_A11Y_PREFS.fontSizePercent ||
    prefs.highContrast ||
    prefs.highlightLinks ||
    prefs.pauseAnimations;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  const updateFontSize = (nextPercent: number) => {
    const clamped = Math.min(FONT_MAX, Math.max(FONT_MIN, nextPercent));
    onChangePrefs({ ...prefs, fontSizePercent: clamped });
  };

  const handleResetAll = () => {
    onChangePrefs(DEFAULT_A11Y_PREFS);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
        aria-controls="a11y-panel"
        title="Opciones de accesibilidad"
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
          open || hasCustomPrefs
            ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Accessibility className="h-4 w-4" aria-hidden="true" />
        {hasCustomPrefs && !open && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-950"
          />
        )}
      </button>

      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Panel de opciones de accesibilidad"
          className="fixed left-3 right-3 top-16 z-50 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Accesibilidad
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Cerrar opciones de accesibilidad"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {/* Font size controls */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Tamaño de letra
                </span>
                <span className="font-mono font-semibold text-blue-700 dark:text-blue-300 tabular-nums">
                  {Math.round(prefs.fontSizePercent)}%
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2" role="group" aria-label="Ajustar tamaño de letra">
                <button
                  type="button"
                  onClick={() => updateFontSize(prefs.fontSizePercent - FONT_STEP)}
                  disabled={prefs.fontSizePercent <= FONT_MIN}
                  aria-label="Reducir tamaño de letra"
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-bold text-slate-900 dark:text-white transition-colors hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize(100)}
                  aria-label="Tamaño de letra predeterminado"
                  aria-pressed={prefs.fontSizePercent === 100}
                  className={`inline-flex min-h-[40px] items-center justify-center rounded-lg border px-3 text-sm font-bold transition-colors ${
                    prefs.fontSizePercent === 100
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-blue-500'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize(prefs.fontSizePercent + FONT_STEP)}
                  disabled={prefs.fontSizePercent >= FONT_MAX}
                  aria-label="Aumentar tamaño de letra"
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-bold text-slate-900 dark:text-white transition-colors hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <button
              type="button"
              onClick={() => onChangePrefs({ ...prefs, highContrast: !prefs.highContrast })}
              aria-pressed={prefs.highContrast}
              className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                prefs.highContrast
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-blue-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Contrast className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Modo de alto contraste</span>
              </span>
              <span className="font-mono text-[0.6875rem] uppercase">
                {prefs.highContrast ? 'Activo' : 'No'}
              </span>
            </button>

            {/* Highlight Links and Buttons */}
            <button
              type="button"
              onClick={() => onChangePrefs({ ...prefs, highlightLinks: !prefs.highlightLinks })}
              aria-pressed={prefs.highlightLinks}
              className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                prefs.highlightLinks
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-blue-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Resaltar enlaces y botones</span>
              </span>
              <span className="font-mono text-[0.6875rem] uppercase">
                {prefs.highlightLinks ? 'Activo' : 'No'}
              </span>
            </button>

            {/* Pause Animations */}
            <button
              type="button"
              onClick={() => onChangePrefs({ ...prefs, pauseAnimations: !prefs.pauseAnimations })}
              aria-pressed={prefs.pauseAnimations}
              className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors ${
                prefs.pauseAnimations
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-blue-400'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <PauseCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Pausar animaciones</span>
              </span>
              <span className="font-mono text-[0.6875rem] uppercase">
                {prefs.pauseAnimations ? 'Activo' : 'No'}
              </span>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[0.6875rem] text-slate-500 dark:text-slate-400">
              Guardado automáticamente
            </span>
            <button
              type="button"
              onClick={handleResetAll}
              disabled={!hasCustomPrefs}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
