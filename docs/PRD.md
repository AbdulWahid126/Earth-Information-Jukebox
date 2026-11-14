# Product Requirements Document (PRD)
## Earth Information Jukebox

**Project Name:** Earth Information Jukebox  
**Hackathon / Program:** NASA Space Apps Challenge  
**Author / Lead Architect:** Lead Software Architect  
**Project Owner / Developer:** Solo Developer  
**Status:** Approved Architecture Draft  
**Target Deployment:** Vercel (Client-Side Jamstack / Next.js)

---

## 1. Project Overview

The **Earth Information Jukebox** is an interactive web-based data sonification and exploration laboratory. It bridges Earth science and acoustic arts by transforming NASA Earth observation visualizations (e.g., satellite imagery, climate indicator maps, surface temperature grids, vegetation indices) into meaningful musical soundscapes in real time.

Built to run entirely within modern web browsers without relying on external server-side computation or machine learning microservices, the application fuses client-side computer vision (via WebAssembly-compiled OpenCV.js) with synthesis engines (via Tone.js and the native Web Audio API). Users can select curated NASA Earth visualizations, inspect localized visual features, calibrate sonification parameters, and listen to harmonically rich, multi-layered auditory representations that reflect genuine planetary metrics.

---

## 2. Problem Statement

NASA's Earth Science Division collects petabytes of telemetry and produces complex visual maps documenting environmental change, atmospheric dynamics, ocean circulation, and biosystem vitality. However:
1. **Visual Exclusivity:** Scientific findings are overwhelmingly disseminated as static 2D colorized maps or charts, limiting accessibility for visually impaired individuals and non-visual learners.
2. **Sensory Saturation:** Complex multi-band geospatial data sets often overwhelm visual perception, making it difficult to discern subtle spatial trends or temporal anomalies through sight alone.
3. **Passive Engagement:** Public audiences frequently view satellite imagery as aesthetic snapshots rather than dynamic datasets with quantitative dimensions.
4. **Computational Barriers:** Traditional data sonification and image analysis workflows often rely on cumbersome desktop applications, Python scientific environments (NumPy/SciPy/SuperCollider), or remote backend servers, creating friction for casual exploration.

---

## 3. Proposed Solution

The Earth Information Jukebox provides an intuitive, browser-based, zero-installation "observatory and music studio" that:
- Ingests verified NASA Earth observation imagery along with documented calibration legends, units, and spatial bounds.
- Deconstructs images through client-side computer vision into regional zones, statistical brightness gradients, hue distributions, and spatial edge densities.
- Translates extracted features into musical primitives (pitch, scale degrees, harmonic timbre, cadence, stereo panning, filter resonance) using mathematically grounded, configurable mapping pipelines.
- Implements interactive spatial scanning (chronological time-series, latitude/longitude line sweeps, quadrant probes, and cursor-driven interactive nodes).
- Delivers an accessible experience with WCAG 2.1 AA compliance, live textual transcripts, screen-reader telemetry callouts, and audio descriptive narrations.

---

## 4. Target Users

1. **Visually Impaired & Neurodiverse Explorers:** Users requiring auditory data translation, screen-reader optimized telemetry, and multi-sensory scientific communication.
2. **Science Educators & Students:** Middle school to university instructors seeking engaging, cross-disciplinary STEM/STEAM tools connecting physics, ecology, computer vision, and music theory.
3. **NASA Enthusiasts & General Public:** Everyday citizens exploring global environmental shifts (global temperature, polar ice extent, wildfire aerosol spread) through an artistic and educational lens.
4. **Acoustic Artists & Creative Coders:** Musicians and sound designers interested in generative audio derived from empirical natural phenomena.

---

## 5. Main Objectives

- **Scientific Integrity:** Strictly distinguish between verified NASA physical quantities and qualitative visual approximations derived from imagery.
- **Client-Side Autonomy:** Execute all image processing and audio synthesis directly in the browser with zero backend dependency (no Python, no database, no hosted GPU compute).
- **Acoustic Coherence:** Produce musically engaging, structured soundscapes (using tuned scales and harmonic constraints) rather than harsh chaotic noise or simplistic 1:1 pixel-to-frequency shrieks.
- **Feasible Solo-Developer Scope:** Deliver a robust, polished MVP within the NASA Space Apps Challenge sprint cycle using clean TypeScript, Next.js App Router, Tailwind CSS, OpenCV.js, and Tone.js.

---

## 6. Functional Requirements

