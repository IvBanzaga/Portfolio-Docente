# Guía Conceptual, Arquitectura y Mantenimiento del Portafolio — Iván Bazaga

## 1. Propuesta conceptual (3 conceptos evaluados y elección recomendada)

Se han evaluado tres direcciones artísticas para representar la dualidad **Desarrollo de Aplicaciones Web + Docencia Tecnológica**:

1. **Concepto A — Editorial Luminoso + Bento Interactivo (RECOMENDADO e implementado):**
   - **Estética:** Lienzo claro luminoso (`#F8FAFC` / `#FFFFFF`) con malla arquitectónica suave, acentos duales equilibrados (**Azul cobalto `#2563EB`** para ingeniería web y **Naranja coral `#F97316` / Teal `#0D9488`** para docencia y laboratorio).
   - **Tipografía:** *Bricolage Grotesque* (titulares expresivos), *Plus Jakarta Sans* (lectura cómoda en español) y *JetBrains Mono* (datos numéricos tabulares y código).
   - **Ventaja:** Máxima legibilidad, personalidad moderna y luminosa, evita la frialdad corporativa y conecta ambos ámbitos desde la primera pantalla.

2. **Concepto B — Neo-Brutalismo Didáctico:**
   - Contornos negros gruesos, sombras sólidas desplazadas y bloques cromáticos primarios.
   - **Ventaja:** Gran impacto visual; **Desventaja:** Puede cansar en catálogos amplios (17 proyectos) y restar sensación de precisión técnica.

3. **Concepto C — Estudio Modular Minimalista (Monocromo + Acento Único):**
   - Fondo blanco puro, tipografía suiza y un único color de énfasis.
   - **Ventaja:** Limpieza extrema; **Desventaja:** Menos expresivo para transmitir la energía creativa y pedagógica solicitada.

---

## 2. Arquitectura técnica y justificación

- **Stack elegido:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Motion + Lucide Icons.
- **Por qué Vite SPA frente a Next.js / backend dedicado:** El portafolio es una plataforma editorial e interactiva orientada a mostrar proyectos reales, demos en cliente (Constructor HTML5, Simulador React Email, Filtro CSV) y fichas técnicas. Desplegado como SPA estática en Vercel ofrece carga instantánea, cero mantenimiento de servidor y coste cero de base de datos, manteniendo toda la información desacoplada en archivos tipados de `src/data/`.

### Estructura de carpetas
```text
src/
├── types/portfolio.ts          # Modelo de datos tipado (Project, SkillGroup, TimelineEntry...)
├── data/
│   ├── profile.ts              # Datos personales, enlaces, ruta de avatar y CV PDF
│   ├── projects.ts             # Inventario completo de los 17 proyectos reales
│   ├── skills.ts               # Competencias vinculadas a proyectos reales (sin % inventados)
│   └── teachingAndTimeline.ts  # Puente pedagogía-código, pilares docentes y línea temporal
├── components/
│   ├── Navbar.tsx              # Barra superior limpia en 3 zonas
│   ├── Hero.tsx                # Selector interactivo Dual (Desarrollo ↔ Docencia ↔ Síntesis)
│   ├── ProjectsSection.tsx     # Bento Grid destacado + Catálogo filtrable de 17 proyectos
│   ├── ProjectVisual.tsx       # Miniaturas interactivas + soporte automático de capturas reales
│   ├── ProjectModal.tsx        # Ficha técnica completa con zoom lightbox y enlaces
│   ├── TeachingSection.tsx     # Espacio diferenciado de docencia y EdTech
│   ├── InteractiveLab.tsx      # 3 demos funcionales en vivo + líneas en investigación
│   ├── SkillsMatrix.tsx        # Mapa de tecnologías conectado al catálogo
│   ├── TimelineSection.tsx     # Línea temporal verificada + bloques para completar
│   ├── AboutBridge.tsx         # Biografía + traductor Pedagogía ↔ Ingeniería
│   ├── ContactSection.tsx      # Formulario validado con honeypot antispam + suma humana
│   ├── CommandPalette.tsx      # Navegación rápida por teclado (Ctrl+K / Cmd+K)
│   ├── NotFound.tsx            # Página de error 404
│   └── Footer.tsx              # Pie editorial
└── App.tsx                     # Orquestación principal, accesibilidad y rutas
```

---

## 3. Cómo añadir o actualizar proyectos, imágenes y CV

### Añadir un nuevo proyecto
Abre `src/data/projects.ts` y añade un nuevo objeto al array `PROJECTS`:
```ts
{
  id: 'mi-nuevo-proyecto',
  title: 'Nombre del Proyecto',
  subtitle: 'Resumen corto en una línea',
  category: 'Aplicaciones de gestión',
  domain: 'web', // 'web' | 'docencia' | 'dual'
  status: 'Publicado', // 'Publicado' | 'En desarrollo' | 'Plantilla / Base' | 'Experimental'
  featured: false,
  visualKind: 'catalog-data',
  accentColor: 'blue',
  image: '/projects/mi-nuevo-proyecto.png', // Opcional: si existe en public/projects/
  shortDescription: 'Descripción enfocada al problema que resuelve...',
  problemSolved: '...',
  objective: '...',
  features: ['Funcionalidad 1', 'Funcionalidad 2'],
  technologies: ['React', 'TypeScript'],
  architectureNotes: ['...'],
  challengesAndLearnings: ['...'],
  demoUrl: 'https://...',
  repoUrl: 'https://github.com/IvBanzaga/...',
}
```

### Añadir capturas reales y fotografía personal
1. Coloca tus capturas en `public/projects/nombre.png` y añade `image: '/projects/nombre.png'` en cada objeto de `src/data/projects.ts`. Mientras no se añada `image`, la web muestra automáticamente una previsualización UI fiel a cada app.
2. Coloca tu fotografía en `public/images/ivan-bazaga.jpg` y actualiza `avatarUrl: '/images/ivan-bazaga.jpg'` en `src/data/profile.ts`.
3. Coloca tu CV en PDF en `public/cv-ivan-bazaga.pdf` y actualiza `cvPdfUrl: '/cv-ivan-bazaga.pdf'` en `src/data/profile.ts`.

---

## 4. Instalación local y despliegue en Vercel

```bash
npm install
npm run dev      # Servidor local en http://localhost:3000
npm run build    # Compilación de producción en dist/
```

El archivo `vercel.json` ya incluye las reescrituras SPA (`/(.*) -> /index.html`) para que la página 404 personalizada y las rutas funcionen en Vercel sin configuración manual adicional:
1. Sube el repositorio a GitHub (`IvBanzaga`).
2. Importa el proyecto en **Vercel** (Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`).
3. Despliega sin variables de entorno obligatorias (todo funciona en cliente sin claves privadas).
