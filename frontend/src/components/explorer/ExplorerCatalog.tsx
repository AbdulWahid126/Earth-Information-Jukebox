'use client';

import { useState } from 'react';
import { NASA_DATASETS } from '@/lib/nasa/datasets';
import { EarthSystemCategory } from '@/types/dataset';
import DatasetDetailView from './DatasetDetailView';
import DatasetCard from './DatasetCard';
import { Filter, Layers, Database } from 'lucide-react';

const CATEGORIES: readonly ('All' | EarthSystemCategory)[] = [
  'All',
  'Atmosphere',
  'Cryosphere',
  'Hydrosphere',
] as const;

export default function ExplorerCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | EarthSystemCategory>('All');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('gistemp-temperature');

  const filteredDatasets = NASA_DATASETS.filter((ds) => {
    if (selectedCategory === 'All') return true;
    return ds.category === selectedCategory;
  });

  const selectedDataset = NASA_DATASETS.find((ds) => ds.id === selectedDatasetId) || NASA_DATASETS[0];

  return (
    <div className="space-y-12">
      {/* Category Filter Pills & Catalog Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-nasa-cyan" />
          <span className="text-text-muted uppercase tracking-wider text-[11px]">System Domain:</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xs px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-nasa-cyan text-space-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-chassis-panel text-text-secondary hover:text-text-primary hover:bg-chassis-surface border border-hairline'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-text-muted text-[10px]">
          <span>CATALOG: {filteredDatasets.length} DATASETS</span>
          <span>•</span>
          <span className="text-biosphere-emerald">1 INTEGRATED</span>
          <span>•</span>
          <span>2 PENDING</span>
        </div>
      </div>

      {/* Featured Active Dataset Detail View */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-[11px] text-text-muted uppercase tracking-wider">
          <Database className="h-3.5 w-3.5 text-nasa-cyan" />
          <span>Active Dataset Inspection Viewport</span>
        </div>
        <DatasetDetailView dataset={selectedDataset} />
      </div>

      {/* Dataset Catalog Grid */}
      <div className="pt-8 border-t border-hairline">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-text-primary uppercase tracking-wider">
            <Layers className="h-4 w-4 text-nasa-cyan" />
            <h3 className="font-bold">NASA Visualization Catalog Registry</h3>
          </div>
          <span className="font-mono text-[10px] text-text-muted uppercase">
            Click dataset card to inspect telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((ds) => (
            <DatasetCard
              key={ds.id}
              dataset={ds}
              isSelected={ds.id === selectedDatasetId}
              onSelect={(id) => setSelectedDatasetId(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
