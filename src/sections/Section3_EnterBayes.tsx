import { SectionHeader, SectionCard, InsightBox } from "../components/Layout/SectionCard";
import { DiseaseTestDemo } from "../components/Interactive/DiseaseTestDemo";
import { MultipleChoice } from "../components/Quiz/MultipleChoice";
import styles from "../components/Interactive/Interactive.module.css";

export function Section3_EnterBayes() {
  return (
    <section>
      <SectionHeader number={3} title="Enter Bayes" id="bayes" />

      <SectionCard>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#cbd5e1" }}>
          The Reverend Thomas Bayes (1701–1761) gave us a different way to think
          about probability. Instead of asking{" "}
          <em>"how surprising is the data?"</em>, we ask{" "}
          <strong style={{ color: "#f8fafc" }}>
            "what should I believe, given the data?"
          </strong>
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8" }}>
          The idea is beautifully simple: start with a belief, then update it
          when you see evidence.
        </p>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 20 }}>
          Bayes' Theorem
        </h3>
        <div className={styles.formula}>
          <span className={styles.formulaColor} style={{ color: "#f59e0b" }}>
            P(H|D)
          </span>
          <span style={{ color: "#64748b" }}>=</span>
          <span className={styles.formulaFraction}>
            <span className={styles.formulaNumerator}>
              <span className={styles.formulaColor} style={{ color: "#10b981" }}>
                P(D|H)
              </span>
              <span style={{ color: "#64748b" }}> · </span>
              <span className={styles.formulaColor} style={{ color: "#6366f1" }}>
                P(H)
              </span>
            </span>
            <span className={styles.formulaDenominator} style={{ color: "#94a3b8" }}>
              P(D)
            </span>
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginTop: 12,
        }}>
          <div style={{ padding: 12, borderRadius: 8, background: "rgba(245, 158, 11, 0.08)" }}>
            <strong style={{ color: "#f59e0b", fontSize: 13 }}>P(H|D) — Posterior</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", lineHeight: 1.5 }}>
              Your updated belief after seeing the data
            </p>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: "rgba(16, 185, 129, 0.08)" }}>
            <strong style={{ color: "#10b981", fontSize: 13 }}>P(D|H) — Likelihood</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", lineHeight: 1.5 }}>
              How likely is the data if the hypothesis is true?
            </p>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: "rgba(99, 102, 241, 0.08)" }}>
            <strong style={{ color: "#6366f1", fontSize: 13 }}>P(H) — Prior</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", lineHeight: 1.5 }}>
              Your belief <em>before</em> seeing the data
            </p>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: "rgba(148, 163, 184, 0.08)" }}>
            <strong style={{ color: "#94a3b8", fontSize: 13 }}>P(D) — Evidence</strong>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0", lineHeight: 1.5 }}>
              The total probability of the data (normalizing constant)
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 8 }}>
          The Classic Example: Medical Testing
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#94a3b8", marginBottom: 20 }}>
          A disease affects 1% of the population. A test is 95% accurate (95%
          sensitivity, 95% specificity). You test positive. What's the
          probability you actually have the disease?
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#cbd5e1", marginBottom: 24 }}>
          Drag the sliders to explore how prevalence, sensitivity, and
          specificity affect the answer.
        </p>
        <DiseaseTestDemo />
      </SectionCard>

      <SectionCard>
        <InsightBox label="The Prior Matters">
          <p>
            Notice how dramatically the result changes when you adjust the
            disease prevalence. With a 1% prevalence and a 95% accurate test, a
            positive result only means ~16% chance of actually having the
            disease!
          </p>
          <p>
            This is Bayes' theorem in action: your <strong>prior</strong> (how
            common the disease is) heavily influences the{" "}
            <strong>posterior</strong> (how likely you are to actually be sick).
            The test result alone isn't enough — context matters.
          </p>
        </InsightBox>
      </SectionCard>

      <SectionCard>
        <MultipleChoice
          question="A rare disease affects 0.1% of people. A test with 99% sensitivity and 99% specificity comes back positive. What is the approximate probability you have the disease?"
          options={[
            { text: "About 99%" },
            { text: "About 50%" },
            { text: "About 9%", correct: true },
            { text: "About 0.1%" },
          ]}
          explanation="Using Bayes' theorem: P(Disease|+) = (0.99 × 0.001) / (0.99 × 0.001 + 0.01 × 0.999) ≈ 9%. Even a 99% accurate test gives only ~9% posterior probability when the disease is very rare. The low prior overwhelms the test accuracy."
        />
      </SectionCard>
    </section>
  );
}
