# Engineering Rules & Coding Standards
## Earth Information Jukebox

**Author / Lead Architect:** Lead Software Architect  
**Project Owner / Developer:** Solo Developer  
**Status:** Enforced Standards Document

---

## 1. Principles of Solo-Developer Discipline

1. **Pragmatic Simplicity:** Every line of code added must directly serve the user experience or scientific clarity. Do not write premature abstractions or theoretical frameworks.
2. **Deterministic & Lightweight:** The entire application must run client-side without databases, Python microservices, or complex backend deployments.
3. **Fail Safely:** Computer vision and Web Audio rely on low-level browser APIs (WASM and AudioContext). All edge cases must degrade gracefully without crashing the UI.

---

## 2. TypeScript Rules

- **Strict Mode Enforced:** All code must pass `tsc --noEmit` with zero warnings.
- **No `any` Ever:** The use of `any` is strictly prohibited. Use explicit types, discriminating unions, or `unknown` with runtime type narrowing.
- **Explicit Function Signatures:** All exported functions, hooks, and services must declare explicit parameter and return types.
- **Single Source of Truth for Models:** All data structures related to NASA metadata, CV results, and audio parameters must live in the `src/types/` directory.
- **Readonly Data Structures:** Configuration tables, NASA dataset definitions, and musical scale maps must be defined with `as const` or `Readonly<T>` to prevent accidental mutations.

```typescript
// GOOD: Explicit typing and immutable configuration
export const PENTATONIC_SCALE: readonly string[] = ['C3', 'Eb3', 'F3', 'G3', 'Bb3', 'C4'] as const;

// BAD: Implicit any, mutable reference
export const scales = ['C3', 'Eb3', 'F3'];
```

---

## 3. React & Next.js (App Router) Rules

- **Default to Server Components, Explicit Client Components:**
  - Pages and static layouts that do not require state or browser APIs must remain Server Components.
  - Interactive components utilizing React hooks (`useState`, `useEffect`), Tone.js, OpenCV, or Canvas must declare `'use client';` at the very top of the file.
- **Hook Rules & Dependency Arrays:**
  - `useEffect` and `useCallback` dependency arrays must be complete and exact. Never suppress `react-hooks/exhaustive-deps` without an architecturally documented reason.
- **No State Synchronization Antipatterns:**
  - Compute derived values during rendering rather than duplicating state in `useEffect`.
- **Pure Render Functions:**
  - React component bodies must remain pure. Audio triggers, canvas draws, and OpenCV matrix mutations must occur strictly inside event handlers or controlled `useEffect` hooks.

---

## 4. Component Organization & Architecture

Components must reside in strictly organized directories:

```text
src/components/
  ├── common/      # Generic, reusable atoms (Buttons, Sliders, Badges, Switches)
  ├── layout/      # Shell structures (Navbar, MissionStatusHeader, Footer)
  ├── explorer/    # Dataset exploration and catalog browsing components
  ├── workspace/   # Canvas viewport, scanning reticle overlays, HUD panels
  ├── audio/       # Synthesizer racks, filter knobs, scale selectors, meters
  └── telemetry/   # Real-time data readouts, scientific legend inspector
```

### Component Structure Standard
Every component file must follow a consistent internal order:
1. Directive (e.g., `'use client';` if required)
2. Imports (React/Next -> 3rd-party libs -> internal components -> hooks -> types/constants)
3. Interface definition for props (named `ComponentNameProps`)
4. Main Component declaration
5. Internal sub-helpers / memoized components (if strictly local)
6. Default export

---

## 5. Naming Conventions

| Entity | Convention | Example |
| :--- | :--- | :--- |
| **Files & Folders** | camelCase or kebab-case (consistent per category) | `gridAnalyzer.ts`, `useOpenCV.ts`, `dataset-card.tsx` |
| **React Components** | PascalCase | `ScanReticleOverlay`, `AudioRack` |
| **Custom Hooks** | camelCase prefixed with `use` | `useSonificationEngine`, `useImageProcessor` |
| **TypeScript Types & Interfaces** | PascalCase | `SectorMetrics`, `NASAVisualizationDataset` |
| **Constants & Enums** | UPPER_SNAKE_CASE | `DEFAULT_GRID_SIZE`, `MAX_AUDIO_VOICES` |
| **Event Handlers** | camelCase prefixed with `handle` | `handlePlaybackToggle`, `handleSectorClick` |

---

## 6. State Management Rules

- **Keep State Local:** Place state as close to where it is used as possible. Avoid premature global state stores.
- **Decoupled Playback State:** The audio transport clock (`isPlaying`, `currentSectorIndex`, `playbackSpeed`) must be managed centrally via a dedicated hook or React Context to prevent visual reticle and audio desynchronization.
- **No Heavy Objects in React State:**
  - Never store raw `cv.Mat`, image pixel arrays, or Tone.js Synth instances directly in React state.
  - Store references to audio nodes in `useRef` to avoid unnecessary component re-renders.
  - Store only pure serializable metrics (`SectorMetrics`, numbers, booleans, strings) in React state.

---

## 7. Performance & Memory Management Rules

