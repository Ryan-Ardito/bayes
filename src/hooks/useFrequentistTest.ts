import { useMemo } from "react";
import { waldConfidenceInterval, binomialTestPValue } from "../utils/stats";

export interface FrequentistResult {
  pointEstimate: number;
  confidenceInterval: [number, number];
  pValue: number;
  rejectNull: boolean;
}

export function useFrequentistTest(
  heads: number,
  total: number,
  alpha = 0.05
): FrequentistResult {
  return useMemo(() => {
    const pointEstimate = total === 0 ? 0.5 : heads / total;
    const confidenceInterval = waldConfidenceInterval(heads, total);
    const pValue = binomialTestPValue(heads, total);

    return {
      pointEstimate,
      confidenceInterval,
      pValue,
      rejectNull: pValue < alpha,
    };
  }, [heads, total, alpha]);
}
