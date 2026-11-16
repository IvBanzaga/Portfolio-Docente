import {
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FolderGit2,
  FolderKanban,
  Hand,
  Home,
  Mail,
  Pause,
  Play,
  SkipForward,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import devbotIdle from '../../assets/devbot/devbot-idle.png';
import { Project } from '../../types/portfolio';
import './DevBot.css';
import { useDevBotController } from './DevBotController';
import { SECTION_GUIDES } from './DevBotMessages';
import { DEVBOT_POSES, DevBotState, STATE_LABELS } from './DevBotSprites';

interface DevBotProps {
  onNavigate: (sectionId: string) => void;
  hasOpenModal: boolean;
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  pauseAnimations: boolean;
}

function getAnimationClass(
  state: Exclude<DevBotState, 'HIDDEN'>,
  disabled: boolean,
  previewPoseActive: boolean,
  isReading: boolean
): string {
  if (disabled || previewPoseActive) return '';
  if (isReading && (state === 'IDLE' || state === 'RESTING')) {
    return 'devbot-anim-reading';
  }
  switch (state) {
    case 'WALKING':
      return 'devbot-anim-walk';
    case 'RUNNING':
      return 'devbot-anim-run';
    case 'JUMPING':
      return 'devbot-anim-jump';
    case 'POINTING':
      return 'devbot-anim-point';
    case 'EXPLAINING':
      return 'devbot-anim-explain';
    case 'THINKING':
      return 'devbot-anim-think';
    case 'CURIOUS':
      return 'devbot-anim-curious';
    case 'SURPRISED':
      return 'devbot-anim-surprise';
    case 'JOYFUL':
      return 'devbot-anim-joy';
    case 'CELEBRATING':
      return 'devbot-anim-celebrate';
    case 'RESTING':
      return 'devbot-anim-rest';
    default:
      return 'devbot-anim-idle';
  }
}

export function DevBot({
  onNavigate,
  hasOpenModal,
  selectedProject,
  onSelectProject,
  pauseAnimations,
}: DevBotProps) {
  const {
    state,
    botLayerRef,
    isDesktop,
    isReading,
    isTabHidden,
    interactionsPaused,
    coords,
    bubble,
    hintsEnabled,
    animationsEnabled,
    effectiveAnimationsDisabled,
    menuOpen,
    setMenuOpen,
    menuTab,
    setMenuTab,
    previewPoseId,
    setPreviewPoseId,
    activePoseId,
    activePose,
    currentGuide,
    currentIndex,
    totalSections,
    prevGuide,
    nextGuide,
    lastExploredProject,
    tourActive,
    tourPaused,
    tourStepIndex,
    startTour,
    pauseTour,
    resumeTour,
    nextTourStep,
    prevTourStep,
    goToTourStep,
    stopTour,
    dismissBubble,
    navigateAndGuide,
    pointAtInteraction,
    toggleHints,
    toggleAnimations,
    toggleInteractionsPaused,
    hideBot,
    showBot,
    openProjectFromBot,
  } = useDevBotController({
    hasOpenModal,
    selectedProject,
    pauseAnimations,
    onNavigate,
    onSelectProject,
  });

  // Escape closes control panel
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, setMenuOpen]);

  if (!isDesktop) {
    return null;
  }

  if (state === 'HIDDEN') {
    return (
      <div className="fixed bottom-4 left-4 z-40 no-print">
        <button
          type="button"
          onClick={showBot}
          aria-label="Mostrar guía DevBot"
          title="Mostrar a DevBot"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-lg backdrop-blur-md transition-transform duration-150 hover:-translate-y-0.5 hover:border-cyan-500"
        >
          <img
            src={devbotIdle}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="h-7 w-7 devbot-sprite-img"
          />
          <span className="hidden sm:inline">DevBot</span>
        </button>
      </div>
    );
  }

  const animClass = getAnimationClass(
    state,
    effectiveAnimationsDisabled,
    Boolean(previewPoseId),
    isReading
  );

  const isYieldHidden = coords.temporarilyHidden && !menuOpen && !hasOpenModal;
  const pauseAllAnimations = effectiveAnimationsDisabled || isTabHidden || isYieldHidden;
  const spriteSize = Math.round(coords.size * 0.78);
  const bubbleProject = bubble?.project;

  return (
    <div
        ref={botLayerRef}
        style={{
          opacity: isYieldHidden ? 0 : 1,
        }}
        aria-hidden={isYieldHidden}
        className={`devbot-layer no-print ${
          effectiveAnimationsDisabled ? '' : 'devbot-layer--animated'
        } ${pauseAllAnimations ? 'devbot-paused-bg' : ''}`}
      >
        <div
          className={`relative ${effectiveAnimationsDisabled ? '' : 'devbot-enter'}`}
        >
          {/* Contextual Speech Bubble & Guided Tour Controls */}
          {bubble && !menuOpen && !isYieldHidden && (
            <div
              role="status"
              aria-live="polite"
              style={{
                left: `${coords.bubbleDx}px`,
                top: `${coords.bubbleDy}px`,
                width: `${coords.bubbleWidth}px`,
              }}
              className={`pointer-events-auto devbot-bubble absolute rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-3.5 py-3 shadow-xl shadow-slate-900/15 backdrop-blur-md ${
                effectiveAnimationsDisabled
                  ? ''
                  : 'transition-[left,top,width] duration-300 ease-out'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="truncate text-[0.6875rem] font-bold text-blue-600 dark:text-cyan-400">
                  {bubble.kicker}
                </span>
                <button
                  type="button"
                  onClick={() => (tourActive ? stopTour(false) : dismissBubble())}
                  aria-label={tourActive ? 'Finalizar recorrido' : 'Cerrar mensaje de DevBot'}
                  className="-mr-1 -mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="mt-1 line-clamp-3 text-xs leading-snug text-slate-700 dark:text-slate-200">
                {bubble.text}
              </p>

              {/* Real Project Contextual Knowledge: Technologies & Direct Links */}
              {bubbleProject && (
                <div className="mt-2 border-t border-slate-200/80 dark:border-slate-800 pt-2 space-y-2">
                  <p className="font-mono text-[0.6875rem] text-slate-500 dark:text-slate-400 truncate">
                    {bubbleProject.technologies.slice(0, 4).join(' · ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {!hasOpenModal && (
                      <button
                        type="button"
                        onClick={() => openProjectFromBot(bubbleProject)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-400"
                      >
                        Ver ficha
                      </button>
                    )}
                    {bubbleProject.demoUrl && (
                      <a
                        href={bubbleProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[0.6875rem] font-semibold text-white hover:bg-blue-700"
                      >
                        <span>Abrir app</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {bubbleProject.repoUrl ? (
                      <a
                        href={bubbleProject.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500"
                      >
                        <FolderGit2 className="h-3 w-3" />
                        <span>Repo</span>
                      </a>
                    ) : (
                      bubbleProject.docsUrl && (
                        <a
                          href={bubbleProject.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500"
                        >
                          <span>Docs</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Guided Exploration Controls HUD */}
              {tourActive && (
                <div className="mt-2.5 border-t border-slate-200/80 dark:border-slate-800 pt-2 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={prevTourStep}
                      disabled={tourStepIndex === 0}
                      aria-label="Sección anterior del recorrido"
                      className="inline-flex h-7 items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2 text-[0.6875rem] font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      <span>Atrás</span>
                    </button>

                    <button
                      type="button"
                      onClick={tourPaused ? resumeTour : pauseTour}
                      aria-label={tourPaused ? 'Reanudar recorrido' : 'Pausar recorrido'}
                      className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 text-[0.6875rem] font-semibold text-slate-800 dark:text-slate-100 hover:border-cyan-500"
                    >
                      {tourPaused ? (
                        <>
                          <Play className="h-3 w-3 text-emerald-600" />
                          <span>Reanudar</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 text-amber-600" />
                          <span>Pausar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={nextTourStep}
                      aria-label="Continuar a la siguiente sección"
                      className="inline-flex h-7 items-center gap-0.5 rounded-lg bg-blue-600 px-2 text-[0.6875rem] font-semibold text-white hover:bg-blue-700"
                    >
                      <span>{tourStepIndex + 1 >= totalSections ? 'Fin' : 'Seguir'}</span>
                      <SkipForward className="h-3 w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => stopTour(false)}
                      aria-label="Finalizar recorrido guiado"
                      title="Finalizar recorrido"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-rose-400 hover:text-rose-600 dark:text-slate-400"
                    >
                      <Square className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Jump / skip to any section directly */}
                  <div className="flex items-center justify-between gap-1">
                    {SECTION_GUIDES.map((sec, idx) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => goToTourStep(idx)}
                        title={`Saltar a ${sec.label}`}
                        aria-label={`Saltar a ${sec.label}`}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          idx === tourStepIndex
                            ? 'bg-cyan-500'
                            : idx < tourStepIndex
                              ? 'bg-blue-400/70'
                              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Control Panel Dialog (opened on clicking DevBot) */}
          {menuOpen && (
            <div
              role="dialog"
              aria-label="Panel de control de DevBot"
              style={{
                left: `${coords.menuDx}px`,
                top: coords.menuBelow ? `${coords.size + 8}px` : undefined,
                bottom: coords.menuBelow ? undefined : `${coords.size + 8}px`,
              }}
              className="pointer-events-auto absolute w-[min(23rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-2xl shadow-slate-900/25"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div>
                  <p className="font-display text-sm font-bold text-slate-950 dark:text-white">
                    DevBot · Panel de control
                  </p>
                  <p className="text-[0.6875rem] text-slate-500 dark:text-slate-400">
                    {currentGuide.label} · {interactionsPaused ? 'En pausa' : isReading ? 'En calma' : STATE_LABELS[state]}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={hideBot}
                    aria-label="Ocultar mascota DevBot"
                    title="Ocultar mascota"
                    className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[0.6875rem] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Ocultar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Cerrar panel de DevBot"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* 2 Navigation Tabs */}
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuTab('guide');
                    setPreviewPoseId(null);
                  }}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                    menuTab === 'guide'
                      ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Control</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuTab('poses')}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                    menuTab === 'poses'
                      ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Poses</span>
                </button>
              </div>

              {menuTab === 'guide' && (
                <div className="mt-3 space-y-2.5 max-h-[65vh] overflow-y-auto pr-0.5">
                  {/* Guided Tour Action */}
                  {tourActive ? (
                    <div className="flex items-center gap-2 rounded-xl border border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/35 p-2.5">
                      <span className="flex-1 text-xs font-semibold text-cyan-950 dark:text-cyan-100">
                        Recorrido ({tourStepIndex + 1}/{totalSections}): {currentGuide.label}
                      </span>
                      <button
                        type="button"
                        onClick={tourPaused ? resumeTour : pauseTour}
                        className="rounded-lg bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                      >
                        {tourPaused ? 'Reanudar' : 'Pausar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => stopTour(false)}
                        className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white"
                      >
                        Finalizar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startTour}
                      className="flex w-full min-h-[40px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Iniciar recorrido guiado por el portfolio</span>
                    </button>
                  )}

                  {/* Quick Navigation Shortcuts */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigateAndGuide('inicio');
                      }}
                      className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-400 hover:text-blue-600 dark:hover:text-cyan-400"
                    >
                      <Home className="h-3.5 w-3.5 shrink-0" />
                      <span>Inicio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigateAndGuide('proyectos');
                      }}
                      className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-400 hover:text-blue-600 dark:hover:text-cyan-400"
                    >
                      <FolderKanban className="h-3.5 w-3.5 shrink-0" />
                      <span>Proyectos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigateAndGuide('contacto');
                      }}
                      className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-400 hover:text-blue-600 dark:hover:text-cyan-400"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span>Contacto</span>
                    </button>
                  </div>

                  {/* Contextual Project Knowledge Card (Last Explored / Active) */}
                  {lastExploredProject && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 space-y-1.5">
                      <p className="text-[0.6875rem] font-semibold text-blue-600 dark:text-cyan-400">
                        Último proyecto consultado · {lastExploredProject.status}
                      </p>
                      <p className="font-display text-xs font-bold text-slate-950 dark:text-white">
                        {lastExploredProject.title}
                      </p>
                      <p className="line-clamp-2 text-[0.72rem] leading-snug text-slate-600 dark:text-slate-300">
                        {lastExploredProject.shortDescription}
                      </p>
                      <p className="font-mono text-[0.6875rem] text-slate-500 dark:text-slate-400 truncate">
                        {lastExploredProject.technologies.slice(0, 4).join(' · ')}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => openProjectFromBot(lastExploredProject)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-800 dark:text-slate-100 hover:border-blue-400"
                        >
                          Ver ficha
                        </button>
                        {lastExploredProject.demoUrl && (
                          <a
                            href={lastExploredProject.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[0.6875rem] font-semibold text-white hover:bg-blue-700"
                          >
                            <span>Abrir app</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Point at interactive controls in active section */}
                  <div>
                    <p className="mb-1 text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400">
                      Señalar en {currentGuide.label}:
                    </p>
                    <div className="space-y-1.5">
                      {currentGuide.interactions.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            pointAtInteraction(item.selector, currentGuide.id, item.label);
                          }}
                          className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-1.5 text-left text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-cyan-500 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30"
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <Hand className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-cyan-400" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles: Indications, Animations & Pause Interactions */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={toggleHints}
                      aria-pressed={hintsEnabled}
                      className={`flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-2 text-[0.6875rem] font-semibold transition-colors ${
                        hintsEnabled
                          ? 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/70 dark:bg-cyan-950/35 text-cyan-900 dark:text-cyan-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {hintsEnabled ? (
                          <Bell className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        ) : (
                          <BellOff className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>Indicaciones</span>
                      </span>
                      <span>{hintsEnabled ? 'Sí' : 'No'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleAnimations}
                      aria-pressed={animationsEnabled}
                      className={`flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-2 text-[0.6875rem] font-semibold transition-colors ${
                        animationsEnabled && !pauseAnimations
                          ? 'border-blue-300 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/35 text-blue-900 dark:text-blue-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                        <span>Animaciones</span>
                      </span>
                      <span>{animationsEnabled && !pauseAnimations ? 'Sí' : 'No'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleInteractionsPaused}
                      aria-pressed={interactionsPaused}
                      className={`col-span-2 flex items-center justify-between gap-1.5 rounded-xl border px-2.5 py-2 text-[0.6875rem] font-semibold transition-colors ${
                        interactionsPaused
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/35 text-amber-900 dark:text-amber-200'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {interactionsPaused ? (
                          <Play className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Pause className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        )}
                        <span>
                          {interactionsPaused
                            ? 'Interacciones en pausa (pulsa para reanudar)'
                            : 'Pausar reacciones automáticas'}
                        </span>
                      </span>
                      <span>{interactionsPaused ? 'Pausado' : 'Activo'}</span>
                    </button>
                  </div>

                  {/* Prev / Next Section Stepper */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 pt-2">
                    <button
                      type="button"
                      onClick={() => navigateAndGuide(prevGuide.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>{prevGuide.label}</span>
                    </button>
                    <span className="font-mono text-[0.6875rem] text-slate-400 tabular-nums">
                      {currentIndex + 1}/{totalSections}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateAndGuide(nextGuide.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-900 dark:bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      <span>{nextGuide.label}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {menuTab === 'poses' && (
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between text-[0.6875rem] text-slate-500 dark:text-slate-400">
                    <span>Pulsa una expresión para probarla:</span>
                    {previewPoseId && (
                      <button
                        type="button"
                        onClick={() => setPreviewPoseId(null)}
                        className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        Modo automático
                      </button>
                    )}
                  </div>

                  <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto pr-1">
                    {DEVBOT_POSES.map((pose) => {
                      const selected = activePoseId === pose.id;
                      return (
                        <div
                          key={pose.id}
                          className={`flex flex-col justify-between rounded-xl border p-2 transition-colors ${
                            selected
                              ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/35'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setPreviewPoseId(pose.id)}
                            className="flex flex-col items-center text-center"
                          >
                            <img
                              src={pose.src}
                              alt={`DevBot pose ${pose.label}`}
                              referrerPolicy="no-referrer"
                              className="h-12 w-12 devbot-sprite-img"
                            />
                            <span className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                              {pose.label}
                            </span>
                          </button>

                          <a
                            href={pose.publicHref}
                            download={`devbot-${pose.id}.png`}
                            className="mt-1.5 inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1 text-[0.65rem] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400"
                          >
                            <Download className="h-2.5 w-2.5" />
                            <span>PNG</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Interactive Pixel-Art Robot Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            tabIndex={isYieldHidden ? -1 : 0}
            aria-expanded={menuOpen}
            aria-label={`DevBot (${currentGuide.label}, ${STATE_LABELS[state]}): abrir panel de control`}
            title="Pulsa para abrir el panel de control de DevBot"
            style={{
              width: `${coords.size}px`,
              height: `${coords.size}px`,
            }}
            className={`group relative flex items-center justify-center rounded-2xl border border-slate-300/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-lg shadow-slate-900/15 dark:shadow-cyan-950/35 backdrop-blur-md transition-[transform,width,height,border-color] duration-200 hover:-translate-y-1 hover:border-cyan-500 ${
              isYieldHidden ? 'pointer-events-none' : 'pointer-events-auto'
            }`}
          >
            <span
              className="inline-flex items-center justify-center"
              style={coords.facing === 'left' ? { transform: 'scaleX(-1)' } : undefined}
            >
              <img
                src={activePose.src}
                alt={`Mascota pixel art DevBot en pose ${activePose.label}`}
                referrerPolicy="no-referrer"
                decoding="async"
                style={{
                  width: `${spriteSize}px`,
                  height: `${spriteSize}px`,
                }}
                className={`devbot-sprite-img ${animClass}`}
              />
            </span>
          </button>
        </div>
      </div>
  );
}