### 6.1 Visualization Exploration & Selection (Earth Explorer)
- **FR-1.1:** The app shall display a curated catalog of NASA Earth visualizations spanning distinct Earth systems (e.g., Atmosphere, Biosphere, Cryosphere, Hydrosphere).
- **FR-1.2:** Each catalog entry must include official NASA mission metadata: mission title, sensor/instrument name (e.g., MODIS, VIIRS, Landsat), acquisition date/range, color bar legend explanation, measurement units, and direct source attribution links.
- **FR-1.3:** The user shall be able to filter or switch between catalog items seamlessly without full page reloads.

### 6.2 Computer Vision & Image Processing
- **FR-2.1:** OpenCV.js must be lazily initialized only upon loading the visualization workspace to preserve initial page load performance.
- **FR-2.2:** The processing pipeline shall downscale large images into manageable analysis buffers (e.g., standard maximum dimension of 512px–800px) on an off-screen HTML5 Canvas.
- **FR-2.3:** The system shall segment the image into discrete spatial regions (e.g., $N \times M$ grid cells or horizontal scanlines) rather than per-pixel audio loops.
- **FR-2.4:** The pipeline must compute aggregated statistical metrics per region:
  - Mean luminance / brightness ($Y = 0.299R + 0.587G + 0.114B$).
  - Dominant color tone and saturation in HSV color space.
  - Spatial gradient / edge density using Sobel or Canny edge filtering to identify boundary complexity (e.g., coastlines, cloud fronts, burn perimeters).
  - Standard deviation / variance of pixel intensities to quantify regional texture roughness.
- **FR-2.5:** Spatial and temporal smoothing algorithms (moving average / exponential dampening) must be applied across scan increments to avoid jarring audio discontinuities.

### 6.3 Sonification Engine & Audio Synthesis
- **FR-3.1:** Audio initialization must strictly adhere to browser autoplay policies: Tone.js / Web Audio API `AudioContext` will only start after an explicit user interaction (e.g., clicking "Start Sonification" or "Play").
- **FR-3.2:** The sonification engine shall map regional computer vision metrics to defined musical parameters:
  - **Pitch & Melodic Contour:** Mapped to musical scales (e.g., Pentatonic, Dorian, Aeolian, or Lydian) to ensure pleasant tonality.
  - **Bass / Root Drone:** Mapped to overall global baseline values (e.g., sea surface temperature base).
  - **Rhythm / Arpeggiation Rate:** Mapped to regional variance or edge complexity.
  - **Harmonic Timbre & Filter Cutoff:** Mapped to brightness and saturation (low-pass filter opens with higher values).
  - **Spatial Stereo Panning:** Mapped to horizontal coordinates (left to right across the globe or scan sweep).
- **FR-3.3:** The engine shall provide master gain controls, mute toggles, tempo/scan rate controls, and scale selector presets.

### 6.4 Interactive Visualization Workspace & Scanning Modes
- **FR-4.1:** The workspace shall display the visualization with an overlaid scanning indicator indicating the region currently generating audio.
- **FR-4.2:** Supported scanning modes shall include:
  - **Horizontal Sweep:** Left-to-right longitude scan simulating time progression or planetary rotation.
  - **Vertical Profile:** Top-to-bottom latitude scan (polar to equatorial to polar).
  - **Interactive Cursor Probe:** Point-and-click or hover inspection of individual regions.
  - **Global Ambient Loop:** Continuous multi-voice sonification summarizing the entire visualization simultaneously.
- **FR-4.3:** Real-time visual feedback must highlight the active sector on an overlaid SVG/Canvas HUD layer in sync with the audio events.

### 6.5 Accessible Telemetry & Descriptions
- **FR-5.1:** Live screen-reader updates using `aria-live="polite"` announcing the currently scanned sector's physical estimates and musical state.
- **FR-5.2:** A dedicated "Data Inspector & Summary" pane offering plain-text tabular summaries of regional findings.
- **FR-5.3:** Pre-rendered audio descriptions or synthesized speech summaries explaining the scientific context and legend of each visualization.

---

## 7. Non-Functional Requirements

- **NFR-1 (Performance):** Analysis pipeline execution and audio frame generation must maintain a steady 60 FPS UI frame rate and glitch-free audio synthesis (buffer latency under 50ms).
- **NFR-2 (Memory Management):** OpenCV.js C++ Mat objects allocated in WebAssembly heap must be explicitly deleted (`mat.delete()`) to prevent memory leaks during repeated analyses.
- **NFR-3 (Bundle Optimization):** Initial JavaScript bundle must remain lightweight. OpenCV.js (~8-10MB gzip/wasm) must be loaded dynamically on-demand from a reliable CDN or static public asset only when entering the workspace.
- **NFR-4 (Accessibility):** Conformance to WCAG 2.1 Level AA standards. Keyboard-only navigation for all playback, scanning, and calibration tools.
- **NFR-5 (Cross-Browser Compatibility):** Full operation on modern Chromium browsers (Chrome, Edge, Brave), Firefox, and Safari (desktop and tablet).
- **NFR-6 (Offline Resilience):** Static assets and curated imagery packaged locally inside the Next.js bundle to enable reliable demonstration even during unstable network conditions at hackathon showcases.

