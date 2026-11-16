import devbotAtencion from '../../assets/devbot/devbot-atencion.png';
import devbotCelebracion from '../../assets/devbot/devbot-celebracion.png';
import devbotIdle from '../../assets/devbot/devbot-idle.png';
import devbotMovimiento from '../../assets/devbot/devbot-movimiento.png';
import devbotPensativo from '../../assets/devbot/devbot-pensativo.png';
import devbotSaludo from '../../assets/devbot/devbot-saludo.png';
import devbotSenalar from '../../assets/devbot/devbot-senalar.png';

export type DevBotState =
  | 'IDLE'
  | 'RESTING'
  | 'GREETING'
  | 'WALKING'
  | 'RUNNING'
  | 'JUMPING'
  | 'POINTING'
  | 'EXPLAINING'
  | 'THINKING'
  | 'CURIOUS'
  | 'SURPRISED'
  | 'JOYFUL'
  | 'CELEBRATING'
  | 'HIDDEN';

export type DevBotPoseId =
  | 'idle'
  | 'saludo'
  | 'senalar'
  | 'pensativo'
  | 'celebracion'
  | 'atencion'
  | 'movimiento';

export interface DevBotPoseMeta {
  id: DevBotPoseId;
  label: string;
  description: string;
  src: string;
  publicHref: string;
}

export const DEVBOT_POSES: DevBotPoseMeta[] = [
  {
    id: 'idle',
    label: 'Idle / Descanso',
    description: 'Posición de reposo amigable con flotación suave.',
    src: devbotIdle,
    publicHref: '/devbot/devbot-idle.png',
  },
  {
    id: 'saludo',
    label: 'Saludo',
    description: 'Levantando un brazo para dar la bienvenida al visitante.',
    src: devbotSaludo,
    publicHref: '/devbot/devbot-saludo.png',
  },
  {
    id: 'senalar',
    label: 'Señalar',
    description: 'Extendiendo un brazo hacia el proyecto o sección activa.',
    src: devbotSenalar,
    publicHref: '/devbot/devbot-senalar.png',
  },
  {
    id: 'pensativo',
    label: 'Pensativo / Curioso',
    description: 'Analizando código, tecnologías y flujos de trabajo.',
    src: devbotPensativo,
    publicHref: '/devbot/devbot-pensativo.png',
  },
  {
    id: 'celebracion',
    label: 'Alegría / Celebración',
    description: 'Expresión alegre al abrir un proyecto o encontrar un secreto.',
    src: devbotCelebracion,
    publicHref: '/devbot/devbot-celebracion.png',
  },
  {
    id: 'atencion',
    label: 'Atención / Sorpresa',
    description: 'Ojos luminosos atentos al visitante y a cada descubrimiento.',
    src: devbotAtencion,
    publicHref: '/devbot/devbot-atencion.png',
  },
  {
    id: 'movimiento',
    label: 'Movimiento / Salto',
    description: 'Desplazándose, corriendo o saltando entre secciones.',
    src: devbotMovimiento,
    publicHref: '/devbot/devbot-movimiento.png',
  },
];

export const STATE_TO_POSE: Record<Exclude<DevBotState, 'HIDDEN'>, DevBotPoseId> = {
  IDLE: 'idle',
  RESTING: 'idle',
  GREETING: 'saludo',
  WALKING: 'movimiento',
  RUNNING: 'movimiento',
  JUMPING: 'movimiento',
  POINTING: 'senalar',
  EXPLAINING: 'atencion',
  THINKING: 'pensativo',
  CURIOUS: 'pensativo',
  SURPRISED: 'atencion',
  JOYFUL: 'celebracion',
  CELEBRATING: 'celebracion',
};

export const STATE_LABELS: Record<Exclude<DevBotState, 'HIDDEN'>, string> = {
  IDLE: 'En reposo',
  RESTING: 'Descansando',
  GREETING: 'Saludando',
  WALKING: 'Caminando',
  RUNNING: 'Corriendo',
  JUMPING: 'Saltando',
  POINTING: 'Señalando',
  EXPLAINING: 'Explicando',
  THINKING: 'Pensando',
  CURIOUS: 'Curiosidad',
  SURPRISED: '¡Sorpresa!',
  JOYFUL: 'Alegre',
  CELEBRATING: '¡Celebrando!',
};

export function getPoseMeta(poseId: DevBotPoseId): DevBotPoseMeta {
  return DEVBOT_POSES.find((p) => p.id === poseId) || DEVBOT_POSES[0];
}

const preloadedSprites = new Map<string, HTMLImageElement>();

/**
 * Preloads and decodes all DevBot pose sprites once so pose switches
 * never stall waiting for network fetch or PNG decoding.
 */
export function preloadDevBotSprites(): void {
  if (typeof window === 'undefined' || typeof Image === 'undefined') return;

  const startLoad = () => {
    for (const pose of DEVBOT_POSES) {
      if (preloadedSprites.has(pose.src)) continue;
      const img = new Image();
      img.decoding = 'async';
      img.src = pose.src;
      preloadedSprites.set(pose.src, img);
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {
          // Ignore decode rejections for off-screen preloads
        });
      }
    }
  };

  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(startLoad, { timeout: 600 });
  } else {
    window.setTimeout(startLoad, 80);
  }
}
