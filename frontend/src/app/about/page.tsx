import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the Earth Information Jukebox — a NASA Space Apps Challenge project transforming Earth observation data into musical soundscapes.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 sm:px-6">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-sm border border-hairline bg-chassis-panel">
          <Info className="h-7 w-7 text-telemetry-amber" strokeWidth={1.5} />
        </div>

        <span className="mb-3 font-mono text-[10px] font-semibold tracking-wider text-telemetry-amber uppercase">
          About the Project
        </span>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          About
        </h1>

        <p className="mb-3 text-base leading-relaxed text-text-secondary">
          Earth Information Jukebox is a NASA Space Apps Challenge project that
          transforms NASA Earth observation visualizations into immersive
          musical soundscapes. Built entirely as a client-side web application,
          it uses browser-based computer vision and real-time audio synthesis to
          make planetary science accessible through sound.
        </p>

        <p className="mb-8 text-sm leading-relaxed text-text-muted">
          Full project documentation, team information, and technical credits
          will be added here during the deployment phase.
        </p>

        <div className="flex items-center gap-2 rounded-sm border border-hairline bg-chassis-panel px-4 py-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-telemetry-amber" />
          <span className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
            Status: Content Pending
          </span>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
