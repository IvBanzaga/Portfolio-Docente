import { Project } from '../types/portfolio';

export const PROJECTS: Project[] = [
  {
    id: 'react-email-studio',
    title: 'React Email Studio',
    subtitle: 'Editor visual de correos con sincronización TSX/HTML y modo PWA',
    category: 'Herramientas profesionales y productividad',
    domain: 'dual',
    status: 'Publicado',
    featured: true,
    visualKind: 'email-studio',
    accentColor: 'indigo',
    galleryCaptions: [
      'Lienzo visual por bloques con edición de texto enriquecido',
      'Simulación en vivo de variables dinámicas como {{nombre}} y {{empresa}}',
      'Exportación a TSX de React Email y HTML compatible con Outlook y Gmail',
    ],
    shortDescription:
      'Editor visual para diseñar plantillas de email profesional y generar código React Email (TSX) o HTML compatible con clientes de correo.',
    problemSolved:
      'Eliminar la fricción de maquetar tablas HTML compatibles con Outlook y Gmail manualmente, unificando diseño visual y código tipado.',
    objective:
      'Permitir construir, probar con variables dinámicas y exportar plantillas reutilizables incluso sin conexión mediante PWA.',
    features: [
      'Edición visual por bloques y texto enriquecido',
      'Sincronización bidireccional del diseño con componentes React Email',
      'Variables dinámicas ({{nombre}}, {{empresa}}) con simulador de destinatarios',
      'Importación de HTML externo y exportación a HTML y TSX',
      'Compatibilidad orientada a Outlook, Gmail y dispositivos móviles',
      'Instalable como PWA con trabajo offline y guardado local',
    ],
    technologies: ['React Email', 'TSX', 'HTML5', 'PWA', 'Service Worker'],
    architectureNotes: [
      'Soporte offline mediante Service Worker y almacenamiento local de plantillas.',
      'Generación de salida dual: código React Email modular y HTML en línea para clientes legacy.',
    ],
    challengesAndLearnings: [
      'Sincronizar un árbol visual editable con código TSX limpio y previsualización fiable.',
    ],
    demoUrl: 'https://template-email-omega.vercel.app/',
    verificationNote:
      'Framework principal y librerías auxiliares pendientes de confirmar desde el repositorio.',
    dateLabel: 'Productividad · PWA',
  },
  {
    id: 'urban-manager',
    title: 'Urban Manager',
    subtitle: 'Gestión ciudadana de incidencias urbanas con geolocalización',
    category: 'Aplicaciones de gestión',
    domain: 'web',
    status: 'Publicado',
    featured: true,
    visualKind: 'map-incidents',
    accentColor: 'blue',
    galleryCaptions: [
      'Mapa interactivo de incidencias con Leaflet y OpenStreetMap',
      'Panel de administración con filtros, ordenación y estados',
      'Flujo de alta de reporte con fotografía y geolocalización Nominatim',
    ],
    shortDescription:
      'Plataforma para que la ciudadanía comunique problemas urbanos (residuos, alumbrado, calzadas) y los equipos municipales gestionen su resolución.',
    problemSolved:
      'Centralizar los avisos ciudadanos dispersos en un canal único con ubicación exacta en mapa y trazabilidad de estado en tiempo real.',
    objective:
      'Facilitar el reporte ciudadano desde cualquier dispositivo y dotar a la administración de un panel operativo con control de estados y estadísticas.',
    features: [
      'Inicio de sesión mediante Google OAuth',
      'Creación de incidencias con carga de fotografías',
      'Geolocalización y posicionamiento sobre mapa interactivo',
      'Consulta y edición de reportes en estado pendiente',
      'Panel administrativo con filtros, ordenación y estadísticas',
      'Flujo de estados: pendiente, en proceso y resuelto',
      'Actualización automática del panel y empaquetado Android con Capacitor',
    ],
    technologies: [
      'PHP 8.x',
      'JavaScript',
      'Tailwind CSS',
      'MySQL',
      'Supabase',
      'Google OAuth',
      'Leaflet',
      'OpenStreetMap',
      'Nominatim',
      'Node.js',
      'Apache',
      'Git',
      'Capacitor',
      'Docker',
    ],
    architectureNotes: [
      'Separación de flujo ciudadano y panel de administración por roles.',
      'Integración de geocodificación inversa con Nominatim sobre cartografía OpenStreetMap.',
      'Configuración documentada para ejecución con Docker y compilación híbrida móvil vía Capacitor.',
    ],
    challengesAndLearnings: [
      'Sincronización entre ubicación en mapa, carga de archivos gráficos y actualización de estados.',
      'Documentación pública completa del despliegue y arquitectura multiplataforma.',
    ],
    demoUrl: 'https://urbanmanager.creamiproyecto.com/',
    repoUrl: 'https://github.com/IvBanzaga/UrbanManager',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/login',
    dateLabel: 'Proyecto destacado',
  },
  {
    id: 'catalogo-sepe',
    title: 'Catálogo de Especialidades Formativas',
    subtitle: 'Buscador avanzado de especialidades, módulos y centros SEPE',
    category: 'Formación y herramientas educativas',
    domain: 'dual',
    status: 'Publicado',
    featured: true,
    visualKind: 'catalog-data',
    accentColor: 'orange',
    galleryCaptions: [
      'Buscador multicriterio por código, provincia, familia profesional y horas',
      'Vista de centros y academias asociadas por especialidad',
      'Exportación directa de resultados y centros a formato Excel',
    ],
    shortDescription:
      'Herramienta de consulta y análisis del catálogo público del SEPE para localizar especialidades formativas, módulos y academias acreditadas.',
    problemSolved:
      'Agilizar la exploración de miles de especialidades formativas oficiales y centros asociados mediante filtros combinados que ahorran consultas manuales.',
    objective:
      'Ofrecer a docentes, orientadores y entidades de formación un acceso rápido, paginado y exportable al ecosistema formativo oficial.',
    features: [
      'Búsqueda instantánea por denominación o código oficial',
      'Filtros combinados: provincia, familia profesional, nivel de cualificación, modalidad y rango de horas',
      'Consulta de módulos formativos y academias asociadas',
      'Navegación paginada sobre gran volumen de registros',
      'Descarga de resultados y listados de academias en Excel',
    ],
    technologies: [
      'Búsqueda avanzada',
      'Filtros combinados',
      'Paginación',
      'Exportación Excel',
      'Datos SEPE',
    ],
    architectureNotes: [
      'Volumen observado en consulta del 15/11/2026: 7.586 especialidades, 26 familias profesionales, 14.456 módulos y 58.600 academias/centros.',
      'Presentada explícitamente como herramienta independiente de consulta y análisis sobre datos de la Sede Electrónica del SEPE.',
    ],
    challengesAndLearnings: [
      'Optimización de consultas filtradas sobre decenas de miles de registros y generación limpia de hojas Excel.',
    ],
    demoUrl: 'https://catalogo.creamiproyecto.com/',
    verificationNote:
      'Stack técnico interno pendiente de confirmar tras revisar el repositorio.',
    dateLabel: 'EdTech · Datos abiertos',
  },
  {
    id: 'innovapyme-canarias',
    title: 'InnovaPyme Canarias',
    subtitle: 'Buscador y panel de seguimiento de ayudas, digitalización e I+D',
    category: 'Herramientas profesionales y productividad',
    domain: 'web',
    status: 'Publicado',
    featured: true,
    visualKind: 'grants-panel',
    accentColor: 'teal',
    galleryCaptions: [
      'Panel de control con estados: abiertas, próximas, continuas y cerradas',
      'Alertas de cierres próximos y filtros por ámbito y tamaño de empresa',
      'Fichas detalladas con organismo, beneficiarios y referencia oficial',
    ],
    shortDescription:
      'Plataforma para localizar subvenciones, bonos tecnológicos y ayudas a la innovación e I+D para pymes y autónomos con foco en Canarias.',
    problemSolved:
      'Reunir convocatorias regionales, nacionales y europeas dispersas en boletines oficiales dentro de un panel filtrable con alertas de plazos.',
    objective:
      'Facilitar el seguimiento ágil de oportunidades de financiación mediante indicadores visuales de estado y fichas estructuradas.',
    features: [
      'Panel de seguimiento con contadores de convocatorias abiertas, próximas, continuas y cerradas',
      'Alertas tempranas de cierres próximos',
      'Filtros por área temática, ámbito territorial, tamaño de empresa y estado',
      'Fichas con organismo convocante, beneficiarios, cuantías y códigos oficiales',
      'Sincronización con base de datos Neon indicada en la interfaz',
    ],
    technologies: ['Neon', 'Panel analítico', 'Filtros avanzados', 'Fuentes oficiales'],
    architectureNotes: [
      'Modelado estructurado de convocatorias con enlace a fuentes oficiales para verificar vigencia.',
    ],
    challengesAndLearnings: [
      'Diseñar un modelo de información claro advirtiendo siempre sobre la variabilidad temporal de plazos e importes.',
    ],
    demoUrl: 'https://convocatorias-omega.vercel.app/',
    verificationNote:
      'Stack completo y procesos de actualización pendientes de confirmar en repositorio.',
    dateLabel: 'Innovación · Pymes',
  },
  {
    id: 'libroshop',
    title: 'Tienda Online de Libros',
    subtitle: 'Comercio electrónico full-stack con pagos Stripe y panel privado',
    category: 'Webs corporativas y comercio electrónico',
    domain: 'web',
    status: 'Publicado',
    featured: true,
    visualKind: 'ecommerce-books',
    accentColor: 'rose',
    galleryCaptions: [
      'Catálogo público editorial con sistema de diseño propio',
      'Ficha de detalle de libro y flujo de carrito de compra',
      'Panel privado para administración de libros, categorías y pedidos',
    ],
    shortDescription:
      'Tienda online completa de libros con catálogo público, detalle de producto, carrito, pasarela de pago Stripe y gestión administrativa.',
    problemSolved:
      'Integrar experiencia de compra fluida para lectores con administración centralizada de inventario editorial y pedidos.',
    objective:
      'Construir un e-commerce sólido sobre Next.js 16, TypeScript y PostgreSQL con cobro seguro y sistema de diseño propio.',
    features: [
      'Catálogo filtrable y páginas de detalle por libro',
      'Carrito de compra interactivo',
      'Proceso completo de checkout integrado con Stripe',
      'Panel administrativo para gestión de libros, categorías y pedidos',
    ],
    technologies: [
      'Next.js 16',
      'TypeScript',
      'PostgreSQL',
      'Stripe',
      'Sistema de diseño propio',
    ],
    architectureNotes: [
      'Persistencia relacional en PostgreSQL y pasarela transaccional Stripe.',
      'Sistema de diseño propio aplicado transversalmente a tienda y panel.',
    ],
    challengesAndLearnings: [
      'Coordinación de estado de carrito, confirmación de pago y actualización de pedidos en base de datos.',
    ],
    demoUrl: 'https://book-store.creamiproyecto.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/2026-06-03_10h09_34',
    dateLabel: 'E-Commerce Full-Stack',
  },
  {
    id: 'htmlab',
    title: 'Constructor de Plantillas HTML5',
    subtitle: 'Entorno educativo visual con previsualización y tutor con IA',
    category: 'Formación y herramientas educativas',
    domain: 'docencia',
    status: 'Publicado',
    featured: true,
    visualKind: 'html-builder',
    accentColor: 'orange',
    galleryCaptions: [
      'Zona de construcción por bloques y etiquetas semánticas HTML5',
      'Previsualización en tiempo real de la estructura generada',
      'Asistente chatbot tutor integrado para resolver dudas del alumnado',
    ],
    shortDescription:
      'Aplicación educativa interactiva para aprender a estructurar documentos HTML5 semánticos mediante constructor visual, vista previa y tutor con IA.',
    problemSolved:
      'Superar la abstracción inicial del código HTML en alumnado principiante mostrando al instante cómo se anidan las etiquetas semánticas.',
    objective:
      'Guiar el aprendizaje práctico de arquitectura web semántica combinando manipulación visual de bloques y acompañamiento inteligente.',
    features: [
      'Constructor visual para añadir bloques y etiquetas HTML5',
      'Previsualización en tiempo real del documento generado',
      'Chatbot tutor con inteligencia artificial orientado al aprendizaje',
    ],
    technologies: [
      'HTML5 Semántico',
      'Constructor visual',
      'Previsualización en vivo',
      'Chatbot tutor IA',
    ],
    architectureNotes: [
      'Diseñada específicamente para uso didáctico en iniciación al desarrollo web.',
    ],
    challengesAndLearnings: [
      'Equilibrar la simplicidad de un constructor por bloques con el rigor de la semántica HTML5.',
    ],
    demoUrl: 'https://docente-ashen.vercel.app/',
    verificationNote:
      'Stack técnico y alcance detallado del chatbot tutor pendientes de confirmar en repositorio.',
    dateLabel: 'Docencia · IA educativa',
  },
  {
    id: 'aura-formularios',
    title: 'Constructor de Formularios y Plantillas',
    subtitle: 'Laboratorio práctico interactivo de HTML5 y CSS3 para alumnado',
    category: 'Formación y herramientas educativas',
    domain: 'docencia',
    status: 'Publicado',
    featured: false,
    visualKind: 'forms-tutorial',
    accentColor: 'teal',
    shortDescription:
      'Mini laboratorio y tutorial interactivo para dominar la anatomía de formularios web y las etiquetas estructurales HTML5 sin dependencias de servidor.',
    problemSolved:
      'Permitir que el alumnado practique validación nativa HTML5 y maquetación semántica sin necesidad de configurar PHP ni bases de datos.',
    objective:
      'Reforzar el aprendizaje autónomo mediante editor en vivo, reto de conocimientos y zona de práctica guiada.',
    features: [
      'Anatomía guiada de un formulario web',
      'Editor HTML con resultado en vivo en el navegador',
      'Práctica de estructura semántica: header, nav, main y footer',
      'Reto interactivo de conocimientos y comprobación de etiquetas',
      'Zona de alumnos con acceso mediante contraseña',
    ],
    technologies: ['HTML5', 'CSS3', 'Editor en vivo', 'Formularios web'],
    architectureNotes: [
      'Ejecución 100% cliente en HTML y CSS, sin PHP ni bases de datos, facilitando su uso en cualquier aula.',
    ],
    challengesAndLearnings: [
      'Secuenciar contenidos desde teoría visual hasta validación práctica en una sola sesión formativa.',
    ],
    demoUrl: 'https://aura.creamiproyecto.com/',
    dateLabel: 'Recurso docente',
  },
  {
    id: 'construye-plantilla',
    title: 'Construye una plantilla',
    subtitle: 'Plantilla web base en HTML5 y CSS3 con mapa interactivo de zonas semánticas',
    category: 'Formación y herramientas educativas',
    domain: 'docencia',
    status: 'Publicado',
    featured: false,
    visualKind: 'template-blueprint',
    accentColor: 'emerald',
    galleryCaptions: [
      'Mapa interactivo de estructura semántica (header, nav, main y footer)',
      'Cabecera institucional fija, navegación multipágina y pie reutilizable',
      'Guía práctica de bloques para crear páginas nuevas desde una base común',
    ],
    shortDescription:
      'Plantilla web educativa en blanco con cabecera fija, menú de navegación, pie reutilizable y mapa interactivo para aprender a estructurar sitios HTML5 multipágina.',
    problemSolved:
      'Facilitar al alumnado una estructura base clara donde distinguir los elementos comunes de un sitio web frente al contenido específico de cada página dentro de <main>.',
    objective:
      'Acelerar la creación de páginas web reales (inicio, cursos y contacto) aplicando HTML5 semántico, variables CSS, formulario accesible y diseño responsive sin dependencias.',
    features: [
      'Mapa interactivo que identifica visualmente header, nav, main y footer',
      'Cabecera, menú de navegación y pie de página fijos compartidos',
      'Esquema guía para sitio multipágina (inicio, cursos y contacto)',
      'Bloque de tarjetas de cursos y formulario de contacto accesible',
      'Acceso directo a modo juego didáctico y diseño responsive sin servidor',
    ],
    technologies: ['HTML5 Semántico', 'CSS3', 'Plantilla web', 'Arquitectura multipágina'],
    architectureNotes: [
      'Uso de propiedades personalizadas CSS, navegación sticky y atributos data-zona para explicar cada región semántica.',
      'Diseñada para duplicarse directamente como plantilla de partida en talleres y cursos de desarrollo web.',
    ],
    challengesAndLearnings: [
      'Conectar de forma visual e inmediata la teoría de etiquetas semánticas con la reutilización práctica de plantillas.',
    ],
    demoUrl: 'https://aura.creamiproyecto.com/template.html',
    dateLabel: 'Recurso docente',
  },
  {
    id: 'moodle-design',
    title: 'Moodle Design Library',
    subtitle: 'Biblioteca visual de diseños y bloques HTML para Moodle sin código',
    category: 'Formación y herramientas educativas',
    domain: 'docencia',
    status: 'Publicado',
    featured: false,
    visualKind: 'moodle-design',
    accentColor: 'blue',
    galleryCaptions: [
      'Catálogo visual de avisos, tarjetas de actividad, guías y bloques para Moodle',
      'Personalización directa de textos, enlaces y énfasis sin escribir código',
      'Exportación limpia a HTML compatible con el editor de Moodle y soporte PWA',
    ],
    shortDescription:
      'Biblioteca visual de diseños HTML para Moodle que permite crear, personalizar y exportar avisos, tarjetas de actividad y descripciones educativas sin escribir código.',
    problemSolved:
      'Evitar la maquetación manual de HTML en línea dentro del editor de Moodle para que docentes puedan publicar aulas virtuales claras, estructuradas y accesibles.',
    objective:
      'Proveer bloques listos para usar (avisos informativos, tarjetas de actividad, recursos descargables, guías y botones de alto contraste) listos para copiar y pegar en Moodle.',
    features: [
      'Biblioteca categorizada de componentes educativos: avisos, recursos, actividades y guías',
      'Edición visual de contenidos sin necesidad de escribir HTML manualmente',
      'Generación de código HTML limpio y compatible con el editor de Moodle',
      'Botones y tarjetas con diseño de alto contraste orientados a accesibilidad',
      'Aplicación web progresiva (PWA) instalable con icono dedicado',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'HTML5', 'Moodle', 'PWA'],
    architectureNotes: [
      'Componentes optimizados para generar HTML autocontenido compatible con las reglas de saneado de Moodle.',
      'Configuración PWA con Web App Manifest e iconos dedicados para uso ágil desde escritorio o móvil.',
    ],
    challengesAndLearnings: [
      'Diseñar bloques visualmente atractivos que mantengan legibilidad y contraste dentro del editor estándar de Moodle.',
    ],
    demoUrl: 'https://moodle-design.creamiproyecto.com/',
    dateLabel: 'Docencia · Moodle EdTech',
  },
  {
    id: 'control-gastos',
    title: 'Control de Gastos Multiusuario',
    subtitle: 'Gestión centralizada de ingresos, gastos y movimientos recurrentes',
    category: 'Aplicaciones de gestión',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'finance-tracker',
    accentColor: 'emerald',
    shortDescription:
      'Aplicación financiera multiusuario para registrar, consultar y analizar ingresos, gastos y movimientos recurrentes con aprobación de cuentas.',
    problemSolved:
      'Controlar finanzas compartidas o multiusuario con trazabilidad por roles y automatización de movimientos periódicos.',
    objective:
      'Proveer una interfaz clara con tipado estricto de extremo a extremo usando Next.js, TypeScript y Prisma sobre MariaDB.',
    features: [
      'Registro y consulta filtrada de ingresos y gastos',
      'Configuración de movimientos recurrentes',
      'Autenticación por sesión y roles de usuario',
      'Panel administrativo para aprobar nuevas cuentas',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Prisma', 'MariaDB', 'Tailwind CSS'],
    architectureNotes: [
      'ORM Prisma conectado a MariaDB con control de acceso por roles en sesión.',
    ],
    challengesAndLearnings: [
      'Modelado de recurrencias contables y flujo seguro de alta supervisada por administración.',
    ],
    demoUrl: 'https://gastosmultiusuario.creamiproyecto.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/2026-05-29_20h09_58',
    dateLabel: 'Finanzas · Full-Stack',
  },
  {
    id: 'agencia-pro',
    title: 'Representante Deportivo',
    subtitle: 'Plataforma corporativa y panel CMS con Laravel y Filament',
    category: 'Webs corporativas y comercio electrónico',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'sports-agency',
    accentColor: 'blue',
    shortDescription:
      'Web corporativa para una agencia de representación de futbolistas con catálogo de perfiles, noticias, contacto y autogestión privada.',
    problemSolved:
      'Dar visibilidad profesional a jugadores y servicios de representación permitiendo al equipo interno actualizar fichas sin tocar código.',
    objective:
      'Combinar imagen corporativa responsive y SEO básico con un backoffice ágil desarrollado en Laravel, Filament y Livewire.',
    features: [
      'Presentación de perfiles de jugadores y servicios',
      'Sección de noticias y novedades corporativas',
      'Formulario de contacto orientado a clubes y futbolistas',
      'Panel de administración privado construido con Filament',
    ],
    technologies: ['Laravel', 'Filament', 'Livewire', 'SEO'],
    architectureNotes: [
      'Stack monolítico moderno del ecosistema Laravel con interactividad reactiva mediante Livewire.',
    ],
    challengesAndLearnings: [
      'Productividad en la creación de paneles administrativos completos y seguros con Filament.',
    ],
    demoUrl: 'https://agencia.creamiproyecto.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/2026-05-30_16h46_22',
    dateLabel: 'Laravel · Filament',
  },
  {
    id: 'agrimensor-landing',
    title: 'Agrimensor: Landing Web',
    subtitle: 'Web corporativa implementada desde diseño Figma con React y Radix UI',
    category: 'Webs corporativas y comercio electrónico',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'surveyor-landing',
    accentColor: 'teal',
    shortDescription:
      'Landing page para servicios profesionales de agrimensura estructurada mediante componentes reutilizables a partir de un mockup en Figma.',
    problemSolved:
      'Traducir un diseño corporativo completo de Figma a una web rápida, accesible y con conversión directa vía formulario y WhatsApp.',
    objective:
      'Presentar servicios, zona de actuación y testimonios con una arquitectura de componentes limpia en React 18 y Tailwind CSS 4.',
    features: [
      'Secciones de presentación, información, servicios, zona de actuación y testimonios',
      'Navegación, pie de página y acceso directo a WhatsApp',
      'Notificaciones accesibles con Sonner y primitivos Radix UI',
    ],
    technologies: ['React 18', 'Vite 6', 'Tailwind CSS 4', 'Radix UI', 'Sonner', 'Figma'],
    architectureNotes: [
      'Fidelidad visual respecto al archivo de diseño en Figma y composición modular de secciones.',
    ],
    challengesAndLearnings: [
      'Transición precisa desde especificaciones de diseño en Figma hacia componentes React accesibles.',
    ],
    docsUrl: 'https://ivandevs.netlify.app/portfolio/2026-06-03_10h12_03',
    figmaUrl:
      'https://www.figma.com/design/YjIjiTTXWkAqeotAuLju0y/Adjuntar-archivo-de-informaci%C3%B3n',
    dateLabel: 'Figma to React',
  },
  {
    id: 'angular-springboot',
    title: 'Angular & SpringBoot: Inventario',
    subtitle: 'Aplicación empresarial CRUD modular con Angular 20 y Bootstrap 5.3',
    category: 'Aplicaciones de gestión',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'inventory-crud',
    accentColor: 'rose',
    shortDescription:
      'Sistema de gestión de inventario empresarial centrado en una aplicación frontend modular con Angular 20 para administración de productos.',
    problemSolved:
      'Estructurar operaciones de alta, consulta, edición y borrado de inventario con formularios reactivos validados.',
    objective:
      'Aplicar arquitectura modular por servicios, rutas y componentes en Angular 20 con diseño responsive en Bootstrap 5.3.',
    features: [
      'Operaciones CRUD completas sobre catálogo de productos',
      'Navegación entre vistas y rutas dedicadas',
      'Formularios reactivos y arquitectura por servicios',
      'Interfaz responsive con Bootstrap 5.3',
    ],
    technologies: ['Angular 20', 'Bootstrap 5.3', 'Formularios reactivos', 'Spring Boot (en proyecto)'],
    architectureNotes: [
      'Organización escalable por componentes, servicios y enrutamiento Angular.',
    ],
    challengesAndLearnings: [
      'Patrones de formularios reactivos y separación clara entre capa de presentación y servicios.',
    ],
    demoUrl: 'https://angular-spring-boot.vercel.app/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/angular',
    verificationNote:
      'La documentación actual cubre la aplicación Angular 20; pendiente documentar por separado qué endpoints Spring Boot están activos.',
    dateLabel: 'Angular 20',
  },
  {
    id: 'reservas-refugio',
    title: 'Gestión de Reservas para Refugio',
    subtitle: 'Sistema de disponibilidad de camas, habitaciones y reservas',
    category: 'Aplicaciones de gestión',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'refuge-booking',
    accentColor: 'emerald',
    shortDescription:
      'Aplicación web en PHP y MySQL para gestionar reservas de camas, habitaciones y usuarios en refugios de montaña y albergues.',
    problemSolved:
      'Evitar solapamientos de plazas en albergues controlando la disponibilidad real por cama y habitación.',
    objective:
      'Ofrecer consulta rápida de disponibilidad para usuarios y administración integral de estancias para gestores.',
    features: [
      'Consulta de disponibilidad de plazas en tiempo real',
      'Gestión de reservas por parte de usuarios registrados',
      'Administración de usuarios, habitaciones y reservas',
      'Estadísticas y documentación de seguridad e instalación',
    ],
    technologies: ['PHP', 'MySQL', 'HTML5'],
    architectureNotes: [
      'Aplicación clásica PHP/MySQL con documentación detallada de estructura de archivos, seguridad y usuarios de prueba.',
    ],
    challengesAndLearnings: [
      'Validación de rangos de fechas y control de capacidad en base de datos relacional.',
    ],
    demoUrl: 'https://refugio.astrotenerife.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/php',
    dateLabel: 'PHP · MySQL',
  },
  {
    id: 'comunidad-vecinos',
    title: 'Comunidad de Vecinos',
    subtitle: 'Portal comunitario con roles de vecinos, presidencia y administración',
    category: 'Aplicaciones de gestión',
    domain: 'web',
    status: 'En desarrollo',
    featured: false,
    visualKind: 'community-roles',
    accentColor: 'blue',
    shortDescription:
      'Aplicación web para gestionar información interna, usuarios y permisos de una comunidad de vecinos según rol asignado.',
    problemSolved:
      'Organizar el acceso diferenciado a información comunitaria entre vecinos, presidencia y administración.',
    objective:
      'Consolidar un portal de gestión vecinal en PHP y MySQL/MariaDB con operaciones CRUD y control de sesión.',
    features: [
      'Roles diferenciados: vecinos, presidencia y administración',
      'Autenticación con inicio y cierre de sesión',
      'Consulta de información comunitaria',
      'Edición y actualización de datos de usuarios',
    ],
    technologies: ['PHP 7.4+', 'MySQL', 'MariaDB', 'HTML5', 'CSS3'],
    architectureNotes: [
      'Control de acceso basado en roles sobre base de datos relacional MariaDB/MySQL.',
    ],
    challengesAndLearnings: [
      'Definición de permisos por perfil dentro de una organización comunitaria.',
    ],
    demoUrl: 'https://comunidad.astrotenerife.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/mysql',
    verificationNote:
      'Estado indicado en la documentación: en desarrollo, con funciones principales implementadas y en fase de pruebas.',
    dateLabel: 'En pruebas',
  },
  {
    id: 'custodia-compartida',
    title: 'Calendario Custodia Compartida',
    subtitle: 'Organización visual de fechas y turnos de custodia',
    category: 'Proyectos personales y experimentales',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'custody-calendar',
    accentColor: 'indigo',
    shortDescription:
      'Aplicación web enfocada en la organización clara y compartida de un calendario de custodia.',
    problemSolved:
      'Facilitar la consulta ordenada de fechas y coordinación de turnos en una interfaz accesible desde móvil y escritorio.',
    objective:
      'Aportar claridad visual sobre reglas de calendario y persistencia fiable de la planificación.',
    features: [
      'Interfaz visual de calendario y planificación de fechas',
      'Documentación de instalación, requisitos, configuración y pruebas',
    ],
    technologies: [
      'PHP',
      'JavaScript',
      'Tailwind CSS',
      'MySQL',
      'Supabase',
      'Node.js',
      'Apache',
      'Leaflet',
      'Capacitor',
      'Git',
    ],
    architectureNotes: [
      'Comparte base tecnológica documentada para despliegue web y compatibilidad móvil.',
    ],
    challengesAndLearnings: [
      'Diseño de interfaces temporales comprensibles de un vistazo.',
    ],
    demoUrl: 'https://calendario.creamiproyecto.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/calendario',
    verificationNote:
      'Pendiente documentar con precisión reglas concretas de rotación, avisos y sincronización tras revisar la app en uso.',
    dateLabel: 'Organización',
  },
  {
    id: 'astrotenerife',
    title: 'Comunidad AstroTenerife',
    subtitle: 'Comunidad temática y red social de astronomía',
    category: 'Proyectos personales y experimentales',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'astro-community',
    accentColor: 'indigo',
    shortDescription:
      'Plataforma comunitaria dedicada a la astronomía que une divulgación científica e interacción digital.',
    problemSolved:
      'Crear un espacio especializado para compartir interés astronómico vinculado al cielo de Tenerife.',
    objective:
      'Integrar tecnología web con una temática científica y divulgativa cercana.',
    features: [
      'Espacio web temático orientado a comunidad astronómica',
      'Documentación pública de instalación, configuración, uso y contribución',
    ],
    technologies: [
      'PHP',
      'JavaScript',
      'Tailwind CSS',
      'MySQL',
      'Supabase',
      'Node.js',
      'Apache',
      'Leaflet',
      'Capacitor',
      'Git',
    ],
    architectureNotes: [
      'Proyecto personal que conecta desarrollo web y divulgación astronómica.',
    ],
    challengesAndLearnings: [
      'Construcción de una plataforma temática con identidad propia y presencia en redes (@astrotenerife).',
    ],
    demoUrl: 'https://astrotenerife.com/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/astrotenerife',
    verificationNote:
      'Pendiente detallar las funcionalidades sociales específicas tras verificarlas en producción.',
    dateLabel: 'Ciencia · Comunidad',
  },
  {
    id: 'astrotenerife-apod',
    title: 'Imágenes de la Nasa',
    subtitle: 'Explorador de la Imagen Astronómica del Día vía API REST',
    category: 'Proyectos personales y experimentales',
    domain: 'web',
    status: 'Publicado',
    featured: false,
    visualKind: 'nasa-apod',
    accentColor: 'blue',
    shortDescription:
      'Aplicación web en Next.js que consume la API oficial APOD de la NASA para mostrar la imagen o vídeo astronómico diario y consultar fechas pasadas.',
    problemSolved:
      'Acercar contenido científico oficial de la NASA en castellano/entorno amigable con navegación temporal por fechas.',
    objective:
      'Demostrar consumo limpio de API REST externa, tratamiento de JSON y presentación multimedia adaptable.',
    features: [
      'Consulta de la Imagen Astronómica del Día (APOD) oficial',
      'Soporte de imagen y vídeo con explicación científica',
      'Selector de fechas mediante el parámetro date de la API',
    ],
    technologies: ['Next.js', 'NASA APOD API', 'REST API', 'JSON'],
    architectureNotes: [
      'Integración directa con https://api.nasa.gov/ manejando distintos tipos de recurso multimedia.',
    ],
    challengesAndLearnings: [
      'Gestión de respuestas variables (imagen frente a vídeo embebido) y formato legible de divulgación.',
    ],
    demoUrl: 'https://nasa-apod-xi-three.vercel.app/',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/apod-nasa',
    verificationNote:
      'Versión exacta de Next.js y dependencias adicionales pendientes de confirmar desde el repositorio.',
    dateLabel: 'API NASA',
  },
  {
    id: 'theme-astro',
    title: 'Theme Astro',
    subtitle: 'Plantilla inicial reutilizable con Astro 5 y Tailwind CSS 4',
    category: 'Proyectos personales y experimentales',
    domain: 'web',
    status: 'Plantilla / Base',
    featured: false,
    visualKind: 'astro-theme',
    accentColor: 'orange',
    shortDescription:
      'Plantilla base abierta para iniciar proyectos web modernos en Astro 5 con estructura semántica, accesibilidad, SEO base y Tailwind CSS 4.',
    problemSolved:
      'Evitar configurar desde cero layouts, semántica HTML y estilos en cada nuevo sitio estático o corporativo.',
    objective:
      'Proporcionar un punto de partida limpio, rápido y reutilizable con buenas prácticas de rendimiento.',
    features: [
      'Configuración base con Astro 5 y Tailwind CSS 4',
      'Layouts y componentes reutilizables',
      'Estructura semántica accesible y preparación SEO inicial',
      'Diseño totalmente responsive',
    ],
    technologies: ['Astro 5', 'Tailwind CSS 4', 'Accesibilidad', 'SEO'],
    architectureNotes: [
      'Repositorio público listo para clonar y extender en nuevos proyectos frontend.',
    ],
    challengesAndLearnings: [
      'Estandarización de estructura de carpetas y diseño base ligero en Astro 5.',
    ],
    demoUrl: 'https://theme-astro-xi.vercel.app/',
    repoUrl: 'https://github.com/IvBanzaga/theme-astro',
    docsUrl: 'https://ivandevs.netlify.app/portfolio/astrotheme',
    dateLabel: 'Open Source Starter',
  },
];