### OpenCV.js Memory Rules (Critical)
- **Browser-Only Execution:** OpenCV.js must never be executed on the server or in Server Components. Always guard with `typeof window !== 'undefined'` or encapsulate inside `'use client'` hooks and callbacks.
- **Strict Typing:** Never use `any` for OpenCV structures. Use typed interfaces (`OpenCVRuntime`, `CVMat`, `CVRect`, `CVScalar`) from `src/lib/cv/cvTypes.ts`.
- **Deterministic Cleanup:** Every `cv.Mat` instantiated (including ROI slices inside loops) must be explicitly disposed of via `.delete()`. Failure to do so will cause catastrophic memory leaks in the WebAssembly heap.
- **Scoping Pattern:**
  ```typescript
  let srcMat: CVMat | null = null;
  let grayMat: CVMat | null = null;
  try {
    srcMat = cv.imread(canvasElement);
    grayMat = new cv.Mat();
    cv.cvtColor(srcMat, grayMat, cv.COLOR_RGBA2GRAY);
    // Execute feature extraction...
  } finally {
    srcMat?.delete();
    grayMat?.delete();
  }
  ```
- **Controlled Processing Resolution:** Never feed multi-megapixel images directly into the computer vision pipeline. Downscale to a standardized processing buffer ($512\text{px}$ maximum dimension) before running analysis.

### Audio Performance Rules
- **No Direct Audio Allocation in Render Loops:** Pre-allocate Tone.js synthesizer instances during initialization. Never instantiate new `Tone.Synth()` instances inside playback ticks.
- **Audio Clamping:** Always route through a master `Tone.Limiter` to eliminate digital clipping and protect user hearing.
- **Explicit User Gesture Unlock:** Tone.js `AudioContext` and `Tone.start()` must only be triggered in response to an explicit user interaction (click, tap, Spacebar keypress). Never attempt autoplay on page mount.
- **Tone.Draw Callback Guarding:** UI state synchronizers scheduled through `Tone.Draw.schedule()` must verify that transport status is still `'playing'` before updating React state. On playback stop or reset, immediately execute `Tone.Draw.cancel(0)` to prevent queued microtasks from reviving discarded playback frames.
- **Deterministic Transport Reset:** When stopping playback, clear the repeating schedule ID from `Tone.Transport`, call `Tone.Transport.stop()`, reset `Tone.Transport.position = 0`, and release all active synth voices.
- **Equitable Non-Auditory Access:** Every sonified visualization must provide a structured, non-audio tabular summary of empirical features (luminance range, edge complexity, sector extrema) ensuring deaf and hard-of-hearing users have full access to scientific insights.

---

## 8. Accessibility (a11y) Rules

- **WCAG 2.1 AA Compliance:** Minimum color contrast ratio of 4.5:1 for all text and interactive UI elements.
- **Accessible Audio Controls:** Every audio playback control must have a corresponding visual state and explicit `aria-label` (e.g., `aria-label="Pause sonification, currently scanning sector 14"`).
- **ARIA Live Regions:** Use `aria-live="polite"` for real-time sector telemetry readouts, debounced to update no faster than once every 500ms to avoid overwhelming screen-reader buffers.
- **Full Keyboard Navigation:** All actions (play/pause, scale selection, sector scrubbing, image switching) must be executable using standard keyboard commands (`Space`, `Enter`, `Tab`, `ArrowLeft`, `ArrowRight`, `M` for mute).
- **Reduced Motion Support:** Respect user preference `prefers-reduced-motion` by disabling sweeping HUD animations and pulsing reticles.

---

## 9. Error Handling Rules

- **Never Let the UI Crash Silently:** Always trap low-level errors (OpenCV script failures, Web Audio permission errors, image loading issues) and provide user-actionable notifications.
- **Graceful OpenCV Fallback:** If OpenCV WASM fails to initialize, the application must fallback to an HTML5 Canvas pixel sampling method rather than freezing the application.
- **Explicit Web Audio Resume Handling:** If an `AudioContext` is suspended by the browser, display an unmistakable "Resume Audio" prompt.

---

## 10. Dependency Management & Anti-Overengineering Rules

- **Strict Dependency Discipline:**
  - DO NOT add external state libraries (Redux, Zustand, MobX) unless vanilla React context proves insufficient.
  - DO NOT add heavy animation libraries; use Framer Motion (already in project) and native Tailwind transitions.
  - DO NOT install utility bloat (e.g., Lodash, Moment.js). Use modern native JavaScript (`Array.prototype`, `Math`, native `Date`).
- **No Python or Server Runtimes:** All tasks must run in the browser client.
- **No Artificial Machine Learning:** Do not load heavy client-side ML models (TensorFlow.js, ONNX) when OpenCV statistical filtering accomplishes the task with higher efficiency and predictable results.

---

## 11. Security Rules

- **Zero Untrusted Code Execution:** Never evaluate untrusted dynamic code (`eval()`, `new Function()`).
- **Sanitized Asset Sources:** NASA imagery and external assets must only be loaded from vetted, approved local directories or official NASA domain endpoints (`nasa.gov`, `earthobservatory.nasa.gov`).
- **Content Security Policy (CSP) Awareness:** Ensure script-loading patterns for OpenCV.js comply with standard CSP restrictions.

---

## 12. Git Commit & Branching Conventions

Follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short descriptive subject in imperative mood>

[optional body explaining motivation and architectural impact]
```

### Allowed Types:
- `feat`: A new user-facing capability or module (e.g., `feat(audio): implement scale quantizer`)
- `fix`: A bug fix (e.g., `fix(cv): resolve wasm memory leak in grid segmenter`)
- `docs`: Documentation updates only (e.g., `docs(arch): update tone.js signal graph`)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance or reduces memory
- `style`: Changes that do not affect code logic (formatting, whitespace)
- `test`: Adding or correcting tests

### Branching Standard:
- `main`: Production-ready, verified deployable code on Vercel.
- `feat/<feature-name>`: Working branch for isolated development tasks.
