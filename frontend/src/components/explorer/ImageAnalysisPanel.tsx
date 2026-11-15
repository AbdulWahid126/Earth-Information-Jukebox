'use client';

/**
 * Image Analysis & Sonification Panel Component
 * Earth Information Jukebox — Phases 4 & 5 + Final MVP Completion
 *
 * Integrates browser-based OpenCV.js feature extraction with Tone.js harmonic audio sonification.
 * Supports both official NASA curated datasets (GISTEMP 2025 Map) and user-uploaded custom images
 * with drag-and-drop, client-side validation, 16×16 grid overlay, and real-time audio playback.
 */

import { useState, useCallback, useEffect } from 'react';
import { DatasetMetadata } from '@/types/dataset';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useSonificationEngine } from '@/hooks/useSonificationEngine';
import GridOverlayVisualizer from './GridOverlayVisualizer';
import SonificationControlBar from '@/components/sonification/SonificationControlBar';
import SonificationMappingExplainer from '@/components/sonification/SonificationMappingExplainer';
import NonAudioFeatureSummary from '@/components/sonification/NonAudioFeatureSummary';
import ImageUploadZone, { UploadedImageInfo } from '@/components/studio/ImageUploadZone';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Scan,
  Compass,
  Radio,
  UploadCloud,
  FileImage,
  Layers,
  Sparkles
} from 'lucide-react';

export type ImageSourceMode = 'nasa_preset' | 'custom_upload';

interface ImageAnalysisPanelProps {
  readonly dataset?: DatasetMetadata;
  readonly defaultSourceMode?: ImageSourceMode;
}

