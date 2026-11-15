import { DatasetMetadata } from '@/types/dataset';

export const NASA_DATASETS: readonly DatasetMetadata[] = [
  {
    id: 'gistemp-temperature',
    title: 'NASA GISTEMP v4 — Global Temperature Anomalies',
    shortTitle: 'Global Temperature',
    category: 'Atmosphere',
    description:
      'Global surface air temperature and sea surface temperature anomalies for the year 2025 relative to the 1951–1980 climatological baseline. This unsmoothed spatial composite highlights regional temperature variance without smoothing interpolation.',
    scientificSummary:
      'GISTEMP v4 merges surface air temperatures from meteorological land stations (NOAA GHCN v4) with sea surface temperature measurements from buoys and ships (ERSST v5). The spatial map reflects the Robinson projection using the perceptually uniform "vik" colormap, while the companion CSV provides monthly planetary mean anomaly series dating from 1880 to the present.',
    availability: 'available',

    // Provenance
    datasetVersion: 'GISTEMP v4',
    year: 2025,
    temporalCoverage: '1880–2026 (Monthly CSV) / 2025 (Annual Spatial Map)',
    sensor: 'NOAA GHCNv4 (Land Stations) + ERSSTv5 (Ocean Areas)',
    laboratory: 'NASA Goddard Institute for Space Studies (GISS) / SVS',
    nasaSourceUrl: 'https://data.giss.nasa.gov/gistemp/',
    nasaSvsUrl: 'https://svs.gsfc.nasa.gov/5603/',
    attribution:
      "NASA's Scientific Visualization Studio. Data provided by Robert B. Schmunk (NASA/GSFC GISS). Scientists: Gavin A. Schmidt, Robert B. Schmunk, Reto A. Ruedy. Visualizer: Mark SubbaRao. SVS ID: 5603.",
    citations: [
      {
        authors: 'Lenssen, N., G.A. Schmidt, M. Hendrickson, P. Jacobs, M. Menne, and R. Ruedy',
        year: 2024,
        title: 'A GISTEMPv4 observational uncertainty ensemble',
        publication: 'J. Geophys. Res. Atmos., 129, no. 17, e2023JD040179',
        doi: '10.1029/2023JD040179',
      },
      {
        authors: 'Crameri, F.',
        year: 2018,
        title: 'Scientific colour maps',
        publication: 'Zenodo',
        doi: '10.5281/zenodo.1243862',
      },
    ],

    // Assets
    modality: 'hybrid_composite',
    imageAssetPath: '/assets/visualizations/temperature/gistemp-2025-map-nosmoothing.png',
    thumbnailPath: '/assets/visualizations/temperature-anomaly.jpg',
    csvAssetPath: '/assets/datasets/temperature/gistemp-global-monthly.csv',

    // Physics & Projection
    unit: '°C (Temperature Anomaly)',
    baselinePeriod: '1951–1980 Baseline Period',
    mapProjection: 'Robinson Projection',
    colormapName: 'vik (Crameri, 2018)',
    colormapDescription:
      'Diverging, perceptually uniform palette: deep blue (cold anomaly) through white (0°C baseline) to rust-red (warm anomaly).',

    // Integrity
    isCalibrated: false,
    notesOnCalibration:
      'Colormap "vik" calibration curve pending Phase 4 validation. Pixel intensities cannot be directly converted to exact degrees without verifying the LUT mapping across the Robinson map boundary.',
    limitations: [
      'The companion CSV contains global planetary mean anomalies and does NOT provide per-pixel regional values.',
      'Unsmoothed spatial version leaves high-latitude cells with sparse coverage un-interpolated.',
      'Robinson projection distorts high-latitude surface areas relative to equatorial regions.',
    ],
  },
  {
    id: 'sea-level-dynamics',
    title: 'Sea Level & Polar Ice Dynamics',
    shortTitle: 'Sea Level',
    category: 'Cryosphere',
    description:
      'Global sea surface height variations and ice-mass redistribution measured by multi-mission satellite radar altimetry.',
    scientificSummary:
      'Precision radar altimetry records millimeter-scale ocean height topography, documenting thermal expansion and ice sheet meltwater displacement.',
    availability: 'coming_soon',

    datasetVersion: 'Sentinel-6 / Jason-3 Altimetry',
    year: 'Multi-decadal',
    temporalCoverage: '1992–Present',
    sensor: 'Poseidon-4 Radar Altimeter',
    laboratory: 'NASA Jet Propulsion Laboratory (JPL) / CNES / EUMETSAT',
    nasaSourceUrl: 'https://sealevel.jpl.nasa.gov/',
    attribution: 'NASA Jet Propulsion Laboratory (JPL) / Physical Oceanography DAAC.',
    citations: [],

    modality: 'spatial_visualization',
    imageAssetPath: '/assets/visualizations/sea-level.jpg',
    thumbnailPath: '/assets/visualizations/sea-level.jpg',

    unit: 'mm (Sea Surface Height Anomaly)',
    baselinePeriod: '1993–2008 Mean Sea Surface',
    mapProjection: 'Mollweide Projection',
    colormapName: 'Altimetry Diverging',

    isCalibrated: false,
    notesOnCalibration: 'Dataset integration scheduled for future phase.',
    limitations: ['Dataset pending Phase 3 expansion.'],
  },
  {
    id: 'perpetual-ocean-currents',
    title: 'Perpetual Ocean Surface Circulation',
    shortTitle: 'Ocean Currents',
    category: 'Hydrosphere',
    description:
      'High-resolution ocean circulation simulation tracing surface kinetic flow, western boundary currents, and mesoscale eddies.',
    scientificSummary:
      'Generated by the Estimating the Circulation and Climate of the Ocean, Phase II (ECCO2) model, synthesizing satellite sea surface height, wind stress, and temperature telemetry.',
    availability: 'coming_soon',

    datasetVersion: 'ECCO2 Cube92 Model Simulation',
    year: 'Climatological Synthesis',
    temporalCoverage: '2005–2007 High-Res Synthesis',
    sensor: 'Multi-Satellite Telemetry + Global General Circulation Model',
    laboratory: 'NASA Jet Propulsion Laboratory (JPL) / GSFC',
    nasaSourceUrl: 'https://ecco-group.org/',
    attribution: 'NASA / Goddard Space Flight Center Scientific Visualization Studio.',
    citations: [],

    modality: 'spatial_visualization',
    imageAssetPath: '/assets/visualizations/ocean-currents.jpg',
    thumbnailPath: '/assets/visualizations/ocean-currents.jpg',

    unit: 'm/s (Kinematic Current Velocity)',
    mapProjection: 'Equirectangular / Robinson',
    colormapName: 'Streamline Velocity Colormap',

    isCalibrated: false,
    notesOnCalibration: 'Dataset integration scheduled for future phase.',
    limitations: ['Simulation model output, pending Phase 3 expansion.'],
  },
] as const;

export function getDatasetById(id: string): DatasetMetadata | undefined {
  return NASA_DATASETS.find((dataset) => dataset.id === id);
}

export function getAvailableDatasets(): readonly DatasetMetadata[] {
  return NASA_DATASETS.filter((dataset) => dataset.availability === 'available');
}
