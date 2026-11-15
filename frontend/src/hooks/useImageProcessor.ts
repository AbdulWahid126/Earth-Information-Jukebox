'use client';

import { useState, useCallback } from 'react';
import { GridAnalysisResult, GridConfig, RegionalVisualFeatures } from '@/types/cv';
import { loadOpenCV } from '@/lib/cv/opencvLoader';
import { loadImageElement, prepareImageBuffer } from '@/lib/cv/imageLoader';
import { analyzeImageGrid, DEFAULT_GRID_CONFIG } from '@/lib/cv/gridAnalyzer';

export type ProcessorStatus = 'idle' | 'loading_cv' | 'loading_image' | 'analyzing' | 'success' | 'error';

interface UseImageProcessorReturn {
  readonly status: ProcessorStatus;
  readonly isProcessing: boolean;
  readonly result: GridAnalysisResult | null;
  readonly error: string | null;
  readonly selectedSector: RegionalVisualFeatures | null;
  readonly setSelectedSector: (sector: RegionalVisualFeatures | null) => void;
  readonly analyze: (imageSrc: string, datasetId: string, config?: Partial<GridConfig>) => Promise<GridAnalysisResult | null>;
  readonly reset: () => void;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [status, setStatus] = useState<ProcessorStatus>('idle');
  const [result, setResult] = useState<GridAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<RegionalVisualFeatures | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    setSelectedSector(null);
  }, []);

  const analyze = useCallback(
    async (
      imageSrc: string,
      datasetId: string,
      customConfig?: Partial<GridConfig>
    ): Promise<GridAnalysisResult | null> => {
      setError(null);

      const config: GridConfig = {
        ...DEFAULT_GRID_CONFIG,
        ...customConfig,
      };

      try {
        console.log('[useImageProcessor] Step 1: Loading OpenCV...');
        setStatus('loading_cv');
        const cv = await loadOpenCV();
        console.log('[useImageProcessor] Step 1 complete. OpenCV loaded, cv.Mat available:', typeof cv.Mat);

        console.log('[useImageProcessor] Step 2: Loading image:', imageSrc);
        setStatus('loading_image');
        const img = await loadImageElement(imageSrc);
        const prepared = prepareImageBuffer(img, config.maxProcessingWidth);
        console.log('[useImageProcessor] Step 2 complete. Buffer prepared:', prepared.processingWidth, 'x', prepared.processingHeight);

        console.log('[useImageProcessor] Step 3: Executing analyzeImageGrid...');
        setStatus('analyzing');
        const analysisResult = analyzeImageGrid(cv, prepared, datasetId, imageSrc, config);
        console.log('[useImageProcessor] Step 3 complete. Analysis duration:', analysisResult.processingDurationMs, 'ms. Sectors:', analysisResult.sectors.length);

        setResult(analysisResult);
        setStatus('success');
        // Default select center sector if available
        if (analysisResult.sectors.length > 0) {
          const centerIndex = Math.floor(analysisResult.sectors.length / 2);
          setSelectedSector(analysisResult.sectors[centerIndex] || analysisResult.sectors[0]);
        }

        return analysisResult;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown image processing error';
        console.error('[useImageProcessor] Pipeline error caught:', message, err);
        setError(message);
        setStatus('error');
        return null;
      }
    },
    []
  );

  return {
    status,
    isProcessing: status === 'loading_cv' || status === 'loading_image' || status === 'analyzing',
    result,
    error,
    selectedSector,
    setSelectedSector,
    analyze,
    reset,
  };
}
