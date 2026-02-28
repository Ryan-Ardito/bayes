import { useState } from "react";
import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";
import { CoinFlipper } from "../components/Interactive/CoinFlipper";
import { BetaDistributionChart } from "../components/Interactive/BetaDistributionChart";
import { ComparisonPanel } from "../components/Interactive/ComparisonPanel";
import { PriorSelector } from "../components/Interactive/PriorSelector";
import { useCoinTrial } from "../hooks/useCoinTrial";
import { useBayesianUpdate } from "../hooks/useBayesianUpdate";
import { useFrequentistTest } from "../hooks/useFrequentistTest";
import { PRIORS, COLORS } from "../utils/constants";
import iStyles from "../components/Interactive/Interactive.module.css";

type PriorKey = keyof typeof PRIORS;

export function Section4_CoinTrial() {
  const [priorKey, setPriorKey] = useState<PriorKey>("uniform");
  const [customAlpha, setCustomAlpha] = useState(1);
  const [customBeta, setCustomBeta] = useState(1);
  const [trueBias, setTrueBias] = useState(0.5);
  const [showTrueBias, setShowTrueBias] = useState(false);

  const priorAlpha =
    priorKey === "uniform" ? customAlpha : PRIORS[priorKey].alpha;
  const priorBeta =
    priorKey === "uniform" ? customBeta : PRIORS[priorKey].beta;

  const trial = useCoinTrial(trueBias);
  const bayes = useBayesianUpdate(
    priorAlpha,
    priorBeta,
    trial.heads,
    trial.tails
  );
  const freq = useFrequentistTest(trial.heads, trial.total);

  return (
    <section>
      <SectionHeader
        number={4}
        title="The Bayesian Coin Trial"
        id="coin-trial"
      />

      <SectionCard>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "#cbd5e1" }}>
          Now it's your turn to be the researcher. You'll flip a coin, and we'll
          analyze the results using{" "}
          <strong style={{ color: "#f8fafc" }}>both methods side by side</strong>
          .
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8" }}>
          First, choose your <strong style={{ color: "#6366f1" }}>prior belief</strong> — what do
          you think about this coin before seeing any data?
        </p>
      </SectionCard>

      {/* Prior Selection */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Step 1: Choose Your Prior
        </h3>
        <PriorSelector
          selected={priorKey}
          onSelect={setPriorKey}
          customAlpha={customAlpha}
          customBeta={customBeta}
          onCustomChange={(a, b) => {
            setCustomAlpha(a);
            setCustomBeta(b);
          }}
        />
        <div style={{ marginTop: 20 }}>
          <h4
            style={{
              color: "#94a3b8",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 12,
            }}
          >
            Your prior distribution: Beta({priorAlpha.toFixed(1)},{" "}
            {priorBeta.toFixed(1)})
          </h4>
          <BetaDistributionChart
            curves={[
              {
                alpha: priorAlpha,
                beta: priorBeta,
                color: COLORS.prior,
                label: "Prior",
              },
            ]}
          />
        </div>
      </SectionCard>

      {/* Secret bias control */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 8 }}>
          Step 2: Set the True Coin Bias (Secret!)
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#94a3b8", marginBottom: 16 }}>
          In real life, you wouldn't know this. But for learning purposes, you
          can control the coin's true bias and see how both methods discover it.
        </p>
        <div className={iStyles.sliderGroup}>
          <div className={iStyles.sliderLabel}>
            <span>True probability of heads</span>
            <span className={iStyles.sliderLabelValue}>
              {showTrueBias ? trueBias.toFixed(2) : "???"}
            </span>
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
        <button
          className={`${iStyles.btn} ${iStyles.btnSmall}`}
          style={{ marginTop: 10 }}
          onClick={() => setShowTrueBias(!showTrueBias)}
        >
          {showTrueBias ? "Hide true bias" : "Reveal true bias"}
        </button>
      </SectionCard>

      {/* Run the trial */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Step 3: Run the Trial
        </h3>
        <CoinFlipper external={trial} trueBias={trueBias} />

        {/* Live posterior chart */}
        <div style={{ marginTop: 28 }}>
          <h4
            style={{
              color: "#94a3b8",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 12,
            }}
          >
            Prior vs. Posterior Distribution
          </h4>
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

        {trial.total > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.15)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                Posterior Mean
              </div>
              <div
                style={{
                  color: "#f59e0b",
                  fontSize: 22,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {bayes.posteriorMean.toFixed(3)}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.15)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                MAP Estimate
              </div>
              <div
                style={{
                  color: "#f59e0b",
                  fontSize: 22,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {bayes.posteriorMode.toFixed(3)}
              </div>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.15)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                95% Credible Interval
              </div>
              <div
                style={{
                  color: "#f59e0b",
                  fontSize: 16,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                [{bayes.credibleInterval[0].toFixed(3)},{" "}
                {bayes.credibleInterval[1].toFixed(3)}]
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Side-by-side comparison */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Step 4: Compare the Two Approaches
        </h3>
        <ComparisonPanel freq={freq} bayes={bayes} total={trial.total} />
      </SectionCard>

      {/* Key takeaways */}
      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Key Takeaways
        </h3>

        <InsightBox label="Confidence vs. Credible Intervals">
          <p>
            The frequentist 95% CI says: "In repeated experiments, 95% of such
            intervals would contain the true value." The Bayesian 95% credible
            interval says: "Given the data and prior, there is a 95% probability
            the true value lies in this range."
          </p>
          <p>
            The Bayesian interpretation is what most people <em>think</em> the
            frequentist CI means — but it's not!
          </p>
        </InsightBox>

        <div style={{ marginTop: 20 }}>
          <InsightBox label="The Role of the Prior">
            <p>
              With a <strong>strong prior</strong> (e.g., Beta(20,20)), the
              Bayesian is "stubborn" — it takes more data to shift the belief.
              With a <strong>weak prior</strong> (e.g., Beta(1,1)), the data
              speaks for itself. As you collect more data, the prior matters less
              and the two approaches converge.
            </p>
          </InsightBox>
        </div>

        <div style={{ marginTop: 20 }}>
          <InsightBox label="Binary vs. Continuous Answers">
            <p>
              The frequentist gives a <strong>binary</strong> verdict: reject or
              fail to reject. The Bayesian gives a{" "}
              <strong>continuous</strong> answer: an entire probability
              distribution over possible values. This often provides a richer,
              more nuanced picture of uncertainty.
            </p>
          </InsightBox>
        </div>
      </SectionCard>
    </section>
  );
}
