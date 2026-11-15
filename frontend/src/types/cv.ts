/**
 * Computer Vision Analysis Types
 * Earth Information Jukebox — Phase 4
 */

export interface ColorRGB {
  readonly r: number; // 0 - 255
  readonly g: number; // 0 - 255
  readonly b: number; // 0 - 255
}

export interface ColorHSV {
  readonly h: number; // 0 - 360 degrees
  readonly s: number; // 0.0 - 1.0
  readonly v: number; // 0.0 - 1.0
}

export interface SectorCoordinates {
  readonly colIndex: number;
  readonly rowIndex: number;
  readonly normalizedX: number; // 0.0 to 1.0
  readonly normalizedY: number; // 0.0 to 1.0
  readonly processingX: number; // X in downsampled buffer
  readonly processingY: number; // Y in downsampled buffer
  readonly processingWidth: number;
  readonly processingHeight: number;
  readonly originalX: number; // X in original 1920x1080 image
  readonly originalY: number; // Y in original 1920x1080 image
  readonly originalWidth: number;
  readonly originalHeight: number;
}

/**
 * Regional Visual Feature Extraction
 * Note: These are strictly visual/optical features, NOT direct scientific temperature measurements.
 */
export interface RegionalVisualFeatures {
  readonly coordinates: SectorCoordinates;
  readonly pixelCount: number;
  readonly averageRgb: ColorRGB;
  readonly averageHsv: ColorHSV;
  readonly luminance: number; // Normalized 0.0 (dark) to 1.0 (bright)
  readonly colorVariance: number; // Standard deviation of luminance/intensity
  readonly edgeDensity: number; // Normalized 0.0 (smooth) to 1.0 (high spatial contrast)
  readonly isLikelyBackground: boolean; // Flagged if sector is outside the Robinson globe boundary (e.g. pure white canvas border)
}

export interface GridConfig {
  readonly columns: number; // Default: 16
  readonly rows: number; // Default: 16
  readonly maxProcessingWidth: number; // Default: 512
}

export interface GridAnalysisResult {
  readonly datasetId: string;
  readonly imageSrc: string;
  readonly timestamp: number;
  readonly processingDurationMs: number;
  readonly originalDimensions: {
    readonly width: number;
    readonly height: number;
  };
  readonly processingDimensions: {
    readonly width: number;
    readonly height: number;
  };
  readonly gridConfig: GridConfig;
  readonly sectors: readonly RegionalVisualFeatures[];
  readonly globalStatistics: {
    readonly totalSectors: number;
    readonly activeDataSectors: number;
    readonly meanGlobalLuminance: number;
    readonly meanGlobalEdgeDensity: number;
    readonly dominantColorHsv: ColorHSV;
  };
}

export type OpenCVLoadStatus = 'idle' | 'loading' | 'ready' | 'error';
