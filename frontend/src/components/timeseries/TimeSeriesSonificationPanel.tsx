'use client';

/**
 * NASA GISTEMP Time-Series Sonification Panel Component
 * Earth Information Jukebox — Phase 6
 *
 * Full-featured interactive station for exploring and sonifying the 1880–2026
 * NASA global mean temperature anomaly time series.
 */

import React, { useEffect, useState } from 'react';
import { useTimeSeriesSonification } from '@/hooks/useTimeSeriesSonification';
import TimeSeriesChart from './TimeSeriesChart';
import TimeSeriesExplainer from './TimeSeriesExplainer';
import TimeSeriesDataSummary from './TimeSeriesDataSummary';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Calendar, 
  Activity, 
  Layers, 
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  ExternalLink,
  Sliders
} from 'lucide-react';

export default function TimeSeriesSonificationPanel() {
  const {
    data,
    isLoading,
    loadError,
    config,
    playbackStatus,
    currentEvent,
    progress,
    events,
    announcement,
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    setGranularity,
    setPlaybackSpeed,
    setMasterVolume,
    toggleDrone,
    seekToYear,
  } = useTimeSeriesSonification();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(config.masterVolumeDb);

  // Global keyboard shortcuts (Space for Play/Pause, S for Stop, M for Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        void togglePlayPause();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        stop();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, stop, isMuted, config.masterVolumeDb]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setMasterVolume(prevVolume);
    } else {
      setPrevVolume(config.masterVolumeDb);
      setIsMuted(true);
      setMasterVolume(-40);
    }
  };

  const isPlaying = playbackStatus === 'playing';
  const isPaused = playbackStatus === 'paused';

  if (isLoading) {
    return (
      <div className="rounded-sm border border-hairline bg-chassis-base p-8 text-center space-y-3 font-mono text-xs">
        <span className="h-5 w-5 border-2 border-nasa-cyan border-t-transparent rounded-full animate-spin inline-block" />
        <p className="text-text-muted">Loading and parsing NASA GISTEMP time-series dataset...</p>
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="rounded-sm border border-alert-crimson/50 bg-alert-crimson/10 p-6 font-mono text-xs text-alert-crimson space-y-2">
        <div className="flex items-center gap-2 font-bold uppercase">
          <AlertTriangle className="h-4 w-4" />
          <span>NASA Time-Series Data Loading Error</span>
        </div>
        <p className="text-text-primary text-[11px]">{loadError ?? 'Unable to parse CSV dataset.'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base p-6 font-mono text-xs space-y-6">
      {/* Screen reader live region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2 text-nasa-cyan mb-1">
            <Radio className="h-4 w-4" />
            <span className="font-bold uppercase tracking-wider text-sm">
              Scientific Climate Time-Series Sonification
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Direct acoustic translation of NASA GISS Land-Ocean Temperature Index (1880–2026). Empirical Celsius anomalies mapped to musical pitch.
          </p>
        </div>

        {/* Granularity & Mode Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-chassis-panel p-1 rounded-xs border border-hairline text-[10px]">
            <span className="text-text-muted px-1.5 uppercase">Timeline:</span>
            <button
              type="button"
              disabled={isPlaying}
              onClick={() => setGranularity('annual')}
              className={`px-2.5 py-0.5 rounded-xs uppercase tracking-wider transition-colors ${
                config.granularity === 'annual'
                  ? 'bg-nasa-cyan text-space-black font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual Means (147 Yrs)
            </button>
            <button
              type="button"
              disabled={isPlaying}
              onClick={() => setGranularity('monthly')}
              className={`px-2.5 py-0.5 rounded-xs uppercase tracking-wider transition-colors ${
                config.granularity === 'monthly'
                  ? 'bg-nasa-cyan text-space-black font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly Detailed (1754 Mos)
            </button>
          </div>
        </div>
      </div>

      {/* Scientific Distinction Notice Banner */}
      <div className="rounded-sm border border-biosphere-emerald/30 bg-biosphere-emerald/5 p-3.5 flex items-start gap-2.5 text-biosphere-emerald text-[11px] leading-relaxed">
        <Radio className="h-4 w-4 shrink-0 mt-0.5 text-nasa-cyan animate-pulse" />
        <div>
          <strong className="text-nasa-cyan uppercase font-bold">Empirical Scientific Mode: </strong>
          This mode is driven strictly by <strong>verified NASA sensor measurements</strong> (°C anomaly relative to 1951–1980 baseline), 
          NOT visual colormap heuristics. Unlike the 2D spatial map, this represents the <em>planet-wide mean surface temperature trend</em> over 147 years.
        </div>
      </div>

      {/* Interactive Time-Series SVG Chart */}
      <TimeSeriesChart
        data={data}
        currentEvent={currentEvent}
        isPlaying={isPlaying}
        onSelectYear={seekToYear}
      />

      {/* Sonification Playback Station Console */}
      <div className="rounded-sm border border-hairline-bright bg-chassis-panel/95 p-5 space-y-5 shadow-2xl">
        {/* Top Transport Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-nasa-cyan/10 border border-hairline-accent text-nasa-cyan">
              <Calendar className={`h-4 w-4 ${isPlaying ? 'animate-pulse text-telemetry-amber' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold uppercase tracking-wider text-text-primary text-sm">
                  Historical Climate Player
                </h3>
                <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-widest ${
                  isPlaying
                    ? 'bg-telemetry-amber/20 text-telemetry-amber border border-telemetry-amber/40 animate-pulse'
                    : isPaused
                    ? 'bg-nasa-cyan/20 text-nasa-cyan border border-nasa-cyan/40'
                    : 'bg-chassis-base text-text-muted border border-hairline'
                }`}>
                  {playbackStatus}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-0.5">
                Harmonic playback of {events.length} observations ({config.granularity} mode).
              </p>
            </div>
          </div>

          {/* Transport Buttons */}
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                type="button"
                onClick={isPaused ? resume : () => play(0)}
                className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] focus:outline-hidden focus:ring-2 focus:ring-nasa-cyan"
                aria-label={isPaused ? 'Resume climate sonification' : 'Play climate sonification'}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isPaused ? 'Resume' : 'Play Climate History'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pause}
                className="inline-flex items-center gap-2 rounded-xs bg-telemetry-amber px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(255,179,0,0.3)] focus:outline-hidden focus:ring-2 focus:ring-telemetry-amber"
                aria-label="Pause climate sonification"
              >
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={stop}
              disabled={playbackStatus === 'idle' || playbackStatus === 'stopped'}
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline-bright bg-chassis-base px-3 py-2 text-text-secondary hover:text-alert-crimson hover:border-alert-crimson/50 transition-colors disabled:opacity-40 focus:outline-hidden focus:ring-1 focus:ring-alert-crimson"
              aria-label="Stop climate sonification and reset"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
              <span>Stop</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Meter Strip */}
        <div className="rounded-xs border border-hairline bg-space-black/60 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between text-[10px] gap-2">
            <div className="flex items-center gap-3">
              <span className="text-text-muted uppercase">OBSERVATION:</span>
              <span className="text-text-primary font-bold text-xs">
                {currentEvent ? currentEvent.label : 'Select or Play'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-text-muted uppercase">PITCH:</span>
              <span className="text-nasa-cyan font-bold text-xs">
                {currentEvent ? (
                  <>
                    {currentEvent.pitch} <span className="text-text-muted text-[10px]">({currentEvent.frequencyHz} Hz)</span>
                  </>
                ) : '--'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-text-muted uppercase">FILTER CUTOFF:</span>
              <span className="text-text-primary font-semibold">
                {currentEvent ? `${currentEvent.filterCutoffHz} Hz` : '--'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-text-muted uppercase">TIMELINE:</span>
              <span className="text-biosphere-emerald font-bold">
                {currentEvent ? `${currentEvent.index + 1} / ${events.length}` : `0 / ${events.length}`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="h-1.5 w-full bg-chassis-base rounded-full overflow-hidden border border-hairline"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Climate sonification timeline progress"
          >
            <div
              className="h-full bg-linear-to-r from-nasa-cyan via-telemetry-amber to-alert-crimson transition-all duration-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        {/* Controls Grid: Speed, Volume, Drone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Speed */}
          <div className="space-y-1.5">
            <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-telemetry-amber" />
              <span>Playback Rate</span>
            </span>
            <div className="grid grid-cols-4 gap-1">
              {([0.5, 1.0, 1.5, 2.0] as const).map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`py-1 rounded-xs text-[10px] font-bold uppercase transition-colors ${
                    config.playbackSpeed === speed
                      ? 'bg-telemetry-amber text-space-black'
                      : 'bg-chassis-base text-text-secondary hover:text-text-primary border border-hairline'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Master Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
              <span className="text-text-muted flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-text-secondary hover:text-nasa-cyan transition-colors"
                  aria-label={isMuted ? 'Unmute master volume' : 'Mute master volume'}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5 text-alert-crimson" /> : <Volume2 className="h-3.5 w-3.5 text-nasa-cyan" />}
                </button>
                <span>Volume</span>
              </span>
              <span className="text-text-secondary">{isMuted ? 'Muted' : `${config.masterVolumeDb} dB`}</span>
            </div>
            <input
              type="range"
              min="-36"
              max="3"
              step="1"
              value={isMuted ? -40 : config.masterVolumeDb}
              onChange={(e) => {
                setIsMuted(false);
                setMasterVolume(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-chassis-base rounded-lg appearance-none cursor-pointer accent-nasa-cyan"
            />
          </div>

          {/* Root Drone Voice */}
          <div className="space-y-1.5">
            <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-biosphere-emerald" />
              <span>Root Drone Anchor</span>
            </span>
            <button
              type="button"
              onClick={toggleDrone}
              className={`w-full py-1.5 rounded-xs border transition-colors flex items-center justify-center gap-2 text-[10px] uppercase font-bold ${
                config.enableDrone
                  ? 'border-biosphere-emerald/50 bg-biosphere-emerald/10 text-biosphere-emerald'
                  : 'border-hairline bg-chassis-base text-text-muted'
              }`}
            >
              <span>{config.enableDrone ? 'Baseline Drone ON (C2 Normal)' : 'Baseline Drone OFF'}</span>
            </button>
          </div>
        </div>

        {/* Action Link & Keyboard Shortcuts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hairline pt-3 text-[10px] text-text-muted">
          <a
            href="/assets/datasets/temperature/gistemp-global-monthly.csv"
            download="gistemp-global-monthly.csv"
            className="inline-flex items-center gap-1.5 text-nasa-cyan hover:underline"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Download Official NASA CSV (12.8 KB)</span>
          </a>

          <div className="flex items-center gap-2">
            <span>Shortcuts:</span>
            <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">Space</kbd> Play/Pause
            <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">S</kbd> Stop
            <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">M</kbd> Mute
          </div>
        </div>
      </div>

      {/* Scientific Explainer */}
      <TimeSeriesExplainer />

      {/* Non-Audio Empirical Data Digest */}
      <TimeSeriesDataSummary data={data} />
    </div>
  );
}
