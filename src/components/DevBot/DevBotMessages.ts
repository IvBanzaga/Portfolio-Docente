import { PROJECTS } from '../../data/projects';
import { Project } from '../../types/portfolio';
import { DevBotState } from './DevBotSprites';

export interface SectionInteraction {
  label: string;
  selector: string;
}

export interface SectionGuide {
  id: string;
  label: string;
  arrivalState: Exclude<
    DevBotState,
    'HIDDEN' | 'WALKING' | 'RUNNING' | 'JUMPING' | 'GREETING' | 'CELEBRATING'
  >;
  message: string;
  altMessages: string[];
  tourSummary: string;
  interactions: SectionInteraction[];
}

export interface SecretToken {
  id: string;
  sectionId: string;
  title: string;
  clue: string;
  reaction: string;
  accent: 'cyan' | 'orange' | 'indigo' | 'teal' | 'amber';
}

export const INITIAL_GREETING_MESSAGE =
  '¡Hola! Soy DevBot. Te acompañaré a descubrir este portfolio.';

export const RETURN_GREETING_MESSAGES: string[] = [
  '¡Hola de nuevo! Seguimos explorando cuando quieras.',
  '¡Qué bien verte de vuelta! Aquí sigo por si necesitas guía.',
];

export const SECTION_GUIDES: SectionGuide[] = [
  {
    id: 'inicio',
    label: 'Presentación',
    arrivalState: 'EXPLAINING',
    message: '¡Bienvenido! Aquí puedes conocer a Iván y su enfoque dual.',
    altMessages: [
      'En esta cabecera puedes cambiar entre Síntesis, Desarrollo Web y Docencia.',
      'Pulsa Ctrl+K en cualquier momento para abrir el buscador rápido.',
    ],
    tourSummary:
      'Presentación de Iván Bazaga: ingeniería web full-stack, automatización n8n y docencia tecnológica.',
    interactions: [
      {
        label: 'Alternar Síntesis / Desarrollo / Docencia',
        selector: '#inicio [role="tablist"]',
      },
      {
        label: 'Abrir buscador rápido (Ctrl+K)',
        selector: '#inicio button[title="Abrir buscador rápido"]',
      },
      {
        label: 'Ver indicadores principales',
        selector: '#inicio .grid.grid-cols-2',
      },
    ],
  },
  {
    id: 'docencia',
    label: 'Docencia y EdTech',
    arrivalState: 'POINTING',
    message: 'Descubre plataformas educativas reales e IA aplicada a la enseñanza.',
    altMessages: [
      'Aquí tienes recursos digitales activos con zona práctica para alumnado.',
      'Pasa sobre cualquier tarjeta docente para ver su stack y acceso directo.',
    ],
    tourSummary:
      'Plataformas educativas creadas para que el alumnado aprenda HTML5, formularios e IA en vivo.',
    interactions: [
      {
        label: 'Explorar plataformas educativas',
        selector: '#docencia article',
      },
      {
        label: 'Filtrar áreas docentes',
        selector: '#docencia [role="group"]',
      },
      {
        label: 'Ir a demos didácticas del Lab',
        selector: '#docencia button',
      },
    ],
  },
  {
    id: 'proyectos',
    label: 'Proyectos',
    arrivalState: 'CURIOUS',
    message: `Explora sus ${PROJECTS.length} proyectos y descubre las tecnologías utilizadas.`,
    altMessages: [
      'Puedes filtrar el catálogo por Desarrollo Web, Docencia o buscar por tecnología.',
      'Haz clic en una tarjeta para abrir su ficha técnica y enlaces verificados.',
    ],
    tourSummary: `Catálogo completo de ${PROJECTS.length} proyectos verificados con filtros por ámbito, categoría y tecnología.`,
    interactions: [
      {
        label: 'Abrir proyecto destacado',
        selector: '#proyectos article',
      },
      {
        label: 'Filtrar por Desarrollo Web o Docencia',
        selector: '#proyectos [role="group"]',
      },
      {
        label: 'Buscar en el catálogo completo',
        selector: '#proyectos input',
      },
    ],
  },
  {
    id: 'laboratorio',
    label: 'Laboratorio',
    arrivalState: 'THINKING',
    message: 'Prueba en vivo el constructor HTML5, React Email, CSV y flujos n8n.',
    altMessages: [
      'Cambia de pestaña para probar cualquiera de las cuatro utilidades interactivas.',
    ],
    tourSummary:
      'Cuatro micro-aplicaciones funcionales ejecutándose en tu navegador para probar código y automatización.',
    interactions: [
      {
        label: 'Cambiar entre las 4 demos interactivas',
        selector: '#laboratorio [role="tablist"]',
      },
      {
        label: 'Probar el área de trabajo en vivo',
        selector: '#laboratorio .rounded-2xl',
      },
    ],
  },
  {
    id: 'competencias',
    label: 'Tecnologías',
    arrivalState: 'THINKING',
    message: 'Aquí encontrarás las herramientas y tecnologías con las que trabaja.',
    altMessages: [
      'Selecciona cualquier tecnología para ver en qué proyectos reales se aplica.',
    ],
    tourSummary:
      'Mapa de competencias técnicas y docentes conectado directamente a los proyectos reales.',
    interactions: [
      {
        label: 'Explorar categorías de stack',
        selector: '#competencias [role="tablist"]',
      },
      {
        label: 'Ver proyectos donde aplica cada stack',
        selector: '#competencias .space-y-2\\.5 button',
      },
    ],
  },
  {
    id: 'trayectoria',
    label: 'Experiencia',
    arrivalState: 'EXPLAINING',
    message: 'Descubre su trayectoria profesional y evolución por etapas.',
    altMessages: [
      'Cada hito conecta etapas de desarrollo web, automatización y docencia.',
    ],
    tourSummary:
      'Recorrido cronológico con hitos verificados en desarrollo web, docencia y proyectos publicados.',
    interactions: [
      {
        label: 'Filtrar hitos documentados',
        selector: '#trayectoria [role="group"]',
      },
      {
        label: 'Ver proyectos en la línea temporal',
        selector: '#trayectoria .relative.pl-12',
      },
    ],
  },
  {
    id: 'sobre-mi',
    label: 'Sobre mí',
    arrivalState: 'EXPLAINING',
    message: 'Descubre cómo la pedagogía y la ingeniería se refuerzan mutuamente.',
    altMessages: [
      'Explora el puente Pedagogía e Ingeniería para ver cada principio en código real.',
    ],
    tourSummary:
      'Filosofía de trabajo que conecta el diseño instruccional con la arquitectura modular de software.',
    interactions: [
      {
        label: 'Explorar puente Pedagogía ↔ Ingeniería',
        selector: '#sobre-mi .grid.grid-cols-1.gap-2 button',
      },
      {
        label: 'Abrir ficha del proyecto aplicado',
        selector: '#sobre-mi .border-t button',
      },
    ],
  },
  {
    id: 'contacto',
    label: 'Contacto',
    arrivalState: 'JOYFUL',
    message: '¿Tienes una propuesta o proyecto? Puedes contactar con Iván desde aquí.',
    altMessages: [
      'Puedes enviar un mensaje directo o copiar el correo profesional con un clic.',
    ],
    tourSummary:
      'Formulario directo con verificación antispam y acceso a GitHub, LinkedIn y correo profesional.',
    interactions: [
      {
        label: 'Escribir mensaje directo en el formulario',
        selector: '#contacto form',
      },
      {
        label: 'Copiar dirección de correo',
        selector: '#contacto button',
      },
    ],
  },
];

