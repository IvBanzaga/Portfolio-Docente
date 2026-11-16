import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Eye,
  FlaskConical,
  Mail,
  Monitor,
  Play,
  Plus,
  RotateCcw,
  Smartphone,
  Table2,
  Trash2,
  Workflow,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { RESEARCH_LAB_IDEAS } from '../data/teachingAndTimeline';

type LabTab = 'html5' | 'email' | 'data' | 'n8n';

type SemanticBlockType = 'header' | 'nav' | 'main' | 'article' | 'form' | 'footer';

interface SemanticBlock {
  uid: string;
  type: SemanticBlockType;
  label: string;
}

const AVAILABLE_BLOCKS: { type: SemanticBlockType; label: string; hint: string }[] = [
  { type: 'header', label: '<header>', hint: 'Cabecera principal' },
  { type: 'nav', label: '<nav>', hint: 'Menú de navegación' },
  { type: 'main', label: '<main>', hint: 'Contenido central' },
  { type: 'article', label: '<article>', hint: 'Bloque independiente' },
  { type: 'form', label: '<form>', hint: 'Formulario accesible' },
  { type: 'footer', label: '<footer>', hint: 'Pie de página' },
];

const INITIAL_BLOCKS: SemanticBlock[] = [
  { uid: 'b1', type: 'header', label: 'Cabecera del aula digital' },
  { uid: 'b2', type: 'nav', label: 'Inicio · Recursos · Contacto' },
  { uid: 'b3', type: 'main', label: 'Contenido principal de la unidad' },
  { uid: 'b4', type: 'footer', label: 'Autoría y licencia' },
];

const SAMPLE_MODULES = [
  { codigo: 'IFCD0210', nombre: 'Desarrollo de aplicaciones con tecnologías web', familia: 'Informática', horas: 590, modalidad: 'Presencial / Mixta' },
  { codigo: 'IFCD0110', nombre: 'Confección y publicación de páginas web', familia: 'Informática', horas: 560, modalidad: 'Presencial' },
  { codigo: 'SSCE0110', nombre: 'Docencia de la formación profesional para el empleo', familia: 'Docencia', horas: 380, modalidad: 'Presencial / Teleformación' },
  { codigo: 'FCOI02', nombre: 'Competencias digitales básicas y herramientas IA', familia: 'Competencias Digitales', horas: 60, modalidad: 'Teleformación' },
  { codigo: 'IFCT0309', nombre: 'Programación de sistemas informáticos', familia: 'Informática', horas: 590, modalidad: 'Presencial' },
];

type N8nScenario = 'form-to-crm' | 'edtech-ai-tutor' | 'schedule-sync';

const N8N_SCENARIOS: Record<
  N8nScenario,
  {
    name: string;
    trigger: string;
    nodes: { id: string; title: string; service: string; action: string }[];
    sampleOutput: Record<string, string | boolean | number>;
  }
