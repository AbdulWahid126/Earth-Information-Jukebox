'use client';

/**
 * Interactive NASA GISTEMP Time-Series Chart Component
 * Earth Information Jukebox — Phase 6
 *
 * Lightweight, zero-dependency SVG visualization rendering 1880–2026 global temperature anomalies.
 * Features zero-baseline reference, temperature color coding, hover cursor probe,
 * and sample-accurate synchronization with live audio playback.
 */

import React, { useState, useRef, useMemo } from 'react';
import { GistempParsedData, TimeSeriesSonificationEvent } from '@/types/timeSeries';
import { mapAnomalyToPitch } from '@/lib/sonification/timeSeriesMapper';

interface TimeSeriesChartProps {
  readonly data: GistempParsedData;
  readonly currentEvent: TimeSeriesSonificationEvent | null;
  readonly isPlaying: boolean;
  readonly onSelectYear: (year: number) => void;
}

export default function TimeSeriesChart({
  data,
  currentEvent,
  isPlaying,
  onSelectYear,
}: TimeSeriesChartProps) {
  const [hoveredYear, setHoveredYear] = useState<{
    year: number;
    anomaly: number;
    x: number;
    y: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Layout dimensions
  const width = 1000;
  const height = 300;
  const margin = { top: 30, right: 30, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Domain bounds
  const minYear = 1880;
  const maxYear = 2026;
  const minAnomaly = -1.0;
  const maxAnomaly = 1.6;

  // Coordinate transforms
  const getX = (year: number) => {
    return margin.left + ((year - minYear) / (maxYear - minYear)) * innerWidth;
  };

  const getY = (anomaly: number) => {
    return margin.top + innerHeight - ((anomaly - minAnomaly) / (maxAnomaly - minAnomaly)) * innerHeight;
  };

  const zeroY = getY(0.0);

  // Y-axis tick intervals
  const yTicks = [-1.0, -0.5, 0.0, 0.5, 1.0, 1.5];

  // X-axis tick intervals (decades)
  const xTicks = [1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020];

  // Path generator for annual anomaly line
  const linePath = useMemo(() => {
    if (data.annualTimeline.length === 0) return '';
    return data.annualTimeline
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.year).toFixed(1)} ${getY(d.anomaly).toFixed(1)}`)
      .join(' ');
  }, [data.annualTimeline]);

  // Handle pointer interaction across chart
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * width;

    // Convert SVG X to year
    const yearFrac = (svgX - margin.left) / innerWidth;
    const year = Math.round(minYear + Math.max(0, Math.min(1, yearFrac)) * (maxYear - minYear));

    const record = data.annualTimeline.find((d) => d.year === year);
    if (record) {
      setHoveredYear({
        year: record.year,
        anomaly: record.anomaly,
        x: getX(record.year),
        y: getY(record.anomaly),
      });
    }
  };

  const handlePointerLeave = () => {
    setHoveredYear(null);
  };

  const handleClick = () => {
    if (hoveredYear) {
      onSelectYear(hoveredYear.year);
    }
  };

  // Active playhead coordinates
  const activeYear = currentEvent?.year ?? null;
  const activeX = activeYear ? getX(activeYear) : null;
  const activeY = currentEvent ? getY(currentEvent.anomalyCelsius) : null;

  return (
    <div className="rounded-sm border border-hairline bg-space-black/90 p-4 font-mono text-xs space-y-3 shadow-2xl overflow-hidden">
      {/* Top Title & Legend Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] border-b border-hairline pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-text-primary text-xs">
            Global Land-Ocean Temperature Anomaly (1880–2026)
          </span>
          <span className="text-text-muted text-[10px]">
            Baseline: 1951–1980 mean (0.00 °C)
          </span>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-nasa-cyan" />
            <span className="text-text-muted">Cool Anomaly (&lt; 0 °C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-xs bg-telemetry-amber" />
            <span className="text-text-muted">Warm Anomaly (&gt; 0 °C)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-white/40 border-b border-dashed border-white" />
            <span className="text-text-muted">Baseline (0.0 °C)</span>
          </span>
        </div>
      </div>

      {/* SVG Chart Viewport */}
      <div className="relative aspect-[10/3] w-full select-none cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {/* Subtle Grid Lines (Horizontal) */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={width - margin.right}
                  y2={y}
                  stroke={tick === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
                  strokeDasharray={tick === 0 ? '4,4' : undefined}
                  strokeWidth={tick === 0 ? 1.5 : 1}
                />
                <text
                  x={margin.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fill={tick === 0 ? '#00E5FF' : 'rgba(255, 255, 255, 0.4)'}
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {tick > 0 ? `+${tick.toFixed(1)}` : tick.toFixed(1)} °C
                </text>
              </g>
            );
          })}

          {/* X-Axis Ticks (Years) */}
          {xTicks.map((year) => {
            const x = getX(year);
            return (
              <g key={`x-${year}`}>
                <line
                  x1={x}
                  y1={height - margin.bottom}
                  x2={x}
                  y2={height - margin.bottom + 5}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - margin.bottom + 18}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.5)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {year}
                </text>
              </g>
            );
          })}

          {/* Colored Anomaly Bars from Zero Baseline */}
          {data.annualTimeline.map((item) => {
            const x = getX(item.year);
            const y = getY(item.anomaly);
            const isWarm = item.anomaly >= 0;
            const barY = isWarm ? y : zeroY;
            const barHeight = Math.abs(y - zeroY);
            const isCurrent = activeYear === item.year;

            return (
              <rect
                key={item.year}
                x={x - 2.5}
                y={barY}
                width={5}
                height={Math.max(1, barHeight)}
                fill={
                  isCurrent
                    ? '#00E5FF'
                    : isWarm
                    ? item.anomaly > 1.0
                      ? '#FF5252'
                      : '#FFB300'
                    : '#00B0FF'
                }
                opacity={isCurrent ? 1.0 : 0.65}
                className="transition-opacity duration-75"
              />
            );
          })}

          {/* Anomaly Trend Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Active Sonification Playhead Line & Reticle */}
          {activeX !== null && activeY !== null && (
            <g className="transition-all duration-75">
              <line
                x1={activeX}
                y1={margin.top}
                x2={activeX}
                y2={height - margin.bottom}
                stroke="#00E5FF"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
              <circle
                cx={activeX}
                cy={activeY}
                r="6"
                fill="#00E5FF"
                className="animate-ping opacity-75"
              />
              <circle
                cx={activeX}
                cy={activeY}
                r="4.5"
                fill="#00E5FF"
                stroke="#0A0E17"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Hover Crosshair */}
          {hoveredYear && (
            <g pointerEvents="none">
              <line
                x1={hoveredYear.x}
                y1={margin.top}
                x2={hoveredYear.x}
                y2={height - margin.bottom}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="1"
              />
              <circle
                cx={hoveredYear.x}
                cy={hoveredYear.y}
                r="4"
                fill="#FFB300"
                stroke="#0A0E17"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Hover / Probe Tooltip */}
        {hoveredYear && (
          <div
            className="absolute z-30 pointer-events-none rounded-xs border border-hairline-bright bg-space-black/95 px-3 py-1.5 shadow-xl text-[10px] space-y-0.5"
            style={{
              left: `${Math.min(85, Math.max(10, (hoveredYear.x / width) * 100))}%`,
              top: '15px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-text-primary text-xs">{hoveredYear.year}</span>
              <span className={`font-bold ${hoveredYear.anomaly >= 0 ? 'text-telemetry-amber' : 'text-nasa-cyan'}`}>
                {hoveredYear.anomaly >= 0 ? `+${hoveredYear.anomaly.toFixed(2)}` : hoveredYear.anomaly.toFixed(2)} °C
              </span>
            </div>
            <div className="text-[9px] text-text-muted">
              Pitch: <strong className="text-nasa-cyan">{mapAnomalyToPitch(hoveredYear.anomaly).pitch}</strong> ({mapAnomalyToPitch(hoveredYear.anomaly).frequencyHz} Hz)
            </div>
            <div className="text-[8px] text-biosphere-emerald">Click to seek audio</div>
          </div>
        )}
      </div>

      {/* Chart Footer Notice */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-text-muted pt-1 border-t border-hairline/60">
        <span>Click on any year to scrub and begin sonification from that point.</span>
        <span>Source: NASA Goddard Institute for Space Studies (GISTEMP v4)</span>
      </div>
    </div>
  );
}
