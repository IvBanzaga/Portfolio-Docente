import { SkillGroup } from '../types/portfolio';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend y Arquitectura UI',
    area: 'tech',
    summary: 'Interfaces accesibles, reactivas y responsive con código tipado y sistemas de diseño.',
    items: [
      {
        name: 'React & Next.js',
        context: 'SPAs, e-commerce, paneles multiusuario y consumo de APIs',
        projectIds: ['libroshop', 'control-gastos', 'agrimensor-landing', 'astrotenerife-apod', 'react-email-studio'],
      },
      {
        name: 'TypeScript & JavaScript',
        context: 'Tipado estricto en modelos de datos y lógica cliente',
        projectIds: ['libroshop', 'control-gastos', 'urban-manager', 'react-email-studio'],
      },
      {
        name: 'HTML5 Semántico & CSS3',
        context: 'Maquetación accesible, formularios y laboratorios docentes',
        projectIds: ['htmlab', 'aura-formularios', 'reservas-refugio', 'comunidad-vecinos'],
      },
      {
        name: 'Tailwind CSS & Bootstrap',
        context: 'Sistemas visuales ágiles y diseño adaptable',
        projectIds: ['urban-manager', 'agrimensor-landing', 'theme-astro', 'control-gastos', 'angular-springboot'],
      },
      {
        name: 'Astro 5 & Angular 20',
        context: 'Sitios de alto rendimiento y aplicaciones modulares CRUD',
        projectIds: ['theme-astro', 'angular-springboot'],
      },
    ],
  },
  {
    id: 'automation',
    title: 'Automatización y Workflows n8n',
    area: 'tech',
    summary: 'Orquestación visual de procesos, conexión entre APIs, webhooks y automatizaciones con IA.',
    items: [
      {
        name: 'Workflows y orquestación en n8n',
        context: 'Creación de flujos automatizados nodo a nodo, triggers por webhook o programación, transformación JSON y manejo de errores',
        projectIds: [],
      },
      {
        name: 'Integración de APIs REST y servicios externos',
        context: 'Conexión de webhooks, formularios, bases de datos, notificaciones y envío automático de datos entre plataformas',
        projectIds: ['astrotenerife-apod', 'urban-manager', 'innovapyme-canarias'],
      },
      {
        name: 'Automatizaciones asistidas por IA',
        context: 'Encadenamiento de nodos de IA para clasificación, resúmenes, soporte educativo y enriquecimiento de contenidos',
        projectIds: ['htmlab'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend y Lógica de Servidor',
    area: 'tech',
    summary: 'Autenticación, roles, paneles privados y reglas de negocio del lado del servidor.',
    items: [
      {
        name: 'PHP & Laravel',
        context: 'Sistemas CRUD, reservas, comunidades y paneles Filament/Livewire',
        projectIds: ['urban-manager', 'agencia-pro', 'reservas-refugio', 'comunidad-vecinos', 'custodia-compartida', 'astrotenerife'],
      },
      {
        name: 'Node.js & Server Logic',
        context: 'Entornos JS modernos, tooling y backend Next.js',
        projectIds: ['urban-manager', 'control-gastos', 'libroshop'],
      },
    ],
  },
  {
    id: 'databases',
    title: 'Bases de Datos y Persistencia',
    area: 'tech',
    summary: 'Modelado relacional, consultas filtradas y sincronización con servicios en la nube.',
    items: [
      {
        name: 'MySQL & MariaDB',
        context: 'Gestión de usuarios, reservas, movimientos y comunidades',
        projectIds: ['urban-manager', 'reservas-refugio', 'comunidad-vecinos', 'control-gastos', 'custodia-compartida', 'astrotenerife'],
      },
      {
        name: 'PostgreSQL, Prisma, Supabase & Neon',
        context: 'ORMs tipados y bases de datos gestionadas en producción',
        projectIds: ['libroshop', 'control-gastos', 'urban-manager', 'innovapyme-canarias'],
      },
    ],
  },
  {
    id: 'integrations',
    title: 'APIs, Pagos y Mapas',
    area: 'tech',
    summary: 'Conexión con servicios externos reales, geolocalización y pasarelas transaccionales.',
    items: [
      {
        name: 'Google OAuth & Stripe',
        context: 'Autenticación delegada y checkout seguro de comercio electrónico',
        projectIds: ['urban-manager', 'libroshop'],
      },
      {
        name: 'Leaflet, OpenStreetMap & Nominatim',
        context: 'Mapas interactivos y geocodificación de incidencias',
        projectIds: ['urban-manager', 'custodia-compartida', 'astrotenerife'],
      },
      {
        name: 'APIs REST & PWA / Service Worker',
        context: 'Consumo de APIs públicas (NASA APOD) y capacidades offline',
        projectIds: ['astrotenerife-apod', 'react-email-studio'],
      },
    ],
  },
  {
    id: 'devops',
    title: 'Herramientas, Diseño y Despliegue',
    area: 'tech',
    summary: 'Flujo profesional desde prototipado en Figma hasta publicación en producción.',
    items: [
      {
        name: 'Git, GitHub & Docker',
        context: 'Control de versiones, repositorios documentados y contenedores',
        projectIds: ['urban-manager', 'theme-astro', 'custodia-compartida', 'astrotenerife'],
      },
      {
        name: 'Vercel, Netlify, Apache & Capacitor',
        context: 'Despliegue continuo web y empaquetado híbrido Android',
        projectIds: ['urban-manager', 'theme-astro', 'react-email-studio', 'innovapyme-canarias', 'htmlab'],
      },
      {
        name: 'Figma & Radix UI',
        context: 'Traducción fiel de mockups a componentes accesibles',
        projectIds: ['agrimensor-landing'],
      },
    ],
  },
  {
    id: 'teaching',
    title: 'Docencia, Diseño Instruccional e IA',
    area: 'teaching',
    summary: 'Planificación formativa, creación de laboratorios interactivos y uso didáctico de IA.',
    items: [
      {
        name: 'Diseño de recursos y laboratorios web',
        context: 'Entornos interactivos donde el alumnado construye y valida código en vivo',
        projectIds: ['htmlab', 'aura-formularios'],
      },
      {
        name: 'Competencias digitales y consulta formativa',
        context: 'Análisis de catálogos de especialidades, módulos y centros SEPE',
        projectIds: ['catalogo-sepe'],
      },
      {
        name: 'IA aplicada a la enseñanza',
        context: 'Integración de asistentes tutores para acompañar el aprendizaje práctico',
        projectIds: ['htmlab'],
      },
    ],
  },
];
