/**
 * Tone.js Sonification Engine
 * Earth Information Jukebox — Phase 5
 *
 * Client-side Web Audio synthesizer rack and transport sequencer.
 * Translates structured SonificationEvents into harmonic multi-timbral soundscapes.
 */

import * as Tone from 'tone';
import { 
  SonificationEvent, 
  SonificationMappingConfig, 
  PlaybackStatus 
} from '@/types/sonification';

export interface ToneEngineCallbacks {
  readonly onEventTick?: (event: SonificationEvent, progress: number) => void;
  readonly onPlaybackEnd?: () => void;
  readonly onStatusChange?: (status: PlaybackStatus) => void;
}

export class ToneSonificationEngine {
  private isInitialized = false;
  private isAudioUnlocked = false;
  private status: PlaybackStatus = 'idle';

  // Audio Node Rack
  private leadSynth: Tone.PolySynth | null = null;
  private droneSynth: Tone.AMSynth | null = null;
  private noiseSynth: Tone.NoiseSynth | null = null;
  private filterNode: Tone.Filter | null = null;
  private pannerNode: Tone.Panner | null = null;
  private reverbNode: Tone.Reverb | null = null;
  private masterVolumeNode: Tone.Volume | null = null;
  private masterLimiterNode: Tone.Limiter | null = null;

  // Transport & Sequencing State
  private repeatScheduleId: number | null = null;
  private activeEvents: readonly SonificationEvent[] = [];
  private activeConfig: SonificationMappingConfig | null = null;
  private currentEventIndex = 0;
  private callbacks: ToneEngineCallbacks = {};

  constructor(callbacks?: ToneEngineCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
  }

  /**
   * Set or update engine callbacks.
   */
  public setCallbacks(callbacks: ToneEngineCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Explicit user gesture unlock (required by browser autoplay policies).
   */
  public async unlockAudio(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      if (Tone.getContext().state !== 'running') {
        await Tone.start();
      }
      this.isAudioUnlocked = Tone.getContext().state === 'running';
      this.ensureNodes();
      return this.isAudioUnlocked;
    } catch (err) {
      console.error('[ToneEngine] AudioContext initialization failed:', err);
      this.isAudioUnlocked = false;
      return false;
    }
  }

