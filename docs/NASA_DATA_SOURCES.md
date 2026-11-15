# NASA Data Sources & Scientific Calibration Registry
## Earth Information Jukebox

**Author / Lead Architect:** Lead Software Architect  
**Project Owner / Developer:** Solo Developer  
**Status:** Phase 3 Approved Specification  
**Last Updated:** November 2026

---

## 1. Overview & Data Architecture Principles

The **Earth Information Jukebox** uses authentic NASA Earth observation data to drive computer vision analysis and soundscapes. To preserve scientific rigor:
1. **Never conflate spatial imagery with global aggregate time-series:** The global monthly CSV provides scalar planetary mean anomalies across time (1880–present). The satellite map provides 2D spatial anomaly distributions across the planet for a specific observation period (2025).
2. **Explicit colormap calibration:** Visual pixel colors reflect a specific cartographic colormap (*vik*), not raw uncalibrated digital numbers (DN) or direct sensor temperatures.
3. **Traceable provenance:** Every asset is cataloged with its official NASA identifier, publication date, scientific baseline, sensor lineage, and attribution.

---

## 2. Dataset 1: NASA GISTEMP v4 — Global Temperature Anomalies

### 2.1 Metadata Specification

| Metadata Field | Value |
|:---|:---|
| **Dataset Name** | GISS Surface Temperature Analysis version 4 (GISTEMP v4) |
| **Managing Laboratory** | NASA Goddard Institute for Space Studies (GISS), Earth Sciences Division, Goddard Space Flight Center |
| **Release / Publication Date** | January 14, 2026 (SVS Release ID: 5603) |
| **Observation Year** | 2025 (Annual Anomaly Composite) |
| **Time-Series Coverage** | 1880 – 2026 (Monthly & Annual resolution) |
| **Primary Measurement** | Surface Air Temperature and Sea Surface Temperature Anomaly |
| **Physical Unit** | Degrees Celsius ($^\circ\text{C}$) anomaly |
| **Climatological Baseline** | **1951–1980** (Standard GISS 30-year normal period) |
| **Underlying Observations** | NOAA GHCNv4 (meteorological land stations) + ERSSTv5 (ocean buoy & ship measurements) |
| **Map Projection** | **Robinson Projection** (Pseudocylindrical compromise projection) |
| **Colormap Name** | **vik** (Scientific Colour Maps, Crameri 2018) |
| **Colormap Characteristics** | Perceptually uniform, colorblind-friendly, diverging (blue $\to$ white $\to$ rust/red) |
| **Spatial Smoothing** | **No spatial smoothing** (Unsmoothed station coverage cells) |
| **Image Resolution** | $1920 \times 1080$ pixels (Full HD 1080p, PNG format) |

---

### 2.2 Official NASA Source URLs

1. **NASA Scientific Visualization Studio (SVS 5603):**  
   `https://svs.gsfc.nasa.gov/5603/`
2. **NASA SVS 2025 HD Map Asset (Direct Image):**  
   `https://svs.gsfc.nasa.gov/vis/a000000/a005600/a005603/Map_HD_2025_nosmoothing.png`
3. **NASA GISS GISTEMP v4 Data Portal:**  
   `https://data.giss.nasa.gov/gistemp/`
4. **NASA GISS Data Downloads Directory:**  
   `https://data.giss.nasa.gov/gistemp/data_v4.html`
5. **NASA GISS Global Monthly Land-Ocean CSV:**  
   `https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv`

---

### 2.3 Downloaded Local Assets

| Asset Type | Local Project Path | Original Filename | Format / Dimensions | Size |
|:---|:---|:---|:---|:---|
| **Spatial Map Visualization** | `frontend/public/assets/visualizations/temperature/gistemp-2025-map-nosmoothing.png` | `Map_HD_2025_nosmoothing.png` | PNG, $1920 \times 1080$ px | $1,143,895\text{ bytes}$ ($\sim 1.14\text{ MB}$) |
| **Global Anomaly Time Series** | `frontend/public/assets/datasets/temperature/gistemp-global-monthly.csv` | `GLB.Ts+dSST.csv` | CSV text, 149 lines | $12,879\text{ bytes}$ ($\sim 12.8\text{ KB}$) |

