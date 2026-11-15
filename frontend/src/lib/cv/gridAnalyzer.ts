/**
 * Grid Segmentation & Feature Extraction Pipeline
 * Earth Information Jukebox — Phase 4
 *
 * SCIENTIFIC INTEGRITY DIRECTIVE:
 * Values extracted by this module are visual features derived from colormaps (e.g. Crameri 'vik').
 * They are NOT direct scientific temperature measurements.
 * Colormaps are not linear luminance gradients; brightness does not equal temperature.
 */

import { OpenCVRuntime, CVMat, CVRect } from './cvTypes';
import { PreparedCanvasBuffer } from './imageLoader';
import { 
  GridConfig, 
  GridAnalysisResult, 
  RegionalVisualFeatures, 
  SectorCoordinates,
  ColorRGB,
  ColorHSV
} from '@/types/cv';

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 16,
  rows: 16,
  maxProcessingWidth: 512,
} as const;

/**
 * Analyzes an image canvas buffer by partitioning it into an N x M grid
 * and extracting regional statistical features using OpenCV.js.
 */
export function analyzeImageGrid(
  cv: OpenCVRuntime,
  prepared: PreparedCanvasBuffer,
  datasetId: string,
  imageSrc: string,
  config: GridConfig = DEFAULT_GRID_CONFIG
): GridAnalysisResult {
  const startTime = performance.now();
  const { canvas, originalWidth, originalHeight, processingWidth, processingHeight } = prepared;
  const { columns, rows } = config;

  if (columns <= 0 || rows <= 0) {
    throw new Error('Grid columns and rows must be greater than zero.');
  }

  // Pre-allocate top-level Mats
  let srcMat: CVMat | null = null;
  let rgbMat: CVMat | null = null;
  let hsvMat: CVMat | null = null;
  let grayMat: CVMat | null = null;
  let gradX: CVMat | null = null;
  let gradY: CVMat | null = null;
  let absGradX: CVMat | null = null;
  let absGradY: CVMat | null = null;
  let edgeGrad: CVMat | null = null;
  let meanMat: CVMat | null = null;
  let stddevMat: CVMat | null = null;

  const sectors: RegionalVisualFeatures[] = [];

  try {
    // 1. Read canvas into OpenCV RGBA Mat
    srcMat = cv.imread(canvas);

    // 2. Color space conversions
    rgbMat = new cv.Mat();
    hsvMat = new cv.Mat();
    grayMat = new cv.Mat();

    cv.cvtColor(srcMat, rgbMat, cv.COLOR_RGBA2RGB);
    cv.cvtColor(rgbMat, hsvMat, cv.COLOR_RGB2HSV);
    cv.cvtColor(rgbMat, grayMat, cv.COLOR_RGB2GRAY);

    // 3. Compute spatial edge gradient using Sobel operator
    gradX = new cv.Mat();
    gradY = new cv.Mat();
    absGradX = new cv.Mat();
    absGradY = new cv.Mat();
    edgeGrad = new cv.Mat();

    cv.Sobel(grayMat, gradX, cv.CV_16S, 1, 0, 3);
    cv.Sobel(grayMat, gradY, cv.CV_16S, 0, 1, 3);
    cv.convertScaleAbs(gradX, absGradX);
    cv.convertScaleAbs(gradY, absGradY);
    cv.addWeighted(absGradX, 0.5, absGradY, 0.5, 0, edgeGrad);

    // Reusable Mats for meanStdDev
    meanMat = new cv.Mat();
    stddevMat = new cv.Mat();

    const cellWidth = processingWidth / columns;
    const cellHeight = processingHeight / rows;

    let totalLuminanceSum = 0;
    let totalEdgeSum = 0;
    let activeDataSectorCount = 0;

    // 4. Grid iteration & localized feature extraction
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const procX = Math.round(c * cellWidth);
        const procY = Math.round(r * cellHeight);
        const procW = Math.min(Math.round((c + 1) * cellWidth) - procX, processingWidth - procX);
        const procH = Math.min(Math.round((r + 1) * cellHeight) - procY, processingHeight - procY);

        if (procW <= 0 || procH <= 0) continue;

        // Scaled back to original image dimensions (e.g. 1920x1080)
        const origX = Math.round(procX / prepared.scaleFactor);
        const origY = Math.round(procY / prepared.scaleFactor);
        const origW = Math.round(procW / prepared.scaleFactor);
        const origH = Math.round(procH / prepared.scaleFactor);

        const coordinates: SectorCoordinates = {
          colIndex: c,
          rowIndex: r,
          normalizedX: Number(((c + 0.5) / columns).toFixed(4)),
          normalizedY: Number(((r + 0.5) / rows).toFixed(4)),
          processingX: procX,
          processingY: procY,
          processingWidth: procW,
          processingHeight: procH,
          originalX: origX,
          originalY: origY,
          originalWidth: origW,
          originalHeight: origH,
        };

        const rect: CVRect = new cv.Rect(procX, procY, procW, procH);

        let rgbRoi: CVMat | null = null;
        let hsvRoi: CVMat | null = null;
        let grayRoi: CVMat | null = null;
        let edgeRoi: CVMat | null = null;

        try {
          rgbRoi = rgbMat.roi(rect);
          hsvRoi = hsvMat.roi(rect);
          grayRoi = grayMat.roi(rect);
          edgeRoi = edgeGrad.roi(rect);

          // Mean RGB
          const meanRgbScalar = cv.mean(rgbRoi);
          const rVal = Math.round(meanRgbScalar[0]);
          const gVal = Math.round(meanRgbScalar[1]);
          const bVal = Math.round(meanRgbScalar[2]);

          const averageRgb: ColorRGB = { r: rVal, g: gVal, b: bVal };

          // Mean HSV
          // In OpenCV, H is [0, 180] -> map to [0, 360] degrees; S and V are [0, 255] -> map to [0.0, 1.0]
          const meanHsvScalar = cv.mean(hsvRoi);
          const averageHsv: ColorHSV = {
            h: Number((meanHsvScalar[0] * 2).toFixed(1)),
            s: Number((meanHsvScalar[1] / 255).toFixed(3)),
            v: Number((meanHsvScalar[2] / 255).toFixed(3)),
          };

          // Relative Luminance (Rec. 601: Y = 0.299R + 0.587G + 0.114B)
          const luminance = Number(((0.299 * rVal + 0.587 * gVal + 0.114 * bVal) / 255).toFixed(4));

          // Color intensity standard deviation / variance (OpenCV meanStdDev returns CV_64FC1 data64F)
          cv.meanStdDev(grayRoi, meanMat, stddevMat);
          const rawStdDev = stddevMat.data64F?.[0] ?? stddevMat.data32F?.[0] ?? stddevMat.data?.[0] ?? 0;
          const variance = Number(rawStdDev.toFixed(2));

          // Spatial Edge Density (from Sobel magnitude)
          const meanEdgeScalar = cv.mean(edgeRoi);
          const edgeDensity = Number((meanEdgeScalar[0] / 255).toFixed(4));

          // Check if sector is outside the globe boundary (e.g. pure white/near-white margin of the Robinson projection canvas)
          const isLikelyBackground = rVal > 245 && gVal > 245 && bVal > 245 && averageHsv.s < 0.06;

          if (!isLikelyBackground) {
            totalLuminanceSum += luminance;
            totalEdgeSum += edgeDensity;
            activeDataSectorCount++;
          }

          sectors.push({
            coordinates,
            pixelCount: procW * procH,
            averageRgb,
            averageHsv,
            luminance,
            colorVariance: variance,
            edgeDensity,
            isLikelyBackground,
          });
        } finally {
          rgbRoi?.delete();
          hsvRoi?.delete();
          grayRoi?.delete();
          edgeRoi?.delete();
        }
      }
    }

    const duration = Number((performance.now() - startTime).toFixed(1));

    const totalActive = activeDataSectorCount > 0 ? activeDataSectorCount : sectors.length;
    const globalMeanLuminance = Number((totalLuminanceSum / totalActive).toFixed(4));
    const globalMeanEdge = Number((totalEdgeSum / totalActive).toFixed(4));

    return {
      datasetId,
      imageSrc,
      timestamp: Date.now(),
      processingDurationMs: duration,
      originalDimensions: {
        width: originalWidth,
        height: originalHeight,
      },
      processingDimensions: {
        width: processingWidth,
        height: processingHeight,
      },
      gridConfig: config,
      sectors,
      globalStatistics: {
        totalSectors: sectors.length,
        activeDataSectors: activeDataSectorCount,
        meanGlobalLuminance: globalMeanLuminance,
        meanGlobalEdgeDensity: globalMeanEdge,
        dominantColorHsv: sectors[0]?.averageHsv ?? { h: 0, s: 0, v: 0 },
      },
    };
  } finally {
    // Explicit deallocation of all top-level OpenCV matrices
    srcMat?.delete();
    rgbMat?.delete();
    hsvMat?.delete();
    grayMat?.delete();
    gradX?.delete();
    gradY?.delete();
    absGradX?.delete();
    absGradY?.delete();
    edgeGrad?.delete();
    meanMat?.delete();
    stddevMat?.delete();
  }
}
