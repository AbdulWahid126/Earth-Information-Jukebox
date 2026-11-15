/**
 * NASA GISTEMP v4 CSV Parser
 * Earth Information Jukebox — Phase 6
 *
 * Client-side parser for official NASA GISS Land-Ocean Temperature Index (GLB.Ts+dSST.csv).
 * Strictly preserves scientific Celsius anomaly observations and handles missing data (***).
 */

import { 
  AnnualAnomalyRecord, 
  MonthlyAnomalyRecord, 
  GistempParsedData, 
  GistempDatasetSummary 
} from '@/types/timeSeries';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

/**
 * Safely parses a float from the NASA CSV token.
 * NASA CSV uses '***' for missing observations and short forms like '-.19' or '.02'.
 */
function parseAnomalyToken(token: string | undefined): number | null {
  if (!token) return null;
  const trimmed = token.trim();
  if (trimmed === '***' || trimmed === '' || trimmed === 'NA') {
    return null;
  }
  const val = parseFloat(trimmed);
  return isNaN(val) ? null : val;
}

/**
 * Parses the raw text of gistemp-global-monthly.csv.
 */
export function parseGistempCsv(csvText: string): GistempParsedData {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  
  if (lines.length < 3) {
    throw new Error('Invalid NASA GISTEMP CSV: File is empty or truncated.');
  }

  // Row 0 is descriptive title ("Land-Ocean: Global Means")
  // Row 1 is header ("Year,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,J-D,D-N,DJF,MAM,JJA,SON")
  const dataLines = lines.slice(2);

  const records: AnnualAnomalyRecord[] = [];
  const monthlyTimeline: MonthlyAnomalyRecord[] = [];
  const annualTimeline: { year: number; anomaly: number }[] = [];

  let globalMin = Infinity;
  let globalMax = -Infinity;
  let minAnnual = { year: 0, anomaly: Infinity };
  let maxAnnual = { year: 0, anomaly: -Infinity };
  let validMonthlyCount = 0;
  let missingMonthlyCount = 0;

  for (const line of dataLines) {
    const parts = line.split(',');
    if (parts.length < 14) continue;

    const year = parseInt(parts[0].trim(), 10);
    if (isNaN(year) || year < 1800 || year > 2100) continue;

    // Monthly values (Jan to Dec, indices 1 to 12)
    const monthlyAnomalies: (number | null)[] = [];
    for (let m = 0; m < 12; m++) {
      const val = parseAnomalyToken(parts[m + 1]);
      monthlyAnomalies.push(val);

      if (val !== null) {
        validMonthlyCount++;
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;

        monthlyTimeline.push({
          year,
          monthIndex: m,
          monthName: MONTH_NAMES[m],
          anomaly: val,
          dateLabel: `${MONTH_NAMES[m]} ${year}`,
        });
      } else {
        missingMonthlyCount++;
      }
    }

    // Annual mean (J-D, index 13)
    const annualMean = parseAnomalyToken(parts[13]);
    if (annualMean !== null) {
      annualTimeline.push({ year, anomaly: annualMean });
      if (annualMean < minAnnual.anomaly) minAnnual = { year, anomaly: annualMean };
      if (annualMean > maxAnnual.anomaly) maxAnnual = { year, anomaly: annualMean };
    }

    // Meteorological year (D-N, index 14)
    const metAnnualMean = parseAnomalyToken(parts[14]);

    // Seasonal (DJF, MAM, JJA, SON, indices 15 to 18)
    const djf = parseAnomalyToken(parts[15]);
    const mam = parseAnomalyToken(parts[16]);
    const jja = parseAnomalyToken(parts[17]);
    const son = parseAnomalyToken(parts[18]);

    records.push({
      year,
      monthlyAnomalies,
      annualMean,
      metAnnualMean,
      seasonal: { djf, mam, jja, son },
    });
  }

  if (records.length === 0) {
    throw new Error('No valid temperature anomaly records could be parsed.');
  }

  const startYear = records[0].year;
  const endYear = records[records.length - 1].year;

  const summary: GistempDatasetSummary = {
    totalYears: records.length,
    startYear,
    endYear,
    baselinePeriod: '1951–1980',
    unit: '°C (Celsius anomaly)',
    minAnomaly: globalMin === Infinity ? 0 : globalMin,
    maxAnomaly: globalMax === -Infinity ? 0 : globalMax,
    minAnnualRecord: minAnnual.anomaly === Infinity ? { year: 0, anomaly: 0 } : minAnnual,
    maxAnnualRecord: maxAnnual.anomaly === -Infinity ? { year: 0, anomaly: 0 } : maxAnnual,
    validMonthlyCount,
    missingMonthlyCount,
  };

  return {
    records,
    monthlyTimeline,
    annualTimeline,
    summary,
  };
}

let cachedData: GistempParsedData | null = null;

/**
 * Fetches and parses the bundled NASA GISTEMP CSV asset in browser.
 */
export async function loadGistempData(): Promise<GistempParsedData> {
  if (cachedData) return cachedData;

  const response = await fetch('/assets/datasets/temperature/gistemp-global-monthly.csv');
  if (!response.ok) {
    throw new Error(`Failed to load NASA GISTEMP CSV (HTTP ${response.status})`);
  }
  const text = await response.text();
  cachedData = parseGistempCsv(text);
  return cachedData;
}
