/**
 * OpenCV.js Minimal Type Definitions
 * Typed wrapper to avoid 'any' when interacting with OpenCV WebAssembly module.
 */

export interface CVMat {
  readonly rows: number;
  readonly cols: number;
  readonly type: () => number;
  readonly channels: () => number;
  readonly delete: () => void;
  roi: (rect: CVRect) => CVMat;
  copyTo: (dst: CVMat) => void;
  data: Uint8Array;
  data32F?: Float32Array;
  data64F?: Float64Array;
}

export interface CVRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CVScalar {
  [index: number]: number;
}

export interface CVSize {
  width: number;
  height: number;
}

export interface OpenCVRuntime {
  Mat: new () => CVMat;
  matFromArray?: (rows: number, cols: number, type: number, array: ArrayLike<number>) => CVMat;
  zeros: (rows: number, cols: number, type: number) => CVMat;
  Rect: new (x: number, y: number, width: number, height: number) => CVRect;
  Scalar: new (...args: number[]) => CVScalar;
  Size: new (width: number, height: number) => CVSize;
  imread: (imageOrCanvas: HTMLCanvasElement | HTMLImageElement | string) => CVMat;
  imshow: (canvas: HTMLCanvasElement, mat: CVMat) => void;
  cvtColor: (src: CVMat, dst: CVMat, code: number) => void;
  resize: (src: CVMat, dst: CVMat, dsize: CVSize, fx?: number, fy?: number, interpolation?: number) => void;
  mean: (src: CVMat) => CVScalar;
  meanStdDev: (src: CVMat, mean: CVMat, stddev: CVMat) => void;
  Sobel: (src: CVMat, dst: CVMat, ddepth: number, dx: number, dy: number, ksize?: number) => void;
  convertScaleAbs: (src: CVMat, dst: CVMat) => void;
  addWeighted: (src1: CVMat, alpha: number, src2: CVMat, beta: number, gamma: number, dst: CVMat) => void;

  // Constants
  COLOR_RGBA2RGB: number;
  COLOR_RGB2HSV: number;
  COLOR_RGB2GRAY: number;
  COLOR_RGBA2GRAY: number;
  CV_8U: number;
  CV_8UC1: number;
  CV_8UC3: number;
  CV_8UC4: number;
  CV_16S: number;
  CV_32F: number;
  INTER_AREA: number;
  INTER_LINEAR: number;

  onRuntimeInitialized?: () => void;
}

declare global {
  interface Window {
    cv?: OpenCVRuntime;
    Module?: {
      onRuntimeInitialized?: () => void;
    };
  }
}
