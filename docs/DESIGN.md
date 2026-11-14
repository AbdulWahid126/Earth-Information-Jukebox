# Product Design System & UI/UX Specification
## Earth Information Jukebox

**Author / Lead Architect:** Lead Software Architect  
**Design Persona:** Scientific Systems Designer & Audio Engineer  
**Status:** Approved Design Specification  
**Design Metaphor:** NASA Mission Control Laboratory meets Contemporary Digital Audio Workstation (DAW)

---

## 1. Product Design Direction

The design of the Earth Information Jukebox bridges high-precision orbital telemetry with tactile audio studio instrumentation. 

### Core Design Tenets:
- **Scientific Utility over Decoration:** Avoid generic SaaS dashboard templates, pastel cards, heavy drop shadows, and excessive blurred glassmorphism.
- **Mission Control Atmosphere:** Deep space blacks, high-contrast monochrome structures, tactical borders, and precise telemetry readout grids.
- **Audio Studio Tactility:** Sliders that feel calibrated like analog studio faders, precision-notched rotary controls, LED-style signal peak meters, and crisp waveform displays.
- **Visual Restraint:** Color is reserved strictly for functional information—indicating Earth data values, active telemetry sectors, playback states, and warning indicators.

---

## 2. Visual Identity

- **Aesthetic Descriptor:** *Deep-Space Telemetry & Hardware Synthesis Rack*
- **Atmosphere:** Dark, focused, immersive, mathematically organized, and responsive.
- **Corner Radii:** Tight, purposeful chamfers and minimal rounded corners (`rounded-none` to `rounded-sm`, max `rounded-md` on buttons) to emulate physical instrumentation racks.
- **Borders & Dividers:** Fine $1\text{px}$ hairline borders (`border-white/10` to `border-cyan-500/30`) evoking engineering schematics and rack-mounted equipment.

---

## 3. Color Palette

The interface is built on deep obsidian and graphite foundations, illuminated by functional monochromatic accents and high-visibility indicator colors.

### Base Environment (Dark Matter & Chassis)
| Token | Hex Code | Tailwind Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| `space-black` | `#08090C` | `bg-neutral-950` | Primary viewport background |
| `chassis-base` | `#0E1116` | `bg-neutral-900` | Instrument panel surfaces & control racks |
| `chassis-panel`| `#161B22` | `bg-neutral-800/80` | Sub-panels, inspector modules, and card bays |
| `hairline-grid`| `rgba(255, 255, 255, 0.08)` | `border-white/10` | Structural grid lines, rack separators |

### Functional Telemetry & Signal Accents
| Token | Hex Code | Tailwind Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| `nasa-cyan` | `#00E5FF` | `text-cyan-400` / `border-cyan-500` | Primary scanline playhead, active coordinates, reticle HUD |
| `telemetry-amber` | `#FFB300` | `text-amber-400` | Warning thresholds, thermal telemetry, scale root notes |
| `biosphere-emerald` | `#00E676` | `text-emerald-400` | Audio signal active, live transport clock, vegetation metrics |
| `alert-crimson` | `#FF3D00` | `text-red-500` | Audio limiter clip alert, OpenCV error, critical disconnect |
| `text-primary` | `#F0F6FC` | `text-neutral-100` | Primary readouts, headings, metrics |
| `text-secondary` | `#8B949E` | `text-neutral-400` | Units, telemetry labels, legend descriptions |
| `text-muted` | `#484F58` | `text-neutral-500` | Inactive tracks, grid sector outlines, disabled states |

---

## 4. Typography

A dual-type system pairing a high-legibility geometric sans-serif for UI commands with an engineered monospace font for telemetry and coordinates.

1. **Telemetry & Data Font (Monospace):**
   - Font Family: `Geist Mono`, `JetBrains Mono`, or `ui-monospace, SFMono-Regular, Menlo, monospace`
   - Purpose: Coordinates (Latitude/Longitude), frequencies (Hz), decibels (dB), sector IDs, tempo (BPM), and scientific legends.
   - Styling: Tabular figures enabled (`tabular-nums`), uppercase labels, fine tracking (`tracking-wider`).
2. **Interface & Narrative Font (Sans-Serif):**
   - Font Family: `Inter`, `Geist Sans`, or `system-ui, -apple-system, sans-serif`
   - Purpose: Mission briefings, scientific descriptions, navigation headers, and modal text.
   - Styling: Crisp weight distribution (Regular `400`, Medium `500`, SemiBold `600`).

---

## 5. Layout Principles & Workspace Architecture

The application layout follows a tactical **three-panel laboratory layout**:

```text
+-----------------------------------------------------------------------------------------+
| [NASA LOGO] EARTH INFORMATION JUKEBOX // MISSION: SONIFICATION       [STATUS: ACTIVE 120 BPM] |
+-----------------------------------------------------------------------------------------+
| DATASET CATALOG     | VISUALIZATION WORKSPACE & SCANNING HUD     | SONIFICATION RACK   |
| (Left Bay, 25%)     | (Central Bay, 50%)                         | (Right Bay, 25%)    |
|                     |                                            |                     |
| > Sea Surface Temp  | [IMAGE VIEWPORT + SCANNING RETICLE]        | [MASTER TRANSPORT]  |
| > Arctic Sea Ice    |                                            | > Play/Pause/Scrub  |
| > MODIS Vegetation  |                                            |                     |
| > FIRMS Wildfires   | Sector: [C:08, R:12] Lat: 14.2 N Lon: 82 W | [SYNTHESIZER VOICES]|
|                     | Luminance: 0.742  | Roughness: 0.18        | > Melodic Lead (FM) |
| [DATASET METADATA]  | Approx Metric: 28.4 °C (MODIS Calibrated)  | > Drone Root (AM)   |
| Sensor: MODIS Aqua  |                                            | > Texture Filter    |
| Legend: 2°C to 35°C | [DATA INSPECTOR & ACCESSIBILITY READOUT]   | [SCALE & TUNING]    |
| Unit: Celsius       | Tabular telemetry feed & audio description | > Minor Pentatonic  |
+-----------------------------------------------------------------------------------------+
| SYSTEM FOOTER: CPU 12ms | AUDIO BUFFER: 44.1kHz / 0 CLIP | LATENCY: 22ms | NASA EARTH OBSERVATORY |
+-----------------------------------------------------------------------------------------+
```

---

## 6. Component Design Specifications

### 6.1 Visualization Workspace & Scanning HUD
- **Viewport Canvas:** Centers the NASA Earth imagery within a precision bezel.
- **Scanning Overlays:**
  - *Linear Sweep:* A crisp, vertical or horizontal beam (`nasa-cyan`, $1\text{px}$ line with subtle $4\text{px}$ phosphor glow) sweeping smoothly across the canvas in time with `Tone.Transport`.
  - *Reticle Box:* A dashed $1\text{px}$ cyan boundary highlighting the specific grid cell ($N \times M$) being actively sounded in the current clock cycle.
  - *Interactive Cursor:* Hovering reveals local coordinates, luminance values, and calibrated temperature/index estimates via a tooltip designed like a heads-up targeting pod.

### 6.2 Sonification Rack (Audio Control Bay)
- **Transport Bar:** Large, tactical physical-style toggle buttons:
  - `ENGAGE / DISENGAGE` (Play/Pause) with an illuminated status LED indicator.
  - `SCAN MODE` toggle (Horizontal Sweep / Vertical Sweep / Manual Probe / Ambient Field).
  - `SPEED / TEMPO` stepped slider ($60\text{ BPM}$ to $180\text{ BPM}$).
- **Synthesizer Mixer Channels:**
  - Voice Level Sliders: Master, Lead, Drone, Atmospheric Noise.
  - Frequency Spectrum Visualizer: Real-time Web Audio API FFT analyzer rendered on a $120\text{px} \times 40\text{px}$ miniature oscillographic canvas.
  - Scale & Root Selector: Segmented hardware-style switch to choose musical modes (Pentatonic, Dorian, Lydian, Aeolian).

### 6.3 Telemetry Inspector & Data Log
- A live scrollable terminal module logging real-time values:
  `[SEC-142] LAT: 12.4N LON: 45.2E | LUM: 0.82 | EST_TEMP: 31.2°C | FREQ: 440.0Hz (A4)`
- High-contrast typography optimized for both fast visual scanning and screen-reader accessibility.

---

## 7. Responsive Behavior

- **Desktop Displays ($\ge 1280\text{px}$):** Complete three-column laboratory layout providing simultaneous visualization, telemetry logging, and audio rack tweaking.
- **Laptops / Tablets ($768\text{px} - 1279\text{px}$):** Two-column mode; catalog collapses into an expandable drawer; audio rack docks below or beside the central viewport.
- **Mobile Handhelds ($< 768\text{px}$):** Tabbed interface switching between `[OBSERVE]`, `[SONIFY]`, and `[TELEMETRY]`. The audio transport bar remains pinned to the bottom of the viewport as an accessible floating control bar.

---

## 8. Accessible Design System

- **Focus System:** Unambiguous $2\text{px}$ solid cyan outline with an interior $1\text{px}$ black offset (`focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`).
- **Contrast Ratios:** Text elements consistently achieve $\ge 7:1$ contrast against their chassis backgrounds, exceeding standard WCAG AA requirements.
- **Screen-Reader Compatibility:** Visual indicators have synchronized hidden textual states (`sr-only`) updated via ARIA polite announcements.
- **Motion Reduction:** When `prefers-reduced-motion` is active:
  - The scanning laser line transitions into static step-by-step sector bounding boxes.
  - Oscilloscope visualizers switch to a static numeric decibel readout.

---

## 9. State Displays: Loading, Empty, and Error States

### Loading State (WASM & Asset Acquisition)
- Visual presentation: Radar-style circular sweep graphic with a tactical progress readout:
  `INITIALIZING OPENCV.JS WASM CORE... [OK]`  
  `FETCHING NASA MODIS SATELLITE COMPOSITE... [64%]`

### Empty State (No Selection)
- Clean wireframe globe with dotted orbital trajectories and an invitation:
  `STANDBY: SELECT AN EARTH OBSERVATION DATASET FROM THE EXPLORER CATALOG TO COMMENCE ANALYSIS.`

### Error State (WASM Failure / AudioContext Blocked)
- Mission Alert panel with a crimson header and high-contrast diagnostic code:
  `[SYSTEM ALERT 0x4A]: WEB AUDIO INITIALIZATION PREVENTED BY BROWSER AUTOPLAY POLICY`  
  `ACTION REQUIRED: CLICK "ENGAGE AUDIO ENGINE" TO ACTIVATE HARDWARE OUTPUT.`