> = {
  'form-to-crm': {
    name: 'Captación web → Validación → Notificación',
    trigger: 'Webhook POST (/webhook/contacto)',
    nodes: [
      { id: 'n1', title: 'Webhook Trigger', service: 'HTTP', action: 'Recibe JSON del formulario web' },
      { id: 'n2', title: 'Set & Sanitize', service: 'Transform', action: 'Normaliza correo, fecha y etiqueta' },
      { id: 'n3', title: 'IF Spam Check', service: 'Logic', action: 'Filtra honeypot y campos válidos' },
      { id: 'n4', title: 'DB & Email', service: 'PostgreSQL / SMTP', action: 'Guarda registro y envía aviso' },
    ],
    sampleOutput: {
      workflow: 'contacto-web-n8n',
      status: 'success',
      validated: true,
      routedTo: 'info@creamiproyecto.com',
      nodesExecuted: 4,
    },
  },
  'edtech-ai-tutor': {
    name: 'Entrega alumnado → Resumen IA → Feedback',
    trigger: 'Webhook / Formulario Aula',
    nodes: [
      { id: 'n1', title: 'Student Submit', service: 'Webhook', action: 'Recibe ejercicio HTML5 del alumno' },
      { id: 'n2', title: 'AI Evaluator', service: 'LLM Node', action: 'Comprueba etiquetas semánticas y accesibilidad' },
      { id: 'n3', title: 'Format Feedback', service: 'Code (JS)', action: 'Estructura sugerencias didácticas claras' },
      { id: 'n4', title: 'Notify Student', service: 'Email / Sheet', action: 'Registra progreso y envía guía' },
    ],
    sampleOutput: {
      workflow: 'evaluacion-formativa-ia',
      status: 'success',
      semanticScore: 'OK (<main>, <header>, <label>)',
      feedbackSent: true,
      nodesExecuted: 4,
    },
  },
  'schedule-sync': {
    name: 'Cron diario → Consulta API → Alerta novedades',
    trigger: 'Schedule Trigger (08:30)',
    nodes: [
      { id: 'n1', title: 'Cron 08:30', service: 'Schedule', action: 'Dispara ejecución diaria automática' },
      { id: 'n2', title: 'HTTP Request', service: 'API REST', action: 'Consulta nuevas convocatorias o registros' },
      { id: 'n3', title: 'Merge & Diff', service: 'Compare', action: 'Detecta únicamente elementos nuevos' },
      { id: 'n4', title: 'Digest Alert', service: 'Telegram / Mail', action: 'Envía resumen estructurado' },
    ],
    sampleOutput: {
      workflow: 'sincronizacion-api-programada',
      status: 'success',
      newItemsDetected: 3,
      duplicatesSkipped: 14,
      nodesExecuted: 4,
    },
  },
};

