'use client';

/**
 * Studio Workstation Component
 * Earth Information Jukebox — Dual-Modality Workstation + Presentation Readiness
 *
 * Dedicated digital audio workstation and NASA mission-control environment.
 * Houses two distinct, scientifically segregated sonification modalities:
 *   Mode A: 2D Spatial Visual Sonification (OpenCV.js WASM + Tone.js) with Custom Image Upload
 *   Mode B: Scientific Time-Series Sonification (1880–2026 NASA GISTEMP CSV + Tone.js)
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { NASA_DATASETS } from '@/lib/nasa/datasets';
import ImageAnalysisPanel from '@/components/explorer/ImageAnalysisPanel';
import TimeSeriesSonificationPanel from '@/components/timeseries/TimeSeriesSonificationPanel';
import { 
  Sliders, 
  Radio, 
  Layers, 
  Cpu, 
  Music, 
  Activity, 
  Compass, 
  Info,
  ExternalLink,
  Calendar,
  Scan,
  Lock
} from 'lucide-react';

export type StudioSonificationModality = 'scientific_timeseries' | 'spatial_visual';

export default function StudioWorkstation() {
  const [activeModality, setActiveModality] = useState<StudioSonificationModality>('scientific_timeseries');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('gistemp-temperature');

  const selectedDataset = NASA_DATASETS.find((d) => d.id === selectedDatasetId) || NASA_DATASETS[0];
  const isSelectedDatasetAvailable = selectedDataset.availability === 'available';

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Studio Mission Control Banner */}
      <div className="rounded-sm border border-hairline-bright bg-chassis-panel/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nasa-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nasa-cyan" />
            </span>
            <span className="font-bold text-nasa-cyan uppercase tracking-wider text-sm">
              AUDIO SYNTHESIZER LABORATORY // DUAL-MODALITY WORKSTATION
            </span>
          </div>
          <p className="text-text-muted text-[11px]">
            NASA Earth data sonification engine. Pure client-side Web Audio + OpenCV.js WASM execution.
          </p>
        </div>

        {/* Telemetry Hardware Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="rounded-xs border border-biosphere-emerald/40 bg-biosphere-emerald/10 px-2.5 py-1 text-biosphere-emerald font-bold uppercase">
            Tone.js Audio Engine
          </span>
          <span className="rounded-xs border border-hairline-accent bg-nasa-cyan/10 px-2.5 py-1 text-nasa-cyan font-bold uppercase">
            OpenCV.js 4.8 WASM
          </span>
          <span className="rounded-xs border border-hairline bg-chassis-base px-2.5 py-1 text-text-secondary uppercase">
            Zero Server Audio Compute
          </span>
        </div>
      </div>

      {/* Primary Modality Switcher */}
      <div className="rounded-sm border border-hairline-accent bg-chassis-base p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Mode B: Scientific Time-Series */}
          <button
            type="button"
            onClick={() => setActiveModality('scientific_timeseries')}
            className={`p-4 rounded-xs border text-left transition-all flex items-start gap-3.5 ${
              activeModality === 'scientific_timeseries'
                ? 'border-nasa-cyan bg-nasa-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.25)] ring-1 ring-nasa-cyan'
                : 'border-hairline bg-chassis-panel hover:bg-chassis-surface hover:border-hairline-bright'
            }`}
          >
            <div className={`p-2 rounded-xs shrink-0 ${
              activeModality === 'scientific_timeseries' ? 'bg-nasa-cyan text-space-black' : 'bg-chassis-base text-nasa-cyan'
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-sm text-text-primary">
                  Scientific Time-Series Mode
                </span>
                <span className="px-1.5 py-0.5 rounded-xs bg-biosphere-emerald/20 text-biosphere-emerald text-[9px] font-bold uppercase">
                  Verified Data (1880–2026)
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1 leading-normal">
                Sonify 147 years of empirical NASA global mean temperature anomalies. 
                Direct Celsius measurements relative to the 1951–1980 baseline mapped to calibrated musical pitch.
              </p>
            </div>
          </button>

          {/* Mode A: Spatial Visual Sonification */}
          <button
            type="button"
            onClick={() => setActiveModality('spatial_visual')}
            className={`p-4 rounded-xs border text-left transition-all flex items-start gap-3.5 ${
              activeModality === 'spatial_visual'
                ? 'border-telemetry-amber bg-telemetry-amber/10 shadow-[0_0_15px_rgba(255,179,0,0.25)] ring-1 ring-telemetry-amber'
                : 'border-hairline bg-chassis-panel hover:bg-chassis-surface hover:border-hairline-bright'
            }`}
          >
            <div className={`p-2 rounded-xs shrink-0 ${
              activeModality === 'spatial_visual' ? 'bg-telemetry-amber text-space-black' : 'bg-chassis-base text-telemetry-amber'
            }`}>
              <Scan className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-sm text-text-primary">
                  Spatial Visual Sonification Mode
                </span>
                <span className="px-1.5 py-0.5 rounded-xs bg-telemetry-amber/20 text-telemetry-amber text-[9px] font-bold uppercase">
                  OpenCV.js WASM + Upload
                </span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1 leading-normal">
                Sonify 2D geographic patterns from the 2025 Robinson projection map or upload your own image. 
                Regional luminance, texture variance, and Sobel edge density extracted locally in browser WebAssembly.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Mode Render Bay */}
      {activeModality === 'scientific_timeseries' ? (
        /* Render Scientific Time-Series Station */
        <TimeSeriesSonificationPanel />
      ) : (
        /* Render 2D Spatial Map Station */
        <div className="space-y-6">
          {/* Dataset Selection Bar */}
          <div className="rounded-sm border border-hairline bg-chassis-base p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-nasa-cyan" />
                <span>Planetary Visualizations Catalog:</span>
              </span>
              <span className="text-text-secondary text-[10px]">
                1 Operational MVP Dataset • 2 Planned for Future Expansion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {NASA_DATASETS.map((dataset) => {
                const isSelected = dataset.id === selectedDatasetId;
                const isAvailable = dataset.availability === 'available';

                return (
                  <button
                    key={dataset.id}
                    type="button"
                    onClick={() => setSelectedDatasetId(dataset.id)}
                    className={`p-3 rounded-xs border text-left transition-all ${
                      isSelected
                        ? 'border-nasa-cyan bg-nasa-cyan/10 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : isAvailable
                        ? 'border-hairline bg-chassis-panel hover:border-hairline-bright hover:bg-chassis-surface'
                        : 'border-hairline/40 bg-chassis-panel/40 opacity-70 cursor-pointer hover:border-hairline'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-xs ${
                        isAvailable 
                          ? 'bg-biosphere-emerald/20 text-biosphere-emerald' 
                          : 'bg-telemetry-amber/20 text-telemetry-amber flex items-center gap-1'
                      }`}>
                        {!isAvailable && <Lock className="h-2.5 w-2.5" />}
                        {isAvailable ? 'Operational' : 'Planned'}
                      </span>
                      <span className="text-[9px] text-text-muted">{dataset.year}</span>
                    </div>
                    <div className={`font-bold text-xs line-clamp-1 ${isSelected ? 'text-nasa-cyan' : 'text-text-primary'}`}>
                      {dataset.title}
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {isAvailable ? `${dataset.colormapName} • ${dataset.mapProjection}` : 'Future Expansion'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Informational notice when a pending dataset is clicked */}
            {!isSelectedDatasetAvailable && (
              <div className="rounded-xs border border-telemetry-amber/40 bg-telemetry-amber/10 p-3 flex items-start gap-2.5 text-telemetry-amber text-[11px] leading-normal">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Dataset Scheduled for Future Expansion: </strong>
                  &quot;{selectedDataset.title}&quot; is scheduled for a future release. For the current MVP, 
                  <strong>NASA GISTEMP v4</strong> is fully integrated and operational. You can analyze the 2025 GISTEMP map or upload your own satellite visualization below.
                </div>
              </div>
            )}
          </div>

          {/* Target Dataset Overview Strip (for the available GISTEMP dataset) */}
          {isSelectedDatasetAvailable && (
            <div className="rounded-sm border border-hairline bg-chassis-base p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-28 rounded-xs border border-hairline overflow-hidden bg-space-black shrink-0">
                  <Image
                    src={selectedDataset.imageAssetPath}
                    alt={selectedDataset.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    {selectedDataset.title} ({selectedDataset.datasetVersion})
                  </h2>
                  <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
                    {selectedDataset.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1">
                    <span>Unit: <strong className="text-text-primary">{selectedDataset.unit}</strong></span>
                    <span>•</span>
                    <span>Baseline: <strong className="text-text-primary">{selectedDataset.baselinePeriod}</strong></span>
                    <span>•</span>
                    <span>Sensor: <strong className="text-text-primary">{selectedDataset.sensor}</strong></span>
                  </div>
                </div>
              </div>

              <a
                href={selectedDataset.nasaSvsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xs border border-hairline px-3 py-1.5 text-[10px] text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan transition-colors self-start md:self-center"
              >
                <span>NASA SVS #5603</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Core Spatial Sonification & Computer Vision Workstation (Supports Preset + Custom Upload) */}
          <ImageAnalysisPanel dataset={selectedDataset} />
        </div>
      )}
    </div>
  );
}
