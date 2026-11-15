import type { Metadata } from 'next';
import StudioWorkstation from '@/components/studio/StudioWorkstation';
import { Sliders, AudioLines } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sonification Studio — Earth Information Jukebox',
  description:
    'Interactive digital audio workstation and NASA Earth observation sonification laboratory. Analyze planetary features with OpenCV.js and synthesize real-time harmonic soundscapes using Tone.js.',
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-deep-space py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Studio Page Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/5 px-3 py-1 mb-3">
            <AudioLines className="h-3.5 w-3.5 text-nasa-cyan" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
              NASA Sonification Laboratory
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            SONIFICATION STUDIO.
          </h1>

          <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">
            Translate regional visual features from verified NASA Earth visualizations into harmonic, 
            multi-timbral audio soundscapes in real time using client-side computer vision and Tone.js synthesis.
          </p>
        </header>

        {/* Workstation Console */}
        <main>
          <StudioWorkstation />
        </main>
      </div>
    </div>
  );
}
