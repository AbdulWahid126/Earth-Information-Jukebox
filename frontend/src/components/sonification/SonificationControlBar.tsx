'use client';

/**
 * Sonification Control Bar Component
 * Earth Information Jukebox — Phase 5
 *
 * Professional mission-control audio playback station with full keyboard accessibility,
 * real-time telemetry meters, voice toggles, scale selection, and screen-reader announcements.
 */

import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Music, 
  Compass, 
  Sliders, 
  Layers, 
  Activity, 
  Info,
  Radio,
  Wind
} from 'lucide-react';
import { 
  PlaybackStatus, 
  SonificationEvent, 
  SonificationMappingConfig, 
  MusicalScaleId,
  TraversalMode 
} from '@/types/sonification';
import { MUSICAL_SCALES } from '@/lib/sonification/scales';

interface SonificationControlBarProps {
  readonly playbackStatus: PlaybackStatus;
  readonly currentEvent: SonificationEvent | null;
  readonly progress: number;
  readonly totalEvents: number;
  readonly config: SonificationMappingConfig;
  readonly announcement: string;
  readonly onPlay: () => Promise<boolean>;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onStop: () => void;
  readonly onTogglePlayPause: () => Promise<void>;
  readonly onSetScale: (scaleId: MusicalScaleId) => void;
  readonly onSetTraversalMode: (mode: TraversalMode) => void;
  readonly onSetPlaybackSpeed: (speed: number) => void;
  readonly onSetMasterVolume: (db: number) => void;
  readonly onToggleVoice: (voice: 'lead' | 'drone' | 'atmosphere') => void;
}

