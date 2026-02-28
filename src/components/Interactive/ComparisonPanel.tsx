import type { FrequentistResult } from "../../hooks/useFrequentistTest";
import type { BayesianResult } from "../../hooks/useBayesianUpdate";
import styles from "./Interactive.module.css";

interface Props {
  freq: FrequentistResult;
  bayes: BayesianResult;
  total: number;
}

function fmt(n: number, digits = 3): string {
  return n.toFixed(digits);
}

export function ComparisonPanel({ freq, bayes, total }: Props) {
  return (
    <div className={styles.comparisonGrid}>
      {/* Frequentist */}
      <div className={`${styles.comparisonPanel} ${styles.comparisonPanelFreq}`}>
        <div className={`${styles.panelTitle} ${styles.panelTitleFreq}`}>
          Frequentist
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>Point estimate (p&#770;)</span>
          <span className={styles.statValue}>{fmt(freq.pointEstimate)}</span>
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>95% Confidence Interval</span>
          <span className={styles.statValue}>
            [{fmt(freq.confidenceInterval[0])}, {fmt(freq.confidenceInterval[1])}]
          </span>
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>p-value (H₀: p=0.5)</span>
          <span className={styles.statValue}>
            {freq.pValue < 0.001 ? "<0.001" : fmt(freq.pValue)}
          </span>
        </div>

        <div className={`${styles.verdict} ${styles.verdictFreq}`}>
          {total === 0
            ? "No data yet"
            : freq.rejectNull
            ? 'Reject H₀ — "statistically significant" evidence the coin is unfair'
            : 'Fail to reject H₀ — "insufficient evidence" to claim unfairness'}
        </div>
      </div>

      {/* Bayesian */}
      <div className={`${styles.comparisonPanel} ${styles.comparisonPanelBayes}`}>
        <div className={`${styles.panelTitle} ${styles.panelTitleBayes}`}>
          Bayesian
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>Posterior mean</span>
          <span className={styles.statValue}>{fmt(bayes.posteriorMean)}</span>
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>95% Credible Interval</span>
          <span className={styles.statValue}>
            [{fmt(bayes.credibleInterval[0])}, {fmt(bayes.credibleInterval[1])}]
          </span>
        </div>

        <div className={styles.statRow}>
          <span className={styles.statLabel}>MAP estimate</span>
          <span className={styles.statValue}>{fmt(bayes.posteriorMode)}</span>
        </div>

        <div className={`${styles.verdict} ${styles.verdictBayes}`}>
          {total === 0
            ? "Prior belief only — no data yet"
            : `There is a posterior probability distribution over p. The most likely value is ~${fmt(
                bayes.posteriorMode,
                2
              )}, with 95% of the probability between ${fmt(
                bayes.credibleInterval[0],
                2
              )} and ${fmt(bayes.credibleInterval[1], 2)}.`}
        </div>
      </div>
    </div>
  );
}
