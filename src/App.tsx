import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { TopNav, type PageId } from "./components/Navigation/TopNav";
import { BayesianPage } from "./pages/BayesianPage";
import { OptimizationPage } from "./pages/OptimizationPage";

function getPageFromHash(): PageId {
  return window.location.hash === "#optimization" ? "optimization" : "bayesian";
}

function App() {
  const [page, setPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const onHash = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleNavigate = useCallback((p: PageId) => {
    window.location.hash = p === "optimization" ? "#optimization" : "";
    setPage(p);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="app">
      <TopNav activePage={page} onNavigate={handleNavigate} />
      {page === "bayesian" ? <BayesianPage /> : <OptimizationPage />}
    </div>
  );
}

export default App;
