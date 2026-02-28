import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  type LossGrid,
  type Point,
  computeLossGrid,
  gradientDecomposed,
  temperature,
  flow,
  loss as defaultLoss,
  FLOW_ISO_VALUES,
  IDEAL_FLOW,
} from "../../utils/optimization";
import styles from "./Optimization.module.css";

const RESOLUTION = 100;

/** Map flow rate to colour: blue (dribble) → green (ideal) → orange (excess) */
function flowColor(f: number): string {
  if (f <= IDEAL_FLOW) {
    // blue → green
    const t = Math.max(0, f / IDEAL_FLOW);
    const r = Math.round(59 * (1 - t) + 34 * t);
    const g = Math.round(130 * (1 - t) + 197 * t);
    const b = Math.round(246 * (1 - t) + 94 * t);
    return `rgb(${r},${g},${b})`;
  }
  // green → orange
  const t = Math.min(1, (f - IDEAL_FLOW) / 0.8);
  const r = Math.round(34 * (1 - t) + 249 * t);
  const g = Math.round(197 * (1 - t) + 115 * t);
  const b = Math.round(94 * (1 - t) + 22 * t);
  return `rgb(${r},${g},${b})`;
}

interface Props {
  lossFn?: (h: number, c: number) => number;
  /** Algorithm trace polyline */
  trace?: Point[];
  traceColor?: string;
  /** Color trace segments by index (for SA temperature gradient) */
  traceColorFn?: (index: number, total: number) => string;
  /** Monte Carlo sample dots */
  samples?: Point[];
  bestPoint?: Point | null;
  /** Show gradient arrows at each trace point */
  showGradientArrows?: boolean;
  /** Called when user clicks on the plot */
  onClick?: (hot: number, cold: number) => void;
  /** Whether to show the click-to-inspect tooltip */
  interactive?: boolean;
  /** Show axis labels */
  showAxes?: boolean;
  /** Show flow iso-lines */
  showFlowLines?: boolean;
  /** Optional className for the wrapper */
  className?: string;
}

