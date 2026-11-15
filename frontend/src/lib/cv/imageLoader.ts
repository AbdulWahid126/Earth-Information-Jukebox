/**
 * Image Loading and Downscaling Utilities
 * Earth Information Jukebox — Phase 4
 */

export interface PreparedCanvasBuffer {
  readonly canvas: HTMLCanvasElement;
  readonly originalWidth: number;
  readonly originalHeight: number;
  readonly processingWidth: number;
  readonly processingHeight: number;
  readonly scaleFactor: number;
}

/**
 * Loads an image from a URL into an HTMLImageElement.
 */
export function loadImageElement(imageSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('loadImageElement can only run in a browser.'));
    }

    const img = new Image();
    // Only set crossOrigin for remote absolute URLs to avoid tainting local same-origin canvas buffers
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    let isResolved = false;
    img.onload = () => {
      if (isResolved) return;
      isResolved = true;
      console.log('[loadImageElement] Image onload fired:', img.naturalWidth, img.naturalHeight);
      resolve(img);
    };
    img.onerror = () => {
      if (isResolved) return;
      isResolved = true;
      console.error('[loadImageElement] Image onerror fired for source:', imageSrc);
      reject(new Error(`Failed to load image from source: ${imageSrc}`));
    };

    img.src = imageSrc;

    if (img.complete && img.naturalWidth > 0) {
      isResolved = true;
      console.log('[loadImageElement] Image already complete in cache:', img.naturalWidth, img.naturalHeight);
      resolve(img);
    }
  });
}

/**
 * Creates an off-screen canvas buffer downscaled to a maximum processing width
 * to maintain high computational performance and avoid WebAssembly heap congestion.
 */
export function prepareImageBuffer(
  img: HTMLImageElement,
  maxProcessingWidth = 512
): PreparedCanvasBuffer {
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  if (originalWidth <= 0 || originalHeight <= 0) {
    throw new Error('Image dimensions must be greater than zero.');
  }

  // Calculate proportional scale
  let processingWidth = originalWidth;
  let processingHeight = originalHeight;

  if (originalWidth > maxProcessingWidth) {
    const scale = maxProcessingWidth / originalWidth;
    processingWidth = Math.round(originalWidth * scale);
    processingHeight = Math.round(originalHeight * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = processingWidth;
  canvas.height = processingHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not acquire 2D rendering context for off-screen canvas.');
  }

  // Draw image scaled down
  ctx.drawImage(img, 0, 0, processingWidth, processingHeight);

  return {
    canvas,
    originalWidth,
    originalHeight,
    processingWidth,
    processingHeight,
    scaleFactor: processingWidth / originalWidth,
  };
}
