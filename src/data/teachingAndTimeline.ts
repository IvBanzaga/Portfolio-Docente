import { BridgeConcept, TeachingPillar, TimelineEntry } from '../types/portfolio';

export const BRIDGE_CONCEPTS: BridgeConcept[] = [
  {
    id: 'active-learning',
    pedagogyTitle: 'Aprendizaje activo y práctica guiada',
    pedagogyDetail:
      'El alumnado consolida mejor un concepto cuando manipula estructuras reales y observa el resultado inmediato sin miedo al error.',
    engineeringTitle: 'Editores en vivo y retroalimentación instantánea',
    engineeringDetail:
      'Construcción de sandboxes en navegador (sin fricción de servidor) que validan etiquetas y muestran renderizado en tiempo real.',
    exampleProjectId: 'aura-formularios',
    exampleProjectName: 'Constructor de Formularios y Plantillas',
  },
  {
    id: 'scaffolding',
    pedagogyTitle: 'Aprender paso a paso',
    pedagogyDetail:
      'Organizar el aprendizaje en etapas progresivas, comenzando por los conceptos básicos y avanzando hacia actividades más complejas. El objetivo es que cada estudiante adquiera conocimientos, practique lo aprendido y gane autonomía para resolver problemas por sí mismo.',
    engineeringTitle: 'Diseño modular y componentes reutilizables',
    engineeringDetail:
      'Desarrollar aplicaciones mediante componentes independientes y reutilizables, organizados para facilitar el mantenimiento, la ampliación y la evolución de cada proyecto. Incorporar herramientas de asistencia basadas en inteligencia artificial cuando aporten valor a la experiencia de uso.',
    exampleProjectId: 'htmlab',
    exampleProjectName: 'Constructor de Plantillas HTML5',
  },
  {
    id: 'curatorial-clarity',
    pedagogyTitle: 'Orientación formativa y claridad curricular',
    pedagogyDetail:
      'Traducir grandes volúmenes de especialidades y módulos oficiales en itinerarios comprensibles para docentes y centros.',
    engineeringTitle: 'Buscadores multicriterio y exportación estructurada',
    engineeringDetail:
      'Filtrado combinado por provincia, familia profesional, modalidad y horas con exportación directa a Excel.',
    exampleProjectId: 'catalogo-sepe',
    exampleProjectName: 'Catálogo de Especialidades Formativas',
  },
  {
    id: 'accessibility-first',
    pedagogyTitle: 'Inclusión y acceso universal al conocimiento',
    pedagogyDetail:
      'Un recurso didáctico solo cumple su función si cualquier persona puede recorrerlo con teclado, lector o móvil.',
    engineeringTitle: 'HTML5 semántico, contraste AA y diseño responsive',
    engineeringDetail:
      'Uso riguroso de landmarks (header, nav, main, footer), primitivos Radix UI y plantillas Astro optimizadas para SEO y accesibilidad.',
    exampleProjectId: 'theme-astro',
    exampleProjectName: 'Theme Astro',
  },
];

