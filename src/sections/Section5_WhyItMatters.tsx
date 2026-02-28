import { useState } from "react";
import { SectionHeader, SectionCard, InsightBox } from "../components/Layout/SectionCard";
import { CoinFlipper } from "../components/Interactive/CoinFlipper";
import { BetaDistributionChart } from "../components/Interactive/BetaDistributionChart";
import { ComparisonPanel } from "../components/Interactive/ComparisonPanel";
import { useCoinTrial } from "../hooks/useCoinTrial";
import { useBayesianUpdate } from "../hooks/useBayesianUpdate";
import { useFrequentistTest } from "../hooks/useFrequentistTest";
import { COLORS } from "../utils/constants";
import iStyles from "../components/Interactive/Interactive.module.css";

export function Section5_WhyItMatters() {
  // Playground state
  const [trueBias, setTrueBias] = useState(0.65);
  const [priorAlpha, setPriorAlpha] = useState(2);
  const [priorBeta, setPriorBeta] = useState(2);

  const trial = useCoinTrial(trueBias);
  const bayes = useBayesianUpdate(priorAlpha, priorBeta, trial.heads, trial.tails);
  const freq = useFrequentistTest(trial.heads, trial.total);

  return (
    <section>
      <SectionHeader number={5} title="Why It Matters" id="why-it-matters" />

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Real-World Impact
        </h3>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#cbd5e1" }}>
          The frequentist vs. Bayesian debate isn't just academic — it affects
          real decisions in medicine, technology, and law.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
          }}>
            <h4 style={{ color: "#a5b4fc", margin: "0 0 8px", fontSize: 15 }}>
              Medical Trials
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Frequentist p-values have led to the "replication crisis" — many
              published results fail to replicate because p &lt; 0.05 was
              treated as proof. Bayesian methods allow researchers to
              incorporate prior knowledge and express uncertainty more naturally.
            </p>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
          }}>
            <h4 style={{ color: "#a5b4fc", margin: "0 0 8px", fontSize: 15 }}>
              A/B Testing
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Tech companies run thousands of A/B tests. Frequentist tests
              require fixed sample sizes decided in advance. Bayesian A/B testing
              allows continuous monitoring — you can check results at any time
              without inflating false positive rates.
            </p>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(99, 102, 241, 0.06)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
          }}>
            <h4 style={{ color: "#a5b4fc", margin: "0 0 8px", fontSize: 15 }}>
              Legal Evidence
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Courts want to know P(guilty | evidence), but DNA match statistics
              give P(evidence | innocent). Confusing these — the "prosecutor's
              fallacy" — is exactly the error Bayes' theorem corrects.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Summary
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #334155", color: "#94a3b8", fontWeight: 600 }}></th>
                <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #334155", color: "#10b981", fontWeight: 700 }}>Frequentist</th>
                <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #334155", color: "#f59e0b", fontWeight: 700 }}>Bayesian</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["What is probability?", "Long-run frequency", "Degree of belief"],
                ["Uses prior info?", "No", "Yes — via the prior"],
                ["Main tool", "p-value, CI", "Posterior distribution"],
                ["Answer type", "Binary (reject/don't)", "Continuous (distribution)"],
                ["Interpretation", '"How surprising is data?"', '"What should I believe?"'],
                ["With small samples", "Low power, wide CIs", "Prior stabilizes estimates"],
                ["With large samples", "Both converge to similar answers", "Both converge to similar answers"],
              ].map(([aspect, freqAnswer, bayesAnswer], i) => (
                <tr key={i}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1e293b", color: "#e2e8f0", fontWeight: 500 }}>{aspect}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>{freqAnswer}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>{bayesAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Playground */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 8 }}>
          Playground
        </h3>
        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Full sandbox — set any true bias, any prior, and explore freely.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div className={iStyles.sliderGroup}>
            <div className={iStyles.sliderLabel}>
              <span>True bias (hidden)</span>
              <span className={iStyles.sliderLabelValue}>{trueBias.toFixed(2)}</span>
            </div>
            <input
              type="range"
              className={iStyles.slider}
              min={0.05}
              max={0.95}
              step={0.01}
              value={trueBias}
              onChange={(e) => {
                setTrueBias(parseFloat(e.target.value));
                trial.reset();
              }}
            />
          </div>
          <div></div>
          <div className={iStyles.sliderGroup}>
            <div className={iStyles.sliderLabel}>
              <span>Prior Alpha (α)</span>
              <span className={iStyles.sliderLabelValue}>{priorAlpha.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className={iStyles.slider}
              min={0.5}
              max={50}
              step={0.5}
              value={priorAlpha}
              onChange={(e) => setPriorAlpha(parseFloat(e.target.value))}
            />
          </div>
          <div className={iStyles.sliderGroup}>
            <div className={iStyles.sliderLabel}>
              <span>Prior Beta (β)</span>
              <span className={iStyles.sliderLabelValue}>{priorBeta.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className={iStyles.slider}
              min={0.5}
              max={50}
              step={0.5}
              value={priorBeta}
              onChange={(e) => setPriorBeta(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <CoinFlipper external={trial} trueBias={trueBias} />

        <div style={{ marginTop: 24 }}>
          <BetaDistributionChart
            curves={[
              {
                alpha: priorAlpha,
                beta: priorBeta,
                color: COLORS.prior,
                label: "Prior",
                opacity: 0.4,
                dashed: true,
              },
              {
                alpha: bayes.posteriorAlpha,
                beta: bayes.posteriorBeta,
                color: COLORS.posterior,
                label: `Posterior (n=${trial.total})`,
              },
            ]}
            showCredibleInterval={{
              alpha: bayes.posteriorAlpha,
              beta: bayes.posteriorBeta,
              color: COLORS.posterior,
            }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <ComparisonPanel freq={freq} bayes={bayes} total={trial.total} />
        </div>
      </SectionCard>

      <SectionCard>
        <InsightBox label="Final Thought">
          <p>
            Neither approach is "right" or "wrong" — they answer different
            questions. The frequentist asks about the long-run behavior of a
            procedure. The Bayesian asks about the probability of a hypothesis
            given observed data. Understanding both gives you a more complete
            statistical toolkit.
          </p>
        </InsightBox>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 16, textAlign: "center" }}>
          Built as an interactive learning experiment.
        </p>
      </SectionCard>
    </section>
  );
}