export function ContourPlot({
  lossFn = defaultLoss,
  trace,
  traceColor = "#38bdf8",
  traceColorFn,
  samples,
  bestPoint,
  showGradientArrows = false,
  onClick,
  interactive = true,
  showAxes = true,
  showFlowLines = false,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    hot: number;
    cold: number;
    loss: number;
    containerWidth: number;
  } | null>(null);

  // Compute grid once per lossFn identity
  const grid: LossGrid = useMemo(
    () => computeLossGrid(RESOLUTION, lossFn),
    [lossFn]
  );

  // Color scale: low loss → bright yellow, high loss → dark purple
  const colorScale = useMemo(
    () => d3.scaleSequential(d3.interpolateMagma).domain([grid.max, grid.min]),
    [grid.min, grid.max]
  );

  // Render heatmap to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = RESOLUTION;
    canvas.height = RESOLUTION;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(RESOLUTION, RESOLUTION);
    for (let row = 0; row < RESOLUTION; row++) {
      for (let col = 0; col < RESOLUTION; col++) {
        const v = grid.data[row * RESOLUTION + col];
        const c = d3.color(colorScale(v));
        if (!c) continue;
        const rgb = c.rgb();
        const i = (row * RESOLUTION + col) * 4;
        imgData.data[i] = rgb.r;
        imgData.data[i + 1] = rgb.g;
        imgData.data[i + 2] = rgb.b;
        imgData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [grid, colorScale]);

  const fromPixel = useCallback(
    (px: number, py: number, size: number) => ({
      hot: px / size,
      cold: 1 - py / size,
    }),
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const size = rect.width;
      const { hot, cold } = fromPixel(px, py, size);
      if (hot < 0 || hot > 1 || cold < 0 || cold > 1) {
        setTooltip(null);
        return;
      }
      setTooltip({
        x: px,
        y: py,
        hot,
        cold,
        loss: lossFn(hot, cold),
        containerWidth: rect.width,
      });
    },
    [interactive, fromPixel, lossFn]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onClick) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const { hot, cold } = fromPixel(
        e.clientX - rect.left,
        e.clientY - rect.top,
        rect.width
      );
      if (hot >= 0 && hot <= 1 && cold >= 0 && cold <= 1) {
        onClick(hot, cold);
      }
    },
    [onClick, fromPixel]
  );

  // Build SVG trace path
  const tracePath = useMemo(() => {
    if (!trace || trace.length < 2) return null;
    return trace.map((p) => ({
      x: p.hot * 100,
      y: (1 - p.cold) * 100,
    }));
  }, [trace]);

  return (
    <div className={className}>
      <div
        ref={wrapRef}
        className={styles.contourWrap}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        onClick={handleClick}
      >
        <canvas ref={canvasRef} className={styles.contourCanvas} />

        <svg
          className={styles.contourSvg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Flow iso-lines: diagonal lines where hot + cold = constant */}
          {showFlowLines &&
            FLOW_ISO_VALUES.map((f) => {
              // Line from (f, 0) to (0, f) in (hot, cold) space
              // But clamp to [0,1] × [0,1]
              const x1 = Math.min(f, 1) * 100;
              const y1 = (1 - Math.max(f - 1, 0)) * 100;
              const x2 = Math.max(f - 1, 0) * 100;
              const y2 = (1 - Math.min(f, 1)) * 100;
              const isIdeal = Math.abs(f - IDEAL_FLOW) < 0.01;
              return (
                <g key={f}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isIdeal ? "#4ade80" : "rgba(255,255,255,0.25)"}
                    strokeWidth={isIdeal ? 0.6 : 0.3}
                    strokeDasharray={isIdeal ? "none" : "2 1.5"}
                  />
                  <text
                    x={x1 + 1}
                    y={y1 - 0.5}
                    fill={isIdeal ? "#4ade80" : "rgba(255,255,255,0.4)"}
                    fontSize="2.5"
                    fontWeight={isIdeal ? 700 : 400}
                  >
                    {isIdeal ? `flow=${f} (ideal)` : `flow=${f}`}
                  </text>
                </g>
              );
            })}

          {/* Trace polyline(s) */}
          {tracePath &&
            !traceColorFn && (
              <polyline
                points={tracePath.map((p) => `${p.x},${p.y}`).join(" ")}
                className={styles.traceLine}
                stroke={traceColor}
                opacity={0.9}
              />
            )}

          {/* Segmented trace with per-segment color */}
          {tracePath &&
            traceColorFn &&
            tracePath.slice(0, -1).map((p, i) => (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={tracePath[i + 1].x}
                y2={tracePath[i + 1].y}
                stroke={traceColorFn(i, tracePath.length)}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))}

          {/* 3D decomposed gradient arrows */}
          {showGradientArrows && (
            <defs>
              <marker
                id="arrow-temp"
                markerWidth="4"
                markerHeight="3"
                refX="4"
                refY="1.5"
                orient="auto"
              >
                <polygon points="0 0, 4 1.5, 0 3" fill="#f97316" opacity={0.7} />
              </marker>
              <marker
                id="arrow-flow"
                markerWidth="4"
                markerHeight="3"
                refX="4"
                refY="1.5"
                orient="auto"
              >
                <polygon points="0 0, 4 1.5, 0 3" fill="#22d3ee" opacity={0.7} />
              </marker>
            </defs>
          )}
          {showGradientArrows &&
            trace &&
            trace.length > 0 &&
            trace
              .filter((_, i) => i % 3 === 0)
              .map((p, i) => {
                const decomp = gradientDecomposed(p.hot, p.cold, lossFn);
                const totalMag = Math.sqrt(
                  decomp.total[0] ** 2 + decomp.total[1] ** 2
                );
                if (totalMag < 0.1) return null;

                const scale = Math.min(5 / totalMag, 3);
                const x = p.hot * 100;
                const y = (1 - p.cold) * 100;

                // Temperature component (orange arrow)
                const tempMag = Math.sqrt(
                  decomp.temp[0] ** 2 + decomp.temp[1] ** 2
                );
                const tx = x - decomp.temp[0] * scale;
                const ty = y + decomp.temp[1] * scale; // inverted y

                // Flow component (cyan arrow, always diagonal)
                const flowMag = Math.sqrt(
                  decomp.flow[0] ** 2 + decomp.flow[1] ** 2
                );
                const fx = x - decomp.flow[0] * scale;
                const fy = y + decomp.flow[1] * scale;

                // Flow rate at this point for the base indicator
                const f = flow(p.hot, p.cold);
                const fColor = flowColor(f);

                return (
                  <g key={i}>
                    {/* Flow rate indicator dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={0.6 + f * 0.5}
                      fill={fColor}
                      opacity={0.6}
                    />

                    {/* Temperature component (orange) */}
                    {tempMag > 0.05 && (
                      <line
                        x1={x}
                        y1={y}
                        x2={tx}
                        y2={ty}
                        stroke="#f97316"
                        strokeWidth={0.7}
                        opacity={0.65}
                        markerEnd="url(#arrow-temp)"
                      />
                    )}

                    {/* Flow component (cyan) */}
                    {flowMag > 0.05 && (
                      <line
                        x1={x}
                        y1={y}
                        x2={fx}
                        y2={fy}
                        stroke="#22d3ee"
                        strokeWidth={0.7}
                        opacity={0.65}
                        markerEnd="url(#arrow-flow)"
                      />
                    )}
                  </g>
                );
              })}

          {/* Monte Carlo samples */}
          {samples &&
            samples.map((s, i) => (
              <circle
                key={i}
                cx={s.hot * 100}
                cy={(1 - s.cold) * 100}
                r={0.8}
                fill={
                  s === bestPoint
                    ? "#4ade80"
                    : colorScale(s.loss)
                }
                opacity={0.7}
                className={styles.sampleDot}
              />
            ))}

          {/* Best point marker */}
          {bestPoint && (
            <circle
              cx={bestPoint.hot * 100}
              cy={(1 - bestPoint.cold) * 100}
              r={2}
              fill="#4ade80"
              stroke="#fff"
              strokeWidth={0.6}
              className={styles.markerPulse}
            />
          )}

          {/* Current position marker (last trace point) */}
          {trace && trace.length > 0 && (
            <circle
              cx={trace[trace.length - 1].hot * 100}
              cy={(1 - trace[trace.length - 1].cold) * 100}
              r={1.8}
              fill={traceColor}
              stroke="#fff"
              strokeWidth={0.5}
              className={styles.markerPulse}
            />
          )}

          {/* Start marker */}
          {trace && trace.length > 0 && (
            <circle
              cx={trace[0].hot * 100}
              cy={(1 - trace[0].cold) * 100}
              r={1.5}
              fill="none"
              stroke="#fff"
              strokeWidth={0.5}
              opacity={0.8}
            />
          )}

          {/* Axis labels */}
          {showAxes && (
            <>
              <text
                x={50}
                y={99}
                className={styles.axisLabel}
                style={{ fontSize: "3.5px" }}
              >
                Hot Knob →
              </text>
              <text
                x={2}
                y={50}
                className={styles.axisLabel}
                style={{ fontSize: "3.5px" }}
                transform="rotate(-90, 2, 50)"
              >
                Cold Knob →
              </text>
            </>
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className={styles.contourTooltip}
            style={{
              left: tooltip.x + 12,
              top: tooltip.y - 10,
              transform:
                tooltip.x > tooltip.containerWidth * 0.7
                  ? "translateX(-110%)"
                  : undefined,
            }}
          >
            Hot: {tooltip.hot.toFixed(2)} | Cold: {tooltip.cold.toFixed(2)}
            <br />
            Temp: {temperature(tooltip.hot, tooltip.cold).toFixed(1)}° | Flow:{" "}
            {flow(tooltip.hot, tooltip.cold).toFixed(2)}
            <br />
            Loss: {tooltip.loss.toFixed(1)}
          </div>
        )}
      </div>

      {/* Legends */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>High loss</span>
        <div
          className={styles.legendGradient}
          style={{
            background: `linear-gradient(to right, ${colorScale(grid.max)}, ${colorScale((grid.max + grid.min) / 2)}, ${colorScale(grid.min)})`,
          }}
        />
        <span className={styles.legendLabel}>Low loss</span>
      </div>
      {showGradientArrows && (
        <div className={styles.legend} style={{ marginTop: 2 }}>
          <span className={styles.legendLabel} style={{ color: "#f97316" }}>
            ● Temp gradient
          </span>
          <span className={styles.legendLabel} style={{ color: "#22d3ee" }}>
            ● Flow gradient
          </span>
          <span className={styles.legendLabel} style={{ color: "#94a3b8" }}>
            ◉ dot size = flow rate
          </span>
        </div>
      )}
    </div>
  );
}