---

### 2.4 Critical Scientific Distinction: Spatial Map vs. Global Time-Series

```
+-----------------------------------------------------------------------------------------+
|                                    DATASET SCOPE COMPARISON                             |
+-----------------------------------------------------------------------------------------+
| FEATURE                     | SPATIAL MAP (PNG)             | GLOBAL TIME-SERIES (CSV)  |
| File Name                   | gistemp-2025-map-nosmoothing  | gistemp-global-monthly    |
| Dimensionality              | 2D Spatial (X, Y pixels)      | 1D Temporal (Year/Month)  |
| Geographic Resolution       | Global Robinson projection    | Planet-wide mean (single) |
| Data Contents               | Regional temperature anomaly  | Global average anomaly    |
| Role in Sonification        | OpenCV.js spatial scanning    | Baseline drone / Tempo    |
| Direct Pixel Calibration?   | Requires "vik" colormap LUT   | N/A (Scalar time series)  |
+-----------------------------------------------------------------------------------------+
```

> [!IMPORTANT]
> **The global monthly CSV does NOT provide per-pixel or regional temperature values.**
> - `gistemp-global-monthly.csv` records the single, area-weighted planetary average temperature anomaly for each month from 1880 to the present.
> - `gistemp-2025-map-nosmoothing.png` displays the spatial geographic distribution of anomalies across the globe during 2025.
> - Computer vision spatial scans (Phase 4) must analyze the 2D map.
> - Temporal modulation or baseline drone tuning (Phase 5) may reference the global time-series CSV.

---

### 2.5 CSV File Structure (`gistemp-global-monthly.csv`)

The file represents the **Land-Ocean Temperature Index (L-OTI)**:
- **Line 1:** Header label (`Land-Ocean: Global Means`)
- **Line 2:** Column headers:
  ```csv
  Year,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,J-D,D-N,DJF,MAM,JJA,SON
  ```
- **Lines 3 to 149:** Annual records from 1880 through present.

#### Column Definitions:
- `Year`: Calendar year ($1880$ to $2026$).
- `Jan` – `Dec`: Monthly mean surface temperature anomalies relative to the 1951–1980 base period, reported in degrees Celsius ($^\circ\text{C}$).
- `J-D`: January–December annual mean temperature anomaly.
- `D-N`: December–November meteorological year anomaly (December of previous year through November of current year).
- `DJF`: Boreal winter mean (December, January, February).
- `MAM`: Boreal spring mean (March, April, May).
- `JJA`: Boreal summer mean (June, July, August).
- `SON`: Boreal autumn mean (September, October, November).
- `***`: Missing or uncalculated data (e.g., future months).

#### Sample Records:
```csv
1880,-.19,-.25,-.09,-.16,-.10,-.21,-.18,-.10,-.14,-.23,-.22,-.19,-.17,***,***,-.12,-.17,-.20
1979,.08,-.10,.19,.15,.03,.14,.04,.16,.25,.26,.28,.47,.16,.13,.02,.12,.11,.26
2024,1.25,1.43,1.39,1.31,1.16,1.24,1.20,1.30,1.23,1.34,1.29,1.26,1.28,1.29,1.34,1.29,1.25,1.29
2025,1.37,1.26,1.37,1.24,1.08,1.06,1.02,1.17,1.25,1.19,1.21,1.07,1.19,1.21,1.30,1.23,1.08,1.21
```

---

### 2.6 Cartographic & Colormap Properties

