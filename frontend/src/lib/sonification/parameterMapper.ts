/**
 * Sonification Parameter Mapper
 * Earth Information Jukebox — Phase 5
 *
 * Maps extracted regional visual features (RGB, HSV, luminance, variance, edge density)
 * to deterministic, harmonious musical events.
 */

import { GridAnalysisResult, RegionalVisualFeatures } from '@/types/cv';
import { 
  SonificationEvent, 
  SonificationMappingConfig, 
  MusicalScaleId,
  TraversalMode 
} from '@/types/sonification';
import { MUSICAL_SCALES, noteToFrequency, quantizeValueToScale } from './scales';

export const DEFAULT_MAPPING_CONFIG: SonificationMappingConfig = {
  scaleId: 'pentatonic_major',
  traversalMode: 'column_sweep',
  tempoBpm: 120,
  baseOctave: 3,
  rootDroneNote: 'C2',
  enableLeadSynth: true,
  enableDroneSynth: true,
  enableAtmosphereNoise: true,
  masterVolumeDb: -3,
  playbackSpeed: 1.0,
};

/**
 * Orders sectors according to selected planetary traversal mode.
 */
export function orderSectors(
  sectors: readonly RegionalVisualFeatures[],
  cols: number,
  rows: number,
  mode: TraversalMode
): RegionalVisualFeatures[] {
  const result: RegionalVisualFeatures[] = [];

  if (mode === 'column_sweep') {
    // Sweep longitude West-to-East (columns), then latitude North-to-South (rows)
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const sector = sectors.find(
          (s) => s.coordinates.colIndex === c && s.coordinates.rowIndex === r
        );
        if (sector) result.push(sector);
      }
    }
  } else if (mode === 'boustrophedon') {
    // Alternating rows (snake scan)
    for (let r = 0; r < rows; r++) {
      const isReverse = r % 2 === 1;
      const rowSectors = sectors.filter((s) => s.coordinates.rowIndex === r);
      rowSectors.sort((a, b) => 
        isReverse 
          ? b.coordinates.colIndex - a.coordinates.colIndex 
          : a.coordinates.colIndex - b.coordinates.colIndex
      );
      result.push(...rowSectors);
    }
  } else {
    // Default 'raster': row-by-row top-to-bottom
    result.push(...sectors);
  }

  return result;
}

/**
 * Translates a complete GridAnalysisResult into a deterministic timeline of SonificationEvents.
 */
export function generateSonificationSequence(
  analysis: GridAnalysisResult,
  config: SonificationMappingConfig = DEFAULT_MAPPING_CONFIG
): SonificationEvent[] {
  const scaleDef = MUSICAL_SCALES[config.scaleId] ?? MUSICAL_SCALES.pentatonic_major;
  const orderedSectors = orderSectors(
    analysis.sectors,
    analysis.gridConfig.columns,
    analysis.gridConfig.rows,
    config.traversalMode
  );

  return orderedSectors.map((sector, index) => {
    const isBackground = sector.isLikelyBackground;

    // 1. Pitch Mapping: Map sector luminance (0.0 to 1.0) into the selected scale
    // Invert slightly or clamp to keep within comfortable ear frequencies
    const normalizedPitchVal = Math.max(0, Math.min(1, sector.luminance));
    const pitch = quantizeValueToScale(normalizedPitchVal, scaleDef.notes);
    const frequencyHz = Math.round(noteToFrequency(pitch) * 10) / 10;

    // 2. Velocity / Volume: Map intensity (saturation & value) to note velocity
    // Background canvas sectors have 0 velocity (inaudible)
    let velocity = 0;
    if (!isBackground) {
      // Dynamic range between 0.35 (gentle) and 0.85 (prominent)
      const intensity = 0.5 * sector.averageHsv.v + 0.5 * (1 - Math.abs(0.5 - sector.luminance) * 2);
      velocity = Math.round((0.35 + intensity * 0.5) * 100) / 100;
    }

    // 3. Stereo Panning: Map horizontal sector coordinate to stereo field [-0.85, +0.85]
    const pan = Math.round((-0.85 + sector.coordinates.normalizedX * 1.7) * 100) / 100;

    // 4. Timbre / Filter Cutoff: Map color variance and saturation to Low-Pass Filter Cutoff
    // Smooth, uniform regions have warm muted tones (~500 Hz); high-variance turbulent regions open up to 3500 Hz
    const varianceFactor = Math.min(1, sector.colorVariance / 40);
    const filterCutoffHz = Math.round(500 + varianceFactor * 2500 + sector.averageHsv.s * 1000);

    // 5. Atmosphere Noise: Map Sobel Edge Density to subtle white/pink noise intensity
    const noiseIntensity = isBackground ? 0 : Math.round(Math.min(1, sector.edgeDensity * 1.5) * 100) / 100;

    return {
      index,
      sectorIndex: sector.coordinates.rowIndex * analysis.gridConfig.columns + sector.coordinates.colIndex,
      coordinates: sector.coordinates,
      pitch,
      frequencyHz,
      duration: '16n',
      velocity,
      pan,
      filterCutoffHz,
      noiseIntensity,
      isBackground,
      visualFeatures: sector,
    };
  });
}
