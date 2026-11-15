'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { DatasetMetadata } from '@/types/dataset';
import ImageAnalysisPanel from './ImageAnalysisPanel';
import TimeSeriesSonificationPanel from '@/components/timeseries/TimeSeriesSonificationPanel';
import { 
  ExternalLink, 
  FileSpreadsheet, 
  Layers, 
  Compass, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sliders,
  Calendar,
  Scan
} from 'lucide-react';

interface DatasetDetailViewProps {
  readonly dataset: DatasetMetadata;
}

export default function DatasetDetailView({ dataset }: DatasetDetailViewProps) {
  const [activeModality, setActiveModality] = useState<'timeseries' | 'spatial'>('timeseries');

  return (
    <article className="rounded-sm border border-hairline-bright bg-chassis-panel/90 overflow-hidden shadow-2xl">
      {/* Top Mission Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-hairline bg-chassis-base px-4 py-3 font-mono text-[10px] gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-biosphere-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-biosphere-emerald" />
          </span>
          <span className="font-bold text-biosphere-emerald uppercase tracking-wider">
            NASA DATASET LOADED: {dataset.datasetVersion}
          </span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary uppercase">CAT: {dataset.category}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-text-muted uppercase">YEAR: {dataset.year}</span>
          <span className="rounded-xs border border-hairline-accent bg-nasa-cyan/5 px-2 py-0.5 text-nasa-cyan font-bold uppercase">
            STATUS: CV & SONIFICATION OPERATIONAL (PHASES 4 & 5)
          </span>
        </div>
      </div>

      {/* Main Imagery Viewport Bay */}
      <div className="relative aspect-[16/9] w-full bg-space-black overflow-hidden border-b border-hairline">
        <Image
          src={dataset.imageAssetPath}
          alt={`${dataset.title} visualization map for ${dataset.year}`}
          fill
          priority
          className="object-contain object-center"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />

        {/* Tactical HUD Corner Reticles */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 rounded-xs border border-hairline bg-space-black/85 px-2.5 py-1.5 backdrop-blur-md font-mono text-[9px]">
          <span className="text-nasa-cyan font-bold uppercase">{dataset.mapProjection}</span>
          <span className="text-text-muted uppercase">Colormap: {dataset.colormapName}</span>
        </div>

        <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-0.5 rounded-xs border border-hairline bg-space-black/85 px-2.5 py-1.5 backdrop-blur-md font-mono text-[9px]">
          <span className="text-text-primary uppercase">Sensor Lineage: {dataset.sensor}</span>
          <span className="text-text-muted">Unsmoothed Observational Station Resolution</span>
        </div>

        <div className="absolute bottom-3 right-3 z-10 rounded-xs border border-hairline bg-space-black/85 px-2.5 py-1.5 backdrop-blur-md font-mono text-[9px] text-text-muted">
          NASA Scientific Visualization Studio // ID: 5603
        </div>

        {/* Scanline Texture */}
        <div className="absolute inset-0 hud-scanline opacity-15 pointer-events-none" />
      </div>

      {/* Sonification Engine Status Banner */}
      <div className="border-b border-hairline bg-biosphere-emerald/10 px-4 py-3 flex items-start sm:items-center gap-3 text-biosphere-emerald font-mono text-xs">
        <Radio className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0 animate-pulse text-nasa-cyan" />
        <div className="flex-1">
          <strong className="font-bold uppercase tracking-wider text-nasa-cyan">Sonification Engine Active: </strong>
          <span className="text-text-secondary">
            Visual feature extraction (OpenCV.js WASM) and harmonic audio sonification (Tone.js) are operational. Run image analysis below to engage real-time planetary playback.
          </span>
        </div>
      </div>

      {/* Detailed Technical & Scientific Bay */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Scientific Narrative & Calibration (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-3">
                {dataset.title}
              </h2>

              <p className="text-base text-text-secondary leading-relaxed mb-4">
                {dataset.description}
              </p>

              <div className="rounded-sm border border-hairline bg-chassis-base/80 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2 text-text-primary font-mono text-xs font-bold uppercase">
                  <Info className="h-3.5 w-3.5 text-nasa-cyan" />
                  <span>Scientific Provenance &amp; Methodology</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {dataset.scientificSummary}
                </p>
              </div>

              {/* Critical Scientific Distinction Callout */}
              <div className="rounded-sm border border-hairline-accent bg-nasa-cyan/5 p-4 mb-6">
                <div className="flex items-center gap-2 mb-1.5 text-nasa-cyan font-mono text-xs font-bold uppercase">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Crucial Distinction: Spatial Map vs. Global Time Series</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  The spatial map above depicts the <strong>2025 geographic distribution</strong> of temperature anomalies across the globe. 
                  The accompanying CSV table provides the <strong>1D global planetary mean anomaly</strong> time series (1880–2026). 
                  The CSV does <em>not</em> contain per-pixel coordinates.
                </p>
              </div>
            </div>

            {/* Citations & Attribution */}
            <div className="pt-4 border-t border-hairline font-mono text-[10px] text-text-muted space-y-1">
              <div><strong>ATTRIBUTION:</strong> {dataset.attribution}</div>
              {dataset.citations.map((cite, i) => (
                <div key={i} className="text-text-muted/80">
                  REF {i + 1}: {cite.authors} ({cite.year}). {cite.title}. <em>{cite.publication}</em>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Physical Metrics & Data Conduits (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Telemetry Key-Value Grid */}
            <div className="rounded-sm border border-hairline bg-chassis-base/90 p-5 font-mono text-xs space-y-3">
              <h3 className="text-text-primary font-bold uppercase tracking-wider text-[11px] border-b border-hairline pb-2 flex items-center justify-between">
                <span>Measurement Telemetry</span>
                <span className="text-nasa-cyan text-[10px]">VERIFIED</span>
              </h3>

              <div className="flex justify-between items-center py-1 border-b border-hairline/50">
                <span className="text-text-muted uppercase text-[10px]">Physical Unit:</span>
                <span className="text-text-primary font-semibold">{dataset.unit}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-hairline/50">
                <span className="text-text-muted uppercase text-[10px]">Climatological Baseline:</span>
                <span className="text-text-primary font-semibold">{dataset.baselinePeriod}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-hairline/50">
                <span className="text-text-muted uppercase text-[10px]">Map Projection:</span>
                <span className="text-nasa-cyan font-semibold">{dataset.mapProjection}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-hairline/50">
                <span className="text-text-muted uppercase text-[10px]">Scientific Colormap:</span>
                <span className="text-text-primary font-semibold">{dataset.colormapName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-hairline/50">
                <span className="text-text-muted uppercase text-[10px]">Laboratory:</span>
                <span className="text-text-secondary text-[10px]">{dataset.laboratory}</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-text-muted uppercase text-[10px]">Calibration Status:</span>
                <span className="text-telemetry-amber font-semibold text-[10px]">LUT Pending Phase 4</span>
              </div>
            </div>

            {/* Official NASA External Action Links */}
            <div className="space-y-2.5 font-mono text-xs">
              <a
                href={dataset.nasaSvsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between rounded-sm border border-hairline-bright bg-chassis-base px-4 py-2.5 text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-nasa-cyan" />
                  <span>NASA SVS Entry (Release 5603)</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={dataset.nasaSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between rounded-sm border border-hairline-bright bg-chassis-base px-4 py-2.5 text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-text-muted" />
                  <span>NASA GISS Data Portal (GISTEMP v4)</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              {dataset.csvAssetPath && (
                <a
                  href={dataset.csvAssetPath}
                  download="gistemp-global-monthly.csv"
                  className="w-full flex items-center justify-between rounded-sm border border-hairline-accent bg-nasa-cyan/10 px-4 py-2.5 text-nasa-cyan hover:bg-nasa-cyan hover:text-space-black transition-colors font-bold uppercase"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Download Raw NASA CSV (12.8 KB)</span>
                  </span>
                  <span className="text-[10px]">CSV</span>
                </a>
              )}
            </div>

            {/* Link to Studio */}
            <Link
              href="/studio"
              className="w-full flex items-center justify-center gap-2 rounded-sm bg-nasa-cyan py-3 font-mono text-xs font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            >
              <Sliders className="h-4 w-4" />
              <span>Open in Sonification Studio</span>
            </Link>

          </div>

        </div>
      </div>

      {/* Sonification Modality Selection & Interactive Bay (Phases 4, 5, 6) */}
      <div className="border-t border-hairline p-6 sm:p-8 bg-chassis-base/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-nasa-cyan" />
            <span className="font-bold uppercase tracking-wider text-text-primary">
              Select Sonification Modality:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModality('timeseries')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                activeModality === 'timeseries'
                  ? 'bg-nasa-cyan text-space-black shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'bg-chassis-panel text-text-secondary hover:text-text-primary border border-hairline'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Scientific Time Series (1880–2026 CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModality('spatial')}
              className={`px-3 py-1.5 rounded-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 ${
                activeModality === 'spatial'
                  ? 'bg-telemetry-amber text-space-black shadow-[0_0_10px_rgba(255,179,0,0.3)]'
                  : 'bg-chassis-panel text-text-secondary hover:text-text-primary border border-hairline'
              }`}
            >
              <Scan className="h-3.5 w-3.5" />
              <span>2D Spatial Map (OpenCV WASM)</span>
            </button>
          </div>
        </div>

        {activeModality === 'timeseries' ? (
          <TimeSeriesSonificationPanel />
        ) : (
          <ImageAnalysisPanel dataset={dataset} />
        )}
      </div>
    </article>
  );
}
