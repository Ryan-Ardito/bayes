import { useState } from "react";
import styles from "./Interactive.module.css";

export function DiseaseTestDemo() {
  const [prevalence, setPrevalence] = useState(1); // percent
  const [sensitivity, setSensitivity] = useState(95); // percent
  const [specificity, setSpecificity] = useState(95); // percent

  const prev = prevalence / 100;
  const sens = sensitivity / 100;
  const spec = specificity / 100;

  // P(Disease | Positive) = P(Pos|D) * P(D) / P(Pos)
  const pPositive = sens * prev + (1 - spec) * (1 - prev);
  const posteriorPercent = pPositive > 0 ? ((sens * prev) / pPositive) * 100 : 0;

  return (
    <div className={styles.diseaseGrid}>
      <div>
        <div className={styles.sliderGroup} style={{ marginBottom: 20 }}>
          <div className={styles.sliderLabel}>
            <span>Disease prevalence</span>
            <span className={styles.sliderLabelValue}>{prevalence}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={0.1}
            max={50}
            step={0.1}
            value={prevalence}
            onChange={(e) => setPrevalence(parseFloat(e.target.value))}
          />
        </div>

        <div className={styles.sliderGroup} style={{ marginBottom: 20 }}>
          <div className={styles.sliderLabel}>
            <span>Test sensitivity (true positive rate)</span>
            <span className={styles.sliderLabelValue}>{sensitivity}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={50}
            max={99.9}
            step={0.1}
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          />
        </div>

        <div className={styles.sliderGroup}>
          <div className={styles.sliderLabel}>
            <span>Test specificity (true negative rate)</span>
            <span className={styles.sliderLabelValue}>{specificity}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={50}
            max={99.9}
            step={0.1}
            value={specificity}
            onChange={(e) => setSpecificity(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.diseaseResult}>
        <div className={styles.diseaseResultLabel}>
          Probability you have the disease,<br />given a positive test result
        </div>
        <div className={styles.diseaseResultValue}>
          {posteriorPercent.toFixed(1)}%
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          {posteriorPercent < 50 ? (
            <>
              Even with a positive test, it's more likely you <em>don't</em> have
              the disease! The low prevalence means most positive results are false
              positives.
            </>
          ) : (
            <>
              The high prevalence (or extremely accurate test) makes a positive
              result meaningful.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
