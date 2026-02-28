import styles from "./TopNav.module.css";

export type PageId = "bayesian" | "optimization";

interface Props {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

const TABS: { id: PageId; label: string }[] = [
  { id: "bayesian", label: "Bayesian Thinking" },
  { id: "optimization", label: "Optimization" },
];

export function TopNav({ activePage, onNavigate }: Props) {
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${
            activePage === tab.id ? styles.tabActive : ""
          }`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
