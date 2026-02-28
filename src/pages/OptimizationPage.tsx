import { useCallback, useEffect, useState } from "react";
import { ProgressSidebar } from "../components/Layout/ProgressSidebar";
import { OPTIMIZATION_SECTIONS, type OptSectionId } from "../utils/constants";
import { OptSection1_TheProblem } from "../sections/OptSection1_TheProblem";
import { OptSection2_LossLandscape } from "../sections/OptSection2_LossLandscape";
import { OptSection3_GradientDescent } from "../sections/OptSection3_GradientDescent";
import { OptSection4_SimulatedAnnealing } from "../sections/OptSection4_SimulatedAnnealing";
import { OptSection5_MonteCarlo } from "../sections/OptSection5_MonteCarlo";
import { OptSection6_WhyItMatters } from "../sections/OptSection6_WhyItMatters";

export function OptimizationPage() {
  const [activeSection, setActiveSection] = useState<OptSectionId>(
    OPTIMIZATION_SECTIONS[0].id
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as OptSectionId);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    for (const section of OPTIMIZATION_SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <ProgressSidebar
        sections={OPTIMIZATION_SECTIONS}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <main className="mainContent">
        <div className="hero">
          <h1 className="heroTitle">
            <span className="heroAccent">Optimization</span> Algorithms
          </h1>
          <p className="heroSubtitle">
            An interactive exploration of gradient descent, simulated annealing,
            and Monte Carlo methods — through the lens of a shower with two
            knobs.
          </p>
        </div>

        <OptSection1_TheProblem />
        <OptSection2_LossLandscape />
        <OptSection3_GradientDescent />
        <OptSection4_SimulatedAnnealing />
        <OptSection5_MonteCarlo />
        <OptSection6_WhyItMatters />
      </main>
    </>
  );
}
