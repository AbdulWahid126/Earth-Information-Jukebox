'use client';

import { motion } from 'framer-motion';
import { Database, Cpu, Sliders, Volume2, ArrowRight, ShieldCheck, Zap, Terminal } from 'lucide-react';

interface ArchitectureNodeProps {
  readonly step: string;
  readonly title: string;
  readonly techBadge: string;
  readonly icon: React.ReactNode;
  readonly inputLabel: string;
  readonly processLabel: string;
  readonly outputLabel: string;
  readonly index: number;
}

function ArchitectureNode({
  step,
  title,
  techBadge,
  icon,
  inputLabel,
  processLabel,
  outputLabel,
  index,
}: ArchitectureNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative flex flex-col rounded-sm border border-hairline bg-chassis-panel/80 p-5 backdrop-blur-sm"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
        <span className="font-mono text-[9px] font-bold text-nasa-cyan tracking-widest uppercase">
          {step}
        </span>
        <span className="rounded-xs border border-hairline-accent bg-nasa-cyan/5 px-2 py-0.5 font-mono text-[8px] font-semibold text-nasa-cyan uppercase">
          {techBadge}
        </span>
      </div>

      {/* Node Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-hairline-bright bg-chassis-surface">
          {icon}
        </div>
        <h3 className="text-base font-bold text-text-primary tracking-tight">
          {title}
        </h3>
      </div>

      {/* Process Specification List */}
      <div className="space-y-2 mt-2 flex-1 font-mono text-[10px]">
        <div className="rounded-xs border border-hairline/60 bg-chassis-base/60 p-2">
          <span className="text-text-muted block text-[8px] uppercase tracking-wider mb-0.5">Input</span>
          <span className="text-text-secondary">{inputLabel}</span>
        </div>

        <div className="rounded-xs border border-hairline/60 bg-chassis-base/60 p-2">
          <span className="text-text-muted block text-[8px] uppercase tracking-wider mb-0.5">Operation</span>
          <span className="text-text-secondary">{processLabel}</span>
        </div>

        <div className="rounded-xs border border-hairline/60 bg-chassis-base/60 p-2">
          <span className="text-text-muted block text-[8px] uppercase tracking-wider mb-0.5">Output</span>
          <span className="text-nasa-cyan font-semibold">{outputLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative border-t border-hairline px-4 py-24 sm:px-6 lg:px-8 bg-space-black">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/5 px-2.5 py-1 mb-4">
            <Terminal className="h-3 w-3 text-nasa-cyan" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
              System Pipeline Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            HOW IT WORKS.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            A deterministic, four-stage client-side pipeline. No remote server processing, 
            no machine learning overhead, and no backend dependencies.
          </p>
        </div>

        {/* 4-Stage Architectural Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ArchitectureNode
            step="PIPELINE STAGE 01"
            title="NASA Earth Data"
            techBadge="Static Ingestion"
            icon={<Database className="h-4 w-4 text-nasa-cyan" />}
            inputLabel="MODIS / VIIRS satellite imagery & documented legend metadata"
            processLabel="Buffer download, canvas off-screen rendering, max 512px downsampling"
            outputLabel="Normalized RGBA pixel matrix"
            index={0}
          />

          <ArchitectureNode
            step="PIPELINE STAGE 02"
            title="OpenCV.js Engine"
            techBadge="WebAssembly"
            icon={<Cpu className="h-4 w-4 text-telemetry-amber" />}
            inputLabel="Normalized image buffer in WebAssembly heap"
            processLabel="N×M grid segmentation, Sobel edge filtering, HSV & luminance extraction"
            outputLabel="Structured SectorMetrics[][]"
            index={1}
          />

          <ArchitectureNode
            step="PIPELINE STAGE 03"
            title="Sonification Matrix"
            techBadge="Pure TypeScript"
            icon={<Sliders className="h-4 w-4 text-biosphere-emerald" />}
            inputLabel="Normalized [0.0, 1.0] visual feature vectors & NASA legend LUT"
            processLabel="Musical scale quantization, filter cutoff scaling, stereo panning"
            outputLabel="SonificationFrameParameters"
            index={2}
          />

          <ArchitectureNode
            step="PIPELINE STAGE 04"
            title="Tone.js Audio Array"
            techBadge="Web Audio API"
            icon={<Volume2 className="h-4 w-4 text-text-primary" />}
            inputLabel="Trigger events synchronized with Tone.Transport clock"
            processLabel="Polyphonic AMSynth drone, Lead synth, Noise textures + Master Limiter"
            outputLabel="Spatial 44.1kHz stereo audio"
            index={3}
          />
        </div>

        {/* Architecture Guarantees Strip */}
        <div className="mt-12 rounded-sm border border-hairline bg-chassis-panel/60 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-biosphere-emerald shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-text-primary uppercase block">
                  Zero Server Dependencies
                </span>
                <p className="text-[11px] text-text-muted mt-1 leading-normal">
                  All computer vision and audio synthesis executes 100% locally in browser memory.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-nasa-cyan shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-text-primary uppercase block">
                  Sub-50ms Latency
                </span>
                <p className="text-[11px] text-text-muted mt-1 leading-normal">
                  Tone.Transport scheduling ensures jitter-free musical timing independent of UI frame rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-telemetry-amber shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-text-primary uppercase block">
                  Rigorous Memory Safety
                </span>
                <p className="text-[11px] text-text-muted mt-1 leading-normal">
                  OpenCV.js C++ Mat objects are explicitly disposed with .delete() to prevent WASM heap exhaustion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
