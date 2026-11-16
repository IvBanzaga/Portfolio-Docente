export interface RectBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SolvedPlacement {
  x: number;
  y: number;
  size: number;
  compact: boolean;
  temporarilyHidden: boolean;
  facing: 'right' | 'left';
  bubbleDx: number;
  bubbleDy: number;
  bubbleWidth: number;
  menuDx: number;
  menuBelow: boolean;
}

const SAFE_GAP = 12;
const FULL_DESKTOP_SIZE = 64;
const COMPACT_DESKTOP_SIZE = 44;
const FULL_MOBILE_SIZE = 48;
const COMPACT_MOBILE_SIZE = 40;

function clamp(val: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(val, min), max);
}

function intersectArea(a: RectBox, b: RectBox, gap = 0): number {
  const xOverlap = Math.max(
    0,
    Math.min(a.right, b.right + gap) - Math.max(a.left, b.left - gap)
  );
  const yOverlap = Math.max(
    0,
    Math.min(a.bottom, b.bottom + gap) - Math.max(a.top, b.top - gap)
  );
  return xOverlap * yOverlap;
}

function getHeaderBottom(): number {
  if (typeof document === 'undefined') return 72;
  const header = document.querySelector('header');
  if (!header) return 72;
  const rect = header.getBoundingClientRect();
  return rect.height > 0 ? Math.ceil(rect.bottom) : 72;
}

/**
 * Collects bounding boxes of visible cards, headings, paragraphs, list items,
 * images, forms, buttons, and links inside visible `<main > section>` elements
 * (plus sticky scroll-to-top control). Culls offscreen sections first to avoid
 * calling `getBoundingClientRect()` on hidden DOM subtrees.
 */
