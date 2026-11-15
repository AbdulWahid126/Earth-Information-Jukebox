'use client';

/**
 * Image Analysis & Sonification Panel Component
 * Earth Information Jukebox — Phases 4 & 5
 *
 * Integrates browser-based OpenCV.js feature extraction with Tone.js harmonic audio sonification.
 */

import { useState } from 'react';
import { DatasetMetadata } from '@/types/dataset';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useSonificationEngine } from '@/hooks/useSonificationEngine';
import GridOverlayVisualizer from './GridOverlayVisualizer';
import SonificationControlBar from '@/components/sonification/SonificationControlBar';
import SonificationMappingExplainer from '@/components/sonification/SonificationMappingExplainer';
import NonAudioFeatureSummary from '@/components/sonification/NonAudioFeatureSummary';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Scan,
  Compass,
  Radio
} from 'lucide-react';

interface ImageAnalysisPanelProps {
  readonly dataset: DatasetMetadata;
}

export default function ImageAnalysisPanel({ dataset }: ImageAnalysisPanelProps) {
  const [gridSize, setGridSize] = useState<number>(16);
  const {
    status,
    isProcessing,
    result,
    error,
    selectedSector,
    setSelectedSector,
    analyze,
    reset,
  } = useImageProcessor();

  const {
    config: sonificationConfig,
    playbackStatus,
    currentEvent,
    progress,
    events,
    announcement,
    play: playSonification,
    pause: pauseSonification,
    resume: resumeSonification,
    stop: stopSonification,
    togglePlayPause: togglePlayPauseSonification,
    setScale: setSonificationScale,
    setTraversalMode: setSonificationTraversalMode,
    setPlaybackSpeed: setSonificationPlaybackSpeed,
    setMasterVolume: setSonificationMasterVolume,
    toggleVoice: toggleSonificationVoice,
  } = useSonificationEngine(result);

  const handleStartAnalysis = () => {
    stopSonification();
    void analyze(dataset.imageAssetPath, dataset.id, {
      columns: gridSize,
      rows: gridSize,
      maxProcessingWidth: 512,
    });
  };

  const handleReset = () => {
    stopSonification();
    reset();
  };

  // When sonifying, the inspector reflects the active playback sector; otherwise user-selected sector
  const activeInspectorSector = currentEvent?.visualFeatures ?? selectedSector;

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base p-6 font-mono text-xs space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 text-nasa-cyan mb-1">
            <Cpu className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Computer Vision & Sonification Station
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Segment NASA map with OpenCV.js WASM and synthesize real-time harmonic soundscapes using Tone.js.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-chassis-panel p-1 rounded-xs border border-hairline text-[10px]">
            <span className="text-text-muted px-1.5 uppercase">Grid:</span>
            {([8, 16, 32] as const).map((size) => (
              <button
                key={size}
                type="button"
                disabled={isProcessing || playbackStatus === 'playing'}
                onClick={() => setGridSize(size)}
                className={`px-2 py-0.5 rounded-xs uppercase tracking-wider transition-colors ${
                  gridSize === size
                    ? 'bg-nasa-cyan text-space-black font-bold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>

          {!result ? (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isProcessing ? 'Processing...' : 'Analyze Image'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                handleReset();
                handleStartAnalysis();
              }}
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline-accent bg-chassis-panel px-3 py-1.5 text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Re-Analyze</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Processing States */}
      {isProcessing && (
        <div className="rounded-sm border border-nasa-cyan/40 bg-nasa-cyan/5 p-4 flex items-center gap-3 text-nasa-cyan">
          <span className="h-4 w-4 border-2 border-nasa-cyan border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider">
              {status === 'loading_cv' && 'Initializing OpenCV.js WebAssembly Core...'}
              {status === 'loading_image' && 'Downscaling image to 512px off-screen buffer...'}
              {status === 'analyzing' && `Executing ${gridSize}×${gridSize} grid segmentation and Sobel gradient analysis...`}
            </span>
            <p className="text-[10px] text-text-muted">
              Execution running 100% locally in browser WebAssembly heap.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="rounded-sm border border-alert-crimson/50 bg-alert-crimson/10 p-4 flex items-start gap-3 text-alert-crimson">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase">Image Processing Fault:</span>
            <p className="text-[11px] mt-1 text-text-primary">{error}</p>
          </div>
        </div>
      )}

      {/* Initial Idle State Callout */}
      {!result && !isProcessing && !error && (
        <div className="rounded-sm border border-hairline bg-chassis-panel/40 p-8 text-center space-y-3">
          <Scan className="h-8 w-8 text-text-muted mx-auto" />
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Image Analysis & Sonification Pipeline Inactive
          </h4>
          <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
            Click <strong>&quot;Analyze Image&quot;</strong> to lazily initialize OpenCV.js WebAssembly, downscale the 
            1080p NASA GISTEMP map, and extract regional visual features across a {gridSize}×{gridSize} grid. 
            Sonification controls unlock immediately after analysis completes.
          </p>

          <div className="pt-2">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-xs border border-hairline bg-chassis-base/60 px-4 py-2 font-bold uppercase tracking-wider text-text-muted cursor-not-allowed opacity-60 text-[11px]"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>Sonification Locked (Run Analysis First)</span>
            </button>
          </div>
        </div>
      )}

      {/* Successful Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Scientific Integrity Disclaimer */}
          <div className="rounded-sm border border-telemetry-amber/30 bg-telemetry-amber/5 p-3 flex items-start gap-2.5 text-telemetry-amber text-[11px]">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="leading-normal">
              <strong>Scientific Notice: </strong>
              Extracted metrics represent <em>visual colormap features</em> (Crameri &quot;vik&quot; palette). They are not calibrated physical temperature values. 
              White background canvas regions outside the Robinson projection oval are automatically silenced during sonification.
            </div>
          </div>

          {/* Interactive Grid Overlay Visualizer */}
          <GridOverlayVisualizer
            result={result}
            selectedSector={selectedSector}
            activePlaybackSector={currentEvent?.visualFeatures ?? null}
            onSelectSector={setSelectedSector}
          />

          {/* Sonification Playback Station (Phase 5) */}
          <SonificationControlBar
            playbackStatus={playbackStatus}
            currentEvent={currentEvent}
            progress={progress}
            totalEvents={events.length}
            config={sonificationConfig}
            announcement={announcement}
            onPlay={playSonification}
            onPause={pauseSonification}
            onResume={resumeSonification}
            onStop={stopSonification}
            onTogglePlayPause={togglePlayPauseSonification}
            onSetScale={setSonificationScale}
            onSetTraversalMode={setSonificationTraversalMode}
            onSetPlaybackSpeed={setSonificationPlaybackSpeed}
            onSetMasterVolume={setSonificationMasterVolume}
            onToggleVoice={toggleSonificationVoice}
          />

          {/* Sonification Scientific Explainer */}
          <SonificationMappingExplainer />

          {/* Non-Audio Empirical Feature Summary (Accessibility) */}
          <NonAudioFeatureSummary result={result} />

          {/* Telemetry Readout Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
              <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">Processing Res</span>
              <span className="text-text-primary font-bold">{result.processingDimensions.width} × {result.processingDimensions.height} px</span>
              <span className="text-text-muted text-[8px] block mt-0.5">(Original: {result.originalDimensions.width}×{result.originalDimensions.height})</span>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
              <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">Execution Speed</span>
              <span className="text-biosphere-emerald font-bold">{result.processingDurationMs} ms</span>
              <span className="text-text-muted text-[8px] block mt-0.5">WASM Execution</span>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
              <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">Grid Sectors</span>
              <span className="text-nasa-cyan font-bold">{result.globalStatistics.totalSectors} Total</span>
              <span className="text-text-muted text-[8px] block mt-0.5">({result.globalStatistics.activeDataSectors} planetary cells)</span>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
              <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">Mean Luminance</span>
              <span className="text-text-primary font-bold">{result.globalStatistics.meanGlobalLuminance}</span>
              <span className="text-text-muted text-[8px] block mt-0.5">Edge Density: {result.globalStatistics.meanGlobalEdgeDensity}</span>
            </div>
          </div>

          {/* Selected Sector Inspector Bay */}
          {activeInspectorSector && (
            <div className="rounded-sm border border-hairline-bright bg-chassis-panel/90 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="text-nasa-cyan font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  Sector Inspector [Col: {activeInspectorSector.coordinates.colIndex}, Row: {activeInspectorSector.coordinates.rowIndex}]
                  {currentEvent?.visualFeatures === activeInspectorSector && (
                    <span className="text-telemetry-amber font-normal text-[10px] ml-2 animate-pulse">
                      (Live Sonification Playhead)
                    </span>
                  )}
                </span>

                <span className={`px-2 py-0.5 rounded-xs uppercase text-[9px] font-bold ${
                  activeInspectorSector.isLikelyBackground 
                    ? 'bg-text-muted/20 text-text-muted border border-hairline' 
                    : 'bg-biosphere-emerald/10 text-biosphere-emerald border border-biosphere-emerald/30'
                }`}>
                  {activeInspectorSector.isLikelyBackground ? 'Canvas Margin (Rest)' : 'Active Earth Observation Data'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
                {/* Color Swatch */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-8 w-8 rounded-xs border border-hairline shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `rgb(${activeInspectorSector.averageRgb.r}, ${activeInspectorSector.averageRgb.g}, ${activeInspectorSector.averageRgb.b})`,
                    }}
                  />
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">Average RGB</span>
                    <span className="text-text-primary font-bold">
                      {activeInspectorSector.averageRgb.r}, {activeInspectorSector.averageRgb.g}, {activeInspectorSector.averageRgb.b}
                    </span>
                  </div>
                </div>

                {/* HSV */}
                <div>
                  <span className="text-text-muted text-[9px] uppercase block">Color HSV</span>
                  <span className="text-text-primary font-semibold">
                    H:{activeInspectorSector.averageHsv.h}° S:{Math.round(activeInspectorSector.averageHsv.s * 100)}% V:{Math.round(activeInspectorSector.averageHsv.v * 100)}%
                  </span>
                </div>

                {/* Relative Luminance */}
                <div>
                  <span className="text-text-muted text-[9px] uppercase block">Luminance</span>
                  <span className="text-text-primary font-semibold">{activeInspectorSector.luminance}</span>
                </div>

                {/* Color Variance */}
                <div>
                  <span className="text-text-muted text-[9px] uppercase block">Texture Variance</span>
                  <span className="text-text-primary font-semibold">{activeInspectorSector.colorVariance}</span>
                </div>

                {/* Edge Density */}
                <div>
                  <span className="text-text-muted text-[9px] uppercase block">Sobel Edge Density</span>
                  <span className="text-text-primary font-semibold">{activeInspectorSector.edgeDensity}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-hairline/60 flex flex-wrap justify-between text-[10px] text-text-muted">
                <span>Normalized Center: ({activeInspectorSector.coordinates.normalizedX}, {activeInspectorSector.coordinates.normalizedY})</span>
                <span>Buffer Pixels: {activeInspectorSector.pixelCount} px ({activeInspectorSector.coordinates.processingWidth}×{activeInspectorSector.coordinates.processingHeight})</span>
                <span>Original Map Coordinates: ({activeInspectorSector.coordinates.originalX}, {activeInspectorSector.coordinates.originalY})</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
