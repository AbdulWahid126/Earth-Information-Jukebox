import type { Metadata } from 'next';
import ExplorerCatalog from '@/components/explorer/ExplorerCatalog';
import { Compass, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Earth Explorer — NASA Observation Catalog',
  description:
    'Explore verified NASA Earth observation visualizations and telemetry datasets spanning atmospheric anomalies, cryosphere topography, and ocean currents.',
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-deep-space py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/5 px-3 py-1 mb-3">
            <Compass className="h-3.5 w-3.5 text-nasa-cyan" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
              NASA Observation Telemetry Catalog
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            EARTH EXPLORER.
          </h1>

          <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">
            Browse verified NASA satellite composites, environmental anomaly maps, 
            and documented calibration legends prepared for client-side computer vision 
            and data sonification.
          </p>
        </header>

        {/* Main Catalog Viewport */}
        <main>
          <ExplorerCatalog />
        </main>

      </div>
    </div>
  );
}
