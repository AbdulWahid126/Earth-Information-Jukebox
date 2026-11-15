# Phased Development Roadmap & Task Tracker
## Earth Information Jukebox

**Author / Lead Architect:** Lead Software Architect  
**Project Owner / Developer:** Solo Developer  
**Status:** Ready for Execution  
**Methodology:** Phased Solo-Sprint Development

---

## Roadmap Overview

This task tracker outlines the step-by-step implementation plan for the solo developer building the **Earth Information Jukebox**. Progress is tracked with interactive markdown checkboxes (`[ ]` / `[x]`).

---

## PHASE 1: Project Foundation

- [ ] **Verify Next.js setup**
  - [ ] Verify Next.js 16 App Router configuration and Turbopack dev server.
  - [ ] Confirm TypeScript compilation (`tsc --noEmit`) passes cleanly.
  - [ ] Confirm basic ESLint rules and scripts run without errors.
- [ ] **Establish project structure**
  - [ ] Create standardized component subdirectories: `common/`, `layout/`, `explorer/`, `workspace/`, `audio/`, `telemetry/`.
  - [ ] Create library folders: `src/lib/cv/`, `src/lib/sonification/`, `src/lib/nasa/`.
  - [ ] Create types directory: `src/types/visualization.ts`, `src/types/cv.ts`, `src/types/audio.ts`.
  - [ ] Set up public asset directories: `public/assets/visualizations/`, `public/assets/opencv/`.
- [ ] **Configure global styling**
  - [ ] Configure Tailwind CSS color tokens for deep space blacks, chassis grays, and telemetry accents (`cyan-400`, `amber-400`, `emerald-400`).
  - [ ] Define mission-control monospace typography rules for tabular data and telemetry readouts.
  - [ ] Configure global custom scrollbar and reset rules in `globals.css`.
- [ ] **Configure Git**
  - [ ] Audit `.gitignore` to ensure `.next/`, `node_modules/`, and large binaries are excluded.
  - [ ] Confirm clean git status on the `main` branch.
  - [ ] Establish initial milestone tag or baseline commit.

---

## PHASE 2: UI/UX Foundation

- [x] **Application layout**
  - [x] Implement responsive root layout with tactical mission header and status bar.
  - [ ] Add breadcrumbs, system latency indicators, and master mute toggle to the header.
  - [x] Implement footer with attribution to NASA Earth Observatory and project metadata.
- [x] **Navigation**
  - [x] Build global navigation component connecting Home, Earth Explorer, and Workspace.
  - [x] Add active route indicator with high-contrast mission-control styling.
- [x] **Homepage**
  - [x] Design high-impact hero section introducing Earth Information Jukebox.
  - [x] Display mission statement: transforming satellite imagery into musical soundscapes.
  - [x] Add interactive "Launch Observatory" CTA linking to the Earth Explorer.
- [ ] **Earth Explorer**
  - [ ] Build responsive catalog grid (`CatalogGrid`) displaying dataset cards.
  - [ ] Implement category filter pills (Atmosphere, Biosphere, Cryosphere, Hydrosphere).
  - [ ] Implement dataset cards showing preview thumbnails, sensor badges, and temporal ranges.
- [ ] **Visualization workspace**
  - [ ] Implement three-bay workspace layout (Catalog Drawer, Central Viewport, Audio Control Rack).
  - [ ] Build high-resolution image canvas container with responsive aspect ratio scaling.
  - [ ] Implement HUD coordinate overlays displaying row/column grid lines.
- [ ] **Audio player UI**
  - [ ] Build hardware-styled master transport bar (Play/Pause, Stop, Scrub, Tempo slider).
  - [ ] Implement synthesizer channel strips with faders for Lead, Drone, and Noise voices.
  - [ ] Build musical scale selector dropdown / segmented switch.
  - [ ] Create real-time audio oscilloscope / FFT waveform canvas component.

---

## PHASE 3: NASA Integration

- [x] **Research available NASA visualizations**
  - [x] Research verified imagery from NASA Earth Observatory, NASA Worldview, and NASA SVS.
  - [x] Document colormap calibration standards for NASA GISTEMP v4 (*vik* colormap, Crameri 2018).
- [x] **Select initial visualization**
  - [x] Select initial active dataset: NASA GISTEMP v4 — Global Temperature Anomalies (SVS 5603 / GISS).
  - [x] Define companion roadmap datasets (Sea Level & Polar Ice Dynamics, Perpetual Ocean Currents).
