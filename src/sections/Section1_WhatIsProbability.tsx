import { useState } from "react";
import { SectionHeader, SectionCard, InsightBox } from "../components/Layout/SectionCard";
import { CoinFlipper } from "../components/Interactive/CoinFlipper";
import { MultipleChoice } from "../components/Quiz/MultipleChoice";
import quizStyles from "../components/Quiz/Quiz.module.css";

export function Section1_WhatIsProbability() {
  const [showReveal, setShowReveal] = useState(false);

  return (
    <section>
      <SectionHeader number={1} title="What Is Probability?" id="intro" />

      <SectionCard>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "#cbd5e1" }}>
          You find a coin on the ground. You pick it up and wonder:{" "}
          <strong style={{ color: "#f8fafc" }}>is this coin fair?</strong>
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8" }}>
          This seemingly simple question has driven a centuries-long debate in
          statistics. The answer depends on what you think "probability" even
          means.
        </p>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#94a3b8" }}>
          But first — let's gather some data. Click the coin to flip it.
        </p>
      </SectionCard>

      <SectionCard>
        <CoinFlipper />
      </SectionCard>

      <SectionCard>
        <MultipleChoice
          question="After a handful of flips, how confident are you that the coin is fair?"
          options={[
            { text: "Very confident — the results look about 50/50" },
            { text: "Somewhat confident — but I'd want more data" },
            { text: "Not confident at all — too few flips to tell", correct: true },
            { text: "I can't answer this without more information" },
          ]}
          explanation="With a small number of flips, we can't be very confident either way. Even a perfectly fair coin can easily show 4 heads out of 5 flips. The question is: how should we reason about our uncertainty?"
        />
      </SectionCard>

      <SectionCard>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#cbd5e1" }}>
          It turns out there are{" "}
          <strong style={{ color: "#f8fafc" }}>
            two fundamentally different ways
          </strong>{" "}
          to think about this question:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "20px 0" }}>
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}>
            <div style={{ color: "#10b981", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Frequentist
            </div>
            <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              "Probability is the long-run frequency of events. We test
              whether the data is consistent with a fair coin."
            </p>
          </div>
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Bayesian
            </div>
            <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              "Probability is a degree of belief. We start with a prior
              belief and update it as we see data."
            </p>
          </div>
        </div>

        {!showReveal ? (
          <button
            onClick={() => setShowReveal(true)}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #6366f1",
              background: "rgba(99, 102, 241, 0.1)",
              color: "#a5b4fc",
              fontSize: 14,
              cursor: "pointer",
              width: "100%",
            }}
          >
            Let's explore both approaches →
          </button>
        ) : (
          <div className={quizStyles.revealCard}>
            <p>
              Both approaches will analyze the <em>same data</em> — but
              they'll ask different questions and give different kinds of
              answers.
            </p>
            <InsightBox>
              <p>
                The frequentist asks: <em>"If the coin were fair, how surprising is this data?"</em>
                <br />
                The Bayesian asks: <em>"Given this data, how likely is the coin to be fair?"</em>
              </p>
            </InsightBox>
            <p style={{ marginTop: 16 }}>
              These are <strong>not</strong> the same question — and the
              distinction has profound consequences. Let's see why.
            </p>
          </div>
        )}
      </SectionCard>
    </section>
  );
}
