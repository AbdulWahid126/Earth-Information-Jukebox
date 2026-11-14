# System Architecture Document
## Earth Information Jukebox

**Author / Lead Architect:** Lead Software Architect  
**Project Owner / Developer:** Solo Developer  
**Status:** Approved Technical Architecture  
**Target Platform:** Next.js (Client-Centric Jamstack) / Vercel Edge Hosting

---

## 1. System Architecture Overview

The Earth Information Jukebox is architected as an autonomous, 100% client-side web application. It operates entirely within the user's browser, eliminating the operational complexity, hosting costs, and latency of a Python scientific server or cloud database.

```mermaid
flowchart TD
    subgraph BrowserClient ["Client Web Browser (Next.js Application)"]
        subgraph UI ["User Interface Layer (React 19 / Tailwind CSS)"]
            Catalog["Earth Explorer Catalog"]
            Workspace["Visualization HUD & Viewport"]
            AudioRack["Sonification Audio Rack & Controls"]
            Telemetry["Data Inspector & Accessibility Feed"]
        end

        subgraph CorePipelines ["Core Computation & Synthesis Pipelines"]
            subgraph CVPipeline ["Computer Vision Pipeline (OpenCV.js)"]
                Loader["Lazy WASM Loader"]
                CanvasBuffer["Off-Screen Canvas Buffer"]
                GridExtractor["Regional Segmenter & Feature Extractor"]
                StatSmoother["Spatial/Temporal Normalizer"]
            end

            subgraph DataMapper ["Scientific Interpretation & Sonification Mapper"]
                LegendMapper["NASA Legend & Calibration Model"]
                ParamQuantizer["Musical Parameter Quantizer (Scale/Tone/Rhythm)"]
            end

            subgraph AudioEngine ["Audio Synthesis Engine (Tone.js / Web Audio)"]
                ToneScheduler["Playback Transport & Scan Clock"]
                SynthArray["Polyphonic Synth Array (Lead, Drone, Bass, Noise)"]
                MasterFX["Master Chain (Filter, StereoPanner, Reverb, Limiter)"]
            end
        end

        subgraph StateStore ["Reactive Application State"]
            AppStore["Context / Hook State (Selection, Playback, Calibration)"]
        end
    end

    subgraph StaticAssets ["Static Public Assets (Next.js / Vercel CDN)"]
        NASAImages["Curated NASA Imagery (.webp/.png)"]
        MetadataJSON["Scientific Metadata & Legend Schemas (.json)"]
        OpenCVWASM["OpenCV.js WebAssembly Binary"]
    end

    NASAImages --> CanvasBuffer
    MetadataJSON --> LegendMapper
    OpenCVWASM -.->|Lazy Load| Loader
    Loader --> GridExtractor
    CanvasBuffer --> GridExtractor
    GridExtractor --> StatSmoother
    StatSmoother --> LegendMapper
    LegendMapper --> ParamQuantizer
    ParamQuantizer --> ToneScheduler
    ToneScheduler --> SynthArray --> MasterFX --> UI
    AppStore <--> UI
    AppStore <--> CorePipelines
```

---

## 2. Technology Stack