export function collectViewportObstacles(): RectBox[] {
  if (typeof document === 'undefined' || typeof window === 'undefined') return [];

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const headerBottom = getHeaderBottom();
  const obstacles: RectBox[] = [];

  const sections = document.querySelectorAll('main > section');
  const selector =
    'article, h1, h2, h3, h4, p, li, img, form, [role="tablist"], [role="group"], a, button';

  for (let s = 0; s < sections.length; s++) {
    const section = sections[s];
    const secRect = section.getBoundingClientRect();
    if (secRect.bottom <= headerBottom || secRect.top >= vh) {
      continue;
    }

    const nodes = section.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const rect = node.getBoundingClientRect();
      if (rect.width <= 4 || rect.height <= 4) continue;
      if (rect.bottom <= headerBottom || rect.top >= vh) continue;
      if (rect.right <= 0 || rect.left >= vw) continue;

      if (
        rect.width > vw * 0.92 &&
        rect.height > vh * 0.7 &&
        node.tagName !== 'ARTICLE'
      ) {
        continue;
      }

      obstacles.push({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  }

  const scrollTopBtn = document.querySelector('button[aria-label="Volver arriba"]');
  if (scrollTopBtn) {
    const r = scrollTopBtn.getBoundingClientRect();
    if (r.width > 4 && r.height > 4 && r.bottom > headerBottom && r.top < vh) {
      obstacles.push({
        left: r.left,
        top: r.top,
        right: r.right,
        bottom: r.bottom,
      });
    }
  }

  return obstacles;
}

function totalCollisionScore(
  box: RectBox,
  obstacles: RectBox[],
  gap: number,
  priorityTarget?: RectBox | null,
  cutoff = Number.POSITIVE_INFINITY
): number {
  let score = 0;

  if (priorityTarget) {
    score += intersectArea(box, priorityTarget, gap) * 6;
    if (score >= cutoff) return score;
  }

  for (let i = 0; i < obstacles.length; i++) {
    score += intersectArea(box, obstacles[i], gap);
    if (score >= cutoff) return score;
  }

  return score;
}

/**
 * Estimates true covered fraction (0..1) of `box` across a 5x5 sample grid so
 * nested elements (e.g. `article > p > a`) never double-count the same pixels.
 */
function actualCoverageRatio(box: RectBox, obstacles: RectBox[]): number {
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  if (width <= 0 || height <= 0) return 0;

  const steps = 5;
  let hits = 0;
  const total = steps * steps;

  for (let gx = 0; gx < steps; gx++) {
    const px = box.left + ((gx + 0.5) / steps) * width;
    for (let gy = 0; gy < steps; gy++) {
      const py = box.top + ((gy + 0.5) / steps) * height;
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (px >= obs.left && px <= obs.right && py >= obs.top && py <= obs.bottom) {
          hits++;
          break;
        }
      }
    }
  }

  return hits / total;
}

function solveBubbleOffset(
  botX: number,
  botY: number,
  botSize: number,
  bubbleWidth: number,
  bubbleHeight: number,
  obstacles: RectBox[],
  vw: number,
  vh: number,
  minTop: number,
  priorityTarget?: RectBox | null
): { dx: number; dy: number } {
  const maxVx = vw - bubbleWidth - 10;
  const maxVy = vh - bubbleHeight - 10;

  const candidates: { vx: number; vy: number }[] = [
    // Right of DevBot
    { vx: botX + botSize + 10, vy: botY },
    { vx: botX + botSize + 10, vy: botY + botSize - bubbleHeight },
    // Left of DevBot
    { vx: botX - bubbleWidth - 10, vy: botY },
    { vx: botX - bubbleWidth - 10, vy: botY + botSize - bubbleHeight },
    // Above DevBot (left & right aligned)
    { vx: botX, vy: botY - bubbleHeight - 10 },
    { vx: botX + botSize - bubbleWidth, vy: botY - bubbleHeight - 10 },
    // Below DevBot (left & right aligned)
    { vx: botX, vy: botY + botSize + 10 },
    { vx: botX + botSize - bubbleWidth, vy: botY + botSize + 10 },
  ];

  if (priorityTarget) {
    const targetCenterX = (priorityTarget.left + priorityTarget.right - bubbleWidth) / 2;
    candidates.push(
      { vx: targetCenterX, vy: priorityTarget.top - bubbleHeight - 10 },
      { vx: targetCenterX, vy: priorityTarget.bottom + 10 }
    );
  }

  const botBox: RectBox = {
    left: botX,
    top: botY,
    right: botX + botSize,
    bottom: botY + botSize,
  };

  let bestVx = clamp(botX, 10, maxVx);
  let bestVy = clamp(botY - bubbleHeight - 10, minTop, maxVy);
  let bestScore = Number.POSITIVE_INFINITY;

  for (const cand of candidates) {
    const vx = clamp(cand.vx, 10, maxVx);
    const vy = clamp(cand.vy, minTop, maxVy);

    const bubbleBox: RectBox = {
      left: vx,
      top: vy,
      right: vx + bubbleWidth,
      bottom: vy + bubbleHeight,
    };

    const botSelfOverlap = intersectArea(bubbleBox, botBox, 2) * 14;
    if (botSelfOverlap >= bestScore) continue;
    const distanceTieBreaker = Math.hypot(vx - botX, vy - botY) * 0.05;
    const contentOverlap = totalCollisionScore(
      bubbleBox,
      obstacles,
      6,
      priorityTarget,
      bestScore - botSelfOverlap - distanceTieBreaker
    );
    const score = botSelfOverlap + contentOverlap + distanceTieBreaker;

    if (score < bestScore) {
      bestScore = score;
      bestVx = vx;
      bestVy = vy;
    }
  }

  return {
    dx: Math.round(bestVx - botX),
    dy: Math.round(bestVy - botY),
  };
}

interface PlacementOptions {
  targetEl?: HTMLElement | null;
  sectionEl?: HTMLElement | null;
  hasProjectBubble?: boolean;
}

/**
 * Computes a collision-aware viewport position for DevBot, its speech bubble,
 * and its control menu without covering cards, headings, paragraphs, or links.
 * Priority:
 *  1) Clear position around target (left / right / above / below) at full size
 *  2) Clear viewport margins / corners at full size
 *  3) Reduced compact size (44px desktop / 40px mobile)
 *  4) Transient yield (`temporarilyHidden`) only if >= 42% of DevBot still hits content
 */
export function solveDevBotPlacement({
  targetEl,
  sectionEl,
  hasProjectBubble = false,
}: PlacementOptions): SolvedPlacement {
  if (typeof window === 'undefined') {
    return {
      x: 16,
      y: 180,
      size: FULL_DESKTOP_SIZE,
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

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isDesktop = vw >= 1024;
  const headerBottom = getHeaderBottom();
  const minTop = headerBottom + 10;
  const obstacles = collectViewportObstacles();

  const priorityRect: RectBox | null = targetEl
    ? (() => {
        const r = targetEl.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return null;
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      })()
    : null;

  const fullSize = isDesktop ? FULL_DESKTOP_SIZE : FULL_MOBILE_SIZE;
  const compactSize = isDesktop ? COMPACT_DESKTOP_SIZE : COMPACT_MOBILE_SIZE;

  const bubbleWidth = isDesktop
    ? Math.min(252, Math.max(204, Math.round(vw * 0.22)))
    : Math.min(244, vw - 24);
  const bubbleHeight = hasProjectBubble ? 168 : 108;

  const buildCandidatesForSize = (
    size: number
  ): { x: number; y: number; facing: 'right' | 'left' }[] => {
    const maxX = Math.max(12, vw - size - 12);
    const maxY = Math.max(minTop, vh - size - 14);
    const list: { x: number; y: number; facing: 'right' | 'left' }[] = [];

    if (priorityRect && isDesktop) {
      const alignedY = clamp(priorityRect.top + 10, minTop, maxY);
      const midY = clamp(
        priorityRect.top + (priorityRect.bottom - priorityRect.top) * 0.35,
        minTop,
        maxY
      );
      const centeredX = clamp(
        priorityRect.left + (priorityRect.right - priorityRect.left - size) / 2,
        12,
        maxX
      );

      // 1. Left & right of target element
      list.push({
        x: clamp(priorityRect.left - size - SAFE_GAP, 12, maxX),
        y: alignedY,
        facing: 'right',
      });
      list.push({
        x: clamp(priorityRect.right + SAFE_GAP, 12, maxX),
        y: alignedY,
        facing: 'left',
      });
      // 2. Above & below target element
      list.push({
        x: centeredX,
        y: clamp(priorityRect.top - size - SAFE_GAP, minTop, maxY),
        facing: 'right',
      });
      list.push({
        x: clamp(priorityRect.left + 8, 12, maxX),
        y: clamp(priorityRect.top - size - SAFE_GAP, minTop, maxY),
        facing: 'right',
      });
      list.push({
        x: centeredX,
        y: clamp(priorityRect.bottom + SAFE_GAP, minTop, maxY),
        facing: 'right',
      });
      list.push({
        x: clamp(priorityRect.left + 8, 12, maxX),
        y: clamp(priorityRect.bottom + SAFE_GAP, minTop, maxY),
        facing: 'right',
      });
      // 3. Outer viewport gutters & corners aligned safely away from grid columns
      list.push({ x: 14, y: midY, facing: 'right' });
      list.push({ x: maxX, y: midY, facing: 'left' });
      list.push({ x: 14, y: minTop + 4, facing: 'right' });
      list.push({ x: maxX, y: minTop + 4, facing: 'left' });
      list.push({ x: 14, y: maxY - 4, facing: 'right' });
      list.push({ x: maxX, y: maxY - 4, facing: 'left' });
    } else if (priorityRect) {
      // Mobile / Tablet with target element
      const centeredX = clamp(
        priorityRect.left + (priorityRect.right - priorityRect.left - size) / 2,
        12,
        maxX
      );
      list.push({ x: 14, y: maxY - 2, facing: 'right' });
      list.push({ x: 14, y: minTop + 2, facing: 'right' });
      list.push({
        x: centeredX,
        y: clamp(priorityRect.top - size - 8, minTop, maxY),
        facing: 'right',
      });
      list.push({
        x: centeredX,
        y: clamp(priorityRect.bottom + 8, minTop, maxY),
        facing: 'right',
      });
      list.push({ x: maxX, y: minTop + 2, facing: 'left' });
      list.push({ x: maxX, y: maxY - 2, facing: 'left' });
    } else if (isDesktop) {
      const sectionRect = sectionEl?.getBoundingClientRect();
      const preferredY = sectionRect
        ? clamp(sectionRect.top + 48, minTop, maxY)
        : clamp(160, minTop, maxY);

      const containerLeft = Math.max(0, (vw - 1152) / 2);
      const leftGutterX =
        containerLeft >= size + 24 ? Math.round(containerLeft - size - 14) : 14;
      const rightGutterX =
        containerLeft >= size + 24
          ? Math.round(vw - containerLeft + 14)
          : maxX;

      list.push({ x: leftGutterX, y: preferredY, facing: 'right' });
      list.push({ x: 14, y: maxY - 4, facing: 'right' });
      list.push({ x: rightGutterX, y: preferredY, facing: 'left' });
      list.push({ x: leftGutterX, y: minTop + 4, facing: 'right' });
      list.push({ x: 14, y: minTop + 4, facing: 'right' });
      list.push({ x: maxX, y: minTop + 4, facing: 'left' });
      list.push({ x: maxX, y: maxY - 4, facing: 'left' });
    } else {
      // Mobile / Tablet idle section navigation
      list.push({ x: 14, y: maxY - 2, facing: 'right' });
      list.push({ x: 14, y: minTop + 2, facing: 'right' });
      list.push({ x: maxX, y: minTop + 2, facing: 'left' });
      list.push({ x: maxX, y: maxY - 2, facing: 'left' });
    }

    return list;
  };

  const evaluateCandidates = (size: number) => {
    const candidates = buildCandidatesForSize(size);
    let best = candidates[0];
    let bestScore = Number.POSITIVE_INFINITY;
    let bestCoverage = 1;

    for (const cand of candidates) {
      const box: RectBox = {
        left: cand.x,
        top: cand.y,
        right: cand.x + size,
        bottom: cand.y + size,
      };
      const score = totalCollisionScore(box, obstacles, 8, priorityRect, bestScore);
      if (score < bestScore) {
        bestScore = score;
        best = cand;
        bestCoverage = actualCoverageRatio(box, obstacles);
        if (score === 0) break;
      }
    }

    return { cand: best, score: bestScore, coverage: bestCoverage, size };
  };

  // Phase 1: Full size
  const fullAttempt = evaluateCandidates(fullSize);
  let chosen = fullAttempt;
  let compact = false;

  // Phase 2: Shrink temporarily when tight
  if (fullAttempt.score > 120) {
    const compactAttempt = evaluateCandidates(compactSize);
    if (
      compactAttempt.score < fullAttempt.score ||
      compactAttempt.coverage < fullAttempt.coverage
    ) {
      chosen = compactAttempt;
      compact = true;
    }
  }

  // Phase 3: Temporarily yield only when >= 42% of DevBot still covers real content
  const targetOverlapRatio = priorityRect
    ? intersectArea(
        {
          left: chosen.cand.x,
          top: chosen.cand.y,
          right: chosen.cand.x + chosen.size,
          bottom: chosen.cand.y + chosen.size,
        },
        priorityRect,
        0
      ) /
      (chosen.size * chosen.size)
    : 0;
  const temporarilyHidden = chosen.coverage >= 0.42 || targetOverlapRatio >= 0.35;

  const finalX = Math.round(chosen.cand.x);
  const finalY = Math.round(chosen.cand.y);

  const bubbleOffset = solveBubbleOffset(
    finalX,
    finalY,
    chosen.size,
    bubbleWidth,
    bubbleHeight,
    obstacles,
    vw,
    vh,
    minTop,
    priorityRect
  );

  // Clamp control panel horizontal offset strictly inside the viewport
  const menuWidth = Math.min(368, vw - 24);
  const desiredMenuX = finalX > vw * 0.52 ? finalX + chosen.size - menuWidth : finalX;
  const clampedMenuX = clamp(desiredMenuX, 12, vw - menuWidth - 12);
  const menuDx = Math.round(clampedMenuX - finalX);

  return {
    x: finalX,
    y: finalY,
    size: chosen.size,
    compact,
    temporarilyHidden,
    facing: chosen.cand.facing,
    bubbleDx: bubbleOffset.dx,
    bubbleDy: bubbleOffset.dy,
    bubbleWidth,
    menuDx,
    menuBelow: finalY < vh * 0.55,
  };
}
