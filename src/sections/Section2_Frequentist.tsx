import { SectionHeader, SectionCard, InsightBox } from "../components/Layout/SectionCard";
import { CoinFlipper } from "../components/Interactive/CoinFlipper";
import { ProportionChart } from "../components/Interactive/ProportionChart";
import { MultipleChoice } from "../components/Quiz/MultipleChoice";
import { useCoinTrial } from "../hooks/useCoinTrial";
import { useFrequentistTest } from "../hooks/useFrequentistTest";

export function Section2_Frequentist() {
  const trial = useCoinTrial(0.5);
  const freq = useFrequentistTest(trial.heads, trial.total);

  return (
    <section>
      <SectionHeader number={2} title="The Frequentist Approach" id="frequentist" />

      <SectionCard>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#cbd5e1" }}>
          The frequentist says: <em>"Probability is the long-run frequency of an
          event."</em> A coin has a fixed, true probability of heads — we just
          don't know what it is. Our job is to estimate it from data.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8" }}>
          The frequentist procedure:
        </p>
        <ol style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: 15 }}>
          <li>
            <strong style={{ color: "#e2e8f0" }}>Null hypothesis</strong>: Assume the
            coin is fair (p = 0.5)
          </li>
          <li>
            <strong style={{ color: "#e2e8f0" }}>Collect data</strong>: Flip the coin
            many times
          </li>
          <li>
            <strong style={{ color: "#e2e8f0" }}>Calculate a p-value</strong>: How
            likely is data this extreme <em>if</em> the coin were fair?
          </li>
          <li>
            <strong style={{ color: "#e2e8f0" }}>Decide</strong>: If p-value &lt;
            0.05, reject the null hypothesis
          </li>
        </ol>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Try it — flip coins and watch the statistics update
        </h3>
        <CoinFlipper external={trial} />

        <div style={{ marginTop: 24 }}>
          <ProportionChart flips={trial.flips} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginTop: 20,
        }}>
          <div style={{
            padding: 16,
            borderRadius: 10,
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            textAlign: "center",
          }}>
            <div style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Point Estimate (p&#770;)
            </div>
            <div style={{ color: "#10b981", fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {freq.pointEstimate.toFixed(3)}
            </div>
          </div>

          <div style={{
            padding: 16,
            borderRadius: 10,
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.15)",
            textAlign: "center",
          }}>
            <div style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              95% CI
            </div>
            <div style={{ color: "#10b981", fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              [{freq.confidenceInterval[0].toFixed(3)}, {freq.confidenceInterval[1].toFixed(3)}]
            </div>
          </div>

          <div style={{
            padding: 16,
            borderRadius: 10,
            background: freq.rejectNull
              ? "rgba(239, 68, 68, 0.08)"
              : "rgba(16, 185, 129, 0.06)",
            border: `1px solid ${
              freq.rejectNull
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(16, 185, 129, 0.15)"
            }`,
            textAlign: "center",
          }}>
            <div style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              p-value
            </div>
            <div style={{
              color: freq.rejectNull ? "#ef4444" : "#10b981",
              fontSize: 24,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}>
              {freq.pValue < 0.001 ? "<0.001" : freq.pValue.toFixed(3)}
            </div>
          </div>
        </div>

        {trial.total > 0 && (
          <div style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 10,
            background: freq.rejectNull
              ? "rgba(239, 68, 68, 0.08)"
              : "rgba(16, 185, 129, 0.08)",
            textAlign: "center",
            color: freq.rejectNull ? "#fca5a5" : "#6ee7b7",
            fontSize: 14,
          }}>
            {freq.rejectNull
              ? "Reject H₀ — the data is statistically significant evidence against a fair coin"
              : "Fail to reject H₀ — the data is consistent with a fair coin"}
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <InsightBox label="Common Misconception">
          <p>
            A 95% confidence interval does <strong>not</strong> mean "there is a
            95% probability the true value is inside this interval."
          </p>
          <p>
            It means: if we repeated this experiment many times, 95% of the
            intervals we compute would contain the true value. Any single
            interval either contains it or doesn't — we just don't know which.
          </p>
          <p style={{ color: "#fbbf24", fontWeight: 600 }}>
            This subtle distinction is one of the key differences between
            frequentist and Bayesian thinking.
          </p>
        </InsightBox>
      </SectionCard>

      <SectionCard>
        <MultipleChoice
          question="You compute a p-value of 0.03. What does this mean?"
          options={[
            { text: "There is a 3% chance the coin is fair" },
            {
              text: "If the coin were fair, there's a 3% chance of seeing data this extreme or more extreme",
              correct: true,
            },
            { text: "There is a 97% chance the coin is biased" },
            { text: "The coin's true bias is 3% away from 0.5" },
          ]}
          explanation="The p-value is NOT the probability the null hypothesis is true. It's the probability of observing data at least this extreme, assuming the null hypothesis IS true. This is a crucial distinction — confusing the two is one of the most common errors in statistics."
        />
      </SectionCard>
    </section>
  );
}
