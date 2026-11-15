'use client';

/**
 * Sonification Mapping Explainer Component
 * Earth Information Jukebox — Phase 5
 *
 * Transparent scientific explanation detailing the exact mathematical and musical
 * mappings from OpenCV.js visual features to Tone.js audio synthesis parameters.
 */

import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Sliders, 
  Compass, 
  Layers, 
  AlertTriangle,
  Wind
} from 'lucide-react';

export default function SonificationMappingExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base font-mono text-xs overflow-hidden">
      {/* Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-chassis-panel/60 hover:bg-chassis-panel transition-colors text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-nasa-cyan shrink-0" />
          <span className="font-bold uppercase tracking-wider text-text-primary text-xs">
            How Earth Visual Features Become Sound (Scientific Sonification Guide)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
          <span>{isOpen ? 'COLLAPSE' : 'EXPAND GUIDE'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {/* Expandable Explanation Body */}
      {isOpen && (
        <div className="p-5 border-t border-hairline space-y-5 bg-space-black/40">
          {/* Scientific Disclaimer Alert */}
          <div className="rounded-xs border border-telemetry-amber/30 bg-telemetry-amber/5 p-3 flex items-start gap-2.5 text-telemetry-amber text-[11px] leading-relaxed">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <strong className="uppercase font-bold">Scientific Integrity Principle: </strong>
              This soundscape is generated strictly from <em>visual colormap features</em> extracted by OpenCV.js 
              (Crameri &quot;vik&quot; palette on a Robinson projection). It is an acoustic translation of planetary visual patterns, 
              not a physical direct temperature sensor reading. Canvas background borders outside the Earth oval are 
              automatically silenced as rests.
            </div>
          </div>

          {/* Feature-to-Sound Mapping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Luminance -> Pitch */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-nasa-cyan font-bold uppercase text-[11px]">
                <Music className="h-3.5 w-3.5" />
                <span>1. Luminance → Musical Pitch</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Regional brightness $Y = 0.299R + 0.587G + 0.114B \in [0, 1]$ maps monotonically across the active 
                musical scale. Darker oceanic sectors trigger deeper lower-octave frequencies (e.g. C3–G3), 
                while bright white/yellowish neutral-anomaly zones ascend into higher registers (e.g. C5–A5).
              </p>
            </div>

            {/* 2. Color Variance -> Filter & Timbre */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-telemetry-amber font-bold uppercase text-[11px]">
                <Sliders className="h-3.5 w-3.5" />
                <span>2. Variance → Timbre & Filter</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Standard deviation of pixel intensities within each grid cell controls the low-pass filter cutoff frequency (500 Hz to 3500 Hz). 
                Uniform, quiet ocean regions sound warm and muted; turbulent boundary zones open up the filter with rich harmonic sparkle.
              </p>
            </div>

            {/* 3. Horizontal Position -> Stereo Panning */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-biosphere-emerald font-bold uppercase text-[11px]">
                <Compass className="h-3.5 w-3.5" />
                <span>3. Longitude → Stereo Field</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                The horizontal coordinate of the scanned cell ($x \in [0, 1]$) pans audio smoothly across the stereo spectrum 
                from $-85\%$ left to $+85\%$ right, providing spatial acoustic orientation across the Western and Eastern hemispheres.
              </p>
            </div>

            {/* 4. Spatial Edge Density -> Atmospheric Noise */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                <Wind className="h-3.5 w-3.5" />
                <span>4. Sobel Edges → Atmosphere</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Sobel gradient magnitude detects coastlines, thermal fronts, and steep anomaly gradients. Sectors with edge densities 
                greater than $0.15$ trigger subtle, band-pass-filtered pink noise bursts evoking atmospheric wind and planetary friction.
              </p>
            </div>

            {/* 5. Traversal Order -> Planetary Sweep */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[11px]">
                <Layers className="h-3.5 w-3.5" />
                <span>5. Sweep Mode → Timeline</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                <strong>Longitude Sweep (Default):</strong> Scans West to East across meridians simulating Earth rotation.<br />
                <strong>Latitude Scan:</strong> Sweeps North to South (Arctic → Tropics → Antarctic).<br />
                <strong>Zigzag:</strong> Alternating polar scans for continuous melodic contours.
              </p>
            </div>

            {/* 6. Harmonic Scale Constraint */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                <Music className="h-3.5 w-3.5" />
                <span>6. Scale Quantization</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                All raw frequencies are strictly quantized to user-selectable musical scales (Major/Minor Pentatonic, Dorian, Lydian). 
                This mathematically eliminates harsh, dissonant intervals, creating an inspiring, consonant listening experience.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
