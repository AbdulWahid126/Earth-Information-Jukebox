'use client';

import { useState, useEffect, useCallback } from 'react';
import { OpenCVLoadStatus } from '@/types/cv';
import { loadOpenCV, isOpenCVReady } from '@/lib/cv/opencvLoader';
import { OpenCVRuntime } from '@/lib/cv/cvTypes';

interface UseOpenCVReturn {
  status: OpenCVLoadStatus;
  isReady: boolean;
  error: string | null;
  load: () => Promise<OpenCVRuntime | null>;
}

export function useOpenCV(autoLoad = false): UseOpenCVReturn {
  const [status, setStatus] = useState<OpenCVLoadStatus>(() => {
    return isOpenCVReady() ? 'ready' : 'idle';
  });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<OpenCVRuntime | null> => {
    if (isOpenCVReady() && window.cv) {
      setStatus('ready');
      return window.cv;
    }

    setStatus('loading');
    setError(null);

    try {
      const cv = await loadOpenCV();
      setStatus('ready');
      return cv;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error initializing OpenCV.js';
      setError(message);
      setStatus('error');
      return null;
    }
  }, []);

  useEffect(() => {
    if (autoLoad && status === 'idle') {
      void load();
    }
  }, [autoLoad, status, load]);

  return {
    status,
    isReady: status === 'ready',
    error,
    load,
  };
}
