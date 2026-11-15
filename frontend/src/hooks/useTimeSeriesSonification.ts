'use client';

/**
 * useTimeSeriesSonification Hook
 * Earth Information Jukebox — Phase 6
 *
 * Coordinates CSV data loading, time-series parameter mapping,
 * and Web Audio playback for NASA GISTEMP temperature anomalies.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  GistempParsedData, 
  TimeSeriesSonificationConfig, 
  TimeSeriesSonificationEvent, 
  TimeSeriesPlaybackGranularity 
} from '@/types/timeSeries';
import { PlaybackStatus } from '@/types/sonification';
import { loadGistempData } from '@/lib/data/gistempCsvParser';
import { generateTimeSeriesEvents } from '@/lib/sonification/timeSeriesMapper';
import { TimeSeriesAudioEngine } from '@/lib/sonification/timeSeriesAudioEngine';

export function useTimeSeriesSonification() {
  const [data, setData] = useState<GistempParsedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [config, setConfig] = useState<TimeSeriesSonificationConfig>({
    granularity: 'annual',
    tempoBpm: 120,
    playbackSpeed: 1.0,
    masterVolumeDb: -3,
    enableDrone: true,
    selectedYear: 2024,
  });

  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [currentEvent, setCurrentEvent] = useState<TimeSeriesSonificationEvent | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');

  const engineRef = useRef<TimeSeriesAudioEngine | null>(null);
  const lastAnnounceTimeRef = useRef<number>(0);

  // Load CSV on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    loadGistempData()
      .then((parsed) => {
        if (isMounted) {
          setData(parsed);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : 'Failed to parse NASA CSV.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate deterministic events whenever data or granularity changes
  const events = useMemo(() => {
    if (!data) return [];
    return generateTimeSeriesEvents(data, config.granularity);
  }, [data, config.granularity]);

  // Initialize Audio Engine once
  useEffect(() => {
    const engine = new TimeSeriesAudioEngine({
      onEventTick: (event, currentProgress) => {
        setCurrentEvent(event);
        setProgress(currentProgress);

        const now = Date.now();
        if (now - lastAnnounceTimeRef.current > 3000) {
          lastAnnounceTimeRef.current = now;
          const sign = event.anomalyCelsius >= 0 ? '+' : '';
          setAnnouncement(
            `Playing ${event.label}. Anomaly: ${sign}${event.anomalyCelsius.toFixed(2)} °C. Pitch: ${event.pitch}.`
          );
        }
      },
      onPlaybackEnd: () => {
        setPlaybackStatus('stopped');
        setCurrentEvent(null);
        setProgress(1);
        setAnnouncement('Time-series climate sonification complete.');
      },
      onStatusChange: (status) => {
        setPlaybackStatus(status);
      },
    });

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Operations
  const play = useCallback(async (startFromIndex = 0) => {
    if (!engineRef.current || events.length === 0) return false;

    const success = await engineRef.current.play(events, config, startFromIndex);
    if (success) {
      setIsAudioUnlocked(true);
      setAnnouncement(`Started climate sonification (${config.granularity} mode).`);
    }
    return success;
  }, [events, config]);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setAnnouncement('Climate sonification paused.');
  }, []);

  const resume = useCallback(() => {
    engineRef.current?.resume();
    setAnnouncement('Climate sonification resumed.');
  }, []);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    setCurrentEvent(null);
    setProgress(0);
    setAnnouncement('Climate sonification stopped.');
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

  const setGranularity = useCallback((granularity: TimeSeriesPlaybackGranularity) => {
    stop();
    setConfig((prev) => ({ ...prev, granularity }));
    setAnnouncement(`Playback granularity set to ${granularity}.`);
  }, [stop]);

  const setPlaybackSpeed = useCallback((playbackSpeed: number) => {
    setConfig((prev) => ({ ...prev, playbackSpeed }));
    engineRef.current?.setPlaybackSpeed(playbackSpeed);
    setAnnouncement(`Playback speed set to ${playbackSpeed}x.`);
  }, []);

  const setMasterVolume = useCallback((masterVolumeDb: number) => {
    setConfig((prev) => ({ ...prev, masterVolumeDb }));
    engineRef.current?.setMasterVolume(masterVolumeDb);
  }, []);

  const toggleDrone = useCallback(() => {
    setConfig((prev) => ({ ...prev, enableDrone: !prev.enableDrone }));
  }, []);

  const seekToYear = useCallback((year: number) => {
    if (events.length === 0) return;
    const targetIdx = events.findIndex((e) => e.year === year);
    if (targetIdx !== -1) {
      engineRef.current?.seekToIndex(targetIdx);
      setCurrentEvent(events[targetIdx]);
      setProgress(targetIdx / events.length);
      setConfig((prev) => ({ ...prev, selectedYear: year }));
    }
  }, [events]);

  return {
    data,
    isLoading,
    loadError,
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
    setGranularity,
    setPlaybackSpeed,
    setMasterVolume,
    toggleDrone,
    seekToYear,
  };
}