- **Projection:** Robinson Projection. Lines of latitude are parallel straight lines; meridians are curved. Polar regions are depicted with moderate distortion compared to Mercator or Equirectangular projections.
- **Colormap:** Fabio Crameri's *vik* colormap (2018).
  - **Negative Anomalies (Cooler):** Saturated deep blue $\to$ cyan $\to$ pale blue.
  - **Zero / Near-Baseline Anomaly ($0^\circ\text{C}$):** Off-white / neutral cream.
  - **Positive Anomalies (Warmer):** Pale yellow $\to$ amber $\to$ rust red $\to$ deep brown.
  - **Perceptual Uniformity:** Designed so that equal data differences correspond to equal perceived visual differences, avoiding artificial perceptual boundaries.

---

### 2.7 Gridded NetCDF Evaluation for Future Phases

NASA GISS provides a binary $2^\circ \times 2^\circ$ gridded NetCDF file (`gistemp250_GHCNv4.nc.gz`, $\sim 45\text{ MB}$ compressed, $\sim 180\text{ MB}$ uncompressed).
- **Pros:** Contains true floating-point numerical values per latitude/longitude cell for all months since 1880.
- **Cons:** Requires client-side GZIP decompression, HDF5/NetCDF-4 binary format parsing (e.g. `netcdfjs`), and heavy memory overhead ($>60\text{ MB}$ RAM).
- **Architectural Decision:** **Do NOT integrate NetCDF for Phase 3/4 MVP.** The browser-based OpenCV.js pipeline operating on the 1080p visualization map provides low-latency, responsive visual feature extraction without heavy binary parsers. If exact numerical coordinates are required post-MVP, a pre-computed lightweight JSON slice or serverless extract can be evaluated.

---

### 2.8 Scientific Attribution & Citation

When citing or presenting this data within the application:

1. **Visualization Attribution:**
   > NASA's Scientific Visualization Studio. Data provided by Robert B. Schmunk (NASA/GSFC GISS). Scientists: Gavin A. Schmidt, Robert B. Schmunk, Reto A. Ruedy. Visualizer: Mark SubbaRao. SVS ID: 5603 (2026).
2. **Scientific GISTEMP v4 Publications:**
   - Lenssen, N., G.A. Schmidt, M. Hendrickson, P. Jacobs, M. Menne, and R. Ruedy, 2024: *A GISTEMPv4 observational uncertainty ensemble*. J. Geophys. Res. Atmos., 129, no. 17, e2023JD040179, doi:10.1029/2023JD040179.
   - Lenssen, N. et al., 2019: *Improvements in the GISTEMP Uncertainty Model*. J. Geophys. Res. Atmos., 124, 6307-6326.
   - Hansen, J., R. Ruedy, M. Sato, and K. Lo, 2010: *Global surface temperature change*. Rev. Geophys., 48, RG4004, doi:10.1029/2010RG00045.
3. **Colormap Citation:**
   - Crameri, F., 2018: *Scientific colour maps*. Zenodo, doi:10.5281/zenodo.1243862.

---

### 2.9 Computer Vision Image Analysis & Scientific Limitations (Phase 4)

In Phase 4, browser-based OpenCV.js was integrated to analyze the 2025 unsmoothed temperature anomaly map (`gistemp-2025-map-nosmoothing.png`). The extracted metrics are strictly **color-derived visual features** and must not be misinterpreted as calibrated physical temperature readings.

#### Documented Pipeline Characteristics:
1. **Downscaling:** The $1920 \times 1080$ source map is proportionally downscaled on an off-screen HTML5 canvas buffer to a maximum processing width of $512\text{px}$ ($512 \times 288\text{px}$). This maintains real-time execution ($<20\text{ms}$) while preserving spatial gradients.
2. **Grid Partitioning:** Configurable $16 \times 16$ (default: 256 sectors), $8 \times 8$ (64 sectors), or $32 \times 32$ (1024 sectors) spatial matrix.
3. **Feature Extraction:**
   - **Average RGB:** Arithmetic mean of 8-bit color channels per sector.
   - **Average HSV:** Dominant hue angle ($0^\circ$ to $360^\circ$), saturation ($0.0$ to $1.0$), and value ($0.0$ to $1.0$).
   - **Luminance:** Standard Rec. 601 perceptual brightness ($Y = 0.299R + 0.587G + 0.114B$).
   - **Texture Variance:** Standard deviation of pixel intensities within each sector, identifying textural boundaries.
   - **Edge Density:** Mean gradient magnitude computed using Sobel derivative operators ($3 \times 3$ kernel, $x$ and $y$ axes), identifying climate fronts, coastlines, and thermal transitions.

