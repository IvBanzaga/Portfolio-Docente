export type ProjectCategory =
  | 'Aplicaciones de gestión'
  | 'Formación y herramientas educativas'
  | 'Herramientas profesionales y productividad'
  | 'Webs corporativas y comercio electrónico'
  | 'Proyectos personales y experimentales';

export type ProjectStatus =
  | 'Publicado'
  | 'En desarrollo'
  | 'Plantilla / Base'
  | 'Experimental';

export type ProjectDomain = 'web' | 'docencia' | 'dual';

export type VisualKind =
  | 'map-incidents'
  | 'catalog-data'
  | 'email-studio'
  | 'grants-panel'
  | 'ecommerce-books'
  | 'html-builder'
  | 'forms-tutorial'
  | 'finance-tracker'
  | 'sports-agency'
  | 'surveyor-landing'
  | 'inventory-crud'
  | 'refuge-booking'
  | 'community-roles'
  | 'custody-calendar'
  | 'astro-community'
  | 'nasa-apod'
  | 'astro-theme'
  | 'template-blueprint'
  | 'moodle-design';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  domain: ProjectDomain;
  status: ProjectStatus;
  featured: boolean;
  visualKind: VisualKind;
  accentColor: 'blue' | 'orange' | 'teal' | 'indigo' | 'emerald' | 'rose';
  /** Ruta a captura real cuando esté disponible (ej. '/projects/urban-manager.png') */
  image?: string;
  galleryCaptions?: string[];
  shortDescription: string;
  problemSolved: string;
  objective: string;
  features: string[];
  technologies: string[];
  architectureNotes: string[];
  challengesAndLearnings: string[];
  demoUrl?: string;
  repoUrl?: string;
  docsUrl?: string;
  figmaUrl?: string;
  verificationNote?: string;
  dateLabel?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  area: 'tech' | 'teaching';
  summary: string;
  items: {
    name: string;
    context: string;
    projectIds: string[];
  }[];
}

export interface BridgeConcept {
  id: string;
  pedagogyTitle: string;
  pedagogyDetail: string;
  engineeringTitle: string;
  engineeringDetail: string;
  exampleProjectId: string;
  exampleProjectName: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  kind: 'verified' | 'pending-slot';
  scope: 'Desarrollo Web' | 'Docencia y EdTech' | 'Formación / Certificaciones';
  description: string;
  highlights: string[];
  relatedProjectIds?: string[];
}

export interface TeachingPillar {
  id: string;
  title: string;
  category: 'Programaciones' | 'Recursos digitales' | 'Práctica y evaluación' | 'IA en enseñanza';
  description: string;
  appliedIn: string;
  projectId?: string;
  demoUrl?: string;
  statusNote: string;
}
