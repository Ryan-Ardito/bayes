import { useMemo, useState } from "react";
import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";
import { ContourPlot } from "../components/Optimization/ContourPlot";
import { AlgorithmControls } from "../components/Optimization/AlgorithmControls";
import { useGradientDescent } from "../hooks/useGradientDescent";
import { loss } from "../utils/optimization";
import { OPTIMIZATION_COLORS } from "../utils/constants";
import iStyles from "../components/Interactive/Interactive.module.css";

export function OptSection3_GradientDescent() {
  const [learningRate, setLearningRate] = useState(0.05);
  const lossFn = useMemo(() => loss, []);
  const gd = useGradientDescent(learningRate, lossFn);

  return (
    <section>
      <SectionHeader
        number={3}
        title="Gradient Descent"
        id="opt-gradient"
      />

      <SectionCard>
        <p style={{ fontSize: 18, color: "#f8fafc", fontStyle: "italic", marginTop: 0 }}>
          What if you could feel which direction reduces discomfort?
        </p>
        <p>
          Gradient descent does exactly that. At each step, it computes the
          <strong style={{ color: "#f8fafc" }}> gradient</strong> — a vector
          pointing toward increasing loss — then takes a step in the
          <em> opposite</em> direction. The <strong style={{ color: "#f8fafc" }}>learning rate</strong> controls
          how big each step is.
        </p>
        <p>
          The gradient here is <strong style={{ color: "#f8fafc" }}>3D</strong> — it
          has a{" "}
          <span style={{ color: "#f97316" }}>temperature component</span> and a{" "}
          <span style={{ color: "#22d3ee" }}>flow component</span>. Watch how the
          algorithm balances getting the temperature right with finding enough
          water pressure. The dot size at each point shows the current flow rate.
        </p>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 8 }}>
          Click the plot to set a starting point
        </h3>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 0, marginBottom: 16 }}>
          Then use Step or Run to watch gradient descent navigate the landscape.
        </p>

        <ContourPlot
          lossFn={lossFn}
          trace={gd.trace}
          traceColor={OPTIMIZATION_COLORS.gradientDescent}
          showGradientArrows
          showFlowLines
          onClick={(h, c) => gd.setStart(h, c)}
          interactive
          showAxes
        />

        <div style={{ marginTop: 16 }}>
          <div className={iStyles.sliderGroup}>
            <div className={iStyles.sliderLabel}>
              <span>Learning Rate</span>
              <span className={iStyles.sliderLabelValue}>
                {learningRate.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              className={iStyles.slider}
              min={0.001}
              max={0.5}
              step={0.001}
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <AlgorithmControls
          step={gd.step}
          run={gd.run}
          stop={gd.stop}
          reset={gd.reset}
          isRunning={gd.isRunning}
          stats={[
            { label: "Steps", value: String(gd.stepCount) },
            {
              label: "Loss",
              value:
                gd.trace.length > 0
                  ? gd.trace[gd.trace.length - 1].loss.toFixed(2)
                  : "—",
            },
            {
              label: "Status",
              value: gd.converged
                ? "Converged"
                : gd.trace.length === 0
                  ? "Click to start"
                  : "Running",
            },
          ]}
        />
      </SectionCard>

      <SectionCard>
        <InsightBox>
          <p>
            Try a <strong>high learning rate</strong> (0.3+) and watch it
            overshoot the valley, bouncing back and forth. Then try a
            <strong> very low rate</strong> (0.005) and watch it crawl. The art
            of gradient descent is choosing the right step size.
          </p>
        </InsightBox>
      </SectionCard>
    </section>
  );
}
