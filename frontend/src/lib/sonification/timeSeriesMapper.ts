/**
 * NASA GISTEMP Time-Series Sonification Parameter Mapper
 * Earth Information Jukebox — Phase 6
 *
 * Mathematically maps empirical Celsius temperature anomalies (°C)
 * relative to the 1951-1980 baseline to strictly calibrated musical pitch,
 * harmonic registers, and filter brightness.
 */

import { 
  GistempParsedData, 
  TimeSeriesSonificationEvent, 
  TimeSeriesPlaybackGranularity 
} from '@/types/timeSeries';
import { noteToFrequency } from './scales';

// 4-octave Pentatonic Scale spanning deep baseline cold up to modern high anomalies
// C4 (index 10) represents the 0.0 °C climatological baseline.
const TIME_SERIES_SCALE = [
  'C2', 'D2', 'E2', 'G2', 'A2', // Extreme historical cold (-0.8 °C to -0.5 °C)
  'C3', 'D3', 'E3', 'G3', 'A3', // Moderate cold (-0.5 °C to -0.05 °C)
  'C4',                         // Zero baseline anchor (1951-1980 normal: 0.0 °C)
  'D4', 'E4', 'G4', 'A4',       // Initial warming (+0.1 °C to +0.5 °C)
  'C5', 'D5', 'E5', 'G5', 'A5', // Accelerated warming (+0.5 °C to +1.0 °C)
  'C6',                         // Severe anomaly (+1.0 °C to +1.5 °C)
] as const;

const BASELINE_NOTE_INDEX = 10; // 'C4' = 0.0 °C

/**
 * Normalizes a temperature anomaly in Celsius into a discrete note on the calibrated scale.
 * Min reference: -0.80 °C
 * Baseline: 0.00 °C
 * Max reference: +1.40 °C
 */
export function mapAnomalyToPitch(anomalyCelsius: number): { pitch: string; frequencyHz: number } {
  let noteIndex: number;

  if (anomalyCelsius <= 0) {
    // Negative anomaly: map [-0.80, 0.0] to [0, 10]
    const ratio = Math.max(0, Math.min(1, (anomalyCelsius - (-0.80)) / 0.80));
    noteIndex = Math.min(BASELINE_NOTE_INDEX, Math.floor(ratio * BASELINE_NOTE_INDEX));
  } else {
    // Positive anomaly: map [0.0, +1.40] to [10, 20]
    const positiveSpan = TIME_SERIES_SCALE.length - 1 - BASELINE_NOTE_INDEX;
    const ratio = Math.max(0, Math.min(1, anomalyCelsius / 1.40));
    noteIndex = Math.min(
      TIME_SERIES_SCALE.length - 1,
      BASELINE_NOTE_INDEX + Math.ceil(ratio * positiveSpan)
    );
  }

  const pitch = TIME_SERIES_SCALE[noteIndex];
  const frequencyHz = Math.round(noteToFrequency(pitch) * 10) / 10;
  return { pitch, frequencyHz };
}

/**
 * Maps Celsius anomaly to dynamic low-pass filter cutoff (500 Hz to 3600 Hz).
 * Colder years sound rounded and warm; modern warming opens high harmonics.
 */
export function mapAnomalyToFilterCutoff(anomalyCelsius: number): number {
  // Normalize between -0.8 °C (500 Hz) and +1.4 °C (3600 Hz)
  const norm = Math.max(0, Math.min(1, (anomalyCelsius + 0.8) / 2.2));
  return Math.round(500 + norm * 3100);
}

/**
 * Generates an ordered timeline of SonificationEvents for time-series playback.
 */
export function generateTimeSeriesEvents(
  data: GistempParsedData,
  granularity: TimeSeriesPlaybackGranularity = 'annual'
): TimeSeriesSonificationEvent[] {
  if (granularity === 'annual') {
    return data.annualTimeline.map((item, index) => {
      const { pitch, frequencyHz } = mapAnomalyToPitch(item.anomaly);
      const filterCutoffHz = mapAnomalyToFilterCutoff(item.anomaly);
      const sign = item.anomaly >= 0 ? '+' : '';
      const formatted = `${sign}${item.anomaly.toFixed(2)} °C`;

      return {
        index,
        year: item.year,
        anomalyCelsius: item.anomaly,
        pitch,
        frequencyHz,
        duration: '8n',
        velocity: Math.min(0.85, 0.45 + Math.abs(item.anomaly) * 0.25),
        filterCutoffHz,
        label: `${item.year}: ${formatted}`,
      };
    });
  }

  // Monthly timeline
  return data.monthlyTimeline.map((item, index) => {
    const { pitch, frequencyHz } = mapAnomalyToPitch(item.anomaly);
    const filterCutoffHz = mapAnomalyToFilterCutoff(item.anomaly);
    const sign = item.anomaly >= 0 ? '+' : '';
    const formatted = `${sign}${item.anomaly.toFixed(2)} °C`;

    return {
      index,
      year: item.year,
      monthName: item.monthName,
      anomalyCelsius: item.anomaly,
      pitch,
      frequencyHz,
      duration: '16n',
      velocity: Math.min(0.85, 0.45 + Math.abs(item.anomaly) * 0.25),
      filterCutoffHz,
      label: `${item.dateLabel}: ${formatted}`,
    };
  });
}