export const TEACHING_PILLARS: TeachingPillar[] = [
  {
    id: 'pillar-ia',
    title: 'Inteligencia artificial aplicada a la enseñanza',
    category: 'IA en enseñanza',
    description:
      'Integración de asistentes tutores con IA junto a constructores visuales para ofrecer apoyo personalizado mientras el alumnado programa.',
    appliedIn: 'Constructor de Plantillas HTML5',
    projectId: 'htmlab',
    statusNote: 'Prototipo educativo publicado; alcance detallado del tutor en documentación continua.',
  },
  {
    id: 'pillar-recursos',
    title: 'Recursos educativos digitales y plantillas base',
    category: 'Recursos digitales',
    description:
      'Creación de plantillas HTML5/CSS3 interactivas y bibliotecas visuales para Moodle (avisos, tarjetas de actividad y guías) listas para reutilizar en clase.',
    appliedIn: 'Construye una plantilla · Moodle Design Library',
    projectId: 'construye-plantilla',
    demoUrl: 'https://aura.creamiproyecto.com/template.html',
    statusNote: 'Publicado en línea con mapa interactivo de zonas semánticas y bloques listos para aulas virtuales.',
  },
  {
    id: 'pillar-practicas',
    title: 'Actividades prácticas y verificación de aprendizaje',
    category: 'Práctica y evaluación',
    description:
      'Retos guiados de comprobación de etiquetas, formularios accesibles y validación básica orientados a evaluación formativa.',
    appliedIn: 'Constructor de Formularios y Plantillas · Moodle Design Library',
    projectId: 'aura-formularios',
    demoUrl: 'https://aura.creamiproyecto.com/',
    statusNote: 'Integrado en entornos prácticos con zona de alumnos y comprobación inmediata.',
  },
  {
    id: 'pillar-programaciones',
    title: 'Programaciones didácticas y organización curricular',
    category: 'Programaciones',
    description:
      'Estructuración de acciones formativas, módulos, objetivos de aprendizaje y secuenciación de competencias digitales.',
    appliedIn: 'Catálogo de Especialidades Formativas (SEPE)',
    projectId: 'catalogo-sepe',
    statusNote:
      'Espacio preparado para enlazar programaciones didácticas y fichas formativas en PDF verificadas.',
  },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'tl-portfolio-base',
    period: 'Etapa inicial documentada',
    title: 'Consolidación de base Full-Stack PHP, MySQL y Astro',
    kind: 'verified',
    scope: 'Desarrollo Web',
    description:
      'Desarrollo de sistemas completos de reservas, gestión vecinal, comunidad astronómica y plantilla reutilizable publicada en el primer portfolio (ivandevs.netlify.app).',
    highlights: [
      'Gestión de Reservas para Refugio y Comunidad de Vecinos (PHP/MySQL)',
      'Urban Manager con mapas Leaflet, Google OAuth y Capacitor',
      'Theme Astro publicado en GitHub con Astro 5 y Tailwind CSS 4',
    ],
    relatedProjectIds: ['urban-manager', 'reservas-refugio', 'comunidad-vecinos', 'theme-astro'],
  },
  {
    id: 'tl-fullstack-2026',
    period: '2026 · Evolución Full-Stack & Producto',
    title: 'Aplicaciones Next.js, TypeScript, Laravel, Angular y EdTech',
    kind: 'verified',
    scope: 'Desarrollo Web',
    description:
      'Ampliación hacia aplicaciones multiusuario con Prisma/MariaDB, e-commerce con PostgreSQL y Stripe, Laravel/Filament, Angular 20 y utilidades de productividad PWA.',
    highlights: [
      'React Email Studio (PWA) e InnovaPyme Canarias (Neon)',
      'Tienda Online de Libros (Next.js 16 + PostgreSQL + Stripe) y Control de Gastos (Prisma + MariaDB)',
      'Representante Deportivo (Laravel + Filament + Livewire) y Agrimensor (Figma -> React 18)',
    ],
    relatedProjectIds: ['react-email-studio', 'libroshop', 'control-gastos', 'agencia-pro', 'innovapyme-canarias'],
  },
  {
    id: 'tl-docencia-2026',
    period: 'Hasta Noviembre 2026 · Docencia y Herramientas Formativas',
    title: 'Creación de plataformas educativas interactivas y consulta formativa',
    kind: 'verified',
    scope: 'Docencia y EdTech',
    description:
      'Diseño y publicación de aplicaciones orientadas específicamente al aprendizaje de desarrollo web y al análisis de la oferta de formación profesional.',
    highlights: [
      'Constructor de Plantillas HTML5 con vista previa y chatbot tutor IA',
      'Constructor de Formularios y Construye una plantilla: laboratorios y base multipágina HTML5/CSS3 para alumnado',
      'Moodle Design Library: biblioteca visual de bloques y avisos HTML exportables para Moodle',
      'Catálogo de Especialidades Formativas SEPE con exportación Excel',
    ],
    relatedProjectIds: ['htmlab', 'aura-formularios', 'construye-plantilla', 'moodle-design', 'catalogo-sepe'],
  },
  {
    id: 'tl-formacion-pendiente',
    period: 'Bloque preparado para completar',
    title: 'Formación académica, certificaciones y experiencia docente reglada',
    kind: 'pending-slot',
    scope: 'Formación / Certificaciones',
    description:
      'Siguiendo el criterio de veracidad del proyecto, no se incluyen titulaciones, centros ni certificaciones sin documentación aportada. Este bloque admite incorporación directa de tu trayectoria académica oficial.',
    highlights: [
      'Titulaciones académicas oficiales y especialidad (por aportar)',
      'Certificaciones de docencia de la formación profesional / tecnológicas (por aportar)',
      'Programas formativos impartidos, centros y horas acreditadas (por aportar)',
    ],
  },
];

export const RESEARCH_LAB_IDEAS = [
  {
    id: 'lab-n8n-docencia',
    title: 'Orquestación n8n para seguimiento formativo',
    stage: 'Flujos de automatización',
    summary:
      'Workflows en n8n que conectan formularios de evaluación, avisos automáticos, sincronización con bases de datos y resúmenes generados con IA.',
    connection: 'Automatización n8n + EdTech',
  },
  {
    id: 'lab-ia-tutor',
    title: 'Evaluación contextual de accesibilidad con IA',
    stage: 'En investigación',
    summary:
      'Extender la experiencia del Constructor de Plantillas HTML5 para analizar automáticamente jerarquía de encabezados, contraste y etiquetas de formulario mientras el alumnado practica.',
    connection: 'EdTech · Accesibilidad IA',
  },
  {
    id: 'lab-sepe-itinerarios',
    title: 'Asistente visual de itinerarios formativos',
    stage: 'Prototipo conceptual',
    summary:
      'Cruzar módulos del catálogo SEPE con competencias tecnológicas reales para ayudar a orientadores y alumnado a trazar rutas de aprendizaje.',
    connection: 'Conecta Catálogo SEPE',
  },
];
