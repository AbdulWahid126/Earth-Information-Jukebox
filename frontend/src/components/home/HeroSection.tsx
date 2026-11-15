'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Compass, Sparkles, Activity } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8 bg-deep-space">
      {/* Background Ambience Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/5 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: Editorial Typography & Mission Callouts (5 cols / 6 on lg)
              ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left">
            
            {/* NASA Space Apps Challenge Identifier */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-chassis-panel/80 px-3 py-1 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nasa-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-nasa-cyan" />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
                  NASA Space Apps Challenge // Project
                </span>
              </div>
              <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider text-text-muted uppercase">
                Global Sonification Lab
              </span>
            </motion.div>

            {/* Large Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.05]"
            >
              HEAR THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nasa-cyan via-cyan-300 to-emerald-400">
                LIVING PLANET.
              </span>
            </motion.h1>

            {/* Strong Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl"
            >
              NASA-powered visual and scientific data sonification. Transforming verified 
              NASA Earth observation datasets into immersive musical soundscapes through browser-based 
              computer vision (OpenCV.js WASM) and calibrated scientific time-series mapping (Tone.js).
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
            >
              <Link
                href="/explore"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-sm bg-nasa-cyan px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-space-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.4)]"
              >
                <span>Explore Earth</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/studio"
                className="group inline-flex items-center justify-center gap-2.5 rounded-sm border border-hairline-bright bg-chassis-panel px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-primary transition-all hover:border-nasa-cyan/40 hover:bg-chassis-surface"
              >
                <Headphones className="h-4 w-4 text-nasa-cyan transition-transform group-hover:scale-110" />
                <span>Enter Studio</span>
              </Link>
            </motion.div>

            {/* Project Status Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="mt-10 pt-6 border-t border-hairline grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg"
            >
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-text-muted">
                  Architecture
                </span>
                <span className="font-mono text-xs font-semibold text-text-secondary">
                  100% In-Browser WASM
                </span>
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-text-muted">
                  Synthesis Engine
                </span>
                <span className="font-mono text-xs font-semibold text-nasa-cyan">
                  Tone.js / Web Audio
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-text-muted">
                  NASA Dataset Status
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-biosphere-emerald">
                  <span className="h-1.5 w-1.5 rounded-full bg-biosphere-emerald animate-pulse" />
                  Verified (1880–2026)
                </span>
              </div>
            </motion.div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: Dominant Realistic Earth Visual with Scientific HUD
              ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="relative w-full max-w-[520px] aspect-square flex items-center justify-center"
            >
              {/* Outer Orbital Bezel & Planetary Ring Guides */}
              <div className="absolute inset-0 rounded-full border border-hairline/60 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-dashed border-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-hairline/40 pointer-events-none" />
              
              {/* Atmospheric Backglow */}
              <div 
                className="absolute inset-10 rounded-full bg-gradient-to-tr from-cyan-600/25 via-blue-700/15 to-transparent blur-[40px] pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Main Earth Orb Viewport */}
              <div className="relative w-[78%] h-[78%] rounded-full overflow-hidden shadow-[0_0_60px_rgba(0,180,255,0.25)] border border-cyan-400/40 bg-chassis-base">
                <Image
                  src="/assets/visualizations/earth-hero.jpg"
                  alt="Realistic Earth from space captured by NASA Suomi NPP VIIRS satellite showing atmospheric clouds, oceans and continents"
                  fill
                  priority
                  className="object-cover object-center scale-[1.08] transition-transform duration-1000 hover:scale-[1.14]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                />

                {/* Subtle Computer Vision Scanning Swath Overlay */}
                <motion.div
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none border-r border-cyan-400/50"
                  animate={{ x: ['-100%', '600%'] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'transform' }}
                />

                {/* Tactical Reticle Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-16 h-px bg-cyan-300" />
                  <div className="h-16 w-px bg-cyan-300 absolute" />
                  <div className="w-8 h-8 rounded-full border border-cyan-300 absolute" />
                </div>

                {/* Subtle HUD Scanline Overlay */}
                <div className="absolute inset-0 hud-scanline pointer-events-none opacity-20" />
              </div>

              {/* Rotating Orbital Trajectory Marker */}
              <motion.div
                className="absolute inset-2 rounded-full border border-transparent border-t-cyan-400/60 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{ willChange: 'transform' }}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-nasa-cyan shadow-[0_0_12px_#00E5FF] animate-pulse" />
                  <span className="font-mono text-[9px] text-nasa-cyan tracking-wider uppercase bg-space-black/90 px-1.5 py-0.5 border border-cyan-500/30">
                    ORBIT: LEO-824
                  </span>
                </div>
              </motion.div>

              {/* HUD Telemetry Badges (Corner Overlays) */}
              {/* Top-Left: Sensor Telemetry */}
              <div className="absolute top-2 left-2 z-20 hidden sm:flex flex-col gap-0.5 rounded-sm border border-hairline-bright bg-chassis-panel/90 px-2.5 py-1.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <Compass className="h-3 w-3 text-nasa-cyan" />
                  <span className="font-mono text-[9px] font-bold text-nasa-cyan tracking-wider uppercase">
                    VIIRS / SUOMI NPP
                  </span>
                </div>
                <span className="font-mono text-[8px] text-text-muted uppercase">
                  True-Color Calibrated VIS
                </span>
              </div>

              {/* Top-Right: Soundscape Harmonic Monitor */}
              <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 rounded-sm border border-hairline-bright bg-chassis-panel/90 px-2.5 py-1.5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] font-bold text-text-primary tracking-wider uppercase flex items-center gap-1">
                    <Activity className="h-2.5 w-2.5 text-biosphere-emerald" />
                    HARMONIC VOICES
                  </span>
                  <span className="font-mono text-[8px] text-biosphere-emerald">4-CH</span>
                </div>
                {/* 4 Voice Spectrum Bars */}
                <div className="flex items-end gap-1.5 h-4 pt-1">
                  <span className="w-1.5 h-3 bg-cyan-400 rounded-xs animate-pulse" />
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-xs animate-pulse delay-75" />
                  <span className="w-1.5 h-2 bg-amber-400 rounded-xs animate-pulse delay-150" />
                  <span className="w-1.5 h-3.5 bg-blue-400 rounded-xs animate-pulse delay-200" />
                </div>
              </div>

              {/* Bottom-Left: Coordinates & Swath */}
              <div className="absolute bottom-2 left-2 z-20 hidden sm:flex flex-col gap-0.5 rounded-sm border border-hairline-bright bg-chassis-panel/90 px-2.5 py-1.5 backdrop-blur-md">
                <span className="font-mono text-[9px] text-text-primary tracking-wider">
                  LAT: 00°00&apos;N // LON: 160°00&apos;W
                </span>
                <span className="font-mono text-[8px] text-text-muted uppercase">
                  Swath Width: 3040 KM // Global
                </span>
              </div>

              {/* Bottom-Right: Attribution Credit */}
              <div className="absolute bottom-2 right-2 z-20 rounded-sm border border-hairline bg-space-black/90 px-2 py-1 backdrop-blur-md">
                <span className="font-mono text-[8px] text-text-muted tracking-widest uppercase">
                  NASA Earth Observatory
                </span>
              </div>

              {/* Corner Framing Brackets */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-nasa-cyan/70" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-nasa-cyan/70" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-nasa-cyan/70" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-nasa-cyan/70" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
