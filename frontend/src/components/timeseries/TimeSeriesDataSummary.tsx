'use client';

/**
 * NASA GISTEMP Time-Series Data Summary Component
 * Earth Information Jukebox — Phase 6 (Accessibility & Telemetry)
 *
 * Provides a structured, accessible empirical table of the 1880–2026 climate record
 * for users who are deaf, hard-of-hearing, or require an empirical non-auditory digest.
 */

import React, { useMemo } from 'react';
import { GistempParsedData } from '@/types/timeSeries';
import { Eye, Sun, Moon, Calendar, TrendingUp, BarChart2 } from 'lucide-react';

interface TimeSeriesDataSummaryProps {
  readonly data: GistempParsedData;
}

export default function TimeSeriesDataSummary({ data }: TimeSeriesDataSummaryProps) {
  const summaryMetrics = useMemo(() => {
    const { summary, annualTimeline, monthlyTimeline } = data;

    // Decadal averages: 1880s, 1950s, 2010s, 2020s
    const getDecadeAvg = (startDecade: number) => {
      const subset = annualTimeline.filter((d) => d.year >= startDecade && d.year < startDecade + 10);
      if (subset.length === 0) return 0;
      const sum = subset.reduce((acc, curr) => acc + curr.anomaly, 0);
      return Math.round((sum / subset.length) * 100) / 100;
    };

    const decade1880s = getDecadeAvg(1880);
    const decade1950s = getDecadeAvg(1950);
    const decade2010s = getDecadeAvg(2010);
    const decade2020s = getDecadeAvg(2020);

    // Warmest and Coldest single monthly observations
    let minMonth = monthlyTimeline[0];
    let maxMonth = monthlyTimeline[0];
    for (const m of monthlyTimeline) {
      if (m.anomaly < minMonth.anomaly) minMonth = m;
      if (m.anomaly > maxMonth.anomaly) maxMonth = m;
    }

    return {
      decade1880s,
      decade1950s,
      decade2010s,
      decade2020s,
      minMonth,
      maxMonth,
      totalAnnualObservations: annualTimeline.length,
      totalMonthlyObservations: monthlyTimeline.length,
    };
  }, [data]);

  const { summary } = data;

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base p-5 font-mono text-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-biosphere-emerald" />
          <h4 className="font-bold uppercase tracking-wider text-text-primary text-xs">
            Non-Auditory Climate Data Digest (Accessibility & Telemetry)
          </h4>
        </div>
        <span className="text-[10px] text-text-muted uppercase">
          Empirical Digest for Visual / Screen-Reader Inspection
        </span>
      </div>

      {/* Primary Climate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Historical Coverage
          </span>
          <span className="text-text-primary font-bold text-sm">
            {summary.startYear} – {summary.endYear}
          </span>
          <span className="text-biosphere-emerald text-[9px] block mt-0.5">
            {summary.totalYears} Annual Records ({summaryMetrics.totalMonthlyObservations} Months)
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            All-Time Record Warmth
          </span>
          <span className="text-alert-crimson font-bold text-sm">
            +{summary.maxAnnualRecord.anomaly.toFixed(2)} °C
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            Year: {summary.maxAnnualRecord.year} (Annual Mean)
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            All-Time Record Cold
          </span>
          <span className="text-nasa-cyan font-bold text-sm">
            {summary.minAnnualRecord.anomaly.toFixed(2)} °C
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            Year: {summary.minAnnualRecord.year} (Annual Mean)
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Decadal Warming Shift
          </span>
          <span className="text-telemetry-amber font-bold text-sm">
            +{(summaryMetrics.decade2020s - summaryMetrics.decade1880s).toFixed(2)} °C
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            1880s Mean vs 2020s Mean
          </span>
        </div>
      </div>

      {/* Extrema & Key Records Table */}
      <div className="space-y-2">
        <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">
          Key NASA GISTEMP Climatological Benchmarks
        </span>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-hairline text-left text-[11px]">
            <thead>
              <tr className="bg-chassis-panel text-text-muted uppercase text-[9px]">
                <th className="border border-hairline p-2">Benchmark Record</th>
                <th className="border border-hairline p-2">Time Period</th>
                <th className="border border-hairline p-2">Measured Anomaly</th>
                <th className="border border-hairline p-2">Departure from Normal</th>
                <th className="border border-hairline p-2">Sonified Note</th>
              </tr>
            </thead>
            <tbody>
              {/* Warmest Year */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5 text-alert-crimson" />
                  <span>Warmest Calendar Year</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  {summary.maxAnnualRecord.year}
                </td>
                <td className="border border-hairline p-2 font-bold text-alert-crimson">
                  +{summary.maxAnnualRecord.anomaly.toFixed(2)} °C
                </td>
                <td className="border border-hairline p-2 text-text-secondary">
                  +1.28 °C above 1951–1980 baseline
                </td>
                <td className="border border-hairline p-2 font-mono text-nasa-cyan font-bold">
                  A5 (880.0 Hz)
                </td>
              </tr>

              {/* Warmest Single Month */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-telemetry-amber" />
                  <span>Warmest Single Month</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  {summaryMetrics.maxMonth.dateLabel}
                </td>
                <td className="border border-hairline p-2 font-bold text-telemetry-amber">
                  +{summaryMetrics.maxMonth.anomaly.toFixed(2)} °C
                </td>
                <td className="border border-hairline p-2 text-text-secondary">
                  +1.48 °C monthly planetary mean
                </td>
                <td className="border border-hairline p-2 font-mono text-nasa-cyan font-bold">
                  C6 (1046.5 Hz)
                </td>
              </tr>

              {/* Coldest Year */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-nasa-cyan" />
                  <span>Coldest Calendar Year</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  {summary.minAnnualRecord.year}
                </td>
                <td className="border border-hairline p-2 font-bold text-nasa-cyan">
                  {summary.minAnnualRecord.anomaly.toFixed(2)} °C
                </td>
                <td className="border border-hairline p-2 text-text-secondary">
                  0.49 °C below baseline
                </td>
                <td className="border border-hairline p-2 font-mono text-nasa-cyan font-bold">
                  E2 (82.4 Hz)
                </td>
              </tr>

              {/* Baseline Period */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-biosphere-emerald" />
                  <span>Climatological Baseline</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  1951–1980 (30-year average)
                </td>
                <td className="border border-hairline p-2 font-bold text-biosphere-emerald">
                  0.00 °C
                </td>
                <td className="border border-hairline p-2 text-text-secondary">
                  Reference zero anchor
                </td>
                <td className="border border-hairline p-2 font-mono text-nasa-cyan font-bold">
                  C4 (261.6 Hz)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