- [x] **Establish source attribution**
  - [x] Draft accurate scientific descriptions and mission citations for GISTEMP v4 (Lenssen et al. 2024, Hansen et al. 2010).
  - [x] Link directly to NASA source repositories and SVS 5603 documentation pages.
- [x] **Load visualization assets**
  - [x] Download and package high-resolution 1080p PNG into `public/assets/visualizations/temperature/gistemp-2025-map-nosmoothing.png`.
  - [x] Download and package global monthly time-series CSV into `public/assets/datasets/temperature/gistemp-global-monthly.csv`.
  - [x] Document asset specifications in `docs/NASA_DATA_SOURCES.md`.
- [x] **Define scientific data and legend metadata**
  - [x] Create static TypeScript metadata registry (`src/lib/nasa/datasets.ts` and `src/types/dataset.ts`).
  - [x] Define physical metric ranges, measurement units (°C anomaly), baseline (1951–1980), and projection (Robinson).
  - [x] Strictly document and enforce distinction between 2D spatial raster maps and 1D global mean time series.

---

## PHASE 4: Computer Vision

- [x] **Integrate OpenCV.js**
  - [x] Set up lazy-loading mechanism (`useOpenCV.ts`, `opencvLoader.ts`) via dynamic script injection.
  - [x] Handle WASM loading progress, ready states, AMD loader resolution, and thenable infinite-loop mitigation.
  - [x] Ensure OpenCV.js binary (4.8.0 WASM) is loaded only on user interaction within the Explore/Studio workspaces.
- [x] **Load image into processing pipeline**
  - [x] Render selected visualization onto an off-screen HTML5 Canvas buffer (`imageLoader.ts`).
  - [x] Downscale buffer proportionally to a standardized max processing width ($512\text{px}$, producing $512 \times 288\text{px}$) to maintain sub-100ms processing.
  - [x] Convert image data into an OpenCV `cv.Mat` RGBA buffer with strict `.delete()` deterministic deallocation in `finally` blocks.
- [x] **Extract image regions**
  - [x] Implement spatial grid subdivision algorithm dividing the image into configurable $N \times M$ sectors ($8 \times 8$, $16 \times 16$, $32 \times 32$).
  - [x] Extract sub-region bounding boxes (`cv.Rect`) for localized feature extraction with zero-leak ROI matrices.
- [x] **Calculate regional brightness and color statistics**
  - [x] Compute mean luminance for each sector ($Y = 0.299R + 0.587G + 0.114B$).
  - [x] Convert sub-regions to HSV and calculate mean hue ($0^\circ–360^\circ$), saturation ($0.0–1.0$), and value ($0.0–1.0$).
  - [x] Apply Sobel spatial edge detection ($3\times3$ kernel, $X$ and $Y$ gradients blended) to quantify regional edge density.
  - [x] Compute color intensity standard deviation / texture variance (`cv.meanStdDev` with `CV_64FC1` accessor).
  - [x] Detect and flag non-data canvas margins outside the Robinson projection oval (`isLikelyBackground`).
- [x] **Implement smoothing and normalization**
  - [x] Normalize extracted metrics (luminance, HSV, edge density) into uniform numerical ranges ($[0.0, 1.0]$).
  - [x] Calculate global aggregation statistics (mean global luminance, mean edge density, active planetary data sectors).
  - [x] Note: Cross-cell 2D Gaussian smoothing and temporal EMA transitions scheduled for Phase 5 continuous playback loop.
- [x] **Produce structured analysis output**
  - [x] Assemble metrics into the strongly-typed `GridAnalysisResult` and `RegionalVisualFeatures` data structures (`types/cv.ts`).
  - [x] Deliver interactive HUD overlay visualizer (`GridOverlayVisualizer.tsx`) with 4 inspection modes (Wireframe, Color, Luminance, Edge).
  - [x] Provide interactive Sector Inspector displaying coordinates, RGB swatch, HSV, luminance, variance, and edge density.

---

## PHASE 5: Sonification

- [x] **Integrate Tone.js**
  - [x] Initialize Tone.js audio engine within a dedicated custom hook (`useSonificationEngine.ts`) and modular engine class (`ToneSonificationEngine`).
  - [x] Implement explicit user gesture trigger (`Tone.start()`) to comply with browser autoplay policies.
  - [x] Create master audio signal chain with `Tone.Filter`, `Tone.Panner`, `Tone.Reverb`, `Tone.Volume`, and `Tone.Limiter`.
