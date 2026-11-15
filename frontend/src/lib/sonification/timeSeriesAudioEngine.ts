/**
 * NASA GISTEMP Time-Series Audio Engine
 * Earth Information Jukebox — Phase 6
 *
 * Dedicated client-side Web Audio synthesizer rack and step sequencer
 * for empirical climate anomaly sonification.
 */

import * as Tone from 'tone';
import { 
  TimeSeriesSonificationEvent, 
  TimeSeriesSonificationConfig 
} from '@/types/timeSeries';
import { PlaybackStatus } from '@/types/sonification';

export interface TimeSeriesEngineCallbacks {
  readonly onEventTick?: (event: TimeSeriesSonificationEvent, progress: number) => void;
  readonly onPlaybackEnd?: () => void;
  readonly onStatusChange?: (status: PlaybackStatus) => void;
}

export class TimeSeriesAudioEngine {
  private isInitialized = false;
  private isAudioUnlocked = false;
  private status: PlaybackStatus = 'idle';

  // Audio Rack
  private leadSynth: Tone.PolySynth | null = null;
  private droneSynth: Tone.AMSynth | null = null;
  private filterNode: Tone.Filter | null = null;
  private reverbNode: Tone.Reverb | null = null;
  private masterVolumeNode: Tone.Volume | null = null;
  private masterLimiterNode: Tone.Limiter | null = null;

  // Transport & Scheduling
  private repeatScheduleId: number | null = null;
  private activeEvents: readonly TimeSeriesSonificationEvent[] = [];
  private activeConfig: TimeSeriesSonificationConfig | null = null;
  private currentEventIndex = 0;
  private callbacks: TimeSeriesEngineCallbacks = {};

  constructor(callbacks?: TimeSeriesEngineCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
  }

