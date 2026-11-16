import { Cpu } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { DEVBOT_SECRETS, SecretToken } from './DevBotMessages';

interface SecretPlacement {
  token: SecretToken;
  x: number;
  y: number;
}

interface DevBotSecretsProps {
  foundSecretIds: string[];
  animationsDisabled: boolean;
  onCollect: (token: SecretToken, triggerCoords: { x: number; y: number }) => void;
}

const ACCENT_CLASSES: Record<SecretToken['accent'], string> = {
  cyan: 'border-cyan-400/70 bg-cyan-50/90 text-cyan-700 hover:bg-cyan-100 dark:border-cyan-500/60 dark:bg-cyan-950/85 dark:text-cyan-300',
  orange:
    'border-orange-400/70 bg-orange-50/90 text-orange-700 hover:bg-orange-100 dark:border-orange-500/60 dark:bg-orange-950/85 dark:text-orange-300',
  teal: 'border-teal-400/70 bg-teal-50/90 text-teal-700 hover:bg-teal-100 dark:border-teal-500/60 dark:bg-teal-950/85 dark:text-teal-300',
  indigo:
    'border-indigo-400/70 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/60 dark:bg-indigo-950/85 dark:text-indigo-300',
  amber:
    'border-amber-400/70 bg-amber-50/90 text-amber-700 hover:bg-amber-100 dark:border-amber-500/60 dark:bg-amber-950/85 dark:text-amber-300',
};

function placementsEqual(a: SecretPlacement[], b: SecretPlacement[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].token.id !== b[i].token.id ||
      Math.abs(a[i].x - b[i].x) >= 2 ||
      Math.abs(a[i].y - b[i].y) >= 2
    ) {
      return false;
    }
  }
  return true;
}

export const DevBotSecrets = memo(function DevBotSecrets({
  foundSecretIds,
  animationsDisabled,
  onCollect,
}: DevBotSecretsProps) {
  const [placements, setPlacements] = useState<SecretPlacement[]>([]);
  const rafRef = useRef<number | null>(null);

  const measureSecrets = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const next: SecretPlacement[] = [];
    DEVBOT_SECRETS.forEach((token, idx) => {
      if (foundSecretIds.includes(token.id)) return;
      const section = document.getElementById(token.sectionId);
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const container = (section.querySelector('.max-w-6xl') as HTMLElement | null) || section;
      const containerRect = container.getBoundingClientRect();

      const x = Math.round(
        Math.min(vw - 52, Math.max(16, containerRect.right - 52)) + scrollX
      );
      const yOffset = idx % 2 === 0 ? 12 : 16;
      const y = Math.round(sectionRect.top + scrollY + yOffset);

      next.push({ token, x, y });
    });

    setPlacements((prev) => (placementsEqual(prev, next) ? prev : next));
  }, [foundSecretIds]);

  useEffect(() => {
    const scheduleMeasure = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        measureSecrets();
      });
    };

    measureSecrets();
    const timer = window.setTimeout(measureSecrets, 350);
    window.addEventListener('resize', scheduleMeasure, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleMeasure);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.clearTimeout(timer);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('resize', scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [measureSecrets]);

  if (placements.length === 0) return null;

  return (
    <div
      className="devbot-secrets-layer pointer-events-none absolute inset-x-0 top-0 z-30 no-print"
      aria-label="Elementos secretos coleccionables de DevBot"
    >
      {placements.map(({ token, x, y }) => (
        <button
          key={token.id}
          type="button"
          onClick={(e) => {
            const btnRect = e.currentTarget.getBoundingClientRect();
            onCollect(token, { x: btnRect.left, y: btnRect.top });
          }}
          style={{
            transform: `translate3d(${x}px, ${y}px, 0)`,
          }}
          aria-label={`Descubrir secreto: ${token.title}`}
          title={`Elemento secreto (${token.title}): pulsa para recoger`}
          className={`pointer-events-auto absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm backdrop-blur-xs transition-transform duration-150 hover:scale-110 focus:outline-none ${
            ACCENT_CLASSES[token.accent]
          } ${animationsDisabled ? '' : 'devbot-anim-idle'}`}
        >
          <Cpu className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
});
