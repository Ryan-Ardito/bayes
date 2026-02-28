import { useMemo } from "react";
import * as d3 from "d3";
import { betaCurvePoints, betaInv } from "../../utils/stats";
import styles from "./Interactive.module.css";

interface CurveConfig {
  alpha: number;
  beta: number;
  color: string;
  label: string;
  opacity?: number;
  dashed?: boolean;
}

interface Props {
  curves: CurveConfig[];
  width?: number;
  height?: number;
  showCredibleInterval?: { alpha: number; beta: number; color: string };
}

export function BetaDistributionChart({
  curves,
  width = 600,
  height = 250,
  showCredibleInterval,
}: Props) {
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { allPoints, xScale, yScale } = useMemo(() => {
    const allPts = curves.map((c) => ({
      ...c,
      points: betaCurvePoints(c.alpha, c.beta),
    }));

    const maxY = Math.max(
      ...allPts.flatMap((c) => c.points.map((p) => p.y)),
      1
    );

    const xS = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const yS = d3
      .scaleLinear()
      .domain([0, Math.min(maxY * 1.1, 20)])
      .range([innerHeight, 0]);

    return { allPoints: allPts, xScale: xS, yScale: yS };
  }, [curves, innerWidth, innerHeight]);

  const lineGenerator = d3
    .line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(Math.min(d.y, yScale.domain()[1])))
    .curve(d3.curveBasis);

  const areaGenerator = d3
    .area<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y0(innerHeight)
    .y1((d) => yScale(Math.min(d.y, yScale.domain()[1])))
    .curve(d3.curveBasis);

  const ciArea = useMemo(() => {
    if (!showCredibleInterval) return null;
    const { alpha, beta, color } = showCredibleInterval;
    const lo = betaInv(0.025, alpha, beta);
    const hi = betaInv(0.975, alpha, beta);
    const points = betaCurvePoints(alpha, beta).filter(
      (p) => p.x >= lo && p.x <= hi
    );
    if (points.length === 0) return null;
    return { path: areaGenerator(points), color, lo, hi };
  }, [showCredibleInterval, areaGenerator]);

  return (
    <div className={styles.chartContainer}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* X axis */}
          <line
            x1={0}
            y1={innerHeight}
            x2={innerWidth}
            y2={innerHeight}
            stroke="#475569"
            strokeWidth={1}
          />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)},${innerHeight})`}>
              <line y2={6} stroke="#475569" />
              <text
                y={20}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={12}
              >
                {tick}
              </text>
            </g>
          ))}
          <text
            x={innerWidth / 2}
            y={innerHeight + 36}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={12}
          >
            Probability of Heads (p)
          </text>

          {/* Y axis */}
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={innerHeight}
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            transform={`translate(-36,${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={12}
          >
            Density
          </text>

          {/* Credible interval shading */}
          {ciArea && (
            <path d={ciArea.path!} fill={ciArea.color} opacity={0.15} />
          )}

          {/* Reference line at 0.5 */}
          <line
            x1={xScale(0.5)}
            y1={0}
            x2={xScale(0.5)}
            y2={innerHeight}
            className={styles.refLine}
          />

          {/* Curves */}
          {allPoints.map((curve, i) => (
            <g key={i}>
              <path
                d={areaGenerator(curve.points)!}
                fill={curve.color}
                opacity={(curve.opacity ?? 1) * 0.08}
              />
              <path
                d={lineGenerator(curve.points)!}
                fill="none"
                stroke={curve.color}
                strokeWidth={2.5}
                opacity={curve.opacity ?? 1}
                strokeDasharray={curve.dashed ? "6 4" : undefined}
              />
            </g>
          ))}

          {/* Legend */}
          {curves.length > 1 && (
            <g transform={`translate(${innerWidth - 140}, 0)`}>
              {curves.map((curve, i) => (
                <g key={i} transform={`translate(0, ${i * 22})`}>
                  <line
                    x1={0}
                    y1={0}
                    x2={20}
                    y2={0}
                    stroke={curve.color}
                    strokeWidth={2.5}
                    opacity={curve.opacity ?? 1}
                    strokeDasharray={curve.dashed ? "6 4" : undefined}
                  />
                  <text
                    x={28}
                    y={4}
                    fill="#e2e8f0"
                    fontSize={12}
                  >
                    {curve.label}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