export default function ImageAnalysisPanel({ 
  dataset, 
  defaultSourceMode = 'nasa_preset' 
}: ImageAnalysisPanelProps) {
  const [sourceMode, setSourceMode] = useState<ImageSourceMode>(defaultSourceMode);
  const [gridSize, setGridSize] = useState<number>(16);
  const [customImage, setCustomImage] = useState<UploadedImageInfo | null>(null);

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

  // Clean up custom image object URL on unmount
  useEffect(() => {
    return () => {
      if (customImage?.objectUrl) {
        try {
          URL.revokeObjectURL(customImage.objectUrl);
        } catch {
          // ignore
        }
      }
    };
  }, [customImage]);

  const handleStartAnalysis = () => {
    stopSonification();
    
    if (sourceMode === 'nasa_preset' && dataset) {
      void analyze(dataset.imageAssetPath, dataset.id, {
        columns: gridSize,
        rows: gridSize,
        maxProcessingWidth: 512,
      });
    } else if (sourceMode === 'custom_upload' && customImage) {
      void analyze(customImage.objectUrl, `custom-${customImage.fileName}`, {
        columns: gridSize,
        rows: gridSize,
        maxProcessingWidth: 512,
      });
    }
  };

  const handleReset = () => {
    stopSonification();
    reset();
  };

  const handleSwitchSourceMode = (newMode: ImageSourceMode) => {
    if (newMode === sourceMode) return;
    stopSonification();
    reset();
    setSourceMode(newMode);
  };

  const handleCustomImageSelected = useCallback((info: UploadedImageInfo) => {
    stopSonification();
    reset();
    setCustomImage(info);
  }, [stopSonification, reset]);

  const handleCustomImageCleared = useCallback(() => {
    stopSonification();
    reset();
    setCustomImage(null);
  }, [stopSonification, reset]);

  // When sonifying, inspector reflects active playback sector; otherwise user-selected sector
  const activeInspectorSector = currentEvent?.visualFeatures ?? selectedSector;

  const canAnalyze = sourceMode === 'nasa_preset' 
    ? Boolean(dataset?.imageAssetPath)
    : Boolean(customImage?.objectUrl);

  const activeImageTitle = sourceMode === 'nasa_preset'
    ? (dataset?.title || 'NASA Visualization')
    : (customImage?.fileName || 'Custom Earth Image');

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base p-6 font-mono text-xs space-y-6">
      
      {/* Panel Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 text-nasa-cyan mb-1">
            <Cpu className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Computer Vision & Sonification Station
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Segment planetary maps with OpenCV.js WASM and synthesize real-time harmonic soundscapes using Tone.js.
          </p>
        </div>

        {/* Image Source Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-chassis-panel p-1 rounded-xs border border-hairline self-start sm:self-center">
          <button
            type="button"
            onClick={() => handleSwitchSourceMode('nasa_preset')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xs uppercase tracking-wider transition-colors text-[10px] ${
              sourceMode === 'nasa_preset'
                ? 'bg-nasa-cyan text-space-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>NASA Preset</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchSourceMode('custom_upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xs uppercase tracking-wider transition-colors text-[10px] ${
              sourceMode === 'custom_upload'
                ? 'bg-nasa-cyan text-space-black font-bold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <UploadCloud className="h-3 w-3" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Mode-Specific Source Ingestion Bay */}
      {sourceMode === 'custom_upload' ? (
        <ImageUploadZone
          currentImage={customImage}
          onImageSelected={handleCustomImageSelected}
          onImageCleared={handleCustomImageCleared}
          disabled={isProcessing}
        />
      ) : dataset ? (
        /* NASA Preset Dataset Confirmation Banner */
        <div className="rounded-sm border border-hairline bg-chassis-panel/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-biosphere-emerald animate-pulse" />
            <div>
              <span className="text-text-muted uppercase text-[9px] block">Active Preset Visualization</span>
              <strong className="text-text-primary font-bold uppercase">{dataset.title} ({dataset.year})</strong>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <span>Projection: <strong className="text-text-secondary">{dataset.mapProjection}</strong></span>
            <span>•</span>
            <span>Colormap: <strong className="text-text-secondary">{dataset.colormapName}</strong></span>
          </div>
        </div>
      ) : null}

      {/* Grid Configuration & Execution Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-chassis-panel/50 p-3 rounded-xs border border-hairline">
        <div className="flex items-center gap-2">
          <span className="text-text-muted uppercase text-[10px] font-bold">Analysis Grid Resolution:</span>
          <div className="flex items-center gap-1">
            {([8, 16, 32] as const).map((size) => (
              <button
                key={size}
                type="button"
                disabled={isProcessing || playbackStatus === 'playing'}
                onClick={() => {
                  setGridSize(size);
                  if (result) {
                    handleReset();
                  }
                }}
                className={`px-2.5 py-0.5 rounded-xs uppercase tracking-wider text-[10px] transition-colors ${
                  gridSize === size
                    ? 'bg-nasa-cyan text-space-black font-bold'
                    : 'text-text-secondary hover:text-text-primary bg-chassis-base border border-hairline'
                } disabled:opacity-50`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          <span className="text-text-muted text-[10px] hidden sm:inline-block">
            ({gridSize * gridSize} spatial analysis sectors)
          </span>
        </div>

        {/* Analyze / Re-Analyze Trigger */}
        <div className="flex items-center gap-2">
          {!result ? (
            <button
              type="button"
              disabled={isProcessing || !canAnalyze}
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isProcessing ? 'Processing WASM...' : 'Analyze Image'}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                handleReset();
                handleStartAnalysis();
              }}
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline-accent bg-chassis-panel px-3.5 py-1.5 text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Re-Analyze Grid</span>
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

      {/* Initial Idle State Callout (When not yet analyzed) */}
      {!result && !isProcessing && !error && (
        <div className="rounded-sm border border-hairline bg-chassis-panel/40 p-8 text-center space-y-3">
          <Scan className="h-8 w-8 text-text-muted mx-auto" />
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            {sourceMode === 'custom_upload' && !customImage
              ? 'Upload an Image to Begin Analysis'
              : 'Image Analysis & Sonification Pipeline Inactive'}
          </h4>
          <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
            {sourceMode === 'custom_upload' && !customImage ? (
              'Drag and drop a PNG, JPG, or WEBP image above to load it into the local memory buffer. No data is sent to external servers.'
            ) : (
              <>
                Click <strong>&quot;Analyze Image&quot;</strong> to initialize OpenCV.js WebAssembly, downscale{' '}
                <strong>{activeImageTitle}</strong> to 512px, and extract regional visual features across a {gridSize}×{gridSize} grid.
                Sonification controls unlock immediately after analysis completes.
              </>
            )}
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
              Extracted metrics represent <em>visual colormap features</em> (luminance, color variance, and edge gradients). 
              They are not calibrated in-situ physical measurements. White or transparent border canvas regions outside the planet are automatically silenced during sonification.
            </div>
          </div>

          {/* Interactive Grid Overlay Visualizer */}
          <GridOverlayVisualizer
            result={result}
            selectedSector={selectedSector}
            activePlaybackSector={currentEvent?.visualFeatures ?? null}
            onSelectSector={setSelectedSector}
          />

          {/* Sonification Playback Station */}
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
              <span className="text-text-muted text-[8px] block mt-0.5">({result.globalStatistics.activeDataSectors} active cells)</span>
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
                  {activeInspectorSector.isLikelyBackground ? 'Canvas Margin (Rest)' : 'Active Data Sector'}
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
                <span>Coordinates: ({activeInspectorSector.coordinates.originalX}, {activeInspectorSector.coordinates.originalY})</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
