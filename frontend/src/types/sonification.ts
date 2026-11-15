/**
 * Audio Sonification Types
 * Earth Information Jukebox — Phase 5
 */

import { RegionalVisualFeatures, SectorCoordinates } from './cv';

export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'stopped';

export type MusicalScaleId = 
  | 'pentatonic_major'
  | 'pentatonic_minor'
  | 'dorian'
  | 'lydian'
  | 'natural_minor';

export interface MusicalScaleDefinition {
  readonly id: MusicalScaleId;
  readonly name: string;
  readonly description: string;
  readonly notes: readonly string[]; // Pitch notations across octaves, e.g. ['C3', 'D3', 'E3', ...]
}

export type TraversalMode = 'raster' | 'column_sweep' | 'boustrophedon';

export interface SonificationMappingConfig {
  readonly scaleId: MusicalScaleId;
  readonly traversalMode: TraversalMode;
  readonly tempoBpm: number; // 60 - 240
  readonly baseOctave: number; // e.g. 3
  readonly rootDroneNote: string; // e.g. 'C2' or 'A1'
  readonly enableLeadSynth: boolean;
  readonly enableDroneSynth: boolean;
  readonly enableAtmosphereNoise: boolean;
  readonly masterVolumeDb: number; // -40 to +3 dB
  readonly playbackSpeed: number; // 0.5x, 1.0x, 1.5x, 2.0x
}

export interface SonificationEvent {
  readonly index: number;
  readonly sectorIndex: number;
  readonly coordinates: SectorCoordinates;
  readonly pitch: string; // Note name, e.g. 'E4'
  readonly frequencyHz: number;
  readonly duration: string; // Tone.js time notation, e.g. '16n', '8n'
  readonly velocity: number; // 0.0 - 1.0
  readonly pan: number; // -1.0 (left) to +1.0 (right)
  readonly filterCutoffHz: number; // 200 - 6000 Hz
  readonly noiseIntensity: number; // 0.0 - 1.0
  readonly isBackground: boolean;
  readonly visualFeatures: RegionalVisualFeatures;
}

export interface SonificationTelemetry {
  readonly currentEventIndex: number;
  readonly totalEvents: number;
  readonly currentSector: SectorCoordinates | null;
  readonly currentPitch: string | null;
  readonly currentFrequencyHz: number | null;
  readonly currentPan: number;
  readonly progress: number; // 0.0 to 1.0
  readonly isMuted: boolean;
  readonly activeVoices: {
    readonly lead: boolean;
    readonly drone: boolean;
    readonly noise: boolean;
  };
}
