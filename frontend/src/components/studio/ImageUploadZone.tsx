'use client';

/**
 * Image Upload Dropzone Component
 * Earth Information Jukebox — MVP Finalization
 *
 * Provides a high-contrast mission-control drag-and-drop file upload zone
 * supporting PNG, JPG/JPEG, and WEBP images with client-side validation:
 * - Max file size: 10 MB
 * - Max dimensions: 4096 x 4096 px
 * - Strictly client-side: 100% in-browser, no external server transfer.
 */

import React, { useState, useRef, useCallback } from 'react';
import { 
  UploadCloud, 
  FileImage, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RefreshCw,
  HardDrive,
  Maximize2,
  ShieldCheck
} from 'lucide-react';

export interface UploadedImageInfo {
  readonly file: File;
  readonly objectUrl: string;
  readonly fileName: string;
  readonly fileSizeFormatted: string;
  readonly fileSizeBytes: number;
  readonly width: number;
  readonly height: number;
  readonly format: string;
}

interface ImageUploadZoneProps {
  readonly currentImage: UploadedImageInfo | null;
  readonly onImageSelected: (info: UploadedImageInfo) => void;
  readonly onImageCleared: () => void;
  readonly disabled?: boolean;
}

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DIMENSION_PX = 4096;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUploadZone({
  currentImage,
  onImageSelected,
  onImageCleared,
  disabled = false,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = useCallback(
    (file: File) => {
      setValidationError(null);

      // 1. Validate MIME type & file extension
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidMime = ALLOWED_MIME_TYPES.has(file.type);
      const isValidExt = ALLOWED_EXTENSIONS.includes(extension);

      if (!isValidMime && !isValidExt) {
        setValidationError(
          `Invalid file format "${file.name}". Only PNG, JPG, JPEG, and WEBP image formats are supported. Executable or non-image files are strictly rejected.`
        );
        return;
      }

      // 2. Validate file size (10 MB max)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setValidationError(
          `File size (${formatBytes(file.size)}) exceeds the maximum allowed limit of 10 MB. Please select a compressed image.`
        );
        return;
      }

      setIsValidating(true);

      // 3. Validate image dimensions using off-screen Image
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        setIsValidating(false);
        const { naturalWidth: width, naturalHeight: height } = img;

        if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
          URL.revokeObjectURL(objectUrl);
          setValidationError(
            `Image dimensions (${width} × ${height} px) exceed the maximum allowed limit of 4096 × 4096 px.`
          );
          return;
        }

        if (width <= 0 || height <= 0) {
          URL.revokeObjectURL(objectUrl);
          setValidationError('Corrupted or empty image file: dimensions could not be read.');
          return;
        }

        // Clean up previous image object URL if existing
        if (currentImage?.objectUrl) {
          try {
            URL.revokeObjectURL(currentImage.objectUrl);
          } catch {
            // ignore
          }
        }

        onImageSelected({
          file,
          objectUrl,
          fileName: file.name,
          fileSizeFormatted: formatBytes(file.size),
          fileSizeBytes: file.size,
          width,
          height,
          format: file.type || extension.replace('.', '').toUpperCase(),
        });
      };

      img.onerror = () => {
        setIsValidating(false);
        URL.revokeObjectURL(objectUrl);
        setValidationError(
          'Failed to decode image. The file may be damaged or in an unsupported encoding format.'
        );
      };

      img.src = objectUrl;
    },
    [currentImage, onImageSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndProcessFile(files[0]);
      }
    },
    [disabled, validateAndProcessFile]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
    // reset input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleClearImage = () => {
    if (currentImage?.objectUrl) {
      try {
        URL.revokeObjectURL(currentImage.objectUrl);
      } catch {
        // ignore
      }
    }
    setValidationError(null);
    onImageCleared();
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Upload custom image file"
      />

      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-sm border border-alert-crimson/60 bg-alert-crimson/10 p-3.5 flex items-start gap-3 text-alert-crimson">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider block">Upload Validation Notice:</span>
            <p className="text-[11px] mt-0.5 text-text-primary leading-normal">{validationError}</p>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-text-muted hover:text-text-primary p-0.5"
            aria-label="Dismiss error notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone (When No Image Selected) */}
      {!currentImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerUpload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerUpload();
            }
          }}
          className={`relative rounded-sm border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-nasa-cyan bg-nasa-cyan/10 shadow-[0_0_24px_rgba(0,229,255,0.3)] scale-[1.01]'
              : 'border-hairline bg-chassis-panel/60 hover:border-nasa-cyan/50 hover:bg-chassis-panel'
          } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`p-3 rounded-full border ${isDragging ? 'border-nasa-cyan bg-nasa-cyan/20 text-nasa-cyan' : 'border-hairline-bright bg-chassis-base text-text-muted'}`}>
              <UploadCloud className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                {isDragging ? 'Release to Load Image into Buffer' : 'Upload Custom Earth Observation Image'}
              </h4>
              <p className="text-[11px] text-text-secondary max-w-md mx-auto">
                Drag and drop your satellite raster, climate colormap, or Earth photography here, or click to browse.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px]">
              <span className="rounded-xs border border-hairline bg-chassis-base px-2 py-0.5 text-text-muted uppercase">
                Formats: PNG • JPG • WEBP
              </span>
              <span className="rounded-xs border border-hairline bg-chassis-base px-2 py-0.5 text-text-muted uppercase">
                Max Size: 10 MB
              </span>
              <span className="rounded-xs border border-hairline bg-chassis-base px-2 py-0.5 text-text-muted uppercase">
                Max Res: 4096 × 4096 px
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerUpload();
                }}
                disabled={disabled || isValidating}
                className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.25)] text-xs"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{isValidating ? 'Validating Image...' : 'Choose Image File'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-biosphere-emerald pt-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Private Client Execution — Images never leave your browser</span>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview & Metadata Card (When Image Selected) */
        <div className="rounded-sm border border-hairline-accent bg-chassis-panel/90 p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-biosphere-emerald" />
              <span className="font-bold text-text-primary uppercase tracking-wider text-xs">
                Custom Image Loaded in Memory Buffer
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerUpload}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-chassis-base px-2.5 py-1 text-[10px] text-text-secondary hover:text-nasa-cyan hover:border-nasa-cyan transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Change Image</span>
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-chassis-base px-2 py-1 text-[10px] text-text-muted hover:text-alert-crimson hover:border-alert-crimson transition-colors"
                aria-label="Clear selected image"
              >
                <X className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Preview Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Image Thumbnail */}
            <div className="md:col-span-5 relative aspect-[16/10] w-full rounded-xs border border-hairline bg-space-black overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage.objectUrl}
                alt={currentImage.fileName}
                className="object-contain w-full h-full max-h-48"
              />
              <div className="absolute top-1.5 right-1.5 rounded-xs bg-space-black/80 border border-hairline px-1.5 py-0.5 text-[9px] text-text-muted uppercase">
                Preview
              </div>
            </div>

            {/* File Metadata Details */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">File Name</div>
                <div className="font-bold text-text-primary text-xs truncate" title={currentImage.fileName}>
                  {currentImage.fileName}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xs border border-hairline bg-chassis-base p-2">
                  <span className="text-[9px] text-text-muted uppercase block flex items-center gap-1">
                    <Maximize2 className="h-2.5 w-2.5 text-nasa-cyan" />
                    Dimensions
                  </span>
                  <span className="text-text-primary font-bold text-[11px]">
                    {currentImage.width} × {currentImage.height}
                  </span>
                </div>

                <div className="rounded-xs border border-hairline bg-chassis-base p-2">
                  <span className="text-[9px] text-text-muted uppercase block flex items-center gap-1">
                    <HardDrive className="h-2.5 w-2.5 text-telemetry-amber" />
                    File Size
                  </span>
                  <span className="text-text-primary font-bold text-[11px]">
                    {currentImage.fileSizeFormatted}
                  </span>
                </div>

                <div className="rounded-xs border border-hairline bg-chassis-base p-2">
                  <span className="text-[9px] text-text-muted uppercase block flex items-center gap-1">
                    <FileImage className="h-2.5 w-2.5 text-biosphere-emerald" />
                    Format
                  </span>
                  <span className="text-text-primary font-bold text-[11px] uppercase">
                    {currentImage.format.replace('image/', '')}
                  </span>
                </div>
              </div>

              <div className="rounded-xs border border-hairline/80 bg-chassis-base/60 p-2 text-[10px] text-text-secondary leading-normal">
                Ready for OpenCV.js WebAssembly grid segmentation and Tone.js audio sonification. Click <strong>&quot;Analyze Image&quot;</strong> below to compute regional features.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
