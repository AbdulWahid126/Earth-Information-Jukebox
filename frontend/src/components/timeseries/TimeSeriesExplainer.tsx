'use client';

/**
 * NASA GISTEMP Time-Series Scientific Explainer Component
 * Earth Information Jukebox — Phase 6
 *
 * Details the scientific principles behind temperature anomalies,
 * the 1951–1980 climatological baseline, and acoustic pitch translation.
 */

import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Thermometer, 
  Calendar, 
  Music, 
  Sliders, 
  AlertTriangle 
} from 'lucide-react';

export default function TimeSeriesExplainer() {
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
            Understanding Climate Anomalies & Sonification (Scientific Guide)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-[10px]">
          <span>{isOpen ? 'COLLAPSE' : 'EXPAND GUIDE'}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-5 border-t border-hairline space-y-5 bg-space-black/40">
          {/* Scientific Notice */}
          <div className="rounded-xs border border-telemetry-amber/30 bg-telemetry-amber/5 p-3 flex items-start gap-2.5 text-telemetry-amber text-[11px] leading-relaxed">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <strong className="uppercase font-bold">Scientific Anomaly Principle: </strong>
              These values represent temperature <em>anomalies</em> (deviations from the baseline), 
              <strong> not absolute surface temperatures</strong>. An anomaly of +1.28 °C indicates the 
              planet was 1.28 °C warmer than the 1951–1980 global average, not that the surface temperature was 1.28 °C.
            </div>
          </div>

          {/* Core Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. What is an Anomaly */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-nasa-cyan font-bold uppercase text-[11px]">
                <Thermometer className="h-3.5 w-3.5" />
                <span>1. Why Use Anomalies?</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Absolute temperatures vary by tens of degrees between valleys and mountaintops within a few miles. 
                However, <em>temperature anomalies</em> (departures from normal) are spatially coherent across distances of 
                up to 1,200 km, allowing accurate global aggregation even in sparse measurement regions.
              </p>
            </div>

            {/* 2. The 1951-1980 Baseline */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-biosphere-emerald font-bold uppercase text-[11px]">
                <Calendar className="h-3.5 w-3.5" />
                <span>2. The 1951–1980 Baseline</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                NASA GISS standardizes against the 30-year climatological base period 1951–1980. This window was selected 
                because it represents the earliest era with comprehensive, high-quality meteorological station coverage across 
                both hemispheres and global ocean basins.
              </p>
            </div>

            {/* 3. Why Cold and Warm Sound Different */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-telemetry-amber font-bold uppercase text-[11px]">
                <Music className="h-3.5 w-3.5" />
                <span>3. Acoustic Contrast</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                0.00 °C is anchored at middle C (C4, 261.6 Hz). Historical cool anomalies (-0.8 °C to 0.0 °C) 
                descend into deep bass registers (C2–A3) with warm, muted filtering. Modern warming (&gt; +1.0 °C) ascends into high, brilliant octaves (C5–C6), 
                creating an unmistakable musical trajectory.
              </p>
            </div>

            {/* 4. Filter Cutoff Brightness */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
                <Sliders className="h-3.5 w-3.5" />
                <span>4. Filter & Harmonic Timbre</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                The 24dB low-pass filter cutoff scales dynamically from 500 Hz in the coldest late-19th century years 
                up to 3600 Hz in 2024–2025. This introduces rich high-frequency shimmer and harmonic tension as global warming intensifies.
              </p>
            </div>

            {/* 5. Missing Data Integrity */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>5. Missing Data Policy</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                Incomplete observations marked by NASA with <code>***</code> (such as future months in 2026 or missing meteorological means in 1880) 
                are strictly treated as missing data, never as zero. Incomplete records are excluded from playback.
              </p>
            </div>

            {/* 6. Modality Separation */}
            <div className="rounded-xs border border-hairline bg-chassis-panel p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
                <Info className="h-3.5 w-3.5" />
                <span>6. Scientific Modality Separation</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-normal">
                This time series is a <strong>planet-wide spatial mean</strong> over time. It contains no longitude/latitude geographic data. 
                Spatial features are sonified separately in the 2D Map mode using OpenCV.js.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
