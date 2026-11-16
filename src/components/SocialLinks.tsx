import { Github, Linkedin } from 'lucide-react';
import { PROFILE } from '../data/profile';

interface SocialLinksProps {
  variant?: 'nav' | 'footer';
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialLinks({ variant = 'nav' }: SocialLinksProps) {
  const sizeClass = variant === 'nav' ? 'h-9 w-9' : 'h-10 w-10';
  const iconClass = variant === 'nav' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <div className="flex items-center gap-2 shrink-0" aria-label="Redes sociales de Iván Bazaga">
      <a
        href={PROFILE.links.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub de Iván Bazaga"
        title="GitHub"
        className={`inline-flex ${sizeClass} items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm transition-all duration-150 hover:scale-105 hover:shadow-md hover:shadow-indigo-500/25`}
      >
        <Github className={iconClass} />
      </a>

      <a
        href={PROFILE.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn de Iván Bazaga"
        title="LinkedIn"
        className={`inline-flex ${sizeClass} items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm transition-all duration-150 hover:scale-105 hover:shadow-md hover:shadow-blue-500/25`}
      >
        <Linkedin className={iconClass} />
      </a>

      <a
        href={PROFILE.links.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil en X de Iván Bazaga"
        title="X (Twitter)"
        className={`inline-flex ${sizeClass} items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm transition-all duration-150 hover:scale-105 hover:shadow-md hover:shadow-orange-500/25`}
      >
        <XIcon className={iconClass} />
      </a>
    </div>
  );
}
