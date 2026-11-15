'use client';

/**
 * Non-Audio Feature Summary Component
 * Earth Information Jukebox — Phase 5 (Accessibility & Scientific Telemetry)
 *
 * Provides a structured, accessible textual and tabular summary of all regional
 * features extracted from the NASA visualization for users who are deaf, hard-of-hearing,
 * or prefer an empirical non-auditory data digest.
 */

import React, { useMemo } from 'react';
import { GridAnalysisResult, RegionalVisualFeatures } from '@/types/cv';
import { 
  BarChart3, 
  CheckCircle2, 
  Layers, 
  Sun, 
  Moon, 
  Activity, 
  Compass, 
  Eye
} from 'lucide-react';

interface NonAudioFeatureSummaryProps {
  readonly result: GridAnalysisResult;
}

export default function NonAudioFeatureSummary({ result }: NonAudioFeatureSummaryProps) {
  const analysisSummary = useMemo(() => {
    const activeSectors = result.sectors.filter((s) => !s.isLikelyBackground);
    if (activeSectors.length === 0) return null;

    let minLumSector = activeSectors[0];
    let maxLumSector = activeSectors[0];
    let maxEdgeSector = activeSectors[0];
    let maxVarianceSector = activeSectors[0];

    for (const s of activeSectors) {
      if (s.luminance < minLumSector.luminance) minLumSector = s;
      if (s.luminance > maxLumSector.luminance) maxLumSector = s;
      if (s.edgeDensity > maxEdgeSector.edgeDensity) maxEdgeSector = s;
      if (s.colorVariance > maxVarianceSector.colorVariance) maxVarianceSector = s;
    }

    const highEdgeCount = activeSectors.filter((s) => s.edgeDensity > 0.15).length;
    const warmToneCount = activeSectors.filter((s) => s.averageRgb.r > s.averageRgb.b).length;
    const coolToneCount = activeSectors.length - warmToneCount;

    return {
      totalSectors: result.sectors.length,
      activeSectorsCount: activeSectors.length,
      backgroundCount: result.sectors.length - activeSectors.length,
      minLumSector,
      maxLumSector,
      maxEdgeSector,
      maxVarianceSector,
      highEdgeCount,
      warmToneCount,
      coolToneCount,
      warmPercentage: Math.round((warmToneCount / activeSectors.length) * 100),
      coolPercentage: Math.round((coolToneCount / activeSectors.length) * 100),
    };
  }, [result]);

  if (!analysisSummary) return null;

  return (
    <div className="rounded-sm border border-hairline bg-chassis-base p-5 font-mono text-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-biosphere-emerald" />
          <h4 className="font-bold uppercase tracking-wider text-text-primary text-xs">
            Non-Auditory Planetary Feature Summary (Accessibility & Telemetry)
          </h4>
        </div>
        <span className="text-[10px] text-text-muted uppercase">
          Empirical Digest for Visual / Screen-Reader Inspection
        </span>
      </div>

      {/* Primary Planetary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Data Coverage
          </span>
          <span className="text-text-primary font-bold text-sm">
            {analysisSummary.activeSectorsCount} / {analysisSummary.totalSectors}
          </span>
          <span className="text-biosphere-emerald text-[9px] block mt-0.5">
            {Math.round((analysisSummary.activeSectorsCount / analysisSummary.totalSectors) * 100)}% Planetary Area
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Global Luminance
          </span>
          <span className="text-text-primary font-bold text-sm">
            {result.globalStatistics.meanGlobalLuminance}
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            Range: {analysisSummary.minLumSector.luminance} – {analysisSummary.maxLumSector.luminance}
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Thermal Front Complexity
          </span>
          <span className="text-telemetry-amber font-bold text-sm">
            {analysisSummary.highEdgeCount} Sectors
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            Sobel Edge Density &gt; 0.15
          </span>
        </div>

        <div className="rounded-xs border border-hairline bg-chassis-panel p-3">
          <span className="text-text-muted text-[9px] uppercase tracking-wider block mb-1">
            Visual Spectral Balance
          </span>
          <span className="text-nasa-cyan font-bold text-sm">
            {analysisSummary.warmPercentage}% Warm / {analysisSummary.coolPercentage}% Cool
          </span>
          <span className="text-text-muted text-[9px] block mt-0.5">
            Crameri &quot;vik&quot; palette distribution
          </span>
        </div>
      </div>

      {/* Salient Planetary Features Table */}
      <div className="space-y-2">
        <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">
          Key Geographic / Grid Sector Extrema
        </span>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-hairline text-left text-[11px]">
            <thead>
              <tr className="bg-chassis-panel text-text-muted uppercase text-[9px]">
                <th className="border border-hairline p-2">Extremum Category</th>
                <th className="border border-hairline p-2">Grid Coordinates</th>
                <th className="border border-hairline p-2">Normalized Pos</th>
                <th className="border border-hairline p-2">Luminance</th>
                <th className="border border-hairline p-2">Variance</th>
                <th className="border border-hairline p-2">Edge Density</th>
                <th className="border border-hairline p-2">Color Swatch</th>
              </tr>
            </thead>
            <tbody>
              {/* Brightest Sector */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Sun className="h-3 w-3 text-telemetry-amber" />
                  <span>Maximum Luminance</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  [Col: {analysisSummary.maxLumSector.coordinates.colIndex}, Row: {analysisSummary.maxLumSector.coordinates.rowIndex}]
                </td>
                <td className="border border-hairline p-2 text-text-muted">
                  ({analysisSummary.maxLumSector.coordinates.normalizedX}, {analysisSummary.maxLumSector.coordinates.normalizedY})
                </td>
                <td className="border border-hairline p-2 font-bold text-nasa-cyan">
                  {analysisSummary.maxLumSector.luminance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxLumSector.colorVariance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxLumSector.edgeDensity}
                </td>
                <td className="border border-hairline p-2">
                  <span
                    className="inline-block h-3.5 w-6 rounded-xs border border-hairline align-middle"
                    style={{
                      backgroundColor: `rgb(${analysisSummary.maxLumSector.averageRgb.r}, ${analysisSummary.maxLumSector.averageRgb.g}, ${analysisSummary.maxLumSector.averageRgb.b})`,
                    }}
                  />
                </td>
              </tr>

              {/* Darkest Sector */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Moon className="h-3 w-3 text-nasa-cyan" />
                  <span>Minimum Luminance</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  [Col: {analysisSummary.minLumSector.coordinates.colIndex}, Row: {analysisSummary.minLumSector.coordinates.rowIndex}]
                </td>
                <td className="border border-hairline p-2 text-text-muted">
                  ({analysisSummary.minLumSector.coordinates.normalizedX}, {analysisSummary.minLumSector.coordinates.normalizedY})
                </td>
                <td className="border border-hairline p-2 font-bold text-text-muted">
                  {analysisSummary.minLumSector.luminance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.minLumSector.colorVariance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.minLumSector.edgeDensity}
                </td>
                <td className="border border-hairline p-2">
                  <span
                    className="inline-block h-3.5 w-6 rounded-xs border border-hairline align-middle"
                    style={{
                      backgroundColor: `rgb(${analysisSummary.minLumSector.averageRgb.r}, ${analysisSummary.minLumSector.averageRgb.g}, ${analysisSummary.minLumSector.averageRgb.b})`,
                    }}
                  />
                </td>
              </tr>

              {/* Highest Edge Complexity Sector */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-alert-crimson" />
                  <span>Maximum Gradient (Sobel Edge)</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  [Col: {analysisSummary.maxEdgeSector.coordinates.colIndex}, Row: {analysisSummary.maxEdgeSector.coordinates.rowIndex}]
                </td>
                <td className="border border-hairline p-2 text-text-muted">
                  ({analysisSummary.maxEdgeSector.coordinates.normalizedX}, {analysisSummary.maxEdgeSector.coordinates.normalizedY})
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxEdgeSector.luminance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxEdgeSector.colorVariance}
                </td>
                <td className="border border-hairline p-2 font-bold text-alert-crimson">
                  {analysisSummary.maxEdgeSector.edgeDensity}
                </td>
                <td className="border border-hairline p-2">
                  <span
                    className="inline-block h-3.5 w-6 rounded-xs border border-hairline align-middle"
                    style={{
                      backgroundColor: `rgb(${analysisSummary.maxEdgeSector.averageRgb.r}, ${analysisSummary.maxEdgeSector.averageRgb.g}, ${analysisSummary.maxEdgeSector.averageRgb.b})`,
                    }}
                  />
                </td>
              </tr>

              {/* Highest Texture Variance Sector */}
              <tr className="hover:bg-chassis-panel/50">
                <td className="border border-hairline p-2 font-bold text-text-primary flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-biosphere-emerald" />
                  <span>Maximum Texture Variance</span>
                </td>
                <td className="border border-hairline p-2 font-semibold">
                  [Col: {analysisSummary.maxVarianceSector.coordinates.colIndex}, Row: {analysisSummary.maxVarianceSector.coordinates.rowIndex}]
                </td>
                <td className="border border-hairline p-2 text-text-muted">
                  ({analysisSummary.maxVarianceSector.coordinates.normalizedX}, {analysisSummary.maxVarianceSector.coordinates.normalizedY})
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxVarianceSector.luminance}
                </td>
                <td className="border border-hairline p-2 font-bold text-biosphere-emerald">
                  {analysisSummary.maxVarianceSector.colorVariance}
                </td>
                <td className="border border-hairline p-2">
                  {analysisSummary.maxVarianceSector.edgeDensity}
                </td>
                <td className="border border-hairline p-2">
                  <span
                    className="inline-block h-3.5 w-6 rounded-xs border border-hairline align-middle"
                    style={{
                      backgroundColor: `rgb(${analysisSummary.maxVarianceSector.averageRgb.r}, ${analysisSummary.maxVarianceSector.averageRgb.g}, ${analysisSummary.maxVarianceSector.averageRgb.b})`,
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
