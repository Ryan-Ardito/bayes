import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { ProgressSidebar } from "./components/Layout/ProgressSidebar";
import { SECTIONS, type SectionId } from "./utils/constants";
import { Section1_WhatIsProbability } from "./sections/Section1_WhatIsProbability";
import { Section2_Frequentist } from "./sections/Section2_Frequentist";
import { Section3_EnterBayes } from "./sections/Section3_EnterBayes";
import { Section4_CoinTrial } from "./sections/Section4_CoinTrial";
import { Section5_WhyItMatters } from "./sections/Section5_WhyItMatters";

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>(SECTIONS[0].id);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    for (const section of SECTIONS) {
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
    <div className="app">
      <ProgressSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <main className="mainContent">
        <div className="hero">
          <h1 className="heroTitle">
            <span className="heroAccent">Bayesian</span> Thinking
          </h1>
          <p className="heroSubtitle">
            An interactive exploration of Bayes' theorem, Bayesian statistics,
            and how they compare to frequentist methods.
          </p>
        </div>

        <Section1_WhatIsProbability />
        <Section2_Frequentist />
        <Section3_EnterBayes />
        <Section4_CoinTrial />
        <Section5_WhyItMatters />
      </main>
    </div>
  );
}

export default App;