- [x] **Define musical parameter mapping**
  - [x] Create mathematical scaling functions mapping $[0.0, 1.0]$ features to musical parameters (`parameterMapper.ts`).
  - [x] Establish scale note definitions (Major Pentatonic, Minor Pentatonic, Dorian, Lydian, Aeolian/Natural Minor) in `src/lib/sonification/scales.ts`.
- [x] **Implement pitch mapping**
  - [x] Map regional luminance to pitch frequencies strictly quantized to the active harmonic scale.
  - [x] Assign base harmonic drone root frequencies (`Tone.AMSynth`) to dataset-wide planetary baseline.
- [x] **Implement rhythm & traversal mapping**
  - [x] Map horizontal longitude sweeps (`column_sweep`), latitude scans (`raster`), and zigzag polar sweeps (`boustrophedon`).
  - [x] Implement 16th-note transport step sequencer with speed multipliers ($0.5\times, 1.0\times, 1.5\times, 2.0\times$).
- [x] **Implement volume mapping**
  - [x] Map feature intensity (HSV value & contrast) to voice velocity ($0.35$ to $0.85$ range).
  - [x] Automatically silence and rest on non-data white background canvas margins (`isLikelyBackground: true`).
- [x] **Implement timbre selection**
  - [x] Configure `Tone.PolySynth` (melodic lead), `Tone.AMSynth` (planetary drone), and `Tone.NoiseSynth` (atmospheric friction).
  - [x] Map color variance and saturation to low-pass filter cutoff frequencies ($500\text{ Hz}$ to $3500\text{ Hz}$).
  - [x] Route Sobel edge density into a bandpass-filtered noise voice for atmospheric turbulence.
- [x] **Generate sound from processed data**
  - [x] Verify real-time generation of harmonic chords, planetary drone, and melodic leads from NASA GISTEMP 2025 analysis.
  - [x] Implement full playback transport bar (`SonificationControlBar.tsx`) with Play, Pause, Resume, Stop, Mute, Volume, and Voice toggles.
  - [x] Implement visual reticle synchronization via `Tone.Draw` on `GridOverlayVisualizer.tsx`.
  - [x] Implement accessible live telemetry announcements (`aria-live="polite"`), `SonificationMappingExplainer.tsx`, and `NonAudioFeatureSummary.tsx`.

---

## PHASE 6: NASA GISTEMP Time-Series Sonification

- [x] **CSV Data Processing Engine**
  - [x] Create dedicated client-side parser (`gistempCsvParser.ts`) safely handling descriptive lines and headers.
  - [x] Parse Year, Jan–Dec (12 months), annual mean (`J-D`), meteorological mean (`D-N`), and seasonal averages.
  - [x] Treat `***` strictly as missing data (`null`), never as zero. Exclude incomplete observations from playback.
  - [x] Validate numeric values and coverage across 147 years (1880–2026).
- [x] **Interactive Time-Series Visualization**
  - [x] Create lightweight SVG time-series chart (`TimeSeriesChart.tsx`) with zero-baseline reference ($0.00^\circ\text{C}$).
  - [x] Color-code anomaly bars: cool blue/cyan ($< 0^\circ\text{C}$), warm amber/crimson ($> 0^\circ\text{C}$).
  - [x] Implement live cursor hover probe displaying Year, anomaly in ${^\circ}\text{C}$, and mapped musical pitch.
  - [x] Synchronize interactive playhead line and pulsing reticle with live audio playback.
  - [x] Support click-to-seek timeline navigation.
- [x] **Scientific Sonification Mapping**
  - [x] Create separate time-series parameter mapper (`timeSeriesMapper.ts`) mapping Celsius anomalies to musical pitch.
  - [x] Anchor zero baseline ($0.0^\circ\text{C}$) to middle C (C4, $261.6\text{ Hz}$).
  - [x] Negative anomalies ($-0.81^\circ\text{C}$ to $0^\circ\text{C}$) descend into deep bass registers (C2–A3) with warm, muted filtering.
  - [x] Positive anomalies ($0^\circ\text{C}$ to $+1.48^\circ\text{C}$) ascend into higher octaves (C4–C6) with dynamic low-pass filter opening ($500\text{ Hz}$ to $3600\text{ Hz}$).
- [x] **Web Audio Playback Engine**
  - [x] Implement dedicated `TimeSeriesAudioEngine` with `Tone.PolySynth` lead and `Tone.AMSynth` baseline drone.
  - [x] Implement Play, Pause, Resume, Stop, Speed multipliers ($0.5\times, 1.0\times, 1.5\times, 2.0\times$), and Volume control.
  - [x] Support dual timeline granularities: Annual Means (146 records) vs Monthly Detailed (1,754 records).
  - [x] Require explicit user gesture (`Tone.start()`) prior to playback; cleanly cancel schedules on stop.
