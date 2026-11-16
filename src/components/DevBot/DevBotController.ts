import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Project } from '../../types/portfolio';
import { SolvedPlacement, solveDevBotPlacement } from './DevBotCollision';
import {
  getSectionGuide,
  getSectionMessageVariant,
  INITIAL_GREETING_MESSAGE,
  resolveCardInfo,
  RETURN_GREETING_MESSAGES,
  SECTION_GUIDES,
} from './DevBotMessages';
import {
  DevBotPoseId,
  DevBotState,
  getPoseMeta,
  preloadDevBotSprites,
  STATE_TO_POSE,
} from './DevBotSprites';

export type DevBotCoordinates = SolvedPlacement;

export interface DevBotBubble {
  key: string;
  kicker: string;
  text: string;
  project?: Project;
  badge?: string;
}

interface UseDevBotControllerArgs {
  hasOpenModal: boolean;
  selectedProject: Project | null;
  pauseAnimations: boolean;
  onNavigate: (sectionId: string) => void;
  onSelectProject: (project: Project) => void;
}

const STORAGE_HIDDEN_KEY = 'devbot-hidden-v2';
const STORAGE_HINTS_KEY = 'devbot-hints-v2';
const STORAGE_ANIM_KEY = 'devbot-anim-v2';
const STORAGE_PAUSED_KEY = 'devbot-paused-v1';

const DESKTOP_BREAKPOINT = 1024;
const BOT_SIZE_MOBILE = 48;
const TOUR_STEP_DURATION_MS = 6500;
const INACTIVITY_DELAY_MS = 16000;
const IDLE_VARIATION_MS = 12000;
const RETURN_GREETING_COOLDOWN_MS = 90000;
const CLICK_REACTION_COOLDOWN_MS = 2200;
const SECTION_MESSAGE_COOLDOWN_MS = 28000;
const SCROLL_SOLVE_MIN_INTERVAL_MS = 100;

function isPlacementClose(prev: SolvedPlacement, next: SolvedPlacement): boolean {
  return (
    Math.abs(prev.x - next.x) < 8 &&
    Math.abs(prev.y - next.y) < 8 &&
    Math.abs(prev.bubbleDx - next.bubbleDx) < 8 &&
    Math.abs(prev.bubbleDy - next.bubbleDy) < 8 &&
    Math.abs(prev.menuDx - next.menuDx) < 8 &&
    prev.size === next.size &&
    prev.compact === next.compact &&
    prev.temporarilyHidden === next.temporarilyHidden &&
    prev.facing === next.facing &&
    prev.bubbleWidth === next.bubbleWidth &&
    prev.menuBelow === next.menuBelow
  );
}