#### Critical Scientific Limitations:
1. **Brightness $\neq$ Temperature:** The Crameri *vik* colormap is a diverging palette where near-zero anomalies are off-white/cream ($Y \approx 0.95$), while strong positive anomalies are deep rust/brown ($Y \approx 0.35$) and negative anomalies are dark blue ($Y \approx 0.25$). Treating luminance as temperature is scientifically invalid.
2. **Canvas Margins vs. Data:** Because the map is rendered in a Robinson projection oval, sectors along the corners and outer edges contain pure white canvas space ($R, G, B > 245$, $S < 0.06$). These are automatically detected and flagged as `isLikelyBackground: true` to prevent false positive sonification triggers.
3. **No Geographic Coordinate Inversion:** The pixel grid coordinates ($X, Y$) do not directly translate to geographic latitude/longitude without explicit Robinson projection inversion equations. Cosine latitude area-weighting is therefore deferred until georeferenced bounding is implemented.
4. **Calibration Curve Pending:** No mathematical Lookup Table (LUT) mapping RGB triplets to exact $^\circ\text{C}$ anomalies has been applied. Until verified against NASA's official colorbar legend points, all values are treated purely as optical parameters.

---

### 2.10 Scientific Time-Series Sonification Specifications (Phase 6)

In Phase 6, a separate empirical sonification mode was implemented using NASA GISTEMP v4 global monthly Land-Ocean Temperature Index data (`gistemp-global-monthly.csv`).

#### Key Data & Musical Parameters:
1. **Scope:** Planet-wide mean surface temperature anomalies from 1880 to 2026 (147 annual records, 1,754 valid monthly records).
2. **Missing Value Enforcement:** NASA's `***` token is parsed strictly as `null`. Missing records are excluded from playback sequences and never coerced to zero.
3. **Climatological Baseline Anchor:** $0.00^\circ\text{C}$ relative to the 1951–1980 base period maps directly to middle C (C4, $261.6\text{ Hz}$) with a sustained C2 baseline root drone.
4. **Bipolar Pitch Mapping:**
   - Negative anomalies ($-0.81^\circ\text{C}$ to $0.00^\circ\text{C}$) descend into bass octaves C2–A3 ($65.4\text{ Hz}$ to $220.0\text{ Hz}$) with rounded, warm low-pass filtering ($500\text{ Hz}$).
   - Positive anomalies ($0.00^\circ\text{C}$ to $+1.48^\circ\text{C}$) ascend through octaves C4–C6 ($261.6\text{ Hz}$ to $1046.5\text{ Hz}$) with dynamic filter opening ($3600\text{ Hz}$).
5. **Timeline Granularity:**
   - **Annual Means:** 146 verified records (1880–2025, 2026 incomplete) sequenced at 8th-note intervals.
   - **Monthly Detailed:** 1,754 verified records sequenced at 16th-note intervals.
6. **Benchmark Records Validated:**
   - All-time record annual warmth: $2024$ ($+1.28^\circ\text{C}$, sonified as A5).
   - All-time record monthly warmth: September $2023$ ($+1.48^\circ\text{C}$, sonified as C6).
   - Coldest calendar year: $1909$ ($-0.49^\circ\text{C}$, sonified as E2).
   - Coldest monthly record: $1893$ ($-0.81^\circ\text{C}$, sonified as C2).