export default function SonificationControlBar({
  playbackStatus,
  currentEvent,
  progress,
  totalEvents,
  config,
  announcement,
  onPlay,
  onPause,
  onResume,
  onStop,
  onTogglePlayPause,
  onSetScale,
  onSetTraversalMode,
  onSetPlaybackSpeed,
  onSetMasterVolume,
  onToggleVoice,
}: SonificationControlBarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(config.masterVolumeDb);

  // Global keyboard shortcuts (Space for Play/Pause, S for Stop, M for Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        void onTogglePlayPause();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onStop();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlayPause, onStop, isMuted, config.masterVolumeDb]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onSetMasterVolume(prevVolume);
    } else {
      setPrevVolume(config.masterVolumeDb);
      setIsMuted(true);
      onSetMasterVolume(-40);
    }
  };

  const isPlaying = playbackStatus === 'playing';
  const isPaused = playbackStatus === 'paused';

  return (
    <div className="rounded-sm border border-hairline-bright bg-chassis-panel/95 p-5 font-mono text-xs space-y-5 shadow-2xl">
      {/* Screen reader live region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Top Header & Status Bay */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-nasa-cyan/10 border border-hairline-accent text-nasa-cyan">
            <Radio className={`h-4 w-4 ${isPlaying ? 'animate-pulse text-telemetry-amber' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold uppercase tracking-wider text-text-primary text-sm">
                Harmonic Sonification Station
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
              Client-side Web Audio synthesis mapped to OpenCV.js regional visual features.
            </p>
          </div>
        </div>

        {/* Primary Transport Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={isPaused ? onResume : onPlay}
              className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] focus:outline-hidden focus:ring-2 focus:ring-nasa-cyan"
              aria-label={isPaused ? 'Resume sonification audio' : 'Play sonification audio'}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Play Soundscape'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="inline-flex items-center gap-2 rounded-xs bg-telemetry-amber px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-amber-300 transition-colors shadow-[0_0_15px_rgba(255,179,0,0.3)] focus:outline-hidden focus:ring-2 focus:ring-telemetry-amber"
              aria-label="Pause sonification audio"
            >
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStop}
            disabled={playbackStatus === 'idle' || playbackStatus === 'stopped'}
            className="inline-flex items-center gap-1.5 rounded-xs border border-hairline-bright bg-chassis-base px-3 py-2 text-text-secondary hover:text-alert-crimson hover:border-alert-crimson/50 transition-colors disabled:opacity-40 focus:outline-hidden focus:ring-1 focus:ring-alert-crimson"
            aria-label="Stop sonification audio and reset sequence"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {/* Live Playback Telemetry & Progress Strip */}
      <div className="rounded-xs border border-hairline bg-space-black/60 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between text-[10px] gap-2">
          <div className="flex items-center gap-3">
            <span className="text-text-muted uppercase">ACTIVE PITCH:</span>
            <span className="text-nasa-cyan font-bold text-xs">
              {currentEvent && !currentEvent.isBackground ? (
                <>
                  {currentEvent.pitch} <span className="text-text-muted text-[10px]">({currentEvent.frequencyHz} Hz)</span>
                </>
              ) : currentEvent?.isBackground ? (
                <span className="text-text-muted italic">Margin (Rest)</span>
              ) : (
                '--'
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-text-muted uppercase">PAN:</span>
            <span className="text-text-primary font-semibold">
              {currentEvent ? (
                currentEvent.pan < -0.1 ? `L ${Math.round(Math.abs(currentEvent.pan) * 100)}%` :
                currentEvent.pan > 0.1 ? `R ${Math.round(currentEvent.pan * 100)}%` : 'Center'
              ) : 'Center'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-text-muted uppercase">FILTER:</span>
            <span className="text-text-primary font-semibold">
              {currentEvent ? `${currentEvent.filterCutoffHz} Hz` : '--'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted uppercase">POSITION:</span>
            <span className="text-biosphere-emerald font-bold">
              {currentEvent ? `${currentEvent.index + 1} / ${totalEvents}` : `0 / ${totalEvents}`}
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
          aria-label="Sonification playback progress"
        >
          <div
            className="h-full bg-linear-to-r from-nasa-cyan via-telemetry-amber to-biosphere-emerald transition-all duration-100"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Synthesizer Rack Controls: Scales, Speeds, Traversal, Volumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        
        {/* 1. Musical Scale Preset */}
        <div className="space-y-1.5">
          <label htmlFor="scale-select" className="text-text-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Music className="h-3 w-3 text-nasa-cyan" />
            <span>Harmonic Scale</span>
          </label>
          <select
            id="scale-select"
            value={config.scaleId}
            onChange={(e) => onSetScale(e.target.value as MusicalScaleId)}
            className="w-full rounded-xs border border-hairline bg-chassis-base px-2.5 py-1.5 text-xs text-text-primary focus:border-nasa-cyan focus:outline-hidden"
          >
            {Object.values(MUSICAL_SCALES).map((scale) => (
              <option key={scale.id} value={scale.id}>
                {scale.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Traversal Mode */}
        <div className="space-y-1.5">
          <label htmlFor="traversal-select" className="text-text-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-biosphere-emerald" />
            <span>Traversal Sweep</span>
          </label>
          <select
            id="traversal-select"
            value={config.traversalMode}
            onChange={(e) => onSetTraversalMode(e.target.value as TraversalMode)}
            className="w-full rounded-xs border border-hairline bg-chassis-base px-2.5 py-1.5 text-xs text-text-primary focus:border-nasa-cyan focus:outline-hidden"
          >
            <option value="column_sweep">Longitude Sweep (West → East)</option>
            <option value="raster">Latitude Scan (North → South)</option>
            <option value="boustrophedon">Zigzag Scan (Alternating)</option>
          </select>
        </div>

        {/* 3. Playback Speed Selector */}
        <div className="space-y-1.5">
          <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-telemetry-amber" />
            <span>Scan Speed</span>
          </span>
          <div className="grid grid-cols-4 gap-1">
            {([0.5, 1.0, 1.5, 2.0] as const).map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onSetPlaybackSpeed(speed)}
                className={`py-1 rounded-xs text-[10px] font-bold uppercase transition-colors ${
                  config.playbackSpeed === speed
                    ? 'bg-telemetry-amber text-space-black'
                    : 'bg-chassis-base text-text-secondary hover:text-text-primary border border-hairline'
                }`}
                aria-label={`Set playback speed to ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* 4. Master Volume Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
            <span className="text-text-muted flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="text-text-secondary hover:text-nasa-cyan transition-colors"
                aria-label={isMuted ? 'Unmute master audio' : 'Mute master audio'}
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
              onSetMasterVolume(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-chassis-base rounded-lg appearance-none cursor-pointer accent-nasa-cyan"
            aria-label="Master volume fader in decibels"
          />
        </div>

      </div>

      {/* Voice Layer Controls & Keyboard Hints */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-hairline pt-4 text-[11px]">
        {/* Voice Layer Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mr-1">Voices:</span>

          <button
            type="button"
            onClick={() => onToggleVoice('lead')}
            className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold ${
              config.enableLeadSynth
                ? 'border-nasa-cyan/50 bg-nasa-cyan/10 text-nasa-cyan'
                : 'border-hairline bg-chassis-base text-text-muted line-through'
            }`}
            aria-pressed={config.enableLeadSynth}
          >
            <Music className="h-3 w-3" />
            <span>Lead Pitch</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleVoice('drone')}
            className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold ${
              config.enableDroneSynth
                ? 'border-biosphere-emerald/50 bg-biosphere-emerald/10 text-biosphere-emerald'
                : 'border-hairline bg-chassis-base text-text-muted line-through'
            }`}
            aria-pressed={config.enableDroneSynth}
          >
            <Layers className="h-3 w-3" />
            <span>Root Drone</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleVoice('atmosphere')}
            className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold ${
              config.enableAtmosphereNoise
                ? 'border-telemetry-amber/50 bg-telemetry-amber/10 text-telemetry-amber'
                : 'border-hairline bg-chassis-base text-text-muted line-through'
            }`}
            aria-pressed={config.enableAtmosphereNoise}
          >
            <Wind className="h-3 w-3" />
            <span>Atmosphere</span>
          </button>
        </div>

        {/* Keyboard Quick Navigation Hint */}
        <div className="text-[10px] text-text-muted flex items-center gap-2">
          <span>Shortcuts:</span>
          <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">Space</kbd> Play/Pause
          <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">S</kbd> Stop
          <kbd className="rounded-xs border border-hairline bg-chassis-base px-1.5 py-0.5 text-text-secondary">M</kbd> Mute
        </div>
      </div>
    </div>
  );
}
