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

- [ ] **Application layout**
  - [ ] Implement responsive root layout with tactical mission header and status bar.
  - [ ] Add breadcrumbs, system latency indicators, and master mute toggle to the header.
  - [ ] Implement footer with attribution to NASA Earth Observatory and project metadata.
- [ ] **Navigation**
  - [ ] Build global navigation component connecting Home, Earth Explorer, and Workspace.
  - [ ] Add active route indicator with high-contrast mission-control styling.
- [ ] **Homepage**
  - [ ] Design high-impact hero section introducing Earth Information Jukebox.
  - [ ] Display mission statement: transforming satellite imagery into musical soundscapes.
  - [ ] Add interactive "Launch Observatory" CTA linking to the Earth Explorer.
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

- [ ] **Research available NASA visualizations**
  - [ ] Research verified imagery from NASA Earth Observatory, NASA Worldview, and Visible Earth.
  - [ ] Document colormap calibration standards for Sea Surface Temperature (SST), NDVI, and Sea Ice.
- [ ] **Select initial visualization**
  - [ ] Select initial set of 4 curated datasets:
    1. Global Sea Surface Temperature (MODIS Aqua/Terra)
    2. Global Biosphere Normalized Difference Vegetation Index / NDVI (MODIS)
    3. Arctic Sea Ice Minimum Extent (AMSR2 / Nimbus-7)
    4. Global Thermal Anomalies & Wildfires (FIRMS VIIRS)
- [ ] **Establish source attribution**
  - [ ] Draft accurate scientific descriptions and mission citations for each selected dataset.
  - [ ] Link directly to NASA source repositories and documentation pages.
- [ ] **Load visualization assets**
  - [ ] Optimize and package high-resolution WebP/PNG images into `public/assets/visualizations/`.
  - [ ] Generate responsive thumbnails for the Explorer catalog.
- [ ] **Define scientific data and legend metadata**
  - [ ] Create static TypeScript metadata registry (`src/lib/nasa/datasets.ts`).
  - [ ] Define physical metric ranges, measurement units (°C, NDVI ratio $[-0.1, 0.9]$, Ice Concentration %), and calibration lookup flags.
  - [ ] Clearly flag whether values represent direct physical readings or visual approximations.

---

## PHASE 4: Computer Vision

- [ ] **Integrate OpenCV.js**
  - [ ] Set up lazy-loading mechanism (`useOpenCV.ts`) via dynamic script injection.
  - [ ] Handle WASM loading progress, ready states, and network failure fallbacks.
  - [ ] Ensure OpenCV.js binary is loaded only when entering the workspace.
- [ ] **Load image into processing pipeline**
  - [ ] Render selected visualization onto an off-screen HTML5 Canvas.
  - [ ] Downscale buffer to a standardized max dimension (e.g., $512\text{px}$) for performant matrix processing.
  - [ ] Convert image data into an OpenCV `cv.Mat` RGBA buffer with strict `.delete()` memory safety.
- [ ] **Extract image regions**
  - [ ] Implement spatial grid subdivision algorithm dividing the image into an $N \times M$ matrix (e.g., $16 \times 16$).
  - [ ] Extract sub-region bounding boxes (`cv.Rect`) for localized feature extraction.
- [ ] **Calculate regional brightness and color statistics**
  - [ ] Compute mean luminance for each sector ($Y = 0.299R + 0.587G + 0.114B$).
  - [ ] Convert sub-regions to HSV and calculate dominant hue, saturation, and value.
  - [ ] Apply Sobel or Canny edge detection filter to quantify spatial gradient / edge density.
  - [ ] Compute intensity standard deviation (texture roughness) per region.
- [ ] **Implement smoothing and normalization**
  - [ ] Normalize all extracted metrics into uniform $[0.0, 1.0]$ numerical ranges.
  - [ ] Implement spatial 2D Gaussian or neighborhood box smoothing across adjacent cells.
  - [ ] Implement temporal exponential moving average (EMA) to prevent audio stepping artifacts.
- [ ] **Produce structured analysis output**
  - [ ] Assemble metrics into the strongly-typed `GridAnalysisResult` data structure.
  - [ ] Cache analysis results in memory to avoid redundant CV processing on identical images.

---

## PHASE 5: Sonification

- [ ] **Integrate Tone.js**
  - [ ] Initialize Tone.js audio engine within a dedicated custom hook (`useSonificationEngine.ts`).
  - [ ] Implement explicit user gesture trigger (`Tone.start()`) to comply with browser autoplay policies.
  - [ ] Create master audio signal chain with `Tone.Filter`, `Tone.Panner`, `Tone.Reverb`, and `Tone.Limiter`.
- [ ] **Define musical parameter mapping**
  - [ ] Create mathematical scaling functions mapping $[0.0, 1.0]$ features to musical parameters.
  - [ ] Establish scale note definitions (Pentatonic, Dorian, Lydian, Aeolian) in `src/lib/sonification/scales.ts`.
- [ ] **Implement pitch mapping**
  - [ ] Map regional luminance / physical metric to pitch frequencies quantized to the active scale.
  - [ ] Assign base harmonic drone root frequencies to dataset-wide baseline metrics.
- [ ] **Implement rhythm mapping**
  - [ ] Map edge density and textural variance to note trigger density and arpeggiator clock subdivisions.
  - [ ] Smooth rhythmic triggers so chaotic regions generate lively textures without auditory clutter.
- [ ] **Implement volume mapping**
  - [ ] Map feature prominence to voice velocity and volume envelopes.
  - [ ] Configure gain stages to prevent distortion while keeping subtle nuances audible.
- [ ] **Implement timbre selection**
  - [ ] Configure `Tone.FMSynth` / `Tone.AMSynth` for organic, evolving timbres.
  - [ ] Map color saturation to low-pass filter cutoff frequencies (opening cutoff on saturated zones).
  - [ ] Route edge density into a bandpass-filtered `Tone.NoiseSynth` for atmospheric friction.
- [ ] **Generate sound from processed data**
  - [ ] Verify real-time generation of harmonic chords, basslines, and melodic leads from the input data.

---

## PHASE 6: Integration

- [ ] **Synchronize visualization and audio**
  - [ ] Bind `Tone.Transport` clock to the UI playhead position via `useScanTransport.ts`.
  - [ ] Render scanning reticle and highlight box over the exact sector currently triggering audio.
- [ ] **Implement playback controls**
  - [ ] Wire up Master Play, Pause, and Reset controls.
  - [ ] Implement manual scrub bar allowing users to jump directly to any column or sector.
  - [ ] Implement keyboard shortcuts (Spacebar for Play/Pause, Arrow keys for step-scrub).
- [ ] **Implement scanning modes**
  - [ ] Implement Horizontal Sweep (left-to-right longitude scan).
  - [ ] Implement Vertical Sweep (pole-to-equator-to-pole scan).
  - [ ] Implement Interactive Probe Mode (hover/click on individual grid sectors).
  - [ ] Implement Global Ambient Mode (concurrent polyphonic summary of whole image).
- [ ] **Implement adjustable sound settings**
  - [ ] Connect UI faders to individual voice gains (Master, Lead, Drone, Atmosphere).
  - [ ] Implement tempo / scan-speed control ($60\text{ BPM}$ to $180\text{ BPM}$).
  - [ ] Implement scale selector enabling real-time musical mode switching.

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
