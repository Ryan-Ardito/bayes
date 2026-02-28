import type { MutableRefObject } from "react";
import styles from "./Optimization.module.css";
import iStyles from "../Interactive/Interactive.module.css";

interface Props {
  step: () => void;
  run: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: MutableRefObject<boolean>;
  stats?: { label: string; value: string }[];
  children?: React.ReactNode;
}

export function AlgorithmControls({
  step,
  run,
  stop,
  reset,
  isRunning,
  stats,
  children,
}: Props) {
  return (
    <div>
      <div className={styles.controlsBar}>
        <button className={`${iStyles.btn} ${iStyles.btnSmall}`} onClick={step}>
          Step
        </button>
        <button
          className={`${iStyles.btn} ${iStyles.btnSmall} ${iStyles.btnPrimary}`}
          onClick={() => (isRunning.current ? stop() : run())}
        >
          {isRunning.current ? "Pause" : "Run"}
        </button>
        <button
          className={`${iStyles.btn} ${iStyles.btnSmall} ${iStyles.btnDanger}`}
          onClick={reset}
        >
          Reset
        </button>
        {children}
      </div>

      {stats && stats.length > 0 && (
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <span key={s.label} className={styles.statChip}>
              {s.label}:{" "}
              <span className={styles.statChipValue}>{s.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
