import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Globe, 
  Cpu, 
  Volume2, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Music, 
  Calendar, 
  Scan, 
  Layers, 
  Eye, 
  Keyboard, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About // NASA Sonification Lab — Earth Information Jukebox',
  description:
    'About the Earth Information Jukebox: A NASA Space Apps Challenge project transforming NASA Earth observation data into musical soundscapes using browser-based OpenCV.js and Tone.js.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep-space py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* Header Hero Section */}
        <header className="space-y-4 border-b border-hairline pb-8">
          <div className="inline-flex items-center gap-2 rounded-sm border border-hairline-accent bg-nasa-cyan/10 px-3 py-1">
            <Globe className="h-3.5 w-3.5 text-nasa-cyan" />
            <span className="text-[10px] font-bold tracking-widest text-nasa-cyan uppercase">
              NASA Space Apps Challenge 2026 // Mission Briefing
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
            EARTH INFORMATION JUKEBOX.
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
            An open-source scientific web application that transforms NASA Earth observations into 
            structured, musical soundscapes. Operating entirely within the user&apos;s browser, the application 
            combines computer vision feature extraction (OpenCV.js WebAssembly) with real-time audio synthesis (Tone.js) 
            to provide multi-sensory planetary exploration for scientists, students, and visually impaired explorers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px]">
            <span className="rounded-xs border border-biosphere-emerald/40 bg-biosphere-emerald/10 px-2.5 py-1 text-biosphere-emerald font-bold uppercase">
              Pure Client Architecture
            </span>
            <span className="rounded-xs border border-hairline-accent bg-nasa-cyan/10 px-2.5 py-1 text-nasa-cyan font-bold uppercase">
              Zero Server Compute
            </span>
            <span className="rounded-xs border border-hairline bg-chassis-panel px-2.5 py-1 text-text-secondary uppercase">
              W3C Web Audio API
            </span>
            <span className="rounded-xs border border-hairline bg-chassis-panel px-2.5 py-1 text-text-secondary uppercase">
              OpenCV.js 4.8 WASM
            </span>
          </div>
        </header>

        {/* 10-Minute Presentation Summary for Judges */}
        <section className="rounded-sm border border-nasa-cyan/40 bg-chassis-panel/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-nasa-cyan" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                Hackathon Presentation Quick Walkthrough (10-Minute Guide)
              </h2>
            </div>
            <span className="text-[10px] text-nasa-cyan font-bold uppercase">
              Judge Evaluation Path
            </span>
          </div>

          <p className="text-text-secondary leading-relaxed text-[11px]">
            To experience the complete application in under five minutes, follow this verified user journey:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
            <div className="rounded-xs border border-hairline bg-chassis-base p-3 space-y-1">
              <span className="text-nasa-cyan font-bold block text-[10px]">STEP 01</span>
              <strong className="text-text-primary block font-semibold">Explore Catalog</strong>
              <p className="text-text-muted text-[10px]">
                Browse NASA GISTEMP v4 dataset details, scientific citations, and colormap specifications.
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-base p-3 space-y-1">
              <span className="text-nasa-cyan font-bold block text-[10px]">STEP 02</span>
              <strong className="text-text-primary block font-semibold">Launch Studio</strong>
              <p className="text-text-muted text-[10px]">
                Switch to <strong>Scientific Time-Series Mode</strong> to sonify 147 years of temperature anomalies (1880–2026).
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-base p-3 space-y-1">
              <span className="text-nasa-cyan font-bold block text-[10px]">STEP 03</span>
              <strong className="text-text-primary block font-semibold">Spatial Analysis</strong>
              <p className="text-text-muted text-[10px]">
                Switch to <strong>Spatial Mode</strong>, click &quot;Analyze Image&quot; to run OpenCV.js WASM across a 16×16 grid.
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-base p-3 space-y-1">
              <span className="text-nasa-cyan font-bold block text-[10px]">STEP 04</span>
              <strong className="text-text-primary block font-semibold">Upload Your Image</strong>
              <p className="text-text-muted text-[10px]">
                Switch to &quot;Upload Image&quot;, drag &amp; drop your own Earth image, and hear it sonified in real time.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase tracking-wider text-space-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] text-xs"
            >
              <span>Launch Studio Workstation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Dual Sonification Modality Deep-Dive */}
        <section className="space-y-6">
          <div className="border-b border-hairline pb-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Music className="h-4 w-4 text-nasa-cyan" />
              <span>Dual-Modality Sonification Architecture</span>
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              Two scientifically segregated sonification systems tailored for spatial and temporal Earth observation data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modality A: Spatial Visual Sonification */}
            <div className="rounded-sm border border-telemetry-amber/30 bg-chassis-panel p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="font-bold text-telemetry-amber uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Scan className="h-3.5 w-3.5" />
                  Modality A // 2D Spatial Visual Sonification
                </span>
                <span className="text-[9px] bg-telemetry-amber/10 text-telemetry-amber px-1.5 py-0.5 rounded-xs font-bold uppercase">
                  OpenCV.js WASM
                </span>
              </div>

              <p className="text-text-secondary leading-normal text-[11px]">
                Transforms 2D planetary visualizations into spatial audio textures. The image is downscaled to an off-screen 512px canvas, converted to RGB/HSV/Gray matrices, and partitioned into an N×M grid (default 16×16, 256 sectors).
              </p>

              <div className="space-y-1.5 pt-2 border-t border-hairline text-[10px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Pitch Mapping:</span>
                  <span className="text-text-primary font-semibold">Luminance (Y = 0.299R + 0.587G + 0.114B)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Timbre &amp; Filter:</span>
                  <span className="text-text-primary font-semibold">Pixel Intensity Variance (500Hz - 3500Hz)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Stereo Panning:</span>
                  <span className="text-text-primary font-semibold">Horizontal Meridian Coordinate (-85% to +85%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Texture Noise:</span>
                  <span className="text-text-primary font-semibold">Sobel Gradient Edge Magnitude (&gt; 0.15)</span>
                </div>
              </div>

              <div className="rounded-xs border border-telemetry-amber/20 bg-telemetry-amber/5 p-2 text-[10px] text-telemetry-amber">
                <strong>Scientific Principle:</strong> Represents visual colormap features; does not claim direct physical temperature measurement.
              </div>
            </div>

            {/* Modality B: Scientific Time-Series */}
            <div className="rounded-sm border border-nasa-cyan/30 bg-chassis-panel p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <span className="font-bold text-nasa-cyan uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Modality B // Scientific Time-Series Sonification
                </span>
                <span className="text-[9px] bg-nasa-cyan/10 text-nasa-cyan px-1.5 py-0.5 rounded-xs font-bold uppercase">
                  Empirical CSV
                </span>
              </div>

              <p className="text-text-secondary leading-normal text-[11px]">
                Sonifies 147 years of empirical NASA global mean temperature anomalies (1880–2026). Parsed directly from the official NASA GISS monthly CSV dataset, representing planetary climate deviation relative to the 1951–1980 baseline.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-hairline text-[10px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Baseline Note:</span>
                  <span className="text-text-primary font-semibold">0.00°C Anomaly = 200 Hz Anchor Tone (G3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Frequency Formula:</span>
                  <span className="text-text-primary font-semibold">f(ΔT) = 200 × 2^(ΔT / 1.5)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Harmonic Voice:</span>
                  <span className="text-text-primary font-semibold">AMSynth Pure Fundamental Sine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Temporal Range:</span>
                  <span className="text-text-primary font-semibold">1880 to 2026 (Monthly &amp; Annual Granularity)</span>
                </div>
              </div>

              <div className="rounded-xs border border-biosphere-emerald/20 bg-biosphere-emerald/5 p-2 text-[10px] text-biosphere-emerald">
                <strong>Scientific Principle:</strong> Mathematically grounded in peer-reviewed NASA GISTEMP v4 empirical observations (Lenssen et al. 2024).
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Sources & Attribution */}
        <section className="space-y-4">
          <div className="border-b border-hairline pb-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Database className="h-4 w-4 text-nasa-cyan" />
              <span>Scientific Lineage &amp; Data Attribution</span>
            </h2>
            <p className="text-[11px] text-text-muted mt-0.5">
              All datasets and visualization maps are sourced from official NASA archives and peer-reviewed publications.
            </p>
          </div>

          <div className="rounded-sm border border-hairline bg-chassis-panel p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-text-muted uppercase text-[10px] block">Scientific Dataset</span>
                <strong className="text-text-primary text-xs">NASA GISTEMP v4 Surface Temperature Analysis</strong>
                <p className="text-text-secondary mt-1 leading-normal">
                  Combines NOAA GHCN v4 meteorological land stations with ERSST v5 ocean buoy and ship measurements.
                </p>
              </div>

              <div>
                <span className="text-text-muted uppercase text-[10px] block">Visualization Source</span>
                <strong className="text-text-primary text-xs">NASA Scientific Visualization Studio (SVS #5603)</strong>
                <p className="text-text-secondary mt-1 leading-normal">
                  2025 unsmoothed high-definition global anomaly composite projected via the Robinson map projection.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline space-y-2 text-[10px]">
              <span className="text-text-muted uppercase tracking-wider block font-bold">Academic Citations</span>
              <ul className="space-y-1.5 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-nasa-cyan font-bold">•</span>
                  <span>
                    Lenssen, N., G.A. Schmidt, M. Hendrickson, P. Jacobs, M. Menne, and R. Ruedy (2024). 
                    <em>A GISTEMPv4 observational uncertainty ensemble</em>. J. Geophys. Res. Atmos., 129, e2023JD040179.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-nasa-cyan font-bold">•</span>
                  <span>
                    Crameri, F. (2018). <em>Scientific colour maps: &quot;vik&quot; palette</em>. Zenodo. DOI: 10.5281/zenodo.1243862.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Architecture Guarantees */}
        <section className="space-y-4">
          <div className="border-b border-hairline pb-2">
            <h2 className="text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Terminal className="h-4 w-4 text-nasa-cyan" />
              <span>Client-Side Architecture Guarantees</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
            <div className="rounded-xs border border-hairline bg-chassis-panel p-4 space-y-1">
              <span className="text-biosphere-emerald font-bold uppercase block text-xs">Zero Server Processing</span>
              <p className="text-text-secondary leading-normal">
                No Python backend, no machine-learning APIs, and no remote audio servers. 100% of image processing and synthesis executes locally in browser memory.
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-panel p-4 space-y-1">
              <span className="text-nasa-cyan font-bold uppercase block text-xs">Memory &amp; Heap Safety</span>
              <p className="text-text-secondary leading-normal">
                Every allocated OpenCV C++ matrix (cv.Mat) is explicitly deleted in finally blocks to prevent WebAssembly memory leaks.
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-chassis-panel p-4 space-y-1">
              <span className="text-telemetry-amber font-bold uppercase block text-xs">Private Image Ingestion</span>
              <p className="text-text-secondary leading-normal">
                User-uploaded images are processed strictly in off-screen canvas buffers and object URLs. Zero bytes are transmitted to any server.
              </p>
            </div>
          </div>
        </section>

        {/* Universal Accessibility Statement */}
        <section className="rounded-sm border border-hairline bg-chassis-panel/60 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-biosphere-emerald" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Accessibility-First Design Architecture
            </h2>
          </div>

          <p className="text-text-secondary leading-relaxed text-[11px]">
            Earth Information Jukebox is engineered with universal accessibility as a core architectural priority:
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-text-secondary">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-biosphere-emerald shrink-0" />
              <span><strong>Hardware Keyboard Controls:</strong> Space (play/pause), S (stop), M (mute).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-biosphere-emerald shrink-0" />
              <span><strong>High-Visibility Focus Rings:</strong> 2px solid cyan focus traversal across all controls.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-biosphere-emerald shrink-0" />
              <span><strong>Screen-Reader Telemetry:</strong> Debounced ARIA live regions announcing playback data.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-biosphere-emerald shrink-0" />
              <span><strong>Non-Auditory Data Digests:</strong> Structured tabular logs for deaf or hard-of-hearing users.</span>
            </li>
          </ul>
        </section>

        {/* Footer Navigation CTA */}
        <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-text-muted text-[10px]">
            Earth Information Jukebox // NASA Space Apps Challenge 2026
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="text-text-secondary hover:text-text-primary underline text-xs"
            >
              Explore Data Catalog
            </Link>
            <Link
              href="/studio"
              className="rounded-xs bg-nasa-cyan px-4 py-2 font-bold uppercase text-space-black hover:bg-cyan-300 transition-colors text-xs"
            >
              Open Studio Workstation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