  public setCallbacks(callbacks: TimeSeriesEngineCallbacks): void {
    this.callbacks = callbacks;
  }

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
      console.error('[TimeSeriesAudioEngine] AudioContext unlock failed:', err);
      this.isAudioUnlocked = false;
      return false;
    }
  }

  private ensureNodes(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // 1. Peak Limiter (-0.5 dB ceiling)
    this.masterLimiterNode = new Tone.Limiter(-0.5).toDestination();

    // 2. Volume Gain Stage
    this.masterVolumeNode = new Tone.Volume(-3).connect(this.masterLimiterNode);

    // 3. Space Reverb (decay: 2.0s, 22% wet)
    this.reverbNode = new Tone.Reverb({
      decay: 2.0,
      preDelay: 0.01,
      wet: 0.22,
    }).connect(this.masterVolumeNode);

    // 4. Low-Pass Filter
    this.filterNode = new Tone.Filter({
      frequency: 1400,
      type: 'lowpass',
      rolloff: -24,
      Q: 1.0,
    }).connect(this.reverbNode);

    // 5. Melodic Lead Synth (warm triangle wave with acoustic bell-like decay)
    this.leadSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.02,
        decay: 0.25,
        sustain: 0.2,
        release: 0.5,
      },
    }).connect(this.filterNode);

    // 6. Root Baseline Drone Synth (holds C2 anchor representing 1951-1980 normal)
    this.droneSynth = new Tone.AMSynth({
      harmonicity: 1.0,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 1.0,
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
    this.droneSynth.volume.value = -14;

    this.isInitialized = true;
  }

  public async play(
    events: readonly TimeSeriesSonificationEvent[],
    config: TimeSeriesSonificationConfig,
    startIndex = 0
  ): Promise<boolean> {
    if (events.length === 0) return false;

    const unlocked = await this.unlockAudio();
    if (!unlocked) return false;

    this.stopTransportOnly();

    this.activeEvents = events;
    this.activeConfig = config;
    this.currentEventIndex = Math.max(0, Math.min(events.length - 1, startIndex));

    this.applyConfig(config);

    // Trigger Baseline Drone if enabled
    if (config.enableDrone && this.droneSynth) {
      try {
        this.droneSynth.triggerAttack('C2', Tone.now(), 0.3);
      } catch (err) {
        console.warn('[TimeSeriesEngine] Drone trigger ignored:', err);
      }
    }

    const stepInterval = config.granularity === 'annual' ? '8n' : '16n';
    this.repeatScheduleId = Tone.getTransport().scheduleRepeat((time) => {
      this.handleStepTick(time);
    }, stepInterval);

    Tone.getTransport().start();
    this.setStatus('playing');
    return true;
  }

  private handleStepTick(time: number): void {
    if (this.status !== 'playing') return;

    if (this.currentEventIndex >= this.activeEvents.length) {
      this.stop();
      if (this.callbacks.onPlaybackEnd) {
        this.callbacks.onPlaybackEnd();
      }
      return;
    }

    const event = this.activeEvents[this.currentEventIndex];
    const eventIndex = this.currentEventIndex;
    const totalEvents = this.activeEvents.length;

    // Filter frequency modulation
    if (this.filterNode) {
      this.filterNode.frequency.setValueAtTime(event.filterCutoffHz, time);
    }

    // Trigger lead pitch
    if (this.leadSynth && event.velocity > 0) {
      this.leadSynth.triggerAttackRelease(
        event.pitch,
        event.duration,
        time,
        event.velocity
      );
    }

    // Synchronize UI callback via Tone.Draw
    Tone.getDraw().schedule(() => {
      if (this.status !== 'playing') return;
      const progress = (eventIndex + 1) / totalEvents;
      if (this.callbacks.onEventTick) {
        this.callbacks.onEventTick(event, progress);
      }
    }, time);

    this.currentEventIndex++;
  }

  public pause(): void {
    if (this.status !== 'playing') return;
    Tone.getTransport().pause();
    this.releaseActiveSynths();
    this.setStatus('paused');
  }

  public resume(): void {
    if (this.status !== 'paused') return;

    if (this.activeConfig?.enableDrone && this.droneSynth) {
      try {
        this.droneSynth.triggerAttack('C2', Tone.now(), 0.3);
      } catch {
        // Ignored
      }
    }

    Tone.getTransport().start();
    this.setStatus('playing');
  }

  public stop(): void {
    this.stopTransportOnly();
    this.currentEventIndex = 0;
    this.setStatus('stopped');
  }

  public seekToIndex(index: number): void {
    this.currentEventIndex = Math.max(0, Math.min(this.activeEvents.length - 1, index));
  }

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

  private releaseActiveSynths(): void {
    try {
      this.leadSynth?.releaseAll();
      this.droneSynth?.triggerRelease();
    } catch {
      // Ignored
    }
  }

  public setMasterVolume(db: number): void {
    const clamped = Math.max(-40, Math.min(3, db));
    if (this.masterVolumeNode) {
      this.masterVolumeNode.volume.rampTo(clamped, 0.05);
    }
  }

  public setPlaybackSpeed(speed: number): void {
    const clamped = Math.max(0.5, Math.min(2.0, speed));
    if (this.activeConfig) {
      const targetBpm = this.activeConfig.tempoBpm * clamped;
      Tone.getTransport().bpm.rampTo(targetBpm, 0.1);
    }
  }

  public applyConfig(config: TimeSeriesSonificationConfig): void {
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

  public dispose(): void {
    this.stopTransportOnly();
    try {
      this.leadSynth?.dispose();
      this.droneSynth?.dispose();
      this.filterNode?.dispose();
      this.reverbNode?.dispose();
      this.masterVolumeNode?.dispose();
      this.masterLimiterNode?.dispose();
    } catch (err) {
      console.warn('[TimeSeriesAudioEngine] Disposal notice:', err);
    }

    this.leadSynth = null;
    this.droneSynth = null;
    this.filterNode = null;
    this.reverbNode = null;
    this.masterVolumeNode = null;
    this.masterLimiterNode = null;
    this.isInitialized = false;
    this.activeEvents = [];
    this.activeConfig = null;
    this.status = 'idle';
  }
}
