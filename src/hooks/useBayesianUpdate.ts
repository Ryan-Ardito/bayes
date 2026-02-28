import { useMemo } from "react";
import {
  betaMean,
  betaMode,
  betaCredibleInterval,
  betaCurvePoints,
} from "../utils/stats";

export interface BayesianResult {
  posteriorAlpha: number;
  posteriorBeta: number;
  posteriorMean: number;
  posteriorMode: number;
  credibleInterval: [number, number];
  priorCurve: { x: number; y: number }[];
  posteriorCurve: { x: number; y: number }[];
}

export function useBayesianUpdate(
  priorAlpha: number,
  priorBeta: number,
  heads: number,
  tails: number
): BayesianResult {
  return useMemo(() => {
    const posteriorAlpha = priorAlpha + heads;
    const posteriorBeta = priorBeta + tails;

    return {
      posteriorAlpha,
      posteriorBeta,
      posteriorMean: betaMean(posteriorAlpha, posteriorBeta),
      posteriorMode: betaMode(posteriorAlpha, posteriorBeta),
      credibleInterval: betaCredibleInterval(posteriorAlpha, posteriorBeta),
      priorCurve: betaCurvePoints(priorAlpha, priorBeta),
      posteriorCurve: betaCurvePoints(posteriorAlpha, posteriorBeta),
    };
  }, [priorAlpha, priorBeta, heads, tails]);
}