  /**
   * Lazy initialization of the synthesizer rack and signal chain.
   */
  private ensureNodes(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 1. Master Output Protection & Limiter (-0.5 dB ceiling)
    this.masterLimiterNode = new Tone.Limiter(-0.5).toDestination();

    // 2. Master Gain / Volume Controller
    this.masterVolumeNode = new Tone.Volume(-3).connect(this.masterLimiterNode);

    // 3. Ambient Space Reverb (decay: 2.2s, 25% wet mix for planetary space feel)
    this.reverbNode = new Tone.Reverb({
      decay: 2.2,
      preDelay: 0.02,
      wet: 0.25,
    }).connect(this.masterVolumeNode);

    // 4. Stereo Panner
    this.pannerNode = new Tone.Panner(0).connect(this.reverbNode);

    // 5. 24dB Dynamic Low-Pass Filter
    this.filterNode = new Tone.Filter({
      frequency: 1400,
      type: 'lowpass',
      rolloff: -24,
      Q: 1.2,
    }).connect(this.pannerNode);

    // 6. Melodic Lead Voice (PolySynth with warm, rounded triangle/sine wave envelope)
    this.leadSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.03,
        decay: 0.18,
        sustain: 0.25,
        release: 0.45,
      },
    }).connect(this.filterNode);

    // 7. Root Planetary Drone Voice (AMSynth for warm, slow-evolving planetary ground)
    this.droneSynth = new Tone.AMSynth({
      harmonicity: 1.5,
      detune: 0,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.8,
        decay: 0.5,
        sustain: 0.8,
        release: 1.5,
      },
      modulation: { type: 'sine' },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0.7,
        release: 1.0,
      },
    }).connect(this.reverbNode);
    this.droneSynth.volume.value = -12; // Balanced ambient background

    // 8. Atmospheric Turbulence Noise Voice (for spatial edge density friction)
    this.noiseSynth = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: {
        attack: 0.02,
        decay: 0.08,
        sustain: 0,
        release: 0.08,
      },
    }).connect(this.pannerNode);
    this.noiseSynth.volume.value = -16;

    this.isInitialized = true;
  }

  /**
   * Start or restart playback with the given events and config.
   */
  public async play(events: readonly SonificationEvent[], config: SonificationMappingConfig): Promise<boolean> {
    if (events.length === 0) return false;

    const unlocked = await this.unlockAudio();
    if (!unlocked) return false;

    // Clear any previous schedule
    this.stopTransportOnly();

    this.activeEvents = events;
    this.activeConfig = config;
    this.currentEventIndex = 0;

    // Apply configuration
    this.applyConfig(config);

    // Start Root Planetary Drone if enabled
    if (config.enableDroneSynth && this.droneSynth) {
      try {
        this.droneSynth.triggerAttack(config.rootDroneNote, Tone.now(), 0.35);
      } catch (err) {
        console.warn('[ToneEngine] Drone trigger ignored:', err);
      }
    }

    // Schedule tick-based step sequencer on Tone.Transport
    const stepDuration = '16n';
    this.repeatScheduleId = Tone.getTransport().scheduleRepeat((time) => {
      this.handleStepTick(time);
    }, stepDuration);

    // Start Transport
    Tone.getTransport().start();
    this.setStatus('playing');
    return true;
  }

  /**
   * Step sequencer tick handler executed on each transport 16th-note.
   */
  private handleStepTick(time: number): void {
    if (this.status !== 'playing') return;

    if (this.currentEventIndex >= this.activeEvents.length) {
      // End of sequence reached
      this.stop();
      if (this.callbacks.onPlaybackEnd) {
        this.callbacks.onPlaybackEnd();
      }
      return;
    }

    const event = this.activeEvents[this.currentEventIndex];
    const eventIndex = this.currentEventIndex;
    const totalEvents = this.activeEvents.length;
    const config = this.activeConfig;

    // 1. Audio Synthesis Execution
    if (config && !event.isBackground) {
      // Dynamic Filter Cutoff Modulation based on regional variance/timbre
      if (this.filterNode) {
        this.filterNode.frequency.setValueAtTime(event.filterCutoffHz, time);
      }

      // Dynamic Stereo Panning based on horizontal longitude
      if (this.pannerNode) {
        this.pannerNode.pan.setValueAtTime(event.pan, time);
      }

      // Melodic Lead Note Trigger
      if (config.enableLeadSynth && this.leadSynth && event.velocity > 0) {
        this.leadSynth.triggerAttackRelease(
          event.pitch,
          event.duration,
          time,
          event.velocity
        );
      }

      // Atmospheric Noise Trigger for high edge density regions
      if (
        config.enableAtmosphereNoise && 
        this.noiseSynth && 
        event.noiseIntensity > 0.15
      ) {
        this.noiseSynth.triggerAttackRelease(
          '32n',
          time,
          Math.min(0.5, event.noiseIntensity * 0.4)
        );
      }
    }

    // 2. Synchronized UI Notification using Tone.Draw (guarantees sample-accurate frame sync)
    Tone.getDraw().schedule(() => {
      if (this.status !== 'playing') return;
      const progress = (eventIndex + 1) / totalEvents;
      if (this.callbacks.onEventTick) {
        this.callbacks.onEventTick(event, progress);
      }
    }, time);

    this.currentEventIndex++;
  }

  /**
   * Pause transport playback without resetting sector position.
   */
  public pause(): void {
    if (this.status !== 'playing') return;

    Tone.getTransport().pause();
    this.releaseActiveSynths();
    this.setStatus('paused');
  }

  /**
   * Resume paused playback.
   */
  public resume(): void {
    if (this.status !== 'paused') return;

    // Resume drone if enabled
    if (this.activeConfig?.enableDroneSynth && this.droneSynth) {
      try {
        this.droneSynth.triggerAttack(this.activeConfig.rootDroneNote, Tone.now(), 0.35);
      } catch (err) {
        console.warn('[ToneEngine] Drone resume ignored:', err);
      }
    }

    Tone.getTransport().start();
    this.setStatus('playing');
  }

  /**
   * Stop transport and reset sequence to the beginning.
   */
  public stop(): void {
    this.stopTransportOnly();
    this.currentEventIndex = 0;
    this.setStatus('stopped');
  }

  /**
   * Stops transport and cleans up active repeating event.
   */
  private stopTransportOnly(): void {
    if (typeof window === 'undefined') return;

    if (this.repeatScheduleId !== null) {
      Tone.getTransport().clear(this.repeatScheduleId);
      this.repeatScheduleId = null;
    }

    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    try {
      Tone.getDraw().cancel(0);
    } catch {
      // Ignored
    }
    this.releaseActiveSynths();
  }

  /**
   * Instantly releases any sustaining synth voices.
   */
  private releaseActiveSynths(): void {
    try {
      this.leadSynth?.releaseAll();
      this.droneSynth?.triggerRelease();
    } catch {
      // Ignored
    }
  }

  /**
   * Adjust master volume in decibels (-40dB to +3dB).
   */
  public setMasterVolume(db: number): void {
    const clamped = Math.max(-40, Math.min(3, db));
    if (this.masterVolumeNode) {
      this.masterVolumeNode.volume.rampTo(clamped, 0.05);
    }
  }

  /**
   * Adjust playback speed multiplier (0.5x to 2.0x).
   */
  public setPlaybackSpeed(speed: number): void {
    const clamped = Math.max(0.5, Math.min(2.0, speed));
    if (this.activeConfig) {
      const targetBpm = this.activeConfig.tempoBpm * clamped;
      Tone.getTransport().bpm.rampTo(targetBpm, 0.1);
    }
  }

  /**
   * Apply configuration changes dynamically.
   */
  public applyConfig(config: SonificationMappingConfig): void {
    this.activeConfig = config;
    const targetBpm = config.tempoBpm * config.playbackSpeed;
    Tone.getTransport().bpm.value = targetBpm;
    this.setMasterVolume(config.masterVolumeDb);
  }

  private setStatus(status: PlaybackStatus): void {
    this.status = status;
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(status);
    }
  }

  public getStatus(): PlaybackStatus {
    return this.status;
  }

  public isUnlocked(): boolean {
    return this.isAudioUnlocked;
  }

  /**
   * Full cleanup of Web Audio nodes on unmount.
   */
  public dispose(): void {
    this.stopTransportOnly();

    try {
      this.leadSynth?.dispose();
      this.droneSynth?.dispose();
      this.noiseSynth?.dispose();
      this.filterNode?.dispose();
      this.pannerNode?.dispose();
      this.reverbNode?.dispose();
      this.masterVolumeNode?.dispose();
      this.masterLimiterNode?.dispose();
    } catch (err) {
      console.warn('[ToneEngine] Disposal notice:', err);
    }

    this.leadSynth = null;
    this.droneSynth = null;
    this.noiseSynth = null;
    this.filterNode = null;
    this.pannerNode = null;
    this.reverbNode = null;
    this.masterVolumeNode = null;
    this.masterLimiterNode = null;
    this.isInitialized = false;
    this.activeEvents = [];
    this.activeConfig = null;
    this.status = 'idle';
  }
}
