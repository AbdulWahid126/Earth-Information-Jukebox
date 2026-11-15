'use client';

import { motion } from 'framer-motion';
import { Eye, Cpu, Headphones, ArrowRight, Grid3X3, Sliders, Waves } from 'lucide-react';

export default function ExperiencePreview() {
  return (
    <section className="relative border-t border-hairline px-4 py-24 sm:px-6 lg:px-8 bg-chassis-base/70 overflow-hidden">
      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/5 px-2.5 py-1 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-nasa-cyan animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
              Scientific Instrument Workflow
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            OBSERVE. ANALYZE. LISTEN.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Every NASA Earth observation captures physical dynamics as light, wavelength, and spatial geometry. 
            Our browser-native processing pipeline translates those visual structures directly into harmonic music.
          </p>
        </div>

        {/* 3-Stage Scientific Workflow Rack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">

          {/* =========================================================================
              STAGE 01: OBSERVE
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col rounded-sm border border-hairline bg-chassis-panel/90 overflow-hidden"
          >
            {/* Stage Bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-chassis-base px-4 py-2.5 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-nasa-cyan font-bold tracking-wider uppercase">
                <Eye className="h-3.5 w-3.5" />
                <span>Stage 01 // Ingest</span>
              </div>
              <span className="text-text-muted">SOURCE DATA</span>
            </div>

            {/* Visual Graphic Area: Earth Observation Swath */}
            <div className="p-4 bg-space-black/60 border-b border-hairline">
              <div className="relative aspect-[16/9] w-full rounded-xs border border-hairline-bright bg-chassis-base overflow-hidden flex flex-col justify-between p-3">
                {/* Simulated Satellite Swath Viewport */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-cyan-950/20 to-emerald-950/30" />
                <div className="absolute inset-0 hud-scanline opacity-30" />
                
                {/* Simulated Geodetic Grid Lines */}
                <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-text-muted">
                  <span>LAT: 45°N → 45°S</span>
                  <span>SPECTRAL: MULTI-BAND</span>
                </div>

                {/* Simulated Colormap Calibration Bar */}
                <div className="relative z-10 my-auto py-2">
                  <div className="h-2 w-full rounded-xs bg-gradient-to-r from-blue-600 via-cyan-400 via-amber-400 to-red-600 border border-hairline" />
                  <div className="flex justify-between font-mono text-[7px] text-text-secondary mt-1">
                    <span>MIN (COLD / DENSE)</span>
                    <span>CALIBRATED LEGEND</span>
                    <span>MAX (WARM / ROUGH)</span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between font-mono text-[8px] text-nasa-cyan">
                  <span>SENSOR: MODIS / VIIRS</span>
                  <span>RESOLUTION: 1KM/PX</span>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
                  1. Observe Satellite Telemetry
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Ingest verified NASA satellite composites with documented scientific calibration legends and physical measurement ranges.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline font-mono text-[9px] text-text-muted">
                INPUT: 2D Spatial Radiometric Imagery (.webp / .png)
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              STAGE 02: ANALYZE
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col rounded-sm border border-hairline bg-chassis-panel/90 overflow-hidden"
          >
            {/* Stage Bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-chassis-base px-4 py-2.5 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-telemetry-amber font-bold tracking-wider uppercase">
                <Cpu className="h-3.5 w-3.5" />
                <span>Stage 02 // Deconstruct</span>
              </div>
              <span className="text-text-muted">OPENCV.JS WASM</span>
            </div>

            {/* Visual Graphic Area: CV Grid Matrix Analysis */}
            <div className="p-4 bg-space-black/60 border-b border-hairline">
              <div className="relative aspect-[16/9] w-full rounded-xs border border-hairline-bright bg-chassis-base overflow-hidden p-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[8px] text-telemetry-amber mb-1">
                  <span className="flex items-center gap-1">
                    <Grid3X3 className="h-2.5 w-2.5" />
                    SECTOR MATRIX: 16×16
                  </span>
                  <span>SOBEL EDGE DETECTOR</span>
                </div>

                {/* 16-Cell Miniature Interactive Matrix Graphic */}
                <div className="grid grid-cols-4 gap-1 flex-1 py-1">
                  {[
                    { lum: '0.82', active: false },
                    { lum: '0.94', active: true },
                    { lum: '0.45', active: false },
                    { lum: '0.12', active: false },
                    { lum: '0.67', active: false },
                    { lum: '0.88', active: true },
                    { lum: '0.73', active: false },
                    { lum: '0.31', active: false },
                    { lum: '0.55', active: false },
                    { lum: '0.79', active: false },
                    { lum: '0.91', active: true },
                    { lum: '0.42', active: false },
                  ].map((cell, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xs border flex items-center justify-center font-mono text-[8px] transition-colors ${
                        cell.active
                          ? 'border-telemetry-amber bg-telemetry-amber/20 text-telemetry-amber font-bold'
                          : 'border-hairline bg-chassis-surface/60 text-text-muted'
                      }`}
                    >
                      {cell.lum}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between font-mono text-[8px] text-text-muted mt-1">
                  <span>METRICS: LUMINANCE / HUE / VARIANCE</span>
                  <span className="text-telemetry-amber font-semibold">HEAP: ZERO LEAK</span>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
                  2. Computer Vision Analysis
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Browser-based OpenCV.js segments the visualization into regional sectors, calculating brightness, dominant hue, and edge boundary density.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline font-mono text-[9px] text-text-muted">
                PROCESS: Controlled Regional Aggregation &amp; Smoothing
              </div>
            </div>
          </motion.div>

          {/* =========================================================================
              STAGE 03: LISTEN
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col rounded-sm border border-hairline bg-chassis-panel/90 overflow-hidden"
          >
            {/* Stage Bar */}
            <div className="flex items-center justify-between border-b border-hairline bg-chassis-base px-4 py-2.5 font-mono text-[10px]">
              <div className="flex items-center gap-2 text-biosphere-emerald font-bold tracking-wider uppercase">
                <Headphones className="h-3.5 w-3.5" />
                <span>Stage 03 // Synthesize</span>
              </div>
              <span className="text-text-muted">TONE.JS AUDIO</span>
            </div>

            {/* Visual Graphic Area: Audio Synthesis DAW Rack */}
            <div className="p-4 bg-space-black/60 border-b border-hairline">
              <div className="relative aspect-[16/9] w-full rounded-xs border border-hairline-bright bg-chassis-base overflow-hidden p-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[8px] text-biosphere-emerald mb-1">
                  <span className="flex items-center gap-1">
                    <Waves className="h-2.5 w-2.5" />
                    HARMONIC SYNTH RACK
                  </span>
                  <span>SCALE: C MINOR PENTATONIC</span>
                </div>

                {/* Simulated Audio Spectrum Oscilloscope */}
                <div className="relative flex-1 bg-space-black/90 rounded-xs border border-hairline flex items-center justify-center p-2 overflow-hidden">
                  <svg className="w-full h-8 text-biosphere-emerald/80" viewBox="0 0 100 24" preserveAspectRatio="none">
                    <path
                      d="M 0,12 Q 10,2 20,12 T 40,12 T 60,6 T 80,18 T 100,12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div className="absolute inset-x-2 bottom-1 flex justify-between font-mono text-[7px] text-text-muted">
                    <span>40Hz BASS</span>
                    <span>440Hz LEAD</span>
                    <span>8kHz AIR</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[8px] text-text-muted mt-1">
                  <span>VOICES: LEAD + DRONE + NOISE</span>
                  <span className="text-biosphere-emerald font-semibold">PEAK: -0.5 dB</span>
                </div>
              </div>
            </div>

            {/* Stage Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
                  3. Real-Time Sonification
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Features are mapped to musical parameters: brightness governs pitch, edge density drives rhythm, and coordinates dictate stereo spatialization.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-hairline font-mono text-[9px] text-text-muted">
                OUTPUT: 44.1kHz Web Audio API Synthesized Soundscape
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
