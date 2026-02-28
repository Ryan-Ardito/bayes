import { useCallback, useMemo } from "react";
import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";
import { ContourPlot } from "../components/Optimization/ContourPlot";
import { useSimulatedAnnealing } from "../hooks/useSimulatedAnnealing";
import { useGradientDescent } from "../hooks/useGradientDescent";
import { lossWithTrap } from "../utils/optimization";
import { OPTIMIZATION_COLORS } from "../utils/constants";
import styles from "../components/Optimization/Optimization.module.css";

/** SA trace color: red (hot) → blue (cool) as temperature drops. */
function saColor(index: number, total: number): string {
  const t = index / Math.max(total - 1, 1);
  const r = Math.round(239 * (1 - t) + 59 * t);
  const g = Math.round(68 * (1 - t) + 130 * t);
  const b = Math.round(68 * (1 - t) + 246 * t);
  return `rgb(${r},${g},${b})`;
}

// Fixed start near the trap
const TRAP_START = { hot: 0.18, cold: 0.6 };

export function OptSection4_SimulatedAnnealing() {
  const lossFn = useMemo(() => lossWithTrap, []);
  const sa = useSimulatedAnnealing(lossFn);
  const gd = useGradientDescent(0.05, lossFn);

  const startBoth = useCallback(() => {
    sa.setStart(TRAP_START.hot, TRAP_START.cold);
    gd.setStart(TRAP_START.hot, TRAP_START.cold);
  }, [sa, gd]);

  const runBoth = useCallback(() => {
    sa.run();
    gd.run();
  }, [sa, gd]);

  const resetBoth = useCallback(() => {
    sa.reset();
    gd.reset();
  }, [sa, gd]);

  return (
    <section>
      <SectionHeader
        number={4}
        title="Simulated Annealing"
        id="opt-annealing"
      />

      <SectionCard>
        <p style={{ fontSize: 18, color: "#f8fafc", fontStyle: "italic", marginTop: 0 }}>
          What if you sometimes tried a worse setting on purpose?
        </p>
        <p>
          Gradient descent always goes downhill — which means it can get
          <strong style={{ color: "#f8fafc" }}> stuck in local minima</strong>.
          Simulated annealing borrows an idea from metallurgy: start "hot"
          (accept bad moves often) and slowly cool down (become pickier). This
          lets it escape traps that would catch gradient descent.
        </p>
        <p>
          The landscape below has a <strong style={{ color: "#f8fafc" }}>trap</strong> — a
          local minimum near the start. Watch how GD gets stuck while SA
          escapes.
        </p>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Side-by-Side: GD vs SA
        </h3>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 0, marginBottom: 12 }}>
          Both start near the trap. Press "Start &amp; Run" to compare.
        </p>

        <div className={styles.comparisonGrid}>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: OPTIMIZATION_COLORS.gradientDescent,
                marginBottom: 8,
              }}
            >
              Gradient Descent
            </div>
            <ContourPlot
              lossFn={lossFn}
              trace={gd.trace}
              traceColor={OPTIMIZATION_COLORS.gradientDescent}
              interactive={false}
              showAxes={false}
            />
            <div
              style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, textAlign: "center" }}
            >
              Steps: {gd.stepCount} | Loss:{" "}
              {gd.bestPoint ? gd.bestPoint.loss.toFixed(1) : "—"}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: OPTIMIZATION_COLORS.simulatedAnnealing,
                marginBottom: 8,
              }}
            >
              Simulated Annealing
            </div>
            <ContourPlot
              lossFn={lossFn}
              trace={sa.trace}
              traceColorFn={saColor}
              traceColor={OPTIMIZATION_COLORS.simulatedAnnealing}
              interactive={false}
              showAxes={false}
            />
            <div
              style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, textAlign: "center" }}
            >
              Steps: {sa.stepCount} | Temp: {sa.saTemp.toFixed(1)} | Loss:{" "}
              {sa.bestPoint ? sa.bestPoint.loss.toFixed(1) : "—"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button
            className="btn btnSmall btnPrimary"
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #6366f1",
              background: "#6366f1",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => {
              startBoth();
              // Small delay so state settles before run
              setTimeout(runBoth, 50);
            }}
          >
            Start &amp; Run
          </button>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #ef4444",
              background: "transparent",
              color: "#ef4444",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={resetBoth}
          >
            Reset Both
          </button>
        </div>
      </SectionCard>

      <SectionCard>
        <InsightBox>
          <p>
            Notice the SA trace colour shifting from <strong style={{ color: "#ef4444" }}>red</strong> (high
            temperature — exploring wildly) to <strong style={{ color: "#3b82f6" }}>blue</strong> (low
            temperature — settling down). Early randomness is the key to
            escaping local traps.
          </p>
        </InsightBox>
      </SectionCard>
    </section>
  );
}