function readStoredFlag(key: string, fallback: boolean): boolean {
  try {
    const val = localStorage.getItem(key);
    if (val === 'true') return true;
    if (val === 'false') return false;
  } catch {
    // Ignore storage access errors
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useDevBotController({
  hasOpenModal,
  selectedProject,
  pauseAnimations,
  onNavigate,
  onSelectProject,
}: UseDevBotControllerArgs) {
  const [state, setState] = useState<DevBotState>(() =>
    readStoredFlag(STORAGE_HIDDEN_KEY, false) ? 'HIDDEN' : 'GREETING'
  );
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(() =>
    readStoredFlag(STORAGE_HINTS_KEY, true)
  );
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() =>
    readStoredFlag(STORAGE_ANIM_KEY, true)
  );
  const [interactionsPaused, setInteractionsPaused] = useState<boolean>(() =>
    readStoredFlag(STORAGE_PAUSED_KEY, false)
  );
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
  );

  const [activeSectionId, setActiveSectionId] = useState<string>('inicio');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuTab, setMenuTab] = useState<'guide' | 'poses'>('guide');
  const [previewPoseId, setPreviewPoseId] = useState<DevBotPoseId | null>(null);
  const [lastExploredProject, setLastExploredProject] = useState<Project | null>(null);

  // Guided exploration tour state
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [tourPaused, setTourPaused] = useState<boolean>(false);
  const [tourStepIndex, setTourStepIndex] = useState<number>(0);

  const [bubble, setBubble] = useState<DevBotBubble | null>(() =>
    readStoredFlag(STORAGE_HIDDEN_KEY, false)
      ? null
      : {
          key: 'greeting-init',
          kicker: 'DevBot',
          text: INITIAL_GREETING_MESSAGE,
        }
  );

  const [coords, setCoords] = useState<DevBotCoordinates>(() => {
    if (typeof window === 'undefined') {
      return {
        x: 16,
        y: 180,
        size: 64,
        compact: false,
        temporarilyHidden: false,
        facing: 'right',
        bubbleDx: 74,
        bubbleDy: 0,
        bubbleWidth: 248,
        menuDx: 0,
        menuBelow: true,
      };
    }
    const desktopNow = window.innerWidth >= DESKTOP_BREAKPOINT;
    return desktopNow
      ? {
          x: 16,
          y: 180,
          size: 64,
          compact: false,
          temporarilyHidden: false,
          facing: 'right',
          bubbleDx: 74,
          bubbleDy: 0,
          bubbleWidth: 248,
          menuDx: 0,
          menuBelow: true,
        }
      : {
          x: 14,
          y: Math.max(88, window.innerHeight - BOT_SIZE_MOBILE - 16),
          size: BOT_SIZE_MOBILE,
          compact: false,
          temporarilyHidden: false,
          facing: 'right',
          bubbleDx: 0,
          bubbleDy: -118,
          bubbleWidth: Math.min(244, window.innerWidth - 24),
          menuDx: 0,
          menuBelow: false,
        };
  });

  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );

  const effectiveAnimationsDisabled = pauseAnimations || !animationsEnabled;

  const isBotHidden = state === 'HIDDEN';
  const isSuspended = isBotHidden || !isDesktop;

  // Refs for zero-render rAF transforms, finite-state transitions & timer hygiene
  const botLayerRef = useRef<HTMLDivElement | null>(null);
  const activeSectionRef = useRef<string>('inicio');
  const hoveredCardRef = useRef<HTMLElement | null>(null);
  const pointingTargetRef = useRef<HTMLElement | null>(null);
  const greetingDoneRef = useRef<boolean>(false);
  const hintsEnabledRef = useRef<boolean>(hintsEnabled);
  const animDisabledRef = useRef<boolean>(effectiveAnimationsDisabled);
  const interactionsPausedRef = useRef<boolean>(interactionsPaused);
  const stateRef = useRef<DevBotState>(state);
  const tourActiveRef = useRef<boolean>(tourActive);
  const menuOpenRef = useRef<boolean>(menuOpen);
  const bubbleVisibleRef = useRef<boolean>(Boolean(bubble));
  const expandedBubbleRef = useRef<boolean>(false);
  const lastBubbleKeyRef = useRef<string>('greeting-init');
  const seenSectionTimestampsRef = useRef<Record<string, number>>({});
  const sectionVisitCountsRef = useRef<Record<string, number>>({});
  const isInactiveRef = useRef<boolean>(false);
  const isTabHiddenRef = useRef<boolean>(isTabHidden);
  const lastReturnGreetingAtRef = useRef<number>(0);
  const returnMessageIdxRef = useRef<number>(0);
  const lastClickReactionAtRef = useRef<number>(0);
  const clickReactionIdxRef = useRef<number>(0);
  const idleVariationIdxRef = useRef<number>(0);
  const lastScrollSolveAtRef = useRef<number>(0);
  const coordsRef = useRef<DevBotCoordinates>(coords);

  const walkTimerRef = useRef<number | null>(null);
  const secondaryStateTimerRef = useRef<number | null>(null);
  const readingTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const cardLeaveTimerRef = useRef<number | null>(null);
  const highlightTimerRef = useRef<number | null>(null);
  const greetingTimerRef = useRef<number | null>(null);
  const restTimerRef = useRef<number | null>(null);
  const idleVariationTimerRef = useRef<number | null>(null);
  const tourAutoTimerRef = useRef<number | null>(null);
  const scrollSettleTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const actionRafRef = useRef<number | null>(null);

  hintsEnabledRef.current = hintsEnabled;
  animDisabledRef.current = effectiveAnimationsDisabled;
  interactionsPausedRef.current = interactionsPaused;
  stateRef.current = state;
  tourActiveRef.current = tourActive;
  menuOpenRef.current = menuOpen;
  bubbleVisibleRef.current = Boolean(bubble);
  expandedBubbleRef.current = Boolean(bubble?.project) || tourActive;
  isTabHiddenRef.current = isTabHidden;

  const clearTimer = (ref: { current: number | null }) => {
    if (ref.current !== null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const clearRaf = (ref: { current: number | null }) => {
    if (ref.current !== null) {
      window.cancelAnimationFrame(ref.current);
      ref.current = null;
    }
  };

  // Sync DOM layer transform directly whenever DevBot mounts, unhides, or switches to desktop
  useLayoutEffect(() => {
    if (!isSuspended && botLayerRef.current) {
      const c = coordsRef.current;
      botLayerRef.current.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
    }
  }, [isSuspended]);

  // Preload & decode all 7 pixel-art pose sprites once in browser idle time (desktop only)
  useEffect(() => {
    if (!isSuspended) {
      preloadDevBotSprites();
    }
  }, [isSuspended]);

  // Persist user preferences & collected secrets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HIDDEN_KEY, String(state === 'HIDDEN'));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HINTS_KEY, String(hintsEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [hintsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANIM_KEY, String(animationsEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [animationsEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAUSED_KEY, String(interactionsPaused));
    } catch {
      // Ignore storage errors
    }
  }, [interactionsPaused]);

  const scheduleReadingSettle = useCallback(
    (delayMs = 3400) => {
      clearTimer(readingTimerRef);
      if (stateRef.current === 'HIDDEN' || interactionsPausedRef.current) return;

      readingTimerRef.current = window.setTimeout(() => {
        readingTimerRef.current = null;
        if (
          stateRef.current === 'HIDDEN' ||
          tourActiveRef.current ||
          hasOpenModal ||
          isInactiveRef.current
        ) {
          return;
        }
        setIsReading(true);
        setState((curr) =>
          curr === 'HIDDEN' || curr === 'CELEBRATING' || curr === 'GREETING' ? curr : 'IDLE'
        );
      }, delayMs);
    },
    [hasOpenModal]
  );

  const scheduleIdleVariation = useCallback(() => {
    clearTimer(idleVariationTimerRef);
    if (
      stateRef.current === 'HIDDEN' ||
      animDisabledRef.current ||
      interactionsPausedRef.current ||
      !isInactiveRef.current
    ) {
      return;
    }

    idleVariationTimerRef.current = window.setTimeout(() => {
      idleVariationTimerRef.current = null;
      if (
        !isInactiveRef.current ||
        stateRef.current === 'HIDDEN' ||
        tourActiveRef.current ||
        hasOpenModal ||
        menuOpen
      ) {
        return;
      }

      idleVariationIdxRef.current = (idleVariationIdxRef.current + 1) % 3;
      const nextIdlePose: DevBotState =
        idleVariationIdxRef.current === 1 ? 'THINKING' : 'RESTING';
      setIsReading(false);
      setState(nextIdlePose);
      scheduleIdleVariation();
    }, IDLE_VARIATION_MS);
  }, [hasOpenModal, menuOpen]);

  const scheduleRestCheck = useCallback(() => {
    clearTimer(restTimerRef);
    clearTimer(idleVariationTimerRef);
    if (
      stateRef.current === 'HIDDEN' ||
      animDisabledRef.current ||
      interactionsPausedRef.current
    ) {
      return;
    }

    restTimerRef.current = window.setTimeout(() => {
      restTimerRef.current = null;
      if (
        stateRef.current !== 'HIDDEN' &&
        !tourActiveRef.current &&
        !hasOpenModal &&
        !menuOpen &&
        !interactionsPausedRef.current
      ) {
        isInactiveRef.current = true;
        setIsReading(false);
        setState('RESTING');
        scheduleIdleVariation();
      }
    }, INACTIVITY_DELAY_MS);
  }, [hasOpenModal, menuOpen, scheduleIdleVariation]);

  const showTimedBubble = useCallback(
    (nextBubble: DevBotBubble, durationMs = 5200, force = false) => {
      if (!force && !hintsEnabledRef.current) return;
      if (!force && lastBubbleKeyRef.current === nextBubble.key) return;

      lastBubbleKeyRef.current = nextBubble.key;
      setCoords((prev) =>
        isPlacementClose(prev, coordsRef.current) ? prev : coordsRef.current
      );
      setBubble(nextBubble);
      clearTimer(bubbleTimerRef);
      if (durationMs > 0) {
        bubbleTimerRef.current = window.setTimeout(() => {
          setBubble((curr) => (curr?.key === nextBubble.key ? null : curr));
        }, durationMs);
      }
    },
    []
  );

  const dismissBubble = useCallback(() => {
    clearTimer(bubbleTimerRef);
    setBubble(null);
  }, []);

  // Direct compositor transform update in rAF; only triggers React state update when layout props change
  const applyCoordsStable = useCallback((nextCoords: DevBotCoordinates) => {
    const prev = coordsRef.current;
    if (isPlacementClose(prev, nextCoords)) return;

    coordsRef.current = nextCoords;
    if (botLayerRef.current) {
      botLayerRef.current.style.transform = `translate3d(${nextCoords.x}px, ${nextCoords.y}px, 0)`;
    }

    const needsReactSync =
      prev.size !== nextCoords.size ||
      prev.compact !== nextCoords.compact ||
      prev.temporarilyHidden !== nextCoords.temporarilyHidden ||
      prev.facing !== nextCoords.facing ||
      (bubbleVisibleRef.current &&
        (Math.abs(prev.bubbleDx - nextCoords.bubbleDx) >= 8 ||
          Math.abs(prev.bubbleDy - nextCoords.bubbleDy) >= 8 ||
          prev.bubbleWidth !== nextCoords.bubbleWidth)) ||
      (menuOpenRef.current &&
        (Math.abs(prev.menuDx - nextCoords.menuDx) >= 8 ||
          prev.menuBelow !== nextCoords.menuBelow));

    if (needsReactSync) {
      setCoords(nextCoords);
    }
  }, []);

  // Collision-aware placement around a specific element (card, control)
  const computeTargetCoordinates = useCallback(
    (el: HTMLElement, hasExpandedBubble?: boolean): DevBotCoordinates =>
      solveDevBotPlacement({
        targetEl: el,
        sectionEl: document.getElementById(activeSectionRef.current),
        hasProjectBubble: hasExpandedBubble ?? expandedBubbleRef.current,
      }),
    []
  );

  // Collision-aware placement for the active section
  const computeSectionCoordinates = useCallback(
    (sectionId: string, hasExpandedBubble?: boolean): DevBotCoordinates =>
      solveDevBotPlacement({
        targetEl: null,
        sectionEl: document.getElementById(sectionId),
        hasProjectBubble: hasExpandedBubble ?? expandedBubbleRef.current,
      }),
    []
  );

  // Controlled FSM transition guaranteeing zero overlapping animations
  const transitionTo = useCallback(
    (
      nextCoords: DevBotCoordinates,
      arrivalState: DevBotState,
      travelMode: 'WALKING' | 'RUNNING' | 'JUMPING' = 'WALKING',
      travelMs = 260,
      settleToReadingMs = 3400
    ) => {
      if (stateRef.current === 'HIDDEN') return;

      clearTimer(walkTimerRef);
      clearTimer(secondaryStateTimerRef);
      clearTimer(readingTimerRef);
      clearTimer(idleVariationTimerRef);
      clearTimer(restTimerRef);
      isInactiveRef.current = false;
      setIsReading(false);

      const prev = coordsRef.current;
      const moveDist = Math.hypot(prev.x - nextCoords.x, prev.y - nextCoords.y);
      applyCoordsStable(nextCoords);

      // Skip travel animation if already close or animations are disabled
      if (animDisabledRef.current || travelMs <= 0 || moveDist < 36) {
        if (stateRef.current !== arrivalState) {
          setState(arrivalState);
        }
        scheduleReadingSettle(settleToReadingMs);
        scheduleRestCheck();
        return;
      }

      if (stateRef.current !== travelMode) {
        setState(travelMode);
      }
      walkTimerRef.current = window.setTimeout(() => {
        walkTimerRef.current = null;
        if (stateRef.current !== 'HIDDEN') {
          setState(arrivalState);
          scheduleReadingSettle(settleToReadingMs);
          scheduleRestCheck();
        }
      }, travelMs);
    },
    [applyCoordsStable, scheduleReadingSettle, scheduleRestCheck]
  );

  // Handles return-from-inactivity discrete greeting & resets inactivity clock
  const recordVisitorActivity = useCallback(() => {
    if (stateRef.current === 'HIDDEN' || interactionsPausedRef.current) return;

    if (isInactiveRef.current) {
      isInactiveRef.current = false;
      clearTimer(idleVariationTimerRef);

      const now = Date.now();
      const canGreetReturn =
        greetingDoneRef.current &&
        !hasOpenModal &&
        !tourActiveRef.current &&
        !hoveredCardRef.current &&
        !menuOpen &&
        now - lastReturnGreetingAtRef.current > RETURN_GREETING_COOLDOWN_MS;

      if (canGreetReturn) {
        lastReturnGreetingAtRef.current = now;
        clearTimer(secondaryStateTimerRef);
        clearTimer(readingTimerRef);
        setIsReading(false);
        setState('GREETING');

        const msgIdx = returnMessageIdxRef.current;
        returnMessageIdxRef.current = (msgIdx + 1) % RETURN_GREETING_MESSAGES.length;
        showTimedBubble(
          {
            key: `welcome-back-${now}`,
            kicker: 'DevBot',
            text: RETURN_GREETING_MESSAGES[msgIdx],
          },
          3200
        );

        secondaryStateTimerRef.current = window.setTimeout(() => {
          secondaryStateTimerRef.current = null;
          if (stateRef.current === 'GREETING') {
            setState('IDLE');
            setIsReading(true);
          }
        }, 1400);
      }
    }

    scheduleRestCheck();
  }, [hasOpenModal, menuOpen, scheduleRestCheck, showTimedBubble]);

  // Clear section spotlight helper
  const clearSectionSpotlight = useCallback(() => {
    document.querySelectorAll('.devbot-section-spotlight').forEach((node) => {
      node.classList.remove('devbot-section-spotlight');
    });
  }, []);

  const applySectionSpotlight = useCallback(
    (sectionId: string) => {
      clearSectionSpotlight();
      const target = document.getElementById(sectionId);
      if (target) {
        target.classList.add('devbot-section-spotlight');
      }
    },
    [clearSectionSpotlight]
  );

  // Background tab pausing (suspends timers & CSS animations while tab is hidden)
  useEffect(() => {
    const onVisibilityChange = () => {
      const hidden = document.visibilityState === 'hidden';
      isTabHiddenRef.current = hidden;
      setIsTabHidden(hidden);

      if (hidden) {
        clearTimer(restTimerRef);
        clearTimer(idleVariationTimerRef);
        clearTimer(readingTimerRef);
        clearTimer(tourAutoTimerRef);
        clearRaf(scrollRafRef);
      } else if (!isSuspended && !interactionsPausedRef.current) {
        scheduleRestCheck();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [isSuspended, scheduleRestCheck]);

  // Track desktop vs mobile viewport so DevBot never mounts/runs on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDesktopState = () => {
      const desktopNow = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop((prev) => (prev === desktopNow ? prev : desktopNow));
    };

    updateDesktopState();
    const mq = window.matchMedia?.(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    if (mq?.addEventListener) {
      mq.addEventListener('change', updateDesktopState);
      return () => mq.removeEventListener('change', updateDesktopState);
    }

    window.addEventListener('resize', updateDesktopState, { passive: true });
    return () => window.removeEventListener('resize', updateDesktopState);
  }, []);

  // Suspend active overlays/timers cleanly when switching into mobile viewport
  useEffect(() => {
    if (isDesktop) return;

    clearTimer(walkTimerRef);
    clearTimer(secondaryStateTimerRef);
    clearTimer(readingTimerRef);
    clearTimer(bubbleTimerRef);
    clearTimer(cardLeaveTimerRef);
    clearTimer(highlightTimerRef);
    clearTimer(greetingTimerRef);
    clearTimer(restTimerRef);
    clearTimer(idleVariationTimerRef);
    clearTimer(tourAutoTimerRef);
    clearTimer(scrollSettleTimerRef);
    clearTimer(actionTimerRef);
    clearRaf(scrollRafRef);
    clearRaf(actionRafRef);
    clearSectionSpotlight();
    hoveredCardRef.current = null;
    pointingTargetRef.current = null;
    setMenuOpen(false);
    setTourActive(false);
    setTourPaused(false);
  }, [clearSectionSpotlight, isDesktop]);

  // Initial collision-free positioning + entrance greeting -> active section
  useEffect(() => {
    if (isSuspended) return;

    const rafId = window.requestAnimationFrame(() => {
      if (stateRef.current !== 'HIDDEN') {
        applyCoordsStable(computeSectionCoordinates(activeSectionRef.current, false));
      }
    });

    greetingTimerRef.current = window.setTimeout(() => {
      greetingDoneRef.current = true;
      if (stateRef.current === 'HIDDEN' || hoveredCardRef.current || tourActiveRef.current) {
        return;
      }

      const guide = getSectionGuide(activeSectionRef.current);
      const targetCoords = computeSectionCoordinates(activeSectionRef.current, false);

      if (interactionsPausedRef.current) {
        setIsReading(true);
        setState('IDLE');
        return;
      }

      transitionTo(targetCoords, guide.arrivalState, 'WALKING', 340, 3400);
      showTimedBubble(
        {
          key: `section-${guide.id}`,
          kicker: guide.label,
          text: guide.message,
        },
        4800
      );
    }, 3400);

    return () => {
      window.cancelAnimationFrame(rafId);
      clearTimer(greetingTimerRef);
    };
  }, [applyCoordsStable, computeSectionCoordinates, isSuspended, showTimedBubble, transitionTo]);

  // Modal open (e.g. clicking a project card) triggers CELEBRATING + real project info
  useEffect(() => {
    if (isSuspended) return;
    if (hasOpenModal) {
      clearTimer(walkTimerRef);
      clearTimer(secondaryStateTimerRef);
      clearTimer(readingTimerRef);
      clearTimer(idleVariationTimerRef);
      clearTimer(restTimerRef);
      isInactiveRef.current = false;
      setIsReading(false);
      setState('CELEBRATING');

      if (selectedProject) {
        setLastExploredProject(selectedProject);
        showTimedBubble(
          {
            key: `modal-proj-${selectedProject.id}`,
            kicker: `Celebrando · ${selectedProject.title}`,
            text: selectedProject.shortDescription,
            project: selectedProject,
          },
          5200
        );
      }
    } else if (greetingDoneRef.current && stateRef.current === 'CELEBRATING') {
      const guide = getSectionGuide(activeSectionRef.current);
      setState(interactionsPausedRef.current ? 'IDLE' : guide.arrivalState);
      scheduleReadingSettle(2800);
      scheduleRestCheck();
    }
  }, [hasOpenModal, isSuspended, scheduleReadingSettle, scheduleRestCheck, selectedProject, showTimedBubble]);

  // Viewport resize listener (rAF-throttled, detached when hidden or mobile)
  useEffect(() => {
    if (isSuspended) return;
    let resizeRaf: number | null = null;

    const handleResize = () => {
      if (resizeRaf !== null) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = null;
        if (stateRef.current === 'HIDDEN' || window.innerWidth < DESKTOP_BREAKPOINT) return;

        if (hoveredCardRef.current) {
          applyCoordsStable(computeTargetCoordinates(hoveredCardRef.current));
        } else if (pointingTargetRef.current) {
          applyCoordsStable(computeTargetCoordinates(pointingTargetRef.current));
        } else {
          applyCoordsStable(computeSectionCoordinates(activeSectionRef.current));
        }
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeRaf !== null) window.cancelAnimationFrame(resizeRaf);
    };
  }, [applyCoordsStable, computeSectionCoordinates, computeTargetCoordinates, isSuspended]);

  // IntersectionObserver for section tracking + non-repetitive contextual variants
  useEffect(() => {
    if (isSuspended) return;
    const elements = SECTION_GUIDES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (stateRef.current === 'HIDDEN' || hasOpenModal || tourActiveRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const nextId = visible[0]?.target?.id;
        if (!nextId || nextId === activeSectionRef.current) return;

        activeSectionRef.current = nextId;
        setActiveSectionId(nextId);
        pointingTargetRef.current = null;

        if (!greetingDoneRef.current || hoveredCardRef.current || interactionsPausedRef.current) {
          return;
        }

        const guide = getSectionGuide(nextId);
        const nextCoords = computeSectionCoordinates(nextId);
        transitionTo(nextCoords, guide.arrivalState, 'WALKING', 320, 3600);

        const now = Date.now();
        const lastSeen = seenSectionTimestampsRef.current[guide.id] || 0;
        if (now - lastSeen > SECTION_MESSAGE_COOLDOWN_MS) {
          seenSectionTimestampsRef.current[guide.id] = now;
          const visitCount = sectionVisitCountsRef.current[guide.id] || 0;
          sectionVisitCountsRef.current[guide.id] = visitCount + 1;
          const message = getSectionMessageVariant(guide.id, visitCount);

          showTimedBubble(
            {
              key: `section-${guide.id}-${visitCount}`,
              kicker: guide.label,
              text: message,
            },
            4600
          );
        }
      },
      {
        rootMargin: '-22% 0px -45% 0px',
        threshold: [0.15, 0.35, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [computeSectionCoordinates, hasOpenModal, isSuspended, showTimedBubble, transitionTo]);

  // Smooth scroll follower: rAF-synced + throttled collision solves + trailing settle
  useEffect(() => {
    if (isSuspended) return;

    const runScrollPlacement = () => {
      if (stateRef.current === 'HIDDEN' || hasOpenModal || interactionsPausedRef.current) return;
      lastScrollSolveAtRef.current = performance.now();

      if (hoveredCardRef.current) {
        applyCoordsStable(computeTargetCoordinates(hoveredCardRef.current));
        return;
      }
      if (pointingTargetRef.current) {
        applyCoordsStable(computeTargetCoordinates(pointingTargetRef.current));
        return;
      }

      const nextCoords = computeSectionCoordinates(activeSectionRef.current);
      const prev = coordsRef.current;
      const dist = Math.hypot(prev.x - nextCoords.x, prev.y - nextCoords.y);
      applyCoordsStable(nextCoords);

      if (
        window.innerWidth >= DESKTOP_BREAKPOINT &&
        greetingDoneRef.current &&
        !tourActiveRef.current &&
        !animDisabledRef.current &&
        dist >= 26
      ) {
        clearTimer(walkTimerRef);
        clearTimer(readingTimerRef);
        setIsReading(false);
        if (stateRef.current !== 'WALKING') {
          setState('WALKING');
        }
        walkTimerRef.current = window.setTimeout(() => {
          walkTimerRef.current = null;
          if (stateRef.current === 'WALKING') {
            const guide = getSectionGuide(activeSectionRef.current);
            setState(guide.arrivalState);
            scheduleReadingSettle(3200);
          }
        }, 300);
      }
    };

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null;
        if (stateRef.current === 'HIDDEN' || hasOpenModal) return;

        recordVisitorActivity();
        if (interactionsPausedRef.current) return;

        const now = performance.now();
        if (now - lastScrollSolveAtRef.current >= SCROLL_SOLVE_MIN_INTERVAL_MS) {
          runScrollPlacement();
        }

        clearTimer(scrollSettleTimerRef);
        scrollSettleTimerRef.current = window.setTimeout(() => {
          scrollSettleTimerRef.current = null;
          if (scrollRafRef.current === null) {
            scrollRafRef.current = window.requestAnimationFrame(() => {
              scrollRafRef.current = null;
              runScrollPlacement();
            });
          }
        }, 140);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearRaf(scrollRafRef);
      clearTimer(scrollSettleTimerRef);
    };
  }, [
    applyCoordsStable,
    computeSectionCoordinates,
    computeTargetCoordinates,
    hasOpenModal,
    isSuspended,
    recordVisitorActivity,
    scheduleReadingSettle,
  ]);

  // Brief non-intrusive reaction to real visitor clicks / keyboard activity + return from idle
  useEffect(() => {
    if (isSuspended) return;

    const handleClick = (e: MouseEvent) => {
      if (stateRef.current === 'HIDDEN') return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('.devbot-layer')) {
        recordVisitorActivity();
        return;
      }

      recordVisitorActivity();
      if (
        interactionsPausedRef.current ||
        hasOpenModal ||
        menuOpen ||
        tourActiveRef.current ||
        !greetingDoneRef.current
      ) {
        return;
      }

      const interactive = target.closest(
        'main button, main a, main article, main [role="tab"], main input, main select'
      );
      if (!interactive) return;

      const now = Date.now();
      if (now - lastClickReactionAtRef.current < CLICK_REACTION_COOLDOWN_MS) return;
      lastClickReactionAtRef.current = now;

      const reactions: DevBotState[] = ['JOYFUL', 'CURIOUS', 'SURPRISED'];
      const chosen = reactions[clickReactionIdxRef.current % reactions.length];
      clickReactionIdxRef.current += 1;

      clearTimer(secondaryStateTimerRef);
      clearTimer(readingTimerRef);
      setIsReading(false);
      setState(chosen);

      secondaryStateTimerRef.current = window.setTimeout(() => {
        secondaryStateTimerRef.current = null;
        if (
          stateRef.current === chosen &&
          !hasOpenModal &&
          !hoveredCardRef.current &&
          !tourActiveRef.current
        ) {
          setState('IDLE');
          setIsReading(true);
        }
      }, 1050);
    };

    const handleKeyActivity = () => {
      if (stateRef.current === 'HIDDEN') return;
      recordVisitorActivity();
    };

    document.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('keydown', handleKeyActivity, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyActivity);
    };
  }, [hasOpenModal, isSuspended, menuOpen, recordVisitorActivity]);

  // Project card hover/focus detection -> fast prioritized reaction, then calm reading stillness
  useEffect(() => {
    if (isSuspended) return;

    const findProjectCard = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest('#proyectos article, #docencia article') as HTMLElement | null;
    };

    const handleCardEnter = (card: HTMLElement) => {
      if (stateRef.current === 'HIDDEN' || hasOpenModal || interactionsPausedRef.current) return;
      clearTimer(cardLeaveTimerRef);

      if (hoveredCardRef.current === card) return;
      hoveredCardRef.current = card;
      pointingTargetRef.current = null;
      greetingDoneRef.current = true;
      clearTimer(greetingTimerRef);
      clearTimer(restTimerRef);
      clearTimer(idleVariationTimerRef);
      clearTimer(walkTimerRef);
      clearTimer(secondaryStateTimerRef);
      isInactiveRef.current = false;

      const cardInfo = resolveCardInfo(card);
      if (cardInfo?.project) {
        setLastExploredProject(cardInfo.project);
      }

      const cardCoords = computeTargetCoordinates(
        card,
        Boolean(cardInfo) || tourActiveRef.current
      );
      // Respond promptly (cancel stale animations, quick 160ms glide -> CURIOUS -> POINTING -> reading calm)
      transitionTo(cardCoords, 'CURIOUS', 'WALKING', 160, 1750);
      if (!animDisabledRef.current) {
        secondaryStateTimerRef.current = window.setTimeout(() => {
          if (hoveredCardRef.current === card && stateRef.current !== 'HIDDEN') {
            setState('POINTING');
          }
        }, 420);
      } else {
        setState('POINTING');
      }

      if (cardInfo) {
        lastBubbleKeyRef.current = '';
        showTimedBubble(
          {
            key: cardInfo.key,
            kicker: cardInfo.kicker,
            text: cardInfo.text,
            project: cardInfo.project,
          },
          6200
        );
      }
    };

    const scheduleCardLeave = () => {
      clearTimer(cardLeaveTimerRef);
      cardLeaveTimerRef.current = window.setTimeout(() => {
        if (!hoveredCardRef.current) return;
        hoveredCardRef.current = null;
        lastBubbleKeyRef.current = '';
        if (
          stateRef.current === 'HIDDEN' ||
          hasOpenModal ||
          interactionsPausedRef.current
        ) {
          return;
        }

        const guide = getSectionGuide(activeSectionRef.current);
        transitionTo(computeSectionCoordinates(guide.id), guide.arrivalState, 'WALKING', 240, 3000);
      }, 180);
    };

    const onMouseOver = (e: MouseEvent) => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;
      const card = findProjectCard(e.target);
      if (card) handleCardEnter(card);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;
      const fromCard = findProjectCard(e.target);
      if (!fromCard) return;
      const toCard = findProjectCard(e.relatedTarget);
      if (toCard === fromCard) return;
      scheduleCardLeave();
    };

    const onFocusIn = (e: FocusEvent) => {
      const card = findProjectCard(e.target);
      if (card) handleCardEnter(card);
    };

    const onFocusOut = (e: FocusEvent) => {
      const fromCard = findProjectCard(e.target);
      if (!fromCard) return;
      const toCard = findProjectCard(e.relatedTarget);
      if (toCard === fromCard) return;
      scheduleCardLeave();
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      clearTimer(cardLeaveTimerRef);
    };
  }, [
    computeSectionCoordinates,
    computeTargetCoordinates,
    hasOpenModal,
    isSuspended,
    showTimedBubble,
    transitionTo,
  ]);

  // Guided Tour step runner
  const goToTourStep = useCallback(
    (stepIdx: number) => {
      const clampedIdx = clamp(stepIdx, 0, SECTION_GUIDES.length - 1);
      const guide = SECTION_GUIDES[clampedIdx];
      const prevIdx = SECTION_GUIDES.findIndex((s) => s.id === activeSectionRef.current);
      const travelMode = Math.abs(clampedIdx - prevIdx) > 1 ? 'RUNNING' : 'WALKING';

      setTourStepIndex(clampedIdx);
      activeSectionRef.current = guide.id;
      setActiveSectionId(guide.id);
      hoveredCardRef.current = null;
      pointingTargetRef.current = null;
      setPreviewPoseId(null);

      onNavigate(guide.id);
      applySectionSpotlight(guide.id);

      clearTimer(actionTimerRef);
      clearRaf(actionRafRef);
      actionTimerRef.current = window.setTimeout(() => {
        actionTimerRef.current = null;
        actionRafRef.current = window.requestAnimationFrame(() => {
          actionRafRef.current = null;
          if (stateRef.current === 'HIDDEN') return;
          const nextCoords = computeSectionCoordinates(guide.id, true);
          transitionTo(nextCoords, guide.arrivalState, travelMode, 320);
        });
      }, 70);

      showTimedBubble(
        {
          key: `tour-${guide.id}-${clampedIdx}-${Date.now()}`,
          kicker: `Recorrido (${clampedIdx + 1}/${SECTION_GUIDES.length}) · ${guide.label}`,
          text: guide.tourSummary,
        },
        0,
        true
      );
    },
    [applySectionSpotlight, computeSectionCoordinates, onNavigate, showTimedBubble, transitionTo]
  );

  const stopTour = useCallback(
    (completed = false) => {
      clearTimer(tourAutoTimerRef);
      clearSectionSpotlight();
      setTourActive(false);
      setTourPaused(false);

      if (completed && stateRef.current !== 'HIDDEN') {
        setState('CELEBRATING');
        showTimedBubble(
          {
            key: `tour-done-${Date.now()}`,
            kicker: 'Recorrido completado',
            text: '¡Has recorrido todo el portfolio! Puedes explorar cualquier proyecto o contactar con Iván.',
          },
          5200,
          true
        );
        secondaryStateTimerRef.current = window.setTimeout(() => {
          if (stateRef.current === 'CELEBRATING' && !hasOpenModal) {
            setState('JOYFUL');
            scheduleRestCheck();
          }
        }, 2600);
      } else {
        dismissBubble();
      }
    },
    [clearSectionSpotlight, dismissBubble, hasOpenModal, scheduleRestCheck, showTimedBubble]
  );

  // Auto-advance timer when guided tour is active and unpaused
  useEffect(() => {
    clearTimer(tourAutoTimerRef);
    if (
      !tourActive ||
      tourPaused ||
      isSuspended ||
      hasOpenModal ||
      menuOpen ||
      isTabHidden
    ) {
      return;
    }

    tourAutoTimerRef.current = window.setTimeout(() => {
      if (tourStepIndex + 1 >= SECTION_GUIDES.length) {
        stopTour(true);
      } else {
        goToTourStep(tourStepIndex + 1);
      }
    }, TOUR_STEP_DURATION_MS);

    return () => clearTimer(tourAutoTimerRef);
  }, [
    goToTourStep,
    hasOpenModal,
    isSuspended,
    isTabHidden,
    menuOpen,
    stopTour,
    tourActive,
    tourPaused,
    tourStepIndex,
  ]);

  const startTour = useCallback(() => {
    greetingDoneRef.current = true;
    clearTimer(greetingTimerRef);
    setMenuOpen(false);
    setTourActive(true);
    setTourPaused(false);
    goToTourStep(0);
  }, [goToTourStep]);

  const pauseTour = useCallback(() => {
    clearTimer(tourAutoTimerRef);
    setTourPaused(true);
  }, []);

  const resumeTour = useCallback(() => {
    setTourPaused(false);
  }, []);

  const nextTourStep = useCallback(() => {
    if (tourStepIndex + 1 >= SECTION_GUIDES.length) {
      stopTour(true);
    } else {
      goToTourStep(tourStepIndex + 1);
    }
  }, [goToTourStep, stopTour, tourStepIndex]);

  const prevTourStep = useCallback(() => {
    goToTourStep(Math.max(0, tourStepIndex - 1));
  }, [goToTourStep, tourStepIndex]);

  // Direct section jump
  const navigateAndGuide = useCallback(
    (sectionId: string) => {
      greetingDoneRef.current = true;
      clearTimer(greetingTimerRef);
      hoveredCardRef.current = null;
      pointingTargetRef.current = null;
      setPreviewPoseId(null);

      if (tourActiveRef.current) {
        clearTimer(tourAutoTimerRef);
        clearSectionSpotlight();
        setTourActive(false);
        setTourPaused(false);
      }

      const prevIdx = SECTION_GUIDES.findIndex((s) => s.id === activeSectionRef.current);
      const nextIdx = SECTION_GUIDES.findIndex((s) => s.id === sectionId);
      const travelMode = Math.abs(nextIdx - prevIdx) > 1 ? 'RUNNING' : 'WALKING';

      activeSectionRef.current = sectionId;
      setActiveSectionId(sectionId);
      onNavigate(sectionId);

      const guide = getSectionGuide(sectionId);
      clearTimer(actionTimerRef);
      clearRaf(actionRafRef);
      actionTimerRef.current = window.setTimeout(() => {
        actionTimerRef.current = null;
        actionRafRef.current = window.requestAnimationFrame(() => {
          actionRafRef.current = null;
          if (stateRef.current === 'HIDDEN') return;
          const nextCoords = computeSectionCoordinates(sectionId);
          transitionTo(nextCoords, guide.arrivalState, travelMode, 320);
        });
      }, 70);

      showTimedBubble(
        {
          key: `nav-${guide.id}-${Date.now()}`,
          kicker: guide.label,
          text: guide.message,
        },
        5200,
        true
      );
    },
    [clearSectionSpotlight, computeSectionCoordinates, onNavigate, showTimedBubble, transitionTo]
  );

  // Highlight a specific UI element inside the section
  const pointAtInteraction = useCallback(
    (selector: string, sectionId: string, label: string) => {
      const target = document.querySelector(selector) as HTMLElement | null;
      if (!target) {
        navigateAndGuide(sectionId);
        return;
      }

      greetingDoneRef.current = true;
      clearTimer(greetingTimerRef);
      hoveredCardRef.current = null;
      pointingTargetRef.current = target;
      setPreviewPoseId(null);

      target.scrollIntoView({
        behavior: animDisabledRef.current ? 'auto' : 'smooth',
        block: 'center',
      });

      document.querySelectorAll('.devbot-target-pulse').forEach((node) => {
        node.classList.remove('devbot-target-pulse');
      });
      target.classList.add('devbot-target-pulse');
      clearTimer(highlightTimerRef);
      highlightTimerRef.current = window.setTimeout(() => {
        target.classList.remove('devbot-target-pulse');
        pointingTargetRef.current = null;
      }, 2100);

      clearTimer(actionTimerRef);
      clearRaf(actionRafRef);
      actionTimerRef.current = window.setTimeout(() => {
        actionTimerRef.current = null;
        actionRafRef.current = window.requestAnimationFrame(() => {
          actionRafRef.current = null;
          if (stateRef.current === 'HIDDEN') return;
          const targetCoords = computeTargetCoordinates(target);
          transitionTo(targetCoords, 'POINTING', 'WALKING', 240);
        });
      }, 90);

      showTimedBubble(
        {
          key: `point-${sectionId}-${label}-${Date.now()}`,
          kicker: 'Indicación',
          text: label,
        },
        4800,
        true
      );
    },
    [computeTargetCoordinates, navigateAndGuide, showTimedBubble, transitionTo]
  );

  const toggleHints = useCallback(() => {
    setHintsEnabled((prev) => {
      const next = !prev;
      if (!next) {
        dismissBubble();
      } else {
        const guide = getSectionGuide(activeSectionRef.current);
        showTimedBubble(
          {
            key: `hints-on-${Date.now()}`,
            kicker: guide.label,
            text: guide.message,
          },
          4200,
          true
        );
      }
      return next;
    });
  }, [dismissBubble, showTimedBubble]);

  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled((prev) => !prev);
  }, []);

  const toggleInteractionsPaused = useCallback(() => {
    setInteractionsPaused((prev) => {
      const next = !prev;
      if (next) {
        clearTimer(walkTimerRef);
        clearTimer(secondaryStateTimerRef);
        clearTimer(readingTimerRef);
        clearTimer(restTimerRef);
        clearTimer(idleVariationTimerRef);
        isInactiveRef.current = false;
        dismissBubble();
        if (stateRef.current !== 'HIDDEN') {
          setIsReading(true);
          setState('IDLE');
        }
      } else {
        setIsReading(false);
        const guide = getSectionGuide(activeSectionRef.current);
        if (stateRef.current !== 'HIDDEN') {
          setState(guide.arrivalState);
          scheduleReadingSettle(3000);
          scheduleRestCheck();
        }
      }
      return next;
    });
  }, [dismissBubble, scheduleReadingSettle, scheduleRestCheck]);

  const toggleMenuOpen = useCallback((updater: boolean | ((prev: boolean) => boolean)) => {
    setMenuOpen((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next) {
        setCoords((c) => (isPlacementClose(c, coordsRef.current) ? c : coordsRef.current));
      }
      return next;
    });
  }, []);

  const hideBot = useCallback(() => {
    clearTimer(walkTimerRef);
    clearTimer(secondaryStateTimerRef);
    clearTimer(readingTimerRef);
    clearTimer(bubbleTimerRef);
    clearTimer(greetingTimerRef);
    clearTimer(restTimerRef);
    clearTimer(idleVariationTimerRef);
    clearTimer(tourAutoTimerRef);
    clearTimer(scrollSettleTimerRef);
    clearTimer(actionTimerRef);
    clearRaf(scrollRafRef);
    clearRaf(actionRafRef);
    clearSectionSpotlight();
    setTourActive(false);
    setTourPaused(false);
    setMenuOpen(false);
    setBubble(null);
    setState('HIDDEN');
  }, [clearSectionSpotlight]);

  const showBot = useCallback(() => {
    preloadDevBotSprites();
    const guide = getSectionGuide(activeSectionRef.current);
    const nextCoords = computeSectionCoordinates(guide.id);
    coordsRef.current = nextCoords;
    setCoords(nextCoords);
    isInactiveRef.current = false;
    setIsReading(false);
    setState('JOYFUL');
    showTimedBubble(
      {
        key: `restore-${Date.now()}`,
        kicker: 'DevBot',
        text: guide.message,
      },
      4500,
      true
    );
    scheduleReadingSettle(3000);
    scheduleRestCheck();
  }, [computeSectionCoordinates, scheduleReadingSettle, scheduleRestCheck, showTimedBubble]);

  const openProjectFromBot = useCallback(
    (project: Project) => {
      setMenuOpen(false);
      onSelectProject(project);
    },
    [onSelectProject]
  );

  // Cleanup all timers, rAFs & spotlight on unmount
  useEffect(() => {
    return () => {
      clearTimer(walkTimerRef);
      clearTimer(secondaryStateTimerRef);
      clearTimer(readingTimerRef);
      clearTimer(bubbleTimerRef);
      clearTimer(cardLeaveTimerRef);
      clearTimer(highlightTimerRef);
      clearTimer(greetingTimerRef);
      clearTimer(restTimerRef);
      clearTimer(idleVariationTimerRef);
      clearTimer(tourAutoTimerRef);
      clearTimer(scrollSettleTimerRef);
      clearTimer(actionTimerRef);
      clearRaf(scrollRafRef);
      clearRaf(actionRafRef);
      clearSectionSpotlight();
    };
  }, [clearSectionSpotlight]);

  const currentGuide = useMemo(() => getSectionGuide(activeSectionId), [activeSectionId]);
  const currentIndex = useMemo(
    () => Math.max(0, SECTION_GUIDES.findIndex((s) => s.id === activeSectionId)),
    [activeSectionId]
  );
  const prevGuide =
    SECTION_GUIDES[(currentIndex - 1 + SECTION_GUIDES.length) % SECTION_GUIDES.length];
  const nextGuide = SECTION_GUIDES[(currentIndex + 1) % SECTION_GUIDES.length];

  const activePoseId: DevBotPoseId = useMemo(() => {
    if (previewPoseId) return previewPoseId;
    if (state === 'HIDDEN') return 'idle';
    if (menuOpen && (state === 'IDLE' || state === 'RESTING')) return 'atencion';
    return STATE_TO_POSE[state];
  }, [menuOpen, previewPoseId, state]);

  const activePose = useMemo(() => getPoseMeta(activePoseId), [activePoseId]);

  return {
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
    setMenuOpen: toggleMenuOpen,
    menuTab,
    setMenuTab,
    previewPoseId,
    setPreviewPoseId,
    activePoseId,
    activePose,
    currentGuide,
    currentIndex,
    totalSections: SECTION_GUIDES.length,
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
  };
}
