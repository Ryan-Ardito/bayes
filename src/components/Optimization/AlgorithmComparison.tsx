import type { Point } from "../../utils/optimization";
import styles from "./Optimization.module.css";

interface MethodResult {
  label: string;
  color: string;
  steps: number;
  best: Point | null;
}

interface Props {
  methods: MethodResult[];
}

export type { MethodResult };

export function AlgorithmComparison({ methods }: Props) {
  return (
    <div className={styles.comparisonGrid}>
      {methods.map((m) => (
        <div key={m.label} className={styles.comparisonCard}>
          <div className={styles.comparisonTitle} style={{ color: m.color }}>
            {m.label}
          </div>
          {m.best ? (
            <>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                Best loss:{" "}
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                  {m.best.loss.toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                At hot={m.best.hot.toFixed(2)}, cold={m.best.cold.toFixed(2)}
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                Steps:{" "}
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                  {m.steps}
                </span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "#64748b" }}>Not run yet</div>
          )}
        </div>
      ))}
    </div>
  );
}
