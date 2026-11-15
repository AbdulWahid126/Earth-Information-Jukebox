/**
 * NASA GISTEMP Time-Series Data & Sonification Types
 * Earth Information Jukebox — Phase 6
 */

export interface MonthlyAnomalyRecord {
  readonly year: number;
  readonly monthIndex: number; // 0 = Jan, 11 = Dec
  readonly monthName: string; // 'Jan', 'Feb', ...
  readonly anomaly: number; // in degrees Celsius relative to 1951-1980
  readonly dateLabel: string; // e.g. "Jan 1880"
}

export interface AnnualAnomalyRecord {
  readonly year: number;
  readonly monthlyAnomalies: readonly (number | null)[]; // 12 entries (Jan-Dec), null if missing (***)
  readonly annualMean: number | null; // J-D column, null if missing (***)
  readonly metAnnualMean: number | null; // D-N column
  readonly seasonal: {
    readonly djf: number | null;
    readonly mam: number | null;
    readonly jja: number | null;
    readonly son: number | null;
  };
}

export interface GistempDatasetSummary {
  readonly totalYears: number;
  readonly startYear: number;
  readonly endYear: number;
  readonly baselinePeriod: string;
  readonly unit: string;
  readonly minAnomaly: number;
  readonly maxAnomaly: number;
  readonly minAnnualRecord: { readonly year: number; readonly anomaly: number };
  readonly maxAnnualRecord: { readonly year: number; readonly anomaly: number };
  readonly validMonthlyCount: number;
  readonly missingMonthlyCount: number;
}

export interface GistempParsedData {
  readonly records: readonly AnnualAnomalyRecord[];
  readonly monthlyTimeline: readonly MonthlyAnomalyRecord[];
  readonly annualTimeline: readonly { readonly year: number; readonly anomaly: number }[];
  readonly summary: GistempDatasetSummary;
}

export type TimeSeriesPlaybackGranularity = 'annual' | 'monthly';

export interface TimeSeriesSonificationEvent {
  readonly index: number;
  readonly year: number;
  readonly monthName?: string;
  readonly anomalyCelsius: number;
  readonly pitch: string; // e.g. 'C4'
  readonly frequencyHz: number;
  readonly duration: string;
  readonly velocity: number;
  readonly filterCutoffHz: number;
  readonly label: string; // e.g. "1998 (+0.61 °C)" or "Jul 2023 (+1.19 °C)"
}

export interface TimeSeriesSonificationConfig {
  readonly granularity: TimeSeriesPlaybackGranularity;
  readonly tempoBpm: number;
  readonly playbackSpeed: number; // 0.5x, 1x, 1.5x, 2x
  readonly masterVolumeDb: number;
  readonly enableDrone: boolean;
  readonly selectedYear: number;
}