---

## 8. Core Application Features

| Feature Name | Description | User Benefit |
| :--- | :--- | :--- |
| **Mission Control Earth Explorer** | Curated gallery of verified NASA visualizations across climate, oceans, vegetation, and atmosphere. | Rapid discovery of scientifically grounded imagery with full attribution. |
| **Spectral Computer Vision Engine** | Client-side OpenCV.js pipeline extracting luminance, edge density, and HSV distribution into a structured grid. | Zero-latency regional statistical analysis running 100% locally in browser memory. |
| **Harmonic Sonification Matrix** | Multi-timbral Tone.js synthesizer array translating grid metrics into scale-quantized notes, drones, and pulses. | Musical, coherent, and pleasing soundscapes that accurately mirror spatial patterns. |
| **Dual-View Scanning HUD** | Synchronized visual scanning reticle overlaid on satellite imagery paired with an oscilloscope/spectrum display. | Intuitive multi-sensory correlation between what the eye sees and what the ear hears. |
| **Accessible Data Telemetry Bar** | High-contrast status readouts, ARIA live feeds, and keyboard-driven sonification scrubbing. | Empowers users with visual or motor impairments to explore Earth datasets fully. |

---

## 9. Accessibility Requirements

1. **Screen Reader Integration:**
   - All interactive controls labeled with explicit `aria-label` and `aria-description`.
   - Dynamic sonification readouts piped through an off-screen `role="status"` live region with debounced updates to prevent screen-reader spam.
2. **Keyboard Navigation:**
   - Full tab-index traversal with visible NASA mission-control styling focus rings (`outline-cyan-400`).
   - Spacebar toggles playback; Arrow keys scrub the scanline across the visualization grid; `M` toggles mute.
3. **Sensory Alternatives:**
   - Textual data descriptions alongside audio sonification for deaf/hard-of-hearing users.
   - High-contrast color palette adhering to minimum 4.5:1 contrast ratios.
   - Reduced-motion toggle disabling pulsing animations and smooth sweep transitions.

---

## 10. MVP Scope vs. Future Enhancements

### In Scope for MVP (Hackathon Solo Delivery)
- 4 to 6 curated, verified NASA visualizations (e.g., Global Sea Surface Temperature, Arctic Sea Ice Minimum, MODIS Global NDVI Vegetation, Fire Information for Resource Management System / FIRMS Thermal Anomalies).
- Static pre-packaged imagery assets with verified scientific legends and source links.
- Lazy-loaded OpenCV.js processing off-screen canvas downscaled to $32 \times 32$ or $16 \times 16$ regional grid segments.
- 3 primary scanning modes: Linear Horizontal Sweep, Linear Vertical Sweep, and Static Region Click/Hover.
- 4-voice Tone.js synthesis engine (Bass Drone, Melodic Lead, Harmonic Pad, Rhythmic Texture).
- Musical scale quantization (C Minor Pentatonic, D Dorian, F Lydian).
- Full responsive interface with Mission Control / DAW aesthetic.
- Vercel production deployment.

### Future Enhancements (Post-Hackathon)
- Live NASA GIBS (Global Imagery Browse Services) WMTS tile API live ingestion for real-time daily global mosaics.
- Web MIDI API export enabling users to route sonification output into digital audio workstations (Ableton Live, Logic Pro).
- Audio recording / WAV export of customized planetary soundscapes.
- Custom user image upload with user-defined legend calibration tools.
- Multi-user collaborative listening rooms using WebRTC.

---

## 11. Acceptance Criteria

1. **Zero Backend Requirement:** The application builds as a static/client-side Next.js project on Vercel without requiring a Node.js persistent backend, Python runtime, or external database.
2. **Deterministic Processing:** Loading a selected NASA image reliably segments the picture into mathematical feature vectors and outputs predictable sound profiles without crashing browser memory.
3. **Autoplay Compliance:** Audio never triggers automatically on page load; audio begins strictly after explicit user action.
4. **Legible Science:** The UI clearly notes where visual color bands approximate scientific units (e.g., "Sea Surface Temperature: Blue ~ 2°C to Red ~ 32°C based on MODIS calibration scale") and includes source links to NASA Earth Observatory / NASA Worldview.
5. **Rock-Solid Stability:** The app handles rapid image switching, rapid play/pause toggles, and resize events without unhandled JavaScript exceptions or WebAudio memory dropouts.