export function InteractiveLab() {
  const [activeTab, setActiveTab] = useState<LabTab>('html5');

  // Lab 1: HTML5 Semantic Builder state
  const [blocks, setBlocks] = useState<SemanticBlock[]>(INITIAL_BLOCKS);
  const [pageTitle, setPageTitle] = useState('Mi plantilla semántica HTML5');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [htmlViewMode, setHtmlViewMode] = useState<'schema' | 'result'>('schema');

  // Lab 2: React Email Variable Simulator state
  const [emailVars, setEmailVars] = useState({
    nombre: 'Laura',
    empresa: 'Aula Digital Canarias',
    recurso: 'Guía práctica de HTML5 y accesibilidad',
  });
  const [emailViewport, setEmailViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [emailMode, setEmailMode] = useState<'preview' | 'tsx'>('preview');

  // Lab 3: Data Filter & CSV Export state
  const [dataSearch, setDataSearch] = useState('');
  const [dataFamily, setDataFamily] = useState('Todas');
  const [maxHours, setMaxHours] = useState(600);
  const [showCsvResult, setShowCsvResult] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Lab 4: n8n Workflow Simulator state
  const [n8nScenario, setN8nScenario] = useState<N8nScenario>('form-to-crm');
  const [executedSteps, setExecutedSteps] = useState<number>(4);
  const [showN8nResult, setShowN8nResult] = useState(true);
  const [hoveredIdeaId, setHoveredIdeaId] = useState<string>(RESEARCH_LAB_IDEAS[0]?.id ?? '');

  const activeWorkflow = N8N_SCENARIOS[n8nScenario];

  const handleRunWorkflow = () => {
    setExecutedSteps(1);
    setTimeout(() => setExecutedSteps(2), 200);
    setTimeout(() => setExecutedSteps(3), 400);
    setTimeout(() => setExecutedSteps(4), 600);
  };

  const addBlock = (type: SemanticBlockType) => {
    const meta = AVAILABLE_BLOCKS.find((b) => b.type === type);
    setBlocks((prev) => [
      ...prev,
      {
        uid: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        label: meta ? meta.hint : type,
      },
    ]);
  };

  const removeBlock = (uid: string) => {
    setBlocks((prev) => prev.filter((b) => b.uid !== uid));
  };

  const generatedHtml = useMemo(() => {
    const inner = blocks
      .map((b) => {
        if (b.type === 'form') {
          return `  <form aria-label="Contacto">\n    <label for="email">Correo electrónico</label>\n    <input id="email" type="email" required />\n    <button type="submit">Enviar</button>\n  </form>`;
        }
        return `  <${b.type}>${b.label}</${b.type}>`;
      })
      .join('\n');

    return `<!doctype html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <title>${pageTitle}</title>\n</head>\n<body>\n${inner}\n</body>\n</html>`;
  }, [blocks, pageTitle]);

  const renderedHtmlDocument = useMemo(() => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const safeTitle = escapeHtml(pageTitle || 'Plantilla HTML5');
    const bodyMarkup = blocks
      .map((b) => {
        const safeLabel = escapeHtml(b.label);
        if (b.type === 'header') {
          return `<header><h1>${safeTitle}</h1><p>${safeLabel}</p></header>`;
        }
        if (b.type === 'nav') {
          return `<nav aria-label="Navegación"><span>Inicio</span><span>Recursos</span><span>Contacto</span></nav>`;
        }
        if (b.type === 'main') {
          return `<main><h2>Contenido principal</h2><p>${safeLabel}</p></main>`;
        }
        if (b.type === 'article') {
          return `<article><h3>Bloque temático</h3><p>${safeLabel}</p></article>`;
        }
        if (b.type === 'form') {
          return `<form onsubmit="return false"><label for="email">Correo electrónico</label><input id="email" type="email" placeholder="nombre@ejemplo.com" required /><button type="submit">Enviar</button></form>`;
        }
        return `<footer><small>${safeLabel}</small></footer>`;
      })
      .join('\n');

    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #f8fafc; line-height: 1.5; }
    header { background: #2563eb; color: #fff; padding: 14px 16px; border-radius: 10px; margin-bottom: 10px; }
    header h1 { margin: 0; font-size: 1rem; }
    header p { margin: 4px 0 0; font-size: 0.75rem; opacity: 0.9; }
    nav { display: flex; gap: 12px; background: #e0e7ff; color: #312e81; padding: 8px 14px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; margin-bottom: 10px; }
    main, article { background: #ffffff; border: 1px solid #cbd5e1; padding: 14px 16px; border-radius: 10px; margin-bottom: 10px; }
    main h2, article h3 { margin: 0 0 6px; font-size: 0.875rem; color: #0f172a; }
    main p, article p { margin: 0; font-size: 0.75rem; color: #475569; }
    form { background: #fff7ed; border: 1px solid #fed7aa; padding: 14px 16px; border-radius: 10px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; }
    form label { font-size: 0.75rem; font-weight: 600; color: #9a3412; }
    form input { padding: 7px 10px; border: 1px solid #fdba74; border-radius: 6px; font-size: 0.75rem; }
    form button { align-self: flex-start; background: #f97316; color: #fff; border: 0; border-radius: 6px; padding: 7px 14px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
    footer { background: #e2e8f0; color: #334155; padding: 10px 14px; border-radius: 8px; font-size: 0.75rem; text-align: center; }
  </style>
</head>
<body>
${bodyMarkup || '<p style="text-align:center;color:#64748b;font-size:0.8125rem;">Añade bloques para visualizar la página generada.</p>'}
</body>
</html>`;
  }, [blocks, pageTitle]);

  const semanticChecks = useMemo(() => {
    const mainCount = blocks.filter((b) => b.type === 'main').length;
    const hasHeader = blocks.some((b) => b.type === 'header');
    const hasFooter = blocks.some((b) => b.type === 'footer');
    return [
      { label: 'Un único <main> en el documento', ok: mainCount === 1 },
      { label: 'Cabecera semántica <header>', ok: hasHeader },
      { label: 'Pie estructural <footer>', ok: hasFooter },
      { label: 'Título de documento definido', ok: pageTitle.trim().length > 3 },
    ];
  }, [blocks, pageTitle]);

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1800);
    } catch {
      setCopiedHtml(false);
    }
  };

  const tsxEmailCode = `import { Html, Body, Container, Heading, Text, Button } from '@react-email/components';

export function BienvenidaEmail({
  nombre = "${emailVars.nombre}",
  empresa = "${emailVars.empresa}",
  recurso = "${emailVars.recurso}",
}) {
  return (
    <Html lang="es">
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Container style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <Heading as="h2">Hola, {nombre}</Heading>
          <Text>
            Desde {empresa} compartimos contigo: {recurso}.
          </Text>
          <Button href="https://ivandevs.netlify.app/">Acceder al recurso</Button>
        </Container>
      </Body>
    </Html>
  );
}`;

  const filteredModules = useMemo(() => {
    return SAMPLE_MODULES.filter((row) => {
      if (dataFamily !== 'Todas' && row.familia !== dataFamily) return false;
      if (row.horas > maxHours) return false;
      if (dataSearch.trim()) {
        const q = dataSearch.toLowerCase();
        if (
          !row.codigo.toLowerCase().includes(q) &&
          !row.nombre.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [dataSearch, dataFamily, maxHours]);

  const csvOutput = useMemo(() => {
    const header = 'Codigo,Denominacion,Familia,Horas,Modalidad\n';
    const rows = filteredModules
      .map(
        (m) =>
          `"${m.codigo}","${m.nombre}","${m.familia}",${m.horas},"${m.modalidad}"`
      )
      .join('\n');
    return header + rows;
  }, [filteredModules]);

  const handleDownloadCsv = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'muestra_formativa_lab.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csvOutput);
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 1800);
    } catch {
      setCopiedCsv(false);
    }
  };

  return (
    <section
      id="laboratorio"
      className="py-16 sm:py-20 bg-[#E9EEF5] dark:bg-slate-950 border-b border-slate-300/70 dark:border-slate-800"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wide text-teal-700 dark:text-teal-400">
              Laboratorio interactivo · Demos funcionales en vivo
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Experimenta cómo construyo, automatizo y enseño
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Cuatro micro-aplicaciones interactivas para probar semántica HTML5, plantillas
              dinámicas, filtrado exportable y flujos de automatización n8n.
            </p>
          </div>
        </div>

        {/* Lab Selector Tabs */}
        <div
          className="mt-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Seleccionar experimento del laboratorio"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'html5'}
            onClick={() => setActiveTab('html5')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'html5'
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Code2 className="h-4 w-4 text-orange-400" />
            <span>1. Constructor HTML5</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'email'}
            onClick={() => setActiveTab('email')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'email'
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="h-4 w-4 text-indigo-400" />
            <span>2. Simulador React Email</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'data'
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Table2 className="h-4 w-4 text-teal-400" />
            <span>3. Filtro y CSV</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'n8n'}
            onClick={() => setActiveTab('n8n')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'n8n'
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Workflow className="h-4 w-4 text-rose-400" />
            <span>4. Workflows n8n</span>
          </button>
        </div>

        {/* Interactive Lab Workspace Container */}
        <div className="mt-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6">
          {/* LAB 1: HTML5 SEMANTIC BUILDER */}
          {activeTab === 'html5' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Constructor Semántico (inspirado en Plantillas HTML5 y Formularios)
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Añade etiquetas HTML5 para construir la estructura y valida buenas prácticas de
                    accesibilidad en tiempo real.
                  </p>
                </div>

                <div>
                  <label htmlFor="lab-page-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Título del documento (&lt;title&gt;)
                  </label>
                  <input
                    id="lab-page-title"
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Añadir etiqueta semántica:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {AVAILABLE_BLOCKS.map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => addBlock(item.type)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                      >
                        <Plus className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Estructura actual ({blocks.length} bloques)
                    </p>
                    <button
                      type="button"
                      onClick={() => setBlocks(INITIAL_BLOCKS)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reiniciar</span>
                    </button>
                  </div>

                  <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                    {blocks.map((block) => (
                      <div
                        key={block.uid}
                        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-semibold text-orange-700 dark:text-orange-400">
                            &lt;{block.type}&gt;
                          </span>
                          <span className="truncate text-slate-700 dark:text-slate-300">
                            {block.label}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.uid)}
                          aria-label={`Eliminar ${block.type}`}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Comprobación didáctica
                  </p>
                  {semanticChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          check.ok
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                      <span
                        className={
                          check.ok
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-500 dark:text-slate-500'
                        }
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {htmlViewMode === 'result'
                        ? 'Resultado renderizado en navegador'
                        : 'Previsualización visual del esquema'}
                    </p>
                    <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-800 p-1">
                      <button
                        type="button"
                        onClick={() => setHtmlViewMode('schema')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          htmlViewMode === 'schema'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Esquema
                      </button>
                      <button
                        type="button"
                        onClick={() => setHtmlViewMode('result')}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          htmlViewMode === 'result'
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Ver resultado</span>
                      </button>
                    </div>
                  </div>

                  {htmlViewMode === 'schema' ? (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-2">
                      {blocks.length === 0 ? (
                        <p className="py-8 text-center text-xs text-slate-400">
                          Añade etiquetas desde el panel izquierdo para construir la plantilla.
                        </p>
                      ) : (
                        blocks.map((b) => (
                          <div
                            key={b.uid}
                            className={`rounded-lg border px-3 py-2 text-xs ${
                              b.type === 'header'
                                ? 'border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 font-semibold'
                                : b.type === 'nav'
                                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100'
                                  : b.type === 'main' || b.type === 'article'
                                    ? 'border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/50 text-teal-950 dark:text-teal-100 py-4'
                                    : b.type === 'form'
                                      ? 'border-orange-200 dark:border-orange-800 bg-orange-50/60 dark:bg-orange-950/50 text-orange-950 dark:text-orange-100'
                                      : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <span className="font-mono text-[0.6875rem] opacity-75 mr-2">
                              &lt;{b.type}&gt;
                            </span>
                            <span>{b.label}</span>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-1.5 text-[0.6875rem] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-400" />
                          <span className="h-2 w-2 rounded-full bg-amber-400" />
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>
                        <span className="truncate font-mono">{pageTitle || 'index.html'}</span>
                        <span className="font-semibold text-orange-600">HTML5 Live</span>
                      </div>
                      <iframe
                        title="Resultado HTML5 en vivo"
                        srcDoc={renderedHtmlDocument}
                        sandbox=""
                        className="h-64 w-full bg-[#f8fafc]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 rounded-xl bg-slate-950 p-4 text-slate-100 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-slate-400">index.html</span>
                    <button
                      type="button"
                      onClick={handleCopyHtml}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedHtml ? 'Copiado' : 'Copiar HTML'}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-sky-200">
                    <code>{generatedHtml}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* LAB 2: REACT EMAIL VARIABLE SIMULATOR */}
          {activeTab === 'email' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Simulador de Variables (inspirado en React Email Studio)
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Prueba cómo cambian el diseño final y las props TSX al modificar variables
                    dinámicas de destinatario.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="email-var-nombre" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {`Variable {{nombre}}`}
                    </label>
                    <input
                      id="email-var-nombre"
                      type="text"
                      value={emailVars.nombre}
                      onChange={(e) => setEmailVars({ ...emailVars, nombre: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email-var-empresa" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {`Variable {{empresa}}`}
                    </label>
                    <input
                      id="email-var-empresa"
                      type="text"
                      value={emailVars.empresa}
                      onChange={(e) => setEmailVars({ ...emailVars, empresa: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email-var-recurso" className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {`Variable {{recurso}}`}
                    </label>
                    <input
                      id="email-var-recurso"
                      type="text"
                      value={emailVars.recurso}
                      onChange={(e) => setEmailVars({ ...emailVars, recurso: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setEmailMode('preview')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        emailMode === 'preview'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver resultado</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailMode('tsx')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        emailMode === 'tsx'
                          ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Componente TSX
                    </button>
                  </div>

                  {emailMode === 'preview' && (
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                      <button
                        type="button"
                        onClick={() => setEmailViewport('desktop')}
                        aria-label="Vista escritorio"
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          emailViewport === 'desktop'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        <span>Escritorio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmailViewport('mobile')}
                        aria-label="Vista móvil"
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          emailViewport === 'mobile'
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Móvil</span>
                      </button>
                    </div>
                  )}
                </div>

                {emailMode === 'preview' ? (
                  <div className="flex justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-5">
                    <div
                      className={`w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-all ${
                        emailViewport === 'mobile' ? 'max-w-[320px]' : 'max-w-[540px]'
                      }`}
                    >
                      <p className="font-mono text-[0.6875rem] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {emailVars.empresa || 'Empresa'}
                      </p>
                      <h4 className="mt-2 font-display text-xl font-bold text-slate-950 dark:text-white">
                        Hola, {emailVars.nombre || 'estudiante'}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        Desde <strong>{emailVars.empresa || 'nuestro equipo'}</strong> te enviamos el
                        acceso directo a <strong>{emailVars.recurso || 'tu material'}</strong>.
                      </p>
                      <div className="mt-5">
                        <span className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
                          Acceder al recurso
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-indigo-200 border border-slate-800">
                    <code>{tsxEmailCode}</code>
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* LAB 3: DATA FILTER & CSV EXPORT */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Filtro multicriterio y exportación (Catálogo SEPE e InnovaPyme Canarias)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Muestra ilustrativa interactiva con filtrado en cliente y descarga real en formato CSV.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => setShowCsvResult((prev) => !prev)}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      showCsvResult
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-teal-400'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{showCsvResult ? 'Ocultar resultado CSV' : 'Ver resultado'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCsv}
                    disabled={filteredModules.length === 0}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-45"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exportar CSV ({filteredModules.length})</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <input
                  type="search"
                  value={dataSearch}
                  onChange={(e) => setDataSearch(e.target.value)}
                  placeholder="Filtrar por código (ej. IFCD) o denominación..."
                  aria-label="Filtrar muestra formativa"
                  className="sm:col-span-5 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                />

                <select
                  aria-label="Filtrar por familia"
                  value={dataFamily}
                  onChange={(e) => setDataFamily(e.target.value)}
                  className="sm:col-span-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                >
                  <option value="Todas">Familia: Todas</option>
                  <option value="Informática">Informática</option>
                  <option value="Docencia">Docencia</option>
                  <option value="Competencias Digitales">Competencias Digitales</option>
                </select>

                <div className="sm:col-span-4 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 h-10">
                  <label htmlFor="max-hours-range" className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    Hasta <strong className="tabular-nums text-slate-900 dark:text-white">{maxHours}h</strong>
                  </label>
                  <input
                    id="max-hours-range"
                    type="range"
                    min={60}
                    max={600}
                    step={20}
                    value={maxHours}
                    onChange={(e) => setMaxHours(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5">Código</th>
                      <th className="px-4 py-2.5">Denominación</th>
                      <th className="px-4 py-2.5">Familia</th>
                      <th className="px-4 py-2.5 text-right">Horas</th>
                      <th className="px-4 py-2.5">Modalidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {filteredModules.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                          Sin resultados con el filtro actual.
                        </td>
                      </tr>
                    ) : (
                      filteredModules.map((row) => (
                        <tr key={row.codigo} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60">
                          <td className="px-4 py-2.5 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                            {row.codigo}
                          </td>
                          <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200">{row.nombre}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400">{row.familia}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-slate-900 dark:text-white">
                            {row.horas} h
                          </td>
                          <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400">{row.modalidad}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {showCsvResult && (
                <div className="rounded-xl bg-slate-950 p-4 text-slate-100 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-teal-300">
                      Resultado generado · muestra_formativa_lab.csv ({filteredModules.length} registros)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCsv}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>{copiedCsv ? 'Copiado' : 'Copiar CSV'}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-teal-200">
                    <code>{csvOutput}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* LAB 4: N8N WORKFLOW AUTOMATION SIMULATOR */}
          {activeTab === 'n8n' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Simulador de Flujos y Automatizaciones n8n
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Selecciona un patrón de automatización y ejecuta la secuencia de nodos para ver
                    cómo se conectan triggers, lógica condicional, IA y APIs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => setShowN8nResult((prev) => !prev)}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      showN8nResult
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{showN8nResult ? 'Ocultar resultado' : 'Ver resultado'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowN8nResult(true);
                      handleRunWorkflow();
                    }}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Simular ejecución</span>
                  </button>
                </div>
              </div>

              {/* Scenario Switcher */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(N8N_SCENARIOS) as N8nScenario[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setN8nScenario(key);
                      setExecutedSteps(4);
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      n8nScenario === key
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {N8N_SCENARIOS[key].name}
                  </button>
                ))}
              </div>

              {/* Visual Node Canvas */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                <p className="mb-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                  Trigger: {activeWorkflow.trigger}
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  {activeWorkflow.nodes.map((node, index) => {
                    const isDone = index < executedSteps;
                    return (
                      <div key={node.id} className="relative flex items-center gap-2">
                        <div
                          className={`w-full rounded-xl border p-3.5 transition-all ${
                            isDone
                              ? 'border-emerald-400 dark:border-emerald-700 bg-white dark:bg-slate-900 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[0.6875rem] font-mono">
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              {node.service}
                            </span>
                            {isDone && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <p className="mt-1.5 font-display text-sm font-bold text-slate-950 dark:text-white">
                            {node.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            {node.action}
                          </p>
                        </div>
                        {index < activeWorkflow.nodes.length - 1 && (
                          <ArrowRight className="hidden md:block h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* JSON Output */}
              {showN8nResult && (
                <div className="rounded-xl bg-slate-950 p-4 text-slate-100 border border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <p className="font-mono text-xs text-slate-400">
                      Resultado de ejecución del flujo ({executedSteps}/4 nodos)
                    </p>
                    <span className="font-mono text-[0.6875rem] font-semibold text-emerald-400">
                      {executedSteps === 4 ? 'Completado · 200 OK' : `Ejecutando nodo ${executedSteps}...`}
                    </span>
                  </div>
                  <pre className="overflow-x-auto font-mono text-xs text-emerald-300">
                    <code>{JSON.stringify(activeWorkflow.sampleOutput, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clearly Separated Research & Prototypes Section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <FlaskConical className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Líneas en investigación y prototipos (diferenciados de proyectos publicados)</span>
          </div>

          <div
            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3"
            onMouseLeave={() => setHoveredIdeaId(RESEARCH_LAB_IDEAS[0]?.id ?? '')}
          >
            {RESEARCH_LAB_IDEAS.map((idea, idx) => {
              const isActive = hoveredIdeaId === idea.id;
              const isDimmed = hoveredIdeaId !== '' && !isActive;
              const ideaTheme =
                idx === 0
                  ? 'border-teal-500 dark:border-teal-400 bg-teal-50/90 dark:bg-teal-950/45 ring-2 ring-teal-500/25 shadow-lg shadow-teal-500/15'
                  : idx === 1
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/90 dark:bg-indigo-950/45 ring-2 ring-indigo-500/25 shadow-lg shadow-indigo-500/15'
                    : 'border-orange-500 dark:border-orange-400 bg-orange-50/90 dark:bg-orange-950/45 ring-2 ring-orange-500/25 shadow-lg shadow-orange-500/15';

              return (
                <div
                  key={idea.id}
                  onMouseEnter={() => setHoveredIdeaId(idea.id)}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 cursor-default ${
                    isActive
                      ? `-translate-y-1 ${ideaTheme}`
                      : isDimmed
                        ? 'border-dashed border-slate-300/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-900/55 opacity-60 saturate-[0.75]'
                        : 'border-dashed border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-900/75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                        {idea.stage}
                      </span>
                      <span>{idea.connection}</span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold text-slate-950 dark:text-white">
                      {idea.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {idea.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
