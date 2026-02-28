import { useState } from "react";
import {
  SectionHeader,
  SectionCard,
} from "../components/Layout/SectionCard";
import { ShowerKnobs } from "../components/Optimization/ShowerKnobs";

export function OptSection1_TheProblem() {
  const [hot, setHot] = useState(0.3);
  const [cold, setCold] = useState(0.3);

  return (
    <section>
      <SectionHeader number={1} title="The Problem" id="opt-problem" />

      <SectionCard>
        <p style={{ fontSize: 18, color: "#f8fafc", fontStyle: "italic", marginTop: 0 }}>
          You step into a shower. Two knobs. One goal: comfort.
        </p>
        <p>
          One knob controls hot water, the other cold. You need to find the
          right combination — not too hot, not too cold, and enough water
          pressure. Every setting has a "discomfort" score. Your job: minimize
          it.
        </p>
        <p>
          Try adjusting the knobs below. Can you find the sweet spot?
        </p>
      </SectionCard>

      <SectionCard>
        <h3 style={{ color: "#f8fafc", marginTop: 0, marginBottom: 16 }}>
          Adjust the Shower
        </h3>
        <ShowerKnobs
          hot={hot}
          cold={cold}
          onHotChange={setHot}
          onColdChange={setCold}
        />
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 16, marginBottom: 0 }}>
          Ideal: 38° at flow 0.70. The discomfort function penalises deviations
          from both temperature and flow — plus a harsh penalty when no water is
          flowing at all.
        </p>
      </SectionCard>
    </section>
  );
}
