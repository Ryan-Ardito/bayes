import { PRIORS } from "../../utils/constants";
import styles from "./Interactive.module.css";

type PriorKey = keyof typeof PRIORS;

interface Props {
  selected: PriorKey;
  onSelect: (key: PriorKey) => void;
  customAlpha?: number;
  customBeta?: number;
  onCustomChange?: (alpha: number, beta: number) => void;
}

export function PriorSelector({
  selected,
  onSelect,
  customAlpha,
  customBeta,
  onCustomChange,
}: Props) {
  return (
    <div>
      <div className={styles.priorOptions}>
        {(Object.entries(PRIORS) as [PriorKey, (typeof PRIORS)[PriorKey]][]).map(
          ([key, prior]) => (
            <button
              key={key}
              className={`${styles.priorOption} ${
                selected === key ? styles.priorOptionActive : ""
              }`}
              onClick={() => onSelect(key)}
            >
              <div
                className={`${styles.priorDot} ${
                  selected === key ? styles.priorDotActive : ""
                }`}
              >
                {selected === key && <div className={styles.priorDotInner} />}
              </div>
              <span>
                {prior.label}
                <span style={{ color: "#64748b", marginLeft: 8, fontSize: 12 }}>
                  Beta({prior.alpha}, {prior.beta})
                </span>
              </span>
            </button>
          )
        )}
      </div>

      {selected === "uniform" && onCustomChange && customAlpha != null && customBeta != null && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Alpha (α)</span>
              <span className={styles.sliderLabelValue}>{customAlpha.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min={0.1}
              max={50}
              step={0.1}
              value={customAlpha}
              onChange={(e) => onCustomChange(parseFloat(e.target.value), customBeta)}
            />
          </div>
          <div className={styles.sliderGroup}>
            <div className={styles.sliderLabel}>
              <span>Beta (β)</span>
              <span className={styles.sliderLabelValue}>{customBeta.toFixed(1)}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min={0.1}
              max={50}
              step={0.1}
              value={customBeta}
              onChange={(e) => onCustomChange(customAlpha, parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