export const DEVBOT_SECRETS: SecretToken[] = [
  {
    id: 'chip-sintesis',
    sectionId: 'inicio',
    title: 'Núcleo Dual',
    clue: 'Busca un micro-chip cian en la parte superior derecha de la Presentación.',
    reaction: '¡Sorpresa! Has encontrado el Núcleo Dual que une desarrollo y docencia.',
    accent: 'cyan',
  },
  {
    id: 'chip-html5',
    sectionId: 'docencia',
    title: 'Etiqueta Semántica',
    clue: 'Hay una insignia naranja escondida en el área de Docencia y EdTech.',
    reaction: '¡Genial! Has descubierto la Etiqueta Semántica del aula digital.',
    accent: 'orange',
  },
  {
    id: 'chip-n8n',
    sectionId: 'laboratorio',
    title: 'Nodo Webhook',
    clue: 'Explora la esquina del Laboratorio en vivo para localizar un nodo.',
    reaction: '¡Bip-bop! Nodo Webhook capturado en el Laboratorio.',
    accent: 'teal',
  },
  {
    id: 'chip-stack',
    sectionId: 'competencias',
    title: 'Módulo Full-Stack',
    clue: 'Revisa los márgenes de la sección de Tecnologías.',
    reaction: '¡Increíble ojo! Módulo Full-Stack desbloqueado.',
    accent: 'indigo',
  },
  {
    id: 'chip-estrella',
    sectionId: 'trayectoria',
    title: 'Hito Estelar',
    clue: 'Un último destello espera junto a la sección de Trayectoria.',
    reaction: '¡Espectacular! Has encontrado el Hito Estelar de la trayectoria.',
    accent: 'amber',
  },
];

export function getSectionGuide(sectionId: string): SectionGuide {
  return SECTION_GUIDES.find((s) => s.id === sectionId) || SECTION_GUIDES[0];
}

export function getSectionMessageVariant(sectionId: string, visitIndex: number): string {
  const guide = getSectionGuide(sectionId);
  const pool = [guide.message, ...guide.altMessages];
  return pool[visitIndex % pool.length];
}

export function findProjectForCard(card: HTMLElement): Project | null {
  const heading = card.querySelector('h3, h4, h2');
  const titleText = heading?.textContent?.trim().toLowerCase();
  if (!titleText) return null;

  return (
    PROJECTS.find((p) => p.title.toLowerCase() === titleText) ||
    PROJECTS.find((p) => titleText.includes(p.title.toLowerCase())) ||
    null
  );
}
