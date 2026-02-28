import { useCallback, useEffect, useRef, useState } from "react";

export interface CoinTrialState {
  flips: ("H" | "T")[];
  heads: number;
  tails: number;
  total: number;
  isFlipping: boolean;
}

export function useCoinTrial(trueBias = 0.5) {
  const [state, setState] = useState<CoinTrialState>({
    flips: [],
    heads: 0,
    tails: 0,
    total: 0,
    isFlipping: false,
  });
  const biasRef = useRef(trueBias);
  useEffect(() => {
    biasRef.current = trueBias;
  }, [trueBias]);

  const flip = useCallback((count = 1) => {
    setState((prev) => {
      const newFlips: ("H" | "T")[] = [];
      for (let i = 0; i < count; i++) {
        newFlips.push(Math.random() < biasRef.current ? "H" : "T");
      }
      const newHeads = newFlips.filter((f) => f === "H").length;
      return {
        flips: [...prev.flips, ...newFlips],
        heads: prev.heads + newHeads,
        tails: prev.tails + (count - newHeads),
        total: prev.total + count,
        isFlipping: true,
      };
    });
    // Reset flipping state after animation
    setTimeout(() => setState((prev) => ({ ...prev, isFlipping: false })), 400);
  }, []);

  const reset = useCallback(() => {
    setState({
      flips: [],
      heads: 0,
      tails: 0,
      total: 0,
      isFlipping: false,
    });
  }, []);

  return { ...state, flip, reset };
}
