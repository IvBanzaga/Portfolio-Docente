import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { FormEvent, useMemo, useRef, useState } from 'react';
import { PROFILE } from '../data/profile';

interface AntiSpamChallenge {
  question: string;
  expected: string;
}

function createAntiSpamChallenge(previousQuestion?: string): AntiSpamChallenge {
  for (let attempt = 0; attempt < 8; attempt++) {
    const mode = Math.floor(Math.random() * 3);
    let question = '';
    let expected = '';

    if (mode === 0) {
      const a = Math.floor(Math.random() * 12) + 2; // 2..13
      const b = Math.floor(Math.random() * 9) + 1; // 1..9
      question = `${a} + ${b}`;
      expected = String(a + b);
    } else if (mode === 1) {
      const b = Math.floor(Math.random() * 7) + 2; // 2..8
      const diff = Math.floor(Math.random() * 10) + 2; // 2..11
      const a = b + diff;
      question = `${a} - ${b}`;
      expected = String(diff);
    } else {
      const a = Math.floor(Math.random() * 5) + 2; // 2..6
      const b = Math.floor(Math.random() * 4) + 2; // 2..5
      question = `${a} × ${b}`;
      expected = String(a * b);
    }

    if (question !== previousQuestion) {
      return { question, expected };
    }
  }

  const a = Math.floor(Math.random() * 8) + 3;
  const b = Math.floor(Math.random() * 7) + 2;
  return { question: `${a} + ${b}`, expected: String(a + b) };
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Desarrollo de aplicación web');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [humanAnswer, setHumanAnswer] = useState('');
  const [challenge, setChallenge] = useState<AntiSpamChallenge>(() => createAntiSpamChallenge());
  const [error, setError] = useState<string | null>(null);
  const [sendFallbackAvailable, setSendFallbackAvailable] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const mountedAtRef = useRef<number>(Date.now());

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyMessage = async () => {
    const summary = `Para: ${PROFILE.email}\nNombre: ${name.trim()}\nCorreo: ${email.trim()}\nAsunto: ${topic}\n\n${message.trim()}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2200);
    } catch {
      setCopiedMessage(false);
    }
  };

  const handleRefreshChallenge = () => {
    setChallenge((prev) => createAntiSpamChallenge(prev.question));
    setHumanAnswer('');
    setError(null);
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`[Portfolio] ${topic}: ${name || 'Consulta'}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nCorreo: ${email}\nMotivo: ${topic}\n\n${message}`
    );
    return `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  }, [name, email, topic, message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSendFallbackAvailable(false);

    if (honeypot.trim() !== '') {
      setError('No se pudo validar el envío.');
      return;
    }

    if (Date.now() - mountedAtRef.current < 1500) {
      setError('Por favor, revisa los campos antes de enviar.');
      return;
    }

    if (name.trim().length < 2) {
      setError('Introduce tu nombre (mínimo 2 caracteres).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Introduce un correo electrónico válido.');
      return;
    }

    if (message.trim().length < 15) {
      setError('Cuéntame brevemente en qué puedo ayudarte (mínimo 15 caracteres).');
      return;
    }

    if (humanAnswer.trim() !== challenge.expected) {
      setError('La respuesta de verificación antispam no es correcta. Inténtalo de nuevo.');
      setChallenge((prev) => createAntiSpamChallenge(prev.question));
      setHumanAnswer('');
      return;
    }

    setIsSending(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 22000);

    try {
      const customWebhook = import.meta.env.VITE_CONTACT_WEBHOOK_URL?.trim();
      const endpoint =
        customWebhook || 'https://formsubmit.co/ajax/d68db123b4fb0a8382a0967b4175d136';

      const payload = customWebhook
        ? {
            name: name.trim(),
            email: email.trim(),
            topic,
            message: message.trim(),
            source: 'portfolio-ivan-bazaga',
            sentAt: new Date().toISOString(),
          }
        : {
            name: name.trim(),
            email: email.trim(),
            _replyto: email.trim(),
            asunto: topic,
            message: message.trim(),
            _subject: `[Portfolio] ${topic}: ${name.trim()}`,
            _template: 'table',
            _captcha: 'false',
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);

      if (
        !response.ok ||
        (data && (data.success === false || data.success === 'false'))
      ) {
        const serverMsg =
          data && typeof data.message === 'string' ? data.message : '';
        if (/activat/i.test(serverMsg)) {
          throw new Error(
            `El servicio de formulario requiere activar ${PROFILE.email} desde el correo de confirmación de FormSubmit (revisa Spam). Mientras tanto, puedes enviarlo desde tu gestor de correo.`
          );
        }
        throw new Error(
          `El servidor de correo externo no aceptó el envío en este momento. Puedes enviarlo directamente desde tu gestor de correo a ${PROFILE.email}.`
        );
      }

      setSubmitted(true);
    } catch (err) {
      setSendFallbackAvailable(true);
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError(
          `El servicio de envío automático tardó demasiado en responder (timeout). Puedes enviar el mensaje al instante desde tu gestor de correo hacia ${PROFILE.email} o copiarlo abajo.`
        );
      } else if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError(
          `No se pudo enviar automáticamente en este momento. Puedes reintentar o enviarlo directamente desde tu gestor de correo hacia ${PROFILE.email}.`
        );
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setHumanAnswer('');
    setChallenge((prev) => createAntiSpamChallenge(prev.question));
    setError(null);
    setSendFallbackAvailable(false);
  };

  return (
    <section id="contacto" className="py-16 sm:py-20 bg-[#F2F5F9] dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Info & Profiles */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                Contacto profesional
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Hablemos de tu próximo proyecto, automatización o formación
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Disponible para colaboraciones de desarrollo web full-stack, flujos de automatización
                en n8n, creación de recursos educativos digitales y docencia tecnológica.
              </p>

              {/* Direct Email Card */}
              <div className="mt-6 rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-[#E9EEF5] dark:bg-slate-950 p-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Correo profesional
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="font-mono text-sm font-semibold text-slate-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Profiles List: ONLY GitHub, LinkedIn, X, and Current Portfolio */}
              <div className="mt-6 space-y-2.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Perfiles profesionales
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href={PROFILE.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
                        <Github className="h-3.5 w-3.5" />
                      </span>
                      <span>GitHub</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>

                  <a
                    href={PROFILE.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                        <Linkedin className="h-3.5 w-3.5" />
                      </span>
                      <span>LinkedIn</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>

                  <a
                    href={PROFILE.links.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
                        <XIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>X (Twitter)</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>

                  <a
                    href={PROFILE.links.currentPortfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span>Portfolio anterior</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* CV Action -> LinkedIn */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <a
                href={PROFILE.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Resumen CV en LinkedIn</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Form with Validation, Direct Email Delivery & Dynamic Anti-Spam */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-300/80 dark:border-slate-800 bg-[#E9EEF5] dark:bg-slate-950 p-5 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                    Mensaje enviado correctamente
                  </h3>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Gracias, <strong>{name}</strong>. Tu consulta sobre{' '}
                    <strong>{topic}</strong> se ha enviado directamente a{' '}
                    <strong>{PROFILE.email}</strong>. Responderé a <strong>{email}</strong> lo
                    antes posible.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex min-h-[44px] items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Enviar otro mensaje
                    </button>
                    <a
                      href={mailtoHref}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Abrir copia en mi correo</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="company_website">No rellenar este campo</label>
                    <input
                      id="company_website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Nombre completo
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Correo electrónico
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nombre@ejemplo.com"
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Ámbito de la consulta
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Desarrollo de aplicación web">Desarrollo de aplicación web</option>
                      <option value="Automatización y workflows con n8n">Automatización y workflows con n8n</option>
                      <option value="Docencia y formación tecnológica">Docencia y formación tecnológica</option>
                      <option value="Recursos educativos e IA">Recursos educativos e IA</option>
                      <option value="Colaboración / Oportunidad laboral">Colaboración / Oportunidad laboral</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Mensaje
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe brevemente el proyecto, flujo n8n, necesidad formativa o consulta..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                    <div className="sm:col-span-7">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="contact-antispam"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <span>Verificación antispam: ¿Cuánto es {challenge.question}?</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleRefreshChallenge}
                          aria-label="Cambiar pregunta antispam"
                          title="Generar otra pregunta"
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Cambiar</span>
                        </button>
                      </div>
                      <input
                        id="contact-antispam"
                        type="text"
                        inputMode="numeric"
                        required
                        value={humanAnswer}
                        onChange={(e) => setHumanAnswer(e.target.value)}
                        placeholder="Respuesta"
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <button
                        type="submit"
                        disabled={isSending}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Enviar mensaje</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="space-y-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-3 text-xs font-medium text-rose-800 dark:text-rose-200"
                    >
                      <p>{error}</p>
                      {sendFallbackAvailable && (
                        <div className="flex flex-wrap items-center gap-3 pt-0.5">
                          <a
                            href={mailtoHref}
                            className="inline-flex items-center gap-1.5 font-semibold text-rose-900 underline dark:text-rose-100"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Abrir en mi gestor de correo</span>
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyMessage}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-white/80 dark:bg-rose-900/40 px-2.5 py-1 font-semibold text-rose-900 dark:text-rose-100 hover:bg-white dark:hover:bg-rose-900/70"
                          >
                            {copiedMessage ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Mensaje copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copiar mensaje</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
