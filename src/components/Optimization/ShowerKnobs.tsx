import { temperature, flow, loss, IDEAL_FLOW } from "../../utils/optimization";
import styles from "./Optimization.module.css";
import iStyles from "../Interactive/Interactive.module.css";

interface Props {
  hot: number;
  cold: number;
  onHotChange: (v: number) => void;
  onColdChange: (v: number) => void;
}

export function ShowerKnobs({ hot, cold, onHotChange, onColdChange }: Props) {
  const temp = temperature(hot, cold);
  const f = flow(hot, cold);
  const discomfort = loss(hot, cold);

  // 0-1 for bar width, capped at loss ≈ 200
  const discomfortPct = Math.min(discomfort / 200, 1) * 100;

  // Temperature → colour
  const tempColor =
    temp < 20
      ? "#3b82f6"
      : temp < 30
        ? "#06b6d4"
        : temp < 36
          ? "#22c55e"
          : temp < 40
            ? "#4ade80"
            : temp < 45
              ? "#f59e0b"
              : "#ef4444";

  // Flow → colour: blue (dribble) → green (ideal) → orange (excess)
  const flowColor =
    f < 0.2
      ? "#3b82f6"
      : f < 0.5
        ? "#06b6d4"
        : f < IDEAL_FLOW + 0.15
          ? "#4ade80"
          : f < 1.2
            ? "#f59e0b"
            : "#ef4444";

  // Discomfort bar color (loss range: ~1 ideal, ~200 worst)
  const barColor =
    discomfort < 3
      ? "#4ade80"
      : discomfort < 15
        ? "#fbbf24"
        : discomfort < 60
          ? "#f97316"
          : "#ef4444";

  return (
    <div className={styles.knobsContainer}>
      <div className={styles.knobRow}>
        <div className={styles.knobSlider}>
          <div className={`${styles.knobLabel} ${styles.knobLabelHot}`}>
            <span>Hot Knob</span>
            <span>{hot.toFixed(2)}</span>
          </div>
          <input
            type="range"
            className={`${iStyles.slider} ${styles.sliderHot}`}
            min={0}
            max={1}
            step={0.01}
            value={hot}
            onChange={(e) => onHotChange(parseFloat(e.target.value))}
          />
        </div>
        <div className={styles.knobSlider}>
          <div className={`${styles.knobLabel} ${styles.knobLabelCold}`}>
            <span>Cold Knob</span>
            <span>{cold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            className={`${iStyles.slider} ${styles.sliderCold}`}
            min={0}
            max={1}
            step={0.01}
            value={cold}
            onChange={(e) => onColdChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.metersRow}>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>Temperature</div>
          <div className={styles.meterValue} style={{ color: tempColor }}>
            {temp.toFixed(1)}°
          </div>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>Flow</div>
          <div className={styles.meterValue} style={{ color: flowColor }}>
            {f.toFixed(2)}
          </div>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>Discomfort</div>
          <div className={styles.meterValue} style={{ color: barColor }}>
            {discomfort.toFixed(1)}
          </div>
          <div className={styles.discomfortBar}>
            <div
              className={styles.discomfortFill}
              style={{
                width: `${discomfortPct}%`,
                background: barColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
