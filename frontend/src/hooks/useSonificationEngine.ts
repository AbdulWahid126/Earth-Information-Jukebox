'use client';

/**
 * useSonificationEngine Hook
 * Earth Information Jukebox — Phase 5
 *
 * Coordinates ToneSonificationEngine with React component lifecycle,
 * mapping configuration, playback state, and accessible live announcements.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GridAnalysisResult } from '@/types/cv';
import { 
  PlaybackStatus, 
  SonificationEvent, 
  SonificationMappingConfig, 
  MusicalScaleId,
  TraversalMode
} from '@/types/sonification';
import { ToneSonificationEngine } from '@/lib/sonification/toneEngine';
import { 
  DEFAULT_MAPPING_CONFIG, 
  generateSonificationSequence 
} from '@/lib/sonification/parameterMapper';
import { MUSICAL_SCALES } from '@/lib/sonification/scales';

interface UseSonificationEngineOptions {
  readonly initialConfig?: Partial<SonificationMappingConfig>;
}

export function useSonificationEngine(
  analysisResult: GridAnalysisResult | null,
  options?: UseSonificationEngineOptions
) {
  const [config, setConfig] = useState<SonificationMappingConfig>({
    ...DEFAULT_MAPPING_CONFIG,
    ...options?.initialConfig,
  });

  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [currentEvent, setCurrentEvent] = useState<SonificationEvent | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');

  const engineRef = useRef<ToneSonificationEngine | null>(null);
  const lastAnnouncementTimeRef = useRef<number>(0);

  // Pre-generate deterministic events whenever analysis result or relevant mapping config changes
  const events = useMemo(() => {
    if (!analysisResult) return [];
    return generateSonificationSequence(analysisResult, config);
  }, [analysisResult, config]);

  // Initialize engine instance once
  useEffect(() => {
    const engine = new ToneSonificationEngine({
      onEventTick: (event, currentProgress) => {
        setCurrentEvent(event);
        setProgress(currentProgress);

        // Throttle screen-reader announcements to at most once every 3 seconds during playback
        const now = Date.now();
        if (now - lastAnnouncementTimeRef.current > 3000) {
          lastAnnouncementTimeRef.current = now;
          if (!event.isBackground) {
            setAnnouncement(
              `Scanning sector row ${event.coordinates.rowIndex + 1}, column ${event.coordinates.colIndex + 1}. Pitch: ${event.pitch}, Luminance: ${Math.round(event.visualFeatures.luminance * 100)}%.`
            );
          }
        }
      },
      onPlaybackEnd: () => {
        setPlaybackStatus('stopped');
        setCurrentEvent(null);
        setProgress(1);
        setAnnouncement('Sonification playback complete.');
      },
      onStatusChange: (newStatus) => {
        setPlaybackStatus(newStatus);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Update engine callbacks if needed
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.applyConfig(config);
    }
  }, [config]);

  // Operations
  const play = useCallback(async () => {
    if (!engineRef.current || events.length === 0) return false;

    const success = await engineRef.current.play(events, config);
    if (success) {
      setIsAudioUnlocked(true);
      setAnnouncement(`Sonification started. Playing in ${MUSICAL_SCALES[config.scaleId]?.name ?? 'Pentatonic'}.`);
    }
    return success;
  }, [events, config]);

  const pause = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    setAnnouncement('Sonification paused.');
  }, []);

  const resume = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.resume();
    setAnnouncement('Sonification resumed.');
  }, []);

  const stop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.stop();
    setCurrentEvent(null);
    setProgress(0);
    setAnnouncement('Sonification stopped.');
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (playbackStatus === 'playing') {
      pause();
    } else if (playbackStatus === 'paused') {
      resume();
    } else {
      await play();
    }
  }, [playbackStatus, pause, resume, play]);

  const setScale = useCallback((scaleId: MusicalScaleId) => {
    setConfig((prev) => ({ ...prev, scaleId }));
    setAnnouncement(`Scale changed to ${MUSICAL_SCALES[scaleId]?.name ?? scaleId}.`);
  }, []);

  const setTraversalMode = useCallback((traversalMode: TraversalMode) => {
    setConfig((prev) => ({ ...prev, traversalMode }));
    setAnnouncement(`Traversal mode changed to ${traversalMode.replace('_', ' ')}.`);
  }, []);

  const setPlaybackSpeed = useCallback((playbackSpeed: number) => {
    setConfig((prev) => ({ ...prev, playbackSpeed }));
    engineRef.current?.setPlaybackSpeed(playbackSpeed);
    setAnnouncement(`Playback speed set to ${playbackSpeed}x.`);
  }, []);

  const setMasterVolume = useCallback((masterVolumeDb: number) => {
    setConfig((prev) => ({ ...prev, masterVolumeDb }));
    engineRef.current?.setMasterVolume(masterVolumeDb);
  }, []);

  const toggleVoice = useCallback((voice: 'lead' | 'drone' | 'atmosphere') => {
    setConfig((prev) => {
      const next = { ...prev };
      if (voice === 'lead') next.enableLeadSynth = !prev.enableLeadSynth;
      if (voice === 'drone') next.enableDroneSynth = !prev.enableDroneSynth;
      if (voice === 'atmosphere') next.enableAtmosphereNoise = !prev.enableAtmosphereNoise;
      return next;
    });
  }, []);

  return {
    config,
    playbackStatus,
    currentEvent,
    progress,
    events,
    isAudioUnlocked,
    announcement,
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    setScale,
    setTraversalMode,
    setPlaybackSpeed,
    setMasterVolume,
    toggleVoice,
  };
}
