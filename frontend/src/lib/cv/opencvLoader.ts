import { OpenCVRuntime } from './cvTypes';

let openCVLoadingPromise: Promise<OpenCVRuntime> | null = null;

/**
 * Lazily loads OpenCV.js into the browser environment.
 * Injects /assets/opencv/opencv.js and polls for window.cv.Mat readiness.
 */
export function loadOpenCV(): Promise<OpenCVRuntime> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('OpenCV.js can only be loaded in a browser environment.'));
  }

  // If already loaded and initialized
  if (window.cv && typeof window.cv.Mat === 'function') {
    if (typeof (window.cv as any).then === 'function') {
      delete (window.cv as any).then;
    }
    return Promise.resolve(window.cv);
  }

  // If already loading, reuse the active promise
  if (openCVLoadingPromise) {
    return openCVLoadingPromise;
  }

  openCVLoadingPromise = new Promise<OpenCVRuntime>((resolve, reject) => {
    const timeoutMs = 30000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let pollIntervalId: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (pollIntervalId) clearInterval(pollIntervalId);
    };

    timeoutId = setTimeout(() => {
      cleanup();
      openCVLoadingPromise = null;
      reject(new Error('OpenCV.js initialization timed out after 30 seconds.'));
    }, timeoutMs);

    const checkReady = () => {
      if (window.cv && typeof window.cv.Mat === 'function') {
        cleanup();
        // Remove Emscripten's non-standard pseudo-then to prevent ECMAScript Promise resolution infinite loop
        if (typeof (window.cv as any).then === 'function') {
          delete (window.cv as any).then;
        }
        console.log('[OpenCV Loader] window.cv.Mat ready!');
        resolve(window.cv);
        return true;
      }
      return false;
    };

    // If script element already exists
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="opencv.js"]');
    if (existingScript) {
      if (checkReady()) return;
      pollIntervalId = setInterval(checkReady, 50);
      existingScript.addEventListener('error', () => {
        cleanup();
        openCVLoadingPromise = null;
        reject(new Error('Failed to load OpenCV.js script from local assets.'));
      });
      return;
    }

    // Inject dynamic script tag
    const script = document.createElement('script');
    script.src = '/assets/opencv/opencv.js';
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      console.log('[OpenCV Loader] script.onload fired. Polling for cv.Mat...');
      if (checkReady()) return;
      pollIntervalId = setInterval(checkReady, 50);
    };

    script.onerror = () => {
      cleanup();
      openCVLoadingPromise = null;
      reject(new Error('Failed to load OpenCV.js script from /assets/opencv/opencv.js.'));
    };

    document.body.appendChild(script);
  });

  return openCVLoadingPromise;
}

/**
 * Checks if OpenCV is currently initialized and ready for computation.
 */
export function isOpenCVReady(): boolean {
  return typeof window !== 'undefined' && Boolean(window.cv && typeof window.cv.Mat === 'function');
}
