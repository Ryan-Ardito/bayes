import { useMemo } from "react";
import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";
import { ContourPlot } from "../components/Optimization/ContourPlot";
import { AlgorithmControls } from "../components/Optimization/AlgorithmControls";
import { AlgorithmComparison } from "../components/Optimization/AlgorithmComparison";
import { useMonteCarloSearch } from "../hooks/useMonteCarloSearch";
import { useGradientDescent } from "../hooks/useGradientDescent";
import { useSimulatedAnnealing } from "../hooks/useSimulatedAnnealing";
import { loss } from "../utils/optimization";
import { OPTIMIZATION_COLORS } from "../utils/constants";

export function OptSection5_MonteCarlo() {
  const lossFn = useMemo(() => loss, []);
  const mc = useMonteCarloSearch(lossFn);
  const gd = useGradientDescent(0.05, lossFn);
  const sa = useSimulatedAnnealing(lossFn);

  return (
    <section>
      <SectionHeader
        number={5}
        title="Monte Carlo Methods"
        id="opt-montecarlo"
      />

      <SectionCard>
        <p style={{ fontSize: 18, color: "#f8fafc", fontStyle: "italic", marginTop: 0 }}>
          What if you just tried random settings?
        </p>
        <p>
          Monte Carlo search is the simplest possible approach: pick random knob
          settings, evaluate the discomfort, and keep track of the best one
          found so far. No gradients, no temperature schedules — just pure
          randomness.
        </p>
        <p>
          It sounds naive, but it's surprisingly effective in high dimensions
          where the landscape is too complex for gradient-based methods.
        </p>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Random Sampling
        </h3>
        <ContourPlot
          lossFn={lossFn}
          samples={mc.samples}
          bestPoint={mc.best}
          interactive
          showAxes
        />

        <AlgorithmControls
          step={mc.step}
          run={mc.run}
          stop={mc.stop}
          reset={mc.reset}
          isRunning={mc.isRunning}
          stats={[
            { label: "Samples", value: String(mc.stepCount) },
            {
              label: "Best loss",
              value: mc.best ? mc.best.loss.toFixed(2) : "—",
            },
          ]}
        />
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Three-Way Comparison
        </h3>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 0, marginBottom: 16 }}>
          Run each algorithm above, then see how they compare. Click "Run All"
          to start all three from scratch.
        </p>

        <button
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #6366f1",
            background: "#6366f1",
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: 16,
          }}
          onClick={() => {
            mc.reset();
            gd.reset();
            sa.reset();
            // Start GD and SA from a random corner
            const startH = 0.1 + Math.random() * 0.15;
            const startC = 0.1 + Math.random() * 0.15;
            setTimeout(() => {
              gd.setStart(startH, startC);
              sa.setStart(startH, startC);
              setTimeout(() => {
                mc.run();
                gd.run();
                sa.run();
              }, 50);
            }, 50);
          }}
        >
          Run All
        </button>

        <AlgorithmComparison
          methods={[
            {
              label: "Gradient Descent",
              color: OPTIMIZATION_COLORS.gradientDescent,
              steps: gd.stepCount,
              best: gd.bestPoint,
            },
            {
              label: "Simulated Annealing",
              color: OPTIMIZATION_COLORS.simulatedAnnealing,
              steps: sa.stepCount,
              best: sa.bestPoint,
            },
            {
              label: "Monte Carlo",
              color: OPTIMIZATION_COLORS.monteCarlo,
              steps: mc.stepCount,
              best: mc.best,
            },
          ]}
        />
      </SectionCard>

      <SectionCard>
        <InsightBox>
          <p>
            Each method has trade-offs. <strong>Gradient descent</strong> is fast
            but greedy. <strong>Simulated annealing</strong> explores more but
            needs tuning. <strong>Monte Carlo</strong> is simple and unbiased but
            slow. In practice, hybrid methods often combine their strengths.
          </p>
        </InsightBox>
      </SectionCard>
    </section>
  );
}
