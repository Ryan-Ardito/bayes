import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";

export function OptSection6_WhyItMatters() {
  return (
    <section>
      <SectionHeader
        number={6}
        title="Why It Matters"
        id="opt-why"
      />

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Real-World Applications
        </h3>
        <p style={{ marginTop: 0 }}>
          The shower metaphor is playful, but these algorithms power some of the
          most important technology in the world.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(56, 189, 248, 0.06)",
            border: "1px solid rgba(56, 189, 248, 0.15)",
          }}>
            <h4 style={{ color: "#7dd3fc", margin: "0 0 8px", fontSize: 15 }}>
              Machine Learning & Neural Networks
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Every neural network is trained by gradient descent (or variants like Adam
              and SGD). The "loss landscape" has millions of dimensions — one for each
              weight — but the principle is identical to our two-knob shower.
            </p>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(251, 146, 60, 0.06)",
            border: "1px solid rgba(251, 146, 60, 0.15)",
          }}>
            <h4 style={{ color: "#fdba74", margin: "0 0 8px", fontSize: 15 }}>
              Chip Design & Logistics
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Simulated annealing was invented to optimise VLSI chip layouts — arranging
              millions of transistors to minimise wire length. It's also used for
              vehicle routing, scheduling, and protein folding.
            </p>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: "rgba(167, 139, 250, 0.06)",
            border: "1px solid rgba(167, 139, 250, 0.15)",
          }}>
            <h4 style={{ color: "#c4b5fd", margin: "0 0 8px", fontSize: 15 }}>
              Finance & Risk
            </h4>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Monte Carlo simulation is the backbone of financial risk modelling.
              Banks run millions of random scenarios to estimate portfolio risk,
              option prices, and Value at Risk (VaR).
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Connection to Bayesian Inference
        </h3>
        <p style={{ marginTop: 0 }}>
          There's a deep link between optimization and Bayesian statistics.
          <strong style={{ color: "#f8fafc" }}> Markov Chain Monte Carlo (MCMC)</strong> methods
          — like the Metropolis-Hastings algorithm — use the same
          "accept/reject" logic as simulated annealing to <em>sample</em> from
          posterior distributions instead of optimizing them.
        </p>
        <p>
          In fact, simulated annealing is mathematically equivalent to sampling
          from a Boltzmann distribution with decreasing temperature. When the
          temperature is fixed instead, you get MCMC — the workhorse of modern
          Bayesian computation.
        </p>
      </SectionCard>

      <SectionCard>
        <InsightBox label="The Big Picture">
          <p>
            Optimization and inference are two sides of the same coin.
            Optimization finds the <em>best</em> answer; Bayesian inference
            finds the <em>distribution</em> of plausible answers. The tools you
            just learned — gradient descent, simulated annealing, Monte Carlo —
            underpin both.
          </p>
        </InsightBox>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 16, textAlign: "center", marginBottom: 0 }}>
          Explore the Bayesian Thinking page to see the other side of the coin.
        </p>
      </SectionCard>
    </section>
  );
}
