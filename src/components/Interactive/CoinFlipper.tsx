import { useCoinTrial } from "../../hooks/useCoinTrial";
import styles from "./Interactive.module.css";

interface Props {
  trueBias?: number;
  onFlipResult?: (heads: number, tails: number, total: number) => void;
  /** Externally controlled trial state */
  external?: ReturnType<typeof useCoinTrial>;
  showControls?: boolean;
}

export function CoinFlipper({
  trueBias = 0.5,
  onFlipResult,
  external,
  showControls = true,
}: Props) {
  const internal = useCoinTrial(trueBias);
  const trial = external ?? internal;
  const lastFlip = trial.flips.length > 0 ? trial.flips[trial.flips.length - 1] : null;

  const handleFlip = (count: number) => {
    trial.flip(count);
    // Call onFlipResult after state updates
    setTimeout(() => {
      onFlipResult?.(
        trial.heads + (count === 1 ? (Math.random() < trueBias ? 1 : 0) : 0),
        trial.tails,
        trial.total + count
      );
    }, 0);
  };

  return (
    <div className={styles.coinContainer}>
      <div
        className={`${styles.coin} ${
          lastFlip === "H" ? styles.coinHeads : styles.coinTails
        } ${trial.isFlipping ? styles.coinFlipping : ""}`}
        onClick={() => handleFlip(1)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleFlip(1)}
        aria-label="Flip coin"
      >
        {lastFlip ?? "?"}
      </div>

      <div className={styles.tally}>
        <div className={styles.tallyItem}>
          <div className={`${styles.tallyDot} ${styles.tallyHeads}`} />
          Heads: {trial.heads}
        </div>
        <div className={styles.tallyItem}>
          <div className={`${styles.tallyDot} ${styles.tallyTails}`} />
          Tails: {trial.tails}
        </div>
        <div className={styles.tallyItem}>Total: {trial.total}</div>
      </div>

      {showControls && (
        <div className={styles.coinButtons}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => handleFlip(1)}
          >
            Flip 1
          </button>
          <button className={styles.btn} onClick={() => handleFlip(10)}>
            Flip 10
          </button>
          <button className={styles.btn} onClick={() => handleFlip(50)}>
            Flip 50
          </button>
          <button
            className={`${styles.btn} ${styles.btnDanger} ${styles.btnSmall}`}
            onClick={trial.reset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