- [x] **Dual Modality Segregation**
  - [x] Keep Spatial Visual Sonification (2D Map) and Scientific Time-Series Sonification (1D CSV) strictly separated.
  - [x] Provide high-level modality switcher in Studio Workstation and Explorer Detail View.
- [x] **Explainability & Accessibility**
  - [x] Create `TimeSeriesExplainer.tsx` explaining temperature anomalies, 1951–1980 baseline, and pitch mapping.
  - [x] Create `TimeSeriesDataSummary.tsx` providing empirical digest (record warmth, record cold, decadal warming shift) for deaf and hard-of-hearing users.
  - [x] Include full keyboard accessibility (`Space`, `S`, `M`), ARIA labels, and `aria-live="polite"` live announcements.

---

## PHASE 7: Accessibility

- [ ] **Keyboard navigation**
  - [ ] Ensure full tab-order coverage across all interactive buttons, faders, and dataset cards.
  - [ ] Add prominent, high-contrast focus rings (`ring-2 ring-cyan-400`).
  - [ ] Map keyboard shortcuts: Space (Play/Pause), `M` (Mute), `ArrowLeft`/`ArrowRight` (Seek), `1`-`4` (Mode select).
- [ ] **Screen-reader descriptions**
  - [ ] Add `aria-label` and `aria-expanded` attributes to all controls and drawers.
  - [ ] Set up debounced `aria-live="polite"` region announcing currently scanned sector coordinates and values.
- [ ] **Audio descriptions**
  - [ ] Provide synthesized or recorded spoken audio overview describing each NASA visualization's scientific context.
  - [ ] Add an accessible "Audio Description" toggle in the workspace.
- [ ] **Accessible controls**
  - [ ] Implement native accessible sliders with standard `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
  - [ ] Provide high-contrast color scheme adhering to WCAG 2.1 AA standards.
  - [ ] Implement `prefers-reduced-motion` detection to disable rapid scanning animations.
- [ ] **Text-based data summaries**
  - [ ] Build a tabular "Data Inspector" displaying regional statistics in accessible plain text.
  - [ ] Provide an exportable plain-text or CSV summary of the extracted grid values.

---

## PHASE 8: Testing and Optimization

- [ ] **Test image processing**
  - [ ] Benchmark OpenCV.js grid segmentation across various image dimensions to verify execution is $<20\text{ms}$.
  - [ ] Verify that all `cv.Mat` references are properly freed without memory growth across 50 consecutive image switches.
- [ ] **Test audio generation**
  - [ ] Verify that Web Audio output starts reliably only after user interaction.
  - [ ] Confirm no audio clicks, pops, or clipping under rapid tempo or scale changes.
- [ ] **Test synchronization**
  - [ ] Verify zero drift between the visual scanning reticle and the Tone.js audio note triggers over a 5-minute continuous run.
- [ ] **Test browser compatibility**
  - [ ] Test on Chromium (Chrome/Edge/Brave), Mozilla Firefox, and Apple Safari.
  - [ ] Verify mobile/tablet layout behavior on iOS Safari and Chrome Android.
- [ ] **Optimize performance**
  - [ ] Audit bundle sizes with Next.js build analyzer to ensure zero OpenCV overhead on the landing page.
  - [ ] Optimize image assets (convert to modern compressed WebP).
- [ ] **Fix bugs**
  - [ ] Resolve any edge cases uncovered during testing.

---

## PHASE 9: Deployment and Presentation

- [ ] **Production build**
  - [ ] Run `npm run build` in `frontend/` and verify zero TypeScript or linting errors.
  - [ ] Confirm static generation and client-side chunk splitting perform as expected.
- [ ] **Vercel deployment**
  - [ ] Link Git repository to Vercel.
  - [ ] Configure root directory to `frontend/`.
  - [ ] Deploy to production edge CDN and verify live URL.
- [ ] **README**
  - [ ] Write comprehensive project `README.md` detailing mission, architecture, setup instructions, and NASA source credits.
- [ ] **Demo preparation**
  - [ ] Prepare a 2-minute demonstration walkthrough highlighting visual analysis, sonification modes, and accessibility.
  - [ ] Record backup video/audio clip in case of live hackathon presentation network issues.
- [ ] **Final project presentation**
  - [ ] Submit final project URL, GitHub repository, and presentation slides to the NASA Space Apps Challenge portal.
