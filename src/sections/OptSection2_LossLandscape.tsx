import { useMemo } from "react";
import {
  SectionHeader,
  SectionCard,
  InsightBox,
} from "../components/Layout/SectionCard";
import { ContourPlot } from "../components/Optimization/ContourPlot";
import { loss } from "../utils/optimization";

export function OptSection2_LossLandscape() {
  const lossFn = useMemo(() => loss, []);

  return (
    <section>
      <SectionHeader
        number={2}
        title="The Loss Landscape"
        id="opt-landscape"
      />

      <SectionCard>
        <p style={{ marginTop: 0 }}>
          What you just explored by hand is a <strong style={{ color: "#f8fafc" }}>loss landscape</strong>.
          Every possible combination of hot and cold settings maps to a
          discomfort value. The bright yellow regions are comfortable (low loss);
          the dark purple regions are miserable (high loss).
        </p>
        <p>
          Notice the <strong style={{ color: "#f8fafc" }}>diagonal flow lines</strong>.
          Points along the same diagonal have the same total water flow.
          The <span style={{ color: "#4ade80" }}>green line</span> marks ideal
          flow (0.7). Below it — toward the bottom-left corner — you're in
          dribble territory, and discomfort spikes no matter the temperature.
        </p>
        <p>
          Hover over the plot to inspect any point. The valley — the bright
          spot — is where you want to be.
        </p>
      </SectionCard>

      <SectionCard>
        <ContourPlot lossFn={lossFn} interactive showAxes showFlowLines />
      </SectionCard>

      <SectionCard>
        <InsightBox>
          <p>
            <strong>Optimization = finding the valley.</strong> Every
            optimization algorithm is just a strategy for navigating this
            landscape to find the lowest point — without being able to see the
            whole map at once.
          </p>
        </InsightBox>
      </SectionCard>
    </section>
  );
}
