import Link from 'next/link';
import { Globe, ExternalLink, Radio } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Explore Earth', href: '/explore' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
] as const;

export default function Footer() {
  return (
    <footer
      className="border-t border-hairline bg-space-black relative z-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand & Mission Briefing (4 cols) */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2.5 transition-opacity hover:opacity-85"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-hairline-accent bg-chassis-panel">
                <Globe className="h-4 w-4 text-nasa-cyan" strokeWidth={1.75} />
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-text-primary uppercase">
                Earth Information Jukebox
              </span>
            </Link>
            
            <p className="max-w-md text-sm leading-relaxed text-text-secondary mb-4">
              An open-source scientific laboratory transforming NASA Earth observation 
              visualizations into structured musical soundscapes using browser-based 
              computer vision (OpenCV.js) and polyphonic audio synthesis (Tone.js).
            </p>

            <div className="inline-flex items-center gap-2 rounded-xs border border-hairline bg-chassis-panel px-3 py-1.5 font-mono text-[10px] text-text-muted">
              <Radio className="h-3 w-3 text-biosphere-emerald" />
              <span>JAMSTACK CLIENT ARCHITECTURE // ZERO BACKEND OVERHEAD</span>
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-mono text-[10px] font-bold tracking-widest text-text-primary uppercase">
              Mission Views
            </h3>
            <ul className="space-y-2.5 font-mono text-xs">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-secondary transition-colors hover:text-nasa-cyan flex items-center gap-1.5"
                  >
                    <span className="text-[9px] text-text-muted">/</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Technologies (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-mono text-[10px] font-bold tracking-widest text-text-primary uppercase">
              Core Stack
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary font-mono">
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-nasa-cyan" />
                <span>Next.js App Router</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-telemetry-amber" />
                <span>OpenCV.js (WASM)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-biosphere-emerald" />
                <span>Tone.js / Web Audio</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-text-secondary" />
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>

          {/* Attribution & Disclaimer (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 font-mono text-[10px] font-bold tracking-widest text-text-primary uppercase">
              NASA Attribution
            </h3>
            <p className="text-xs leading-relaxed text-text-secondary mb-3">
              Imagery, rasters, and sensor telemetry courtesy of NASA Earth Observatory, 
              NASA Goddard Space Flight Center (GSFC), and NASA Jet Propulsion Laboratory (JPL).
            </p>
            <a
              href="https://earthobservatory.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-nasa-cyan hover:underline"
            >
              <span>NASA Earth Observatory</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
            Earth Information Jukebox © 2026 // NASA Space Apps Challenge
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-text-muted uppercase">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>Client-Side Sonification</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
