'use client';

import { useState } from 'react';
import { GridAnalysisResult, RegionalVisualFeatures } from '@/types/cv';

interface GridOverlayVisualizerProps {
  readonly result: GridAnalysisResult;
  readonly selectedSector: RegionalVisualFeatures | null;
  readonly activePlaybackSector?: RegionalVisualFeatures | null;
  readonly onSelectSector: (sector: RegionalVisualFeatures) => void;
}

export type VisualizerMode = 'wireframe' | 'color' | 'luminance' | 'edge';

export default function GridOverlayVisualizer({
  result,
  selectedSector,
  activePlaybackSector,
  onSelectSector,
}: GridOverlayVisualizerProps) {
  const [mode, setMode] = useState<VisualizerMode>('wireframe');
  const { columns, rows } = result.gridConfig;

  return (
    <div className="flex flex-col space-y-3">
      {/* Mode Selector Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-chassis-base/80 p-2 rounded-xs border border-hairline font-mono text-[10px]">
        <span className="text-text-muted uppercase tracking-wider">HUD Overlay Visualization Mode:</span>
        <div className="flex items-center gap-1.5">
          {(['wireframe', 'color', 'luminance', 'edge'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2 py-0.5 rounded-xs uppercase tracking-wider transition-colors ${
                mode === m
                  ? 'bg-nasa-cyan text-space-black font-bold'
                  : 'bg-chassis-panel text-text-secondary hover:text-text-primary border border-hairline'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas Overlay Container */}
      <div className="relative aspect-[16/9] w-full rounded-sm border border-hairline bg-space-black overflow-hidden">
        {/* Underlay NASA Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.imageSrc}
          alt="Analyzed NASA visualization map"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Dynamic Grid Matrix Layer */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {result.sectors.map((sector) => {
            const isSelected =
              selectedSector?.coordinates.colIndex === sector.coordinates.colIndex &&
              selectedSector?.coordinates.rowIndex === sector.coordinates.rowIndex;

            const isPlaying =
              activePlaybackSector?.coordinates.colIndex === sector.coordinates.colIndex &&
              activePlaybackSector?.coordinates.rowIndex === sector.coordinates.rowIndex;

            let cellBg = 'transparent';
            if (mode === 'color') {
              const { r, g, b } = sector.averageRgb;
              cellBg = sector.isLikelyBackground ? 'rgba(255,255,255,0.05)' : `rgba(${r}, ${g}, ${b}, 0.55)`;
            } else if (mode === 'luminance') {
              const lum255 = Math.round(sector.luminance * 255);
              cellBg = `rgba(${lum255}, ${lum255}, ${lum255}, 0.5)`;
            } else if (mode === 'edge') {
              const edgeAlpha = Math.min(sector.edgeDensity * 2, 0.85);
              cellBg = `rgba(0, 229, 255, ${edgeAlpha})`;
            }

            return (
              <button
                key={`${sector.coordinates.colIndex}-${sector.coordinates.rowIndex}`}
                type="button"
                onClick={() => onSelectSector(sector)}
                style={{ backgroundColor: cellBg }}
                className={`relative border transition-all duration-75 focus:outline-hidden ${
                  isPlaying
                    ? 'border-telemetry-amber z-30 shadow-[0_0_12px_#FFB300] bg-telemetry-amber/30 ring-2 ring-telemetry-amber'
                    : isSelected
                    ? 'border-nasa-cyan z-20 shadow-[0_0_8px_#00E5FF] bg-nasa-cyan/20'
                    : 'border-white/5 hover:border-nasa-cyan/60 hover:bg-nasa-cyan/10'
                }`}
                title={`Sector [${sector.coordinates.colIndex}, ${sector.coordinates.rowIndex}] - Click to inspect`}
              >
                {isPlaying && (
                  <span className="absolute inset-0 border-2 border-telemetry-amber animate-ping opacity-60" />
                )}
                {isSelected && !isPlaying && (
                  <span className="absolute inset-0 border border-nasa-cyan animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Reticle Overlay when a sector is selected or playing */}
        {activePlaybackSector ? (
          <div className="absolute top-2 left-2 z-30 font-mono text-[9px] bg-space-black/90 px-2 py-1 border border-telemetry-amber/70 text-telemetry-amber rounded-xs flex items-center gap-1.5 shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-telemetry-amber animate-ping" />
            <span>SONIFYING SECTOR: [C:{activePlaybackSector.coordinates.colIndex}, R:{activePlaybackSector.coordinates.rowIndex}] | LUM: {activePlaybackSector.luminance}</span>
          </div>
        ) : selectedSector ? (
          <div className="absolute top-2 left-2 z-30 font-mono text-[9px] bg-space-black/90 px-2 py-1 border border-nasa-cyan/50 text-nasa-cyan rounded-xs">
            ACTIVE SECTOR: [C:{selectedSector.coordinates.colIndex}, R:{selectedSector.coordinates.rowIndex}] | LUM: {selectedSector.luminance}
          </div>
        ) : null}
      </div>
    </div>
  );
}