| Layer | Chosen Technology | Version / Spec | Justification & Architectural Role |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.4.x` | Modern React framework with high-efficiency static optimization, edge routing, and clean component isolation. |
| **UI Library** | React | `19.3.x` | Latest stable React runtime leveraging modern hooks and concurrent rendering capabilities. |
| **Language** | TypeScript | `5.x` | Enforces strict compile-time typing across computer vision matrix structures, audio parameters, and scientific metadata. |
| **Styling** | Tailwind CSS | `4.3.x` | Utility-first, zero-runtime CSS engine configured with a custom NASA Mission Control / DAW dark theme. |
| **Computer Vision** | OpenCV.js | `4.8.x+` (WASM) | Industrial-grade computer vision compiled to WebAssembly for client-side matrix manipulations, color conversions, and edge detection. |
| **Audio Synthesis** | Tone.js | `15.1.x` | Web Audio framework offering robust scheduling (Transport), polyphonic synthesis, audio effect chains, and scale-tuning utilities. |
| **Animation / HUD** | Framer Motion | `14.14.x` | High-performance hardware-accelerated animations for scanning reticles, audio level meters, and UI state transitions. |
| **Icons** | Lucide React | `1.73.x` | Clean, standardized SVG icons for media controls, planetary filters, and mission telemetry. |
| **Hosting & CI/CD** | Vercel | Global Edge | Automated zero-configuration Git-integrated static deployments with HTTP/2 and asset edge caching. |

---

## 3. Frontend Architecture

The frontend follows a decoupled modular architecture organized into four functional layers:

1. **Presentation Components (`src/components/*`):**
   - Presentational UI components designed with strict separation from business logic.
   - Built to simulate hardware instrumentation: rack mounts, digital rotary knobs, LED status meters, and oscilloscope displays.
2. **Custom Domain Hooks (`src/hooks/*`):**
   - `useOpenCV`: Manages the asynchronous lazy loading of the OpenCV.js script and its lifecycle state (`idle`, `loading`, `ready`, `error`).
   - `useImageProcessor`: Handles off-screen canvas rendering, frame extraction, downscaling, and triggering OpenCV analysis.
   - `useSonificationEngine`: Orchestrates Tone.js AudioContext activation, voice dispatch, note scheduling, and volume/tempo controls.
   - `useScanTransport`: Coordinates the visual playhead position with the audio scheduling loop.
3. **Core Services & Pure Utilities (`src/lib/*`):**
   - Pure, stateless TypeScript modules handling mathematical scaling, color transforms, legend interpolation, and audio-frequency conversions.
4. **Data Repositories (`src/data/*`):**
   - Static schemas, NASA dataset catalog definitions, and verified scientific calibration tables.

---

## 4. Computer Vision Processing Pipeline (OpenCV.js)

To prevent browser UI freezes, memory exhaustion, and audio stutter, the computer vision engine processes images using controlled regional aggregation rather than unconstrained per-pixel operations.

```mermaid
flowchart LR
    SourceImg["Selected NASA Image"] --> CanvasInit["Downscale on Off-Screen Canvas (Max 512px)"]
    CanvasInit --> MatCreate["Allocate cv.Mat (RGBA)"]
    MatCreate --> ColorConvert["Convert to Grayscale & HSV"]
    ColorConvert --> GridDiv["Partition into N x M Grid Sectors (e.g., 16 x 16)"]
    GridDiv --> Metrics["Compute Sector Metrics:\n- Mean Luminance\n- Dominant Hue/Sat\n- Sobel/Canny Edge Density\n- Variance/Roughness"]
    Metrics --> MatFree["Explicit cv.Mat.delete() Cleanup"]
    MatFree --> Smoothing["Temporal & Spatial Smoothing (EMA Filter)"]
    Smoothing --> NormalizedVectors["Export Structured SectorData[]"]
```

### Key CV Pipeline Rules:
1. **Lazy Initialization:** OpenCV.js (`opencv.js`) is never loaded on the homepage. It is fetched dynamically only when the user opens the Visualization Workspace.
2. **Buffer Downsampling:** Source images are loaded onto an off-screen HTML5 `CanvasRenderingContext2D` and normalized to a uniform processing size (e.g., $512 \times 512$ or $640 \times 360$) before conversion to an OpenCV `cv.Mat`.
3. **Grid-Based Statistical Aggregation:** The image is divided into a discrete $N \times M$ grid (default: $16 \times 16$ or $32 \times 32$ sectors). For each sector, the pipeline extracts:
   - **Luminance:** Normalized brightness $\in [0, 1]$.
   - **Hue & Saturation:** Mean HSV coordinates representing visual spectral distribution.
   - **Edge Density:** Gradient magnitude using Sobel or Canny filters $\in [0, 1]$, representing spatial boundaries (fronts, coastlines, wildfires).
   - **Roughness / Variance:** Standard deviation of pixel values within the cell.
4. **WASM Heap Garbage Collection:** JavaScript garbage collection does not clean up OpenCV.js C++ objects. Every allocated `cv.Mat`, `cv.Rect`, or `cv.Scalar` must be explicitly freed in a `try...finally` block via `.delete()`.

---

## 5. Scientific Data Interpretation & Legend Mapping

> **CRITICAL ARCHITECTURAL DIRECTIVE:** Never assume image pixel color directly corresponds to scientific values without calibration. An image is a 2D RGB visualization of underlying sensor measurements that has been run through a specific NASA colormap.

### Legend Mapping Architecture
Each curated NASA visualization is paired with a verified **Visualization Metadata Schema** defining:
1. **Colormap Specification:** The NASA legend type (e.g., Turbo, Viridis, Thermal, Blue-to-Red gradient).
2. **Physical Metric Bounds:** The physical measurement and its verified unit range (e.g., Sea Surface Temperature in ${^\circ}\text{C}$ spanning $[-2.0, 35.0]$).
3. **Calibration Lookup Table (LUT):** Mathematical reference points connecting RGB/HSV values to verified metric values.
4. **Confidence & Approximation Flags:** Clear metadata attributes indicating whether a metric represents an exact physical reading, an interpolated value, or an uncalibrated optical proxy (e.g., cloud optical thickness visual proxy).

---

## 6. Sonification Processing Pipeline & Tone.js Architecture

The sonification engine translates normalized scientific and visual features into harmonic, multi-timbral audio.

```mermaid
flowchart TD
    subgraph InputData ["Processed Image Data"]
        Sector["Active Scanned Sector / Column"]
    end

    subgraph TranslationLayer ["Sonification Mapper"]
        PitchMapper["Luminance / Value -> Scale Degree Quantizer"]
        RhythmMapper["Edge Density -> Note Duration / Trigger Rate"]
        TimbreMapper["Saturation -> Low-Pass Filter Cutoff & Resonance"]
        PanMapper["Horizontal Coordinate -> Stereo Panner (-1.0 to +1.0)"]
    end

    subgraph ToneSynthEngine ["Tone.js Synthesizer Rack"]
        subgraph Voices ["Synthesizer Voices"]
            DroneSynth["Drone Synthesizer (AMSynth)\nDeep Root & Planetary Foundation"]
            LeadSynth["Lead Synthesizer (PolySynth/FMSynth)\nMelodic Spectral Trajectory"]
            TextureSynth["Texture Noise Generator (NoiseSynth)\nAtmospheric Wind / Surface Chaos"]
            BassVoice["Sub-Bass Oscillator (MonoSynth)\nGlobal Baseline Anchor"]
        end

        subgraph MasterEffects ["FX Routing & Dynamics"]
            Filter["Tone.Filter (24dB Lowpass)"]
            Panner["Tone.Panner"]
            Reverb["Tone.Freeverb / Reverb"]
            Limiter["Tone.Limiter (-0.5 dB Peak Guard)"]
        end
    end

    subgraph OutputAudio ["Web Audio Output"]
        Speakers["Browser AudioContext Destination"]
    end

    Sector --> PitchMapper & RhythmMapper & TimbreMapper & PanMapper
    PitchMapper --> LeadSynth
    RhythmMapper --> LeadSynth & TextureSynth
    TimbreMapper --> Filter
    PanMapper --> Panner
    Sector -.-> BassVoice & DroneSynth
    Voices --> Filter --> Panner --> Reverb --> Limiter --> Speakers
```

### Multi-Voice Audio Architecture:
1. **Root / Drone Voice (`Tone.AMSynth`):**
   - Generates sustained, resonant ambient chords grounded in the foundational global baseline of the dataset.
   - Modulated slowly to evoke deep planetary scale.
2. **Melodic Lead Voice (`Tone.PolySynth` with `Tone.Synth`):**
   - Translates regional luminance and calibrated temperature/density into discrete musical notes.
   - Quantized strictly to user-selected musical scales (e.g., Minor Pentatonic, Dorian, Lydian) to prevent dissonance.
3. **Atmospheric Texture Voice (`Tone.NoiseSynth`):**
   - High spatial edge density (roughness, fronts, turbulent boundaries) injects soft, band-pass-filtered white or pink noise simulating atmospheric friction, ocean spray, or solar wind.
4. **Stereo Spatialization (`Tone.Panner`):**
   - The playhead's horizontal position maps directly to the stereo field ($x = 0 \to -1.0$ [full left], $x = 1 \to +1.0$ [full right]), providing spatial acoustic orientation.
5. **Peak Protection & Limiting (`Tone.Limiter`):**
   - A master limiter clamped at $-0.5\text{ dB}$ ensures that rapid parameter changes or overlapping voices never produce harsh clipping or digital distortion.

---

## 7. Data Flow Between Modules

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Application UI
    participant CV as OpenCV.js Engine
    participant Data as Legend Mapper
    participant Audio as Tone.js Engine

    User->>UI: Selects Visualization ("Sea Surface Temperature")
    UI->>CV: Download image buffer & initialize off-screen canvas
    Note over CV: Lazy loads OpenCV WASM if not already resident
    CV->>CV: Downsample image, segment into 16x16 grid, compute metrics
    CV-->>UI: Return Structured Analysis Matrix (GridData)
    User->>UI: Clicks "Engage Sonification" (Explicit User Gesture)
    UI->>Audio: Tone.start() AudioContext initialized & unlocked
    UI->>Audio: Start Transport & Scanning Clock
    loop Scanning Interval (e.g., 120 BPM / 16th notes)
        Audio->>UI: Request Current Sector Data (X, Y)
        UI->>Data: Calibrate Raw Metrics against NASA Legend
        Data-->>Audio: Calibrated Values (Metric + Norm Features)
        Audio->>Audio: Quantize to Musical Scale & Trigger Synths
        Audio->>UI: Update Active Sector Reticle & Audio Oscilloscope
        UI-->>User: Render visual scanline & output spatial audio
    end
    User->>UI: Clicks "Pause" or changes Scale/Mode
    UI->>Audio: Pause Transport / Reconfigure Scales
```

---

## 8. Suggested Folder Structure

The project maintains clean modularity under the `frontend/` directory:

```text
frontend/
├── public/
│   ├── assets/
│   │   ├── opencv/
│   │   │   └── opencv.js              # Lazy-loaded OpenCV WASM runtime
│   │   └── visualizations/            # Curated NASA imagery
│   │       ├── sst-global.webp        # Sea Surface Temperature
│   │       ├── ndvi-vegetation.webp   # Biosphere Vegetation Index
│   │       ├── sea-ice-extent.webp    # Polar Cryosphere Extent
│   │       └── fires-aerosol.webp     # FIRMS Thermal Anomalies
│   └── favicon.ico
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout & NASA metadata
│   │   ├── page.tsx                   # Homepage & Mission Briefing
│   │   ├── explorer/
│   │   │   └── page.tsx               # Earth Explorer Catalog
│   │   ├── workspace/
│   │   │   └── page.tsx               # Main Sonification Laboratory HUD
│   │   └── globals.css                # Global Tailwind CSS definitions
│   ├── components/
│   │   ├── common/                    # Reusable primitives (Buttons, Sliders, Badges)
│   │   ├── layout/                    # Header, Footer, MissionBar, Navigation
│   │   ├── explorer/                  # CatalogGrid, DatasetCard, FilterBar
│   │   ├── workspace/                 # ImageCanvas, ScanReticle, LegendOverlay
│   │   ├── audio/                     # AudioRack, ScaleSelector, VolumeKnob, Oscilloscope
│   │   └── telemetry/                 # DataInspector, AccessibilityReadout, MetricBadge
│   ├── hooks/
│   │   ├── useOpenCV.ts               # Lazy-loading and WASM state hook
│   │   ├── useImageProcessor.ts       # CV extraction pipeline hook
│   │   ├── useSonificationEngine.ts   # Tone.js synthesis and playback hook
│   │   └── useScanTransport.ts        # Playhead clock & synchronization hook
│   ├── lib/
│   │   ├── cv/
│   │   │   ├── cvTypes.ts             # Low-level OpenCV typing
│   │   │   ├── gridAnalyzer.ts        # Segmentation & feature extraction algorithms
│   │   │   └── smoothing.ts           # Exponential moving average & filter utils
│   │   ├── sonification/
│   │   │   ├── scales.ts              # Musical scales, frequency conversions, tuning
│   │   │   ├── synthRack.ts           # Tone.js instrument definitions & audio routing
│   │   │   └── mappings.ts            # Metric-to-musical parameter transformation functions
│   │   ├── nasa/
│   │   │   ├── legendCalibration.ts   # RGB-to-scientific metric calculation
│   │   │   └── datasets.ts            # Curated NASA dataset records and source metadata
│   │   └── utils.ts                   # Generic helper utilities
│   └── types/
│       ├── visualization.ts           # Dataset schemas and metadata interfaces
│       ├── cv.ts                      # Analysis outputs and sector metric interfaces
│       └── audio.ts                   # Audio parameter and synth configuration interfaces
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 9. TypeScript Interfaces for Processing Results

### 9.1 NASA Visualization & Scientific Metadata
```typescript
export type EarthSystemCategory = 'Atmosphere' | 'Biosphere' | 'Cryosphere' | 'Hydrosphere';

export interface LegendRange {
  minPhysicalValue: number;
  maxPhysicalValue: number;
  unit: string;
  isCalibrated: boolean; // false indicates visual proxy rather than direct metric
  notes: string;
}

export interface NASAVisualizationDataset {
  id: string;
  title: string;
  subtitle: string;
  category: EarthSystemCategory;
  sensor: string; // e.g., "MODIS / Terra & Aqua", "VIIRS / Suomi NPP"
  mission: string; // e.g., "Earth Observing System"
  temporalRange: string; // e.g., "September 2024 Composite"
  imagePath: string;
  thumbnailPath: string;
  sourceUrl: string; // Direct link to NASA Worldview / Earth Observatory
  legend: LegendRange;
  description: string;
  scientificContext: string;
}
```

### 9.2 Computer Vision Extraction Results
```typescript
export interface SectorCoordinates {
  colIndex: number;
  rowIndex: number;
  normalizedX: number; // 0.0 (left) to 1.0 (right)
  normalizedY: number; // 0.0 (top) to 1.0 (bottom)
  pixelX: number;
  pixelY: number;
  width: number;
  height: number;
}

export interface SectorMetrics {
  coordinates: SectorCoordinates;
  luminance: number;       // 0.0 (black) to 1.0 (pure white)
  meanColor: {
    r: number;
    g: number;
    b: number;
    h: number; // 0 to 360
    s: number; // 0 to 1.0
    v: number; // 0 to 1.0
  };
  edgeDensity: number;     // 0.0 (smooth gradient) to 1.0 (high spatial contrast)
  roughnessVariance: number; // Standard deviation of pixel luminance
  estimatedPhysicalValue?: number; // Calculated via NASA legend mapping if calibrated
}

export interface GridAnalysisResult {
  datasetId: string;
  gridDimensions: {
    columns: number;
    rows: number;
    totalSectors: number;
  };
  imageDimensions: {
    width: number;
    height: number;
  };
  globalMetrics: {
    averageLuminance: number;
    averageEdgeDensity: number;
    dominantHue: number;
  };
  sectors: SectorMetrics[][]; // 2D array [row][column]
  processedTimestamp: number;
}
```

### 9.3 Sonification Mapping Parameters
```typescript
export type MusicalScaleName = 
  | 'c_minor_pentatonic' 
  | 'd_dorian' 
  | 'f_lydian' 
  | 'a_aeolian' 
  | 'planetary_chromatic';

export type ScanningMode = 
  | 'horizontal_sweep' 
  | 'vertical_sweep' 
  | 'region_probe' 
  | 'global_ambient';

export interface SonificationFrameParameters {
  sector: SectorMetrics;
  pitchNote: string;       // e.g., "C4", "Eb4", "G4"
  frequencyHz: number;
  droneRootHz: number;
  cutoffFrequencyHz: number; // 200 Hz to 12000 Hz
  resonanceQ: number;
  noiseLevelDb: number;    // -60 dB to -10 dB
  stereoPan: number;       // -1.0 (left) to +1.0 (right)
  masterGainDb: number;
  triggerDurationSec: number;
}
```

---

## 10. Error Handling Architecture

The application adopts resilient, graceful degradation patterns across all computational stages:

1. **WASM / OpenCV Load Failure:**
   - If OpenCV.js fails to download (e.g., restricted network, timeout), the UI displays a clean NASA Mission Alert with retry capability and gracefully falls back to a lightweight standard HTML5 Canvas pixel sampler, preserving core sonification functionality.
2. **Web Audio Permission & Autoplay Policy:**
   - Browser policies forbid unprompted audio playback. The audio context state is tracked (`suspended`, `running`, `closed`). If an invocation occurs before interaction, the user is presented with an intuitive "Acoustic System Standby — Press Space or Click Engaged" prompt.
3. **Memory Overflow Prevention:**
   - A global cleanup hook ensures that whenever a user navigates between views or loads a new image, all active Tone.js loops are suspended and allocated OpenCV matrices are explicitly discarded.
4. **Invalid Image Bounds / Malformed Data:**
   - Fallback synthetic test patterns (e.g., standard calibration bars) are provided internally should an image asset fail to decode.

---

## 11. Performance Considerations

- **Frame Budget:** UI animations run on the GPU via CSS transforms and Framer Motion. Image analysis is detached from the render loop and executed once per image selection or scan sweep update.
- **Worker / Batching Consideration:** For the MVP, downscaling the image to $512\text{px}$ and segmenting into a $16 \times 16$ grid ($256$ cells) takes less than $12\text{ms}$ on modern CPUs inside OpenCV.js WASM, which comfortably fits inside a single task without requiring multi-threaded Web Workers. *Decision for research: If scaling to $64 \times 64$ grids in future releases, offload OpenCV to a dedicated Web Worker.*
- **Tone.js Transport Scheduling:** Audio notes are scheduled ahead using `Tone.Transport.scheduleRepeat()` rather than naive `setInterval()`, ensuring sub-millisecond jitter-free acoustic playback regardless of UI re-renders.

---

## 12. Browser Compatibility Considerations

- **WebAudio & AudioContext:** Fully compatible with Chromium $90+$, Firefox $88+$, and Safari $14.1+$. iOS Safari requires the standard user-tap unlock sequence, which is natively handled by the app's "Engage Sonification" button.
- **WebAssembly (WASM):** OpenCV.js requires standard WebAssembly MVP support, available across $>97\%$ of active global browsers.
- **Off-Screen Rendering:** Off-screen canvas buffering utilizes standard HTML5 `<canvas>` elements to ensure uniform cross-browser canvas API behavior.
