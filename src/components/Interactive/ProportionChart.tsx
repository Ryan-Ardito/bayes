import { useMemo } from "react";
import * as d3 from "d3";
import styles from "./Interactive.module.css";

interface Props {
  flips: ("H" | "T")[];
  width?: number;
  height?: number;
}

export function ProportionChart({ flips, width = 600, height = 200 }: Props) {
  const margin = { top: 10, right: 20, bottom: 35, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const data = useMemo(() => {
    let heads = 0;
    return flips.map((f, i) => {
      if (f === "H") heads++;
      return { index: i + 1, proportion: heads / (i + 1) };
    });
  }, [flips]);

  if (flips.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg}>
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fill="#64748b"
            fontSize={14}
          >
            Flip some coins to see the proportion chart
          </text>
        </svg>
      </div>
    );
  }

  const xScale = d3
    .scaleLinear()
    .domain([1, Math.max(flips.length, 10)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

  const lineGen = d3
    .line<(typeof data)[0]>()
    .x((d) => xScale(d.index))
    .y((d) => yScale(d.proportion));

  return (
    <div className={styles.chartContainer}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Axes */}
          <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#475569" />
          <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#475569" />

          {/* Y ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick} transform={`translate(0,${yScale(tick)})`}>
              <line x2={-4} stroke="#475569" />
              <text x={-8} y={4} textAnchor="end" fill="#94a3b8" fontSize={11}>
                {tick}
              </text>
            </g>
          ))}

          {/* X axis label */}
          <text
            x={innerWidth / 2}
            y={innerHeight + 30}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={12}
          >
            Number of flips
          </text>

          {/* Y axis label */}
          <text
            transform={`translate(-38,${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={12}
          >
            Proportion heads
          </text>

          {/* Reference line at 0.5 */}
          <line
            x1={0}
            y1={yScale(0.5)}
            x2={innerWidth}
            y2={yScale(0.5)}
            className={styles.refLine}
          />

          {/* Proportion line */}
          <path d={lineGen(data)!} className={styles.proportionLine} />

          {/* Current value dot */}
          {data.length > 0 && (
            <circle
              cx={xScale(data[data.length - 1].index)}
              cy={yScale(data[data.length - 1].proportion)}
              r={4}
              fill="#10b981"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
