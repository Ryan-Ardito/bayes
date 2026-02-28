// @ts-expect-error jstat has no type definitions
import { jStat } from "jstat";

export function betaPdf(x: number, alpha: number, beta: number): number {
  return jStat.beta.pdf(x, alpha, beta);
}

export function betaCdf(x: number, alpha: number, beta: number): number {
  return jStat.beta.cdf(x, alpha, beta);
}

export function betaInv(p: number, alpha: number, beta: number): number {
  return jStat.beta.inv(p, alpha, beta);
}

export function betaMean(alpha: number, beta: number): number {
  return alpha / (alpha + beta);
}

export function betaMode(alpha: number, beta: number): number {
  if (alpha <= 1 && beta <= 1) return 0.5;
  if (alpha <= 1) return 0;
  if (beta <= 1) return 1;
  return (alpha - 1) / (alpha + beta - 2);
}

export function betaCredibleInterval(
  alpha: number,
  beta: number,
  level = 0.95
): [number, number] {
  const tail = (1 - level) / 2;
  return [betaInv(tail, alpha, beta), betaInv(1 - tail, alpha, beta)];
}

/** Frequentist confidence interval for a proportion using the Wald method */
export function waldConfidenceInterval(
  heads: number,
  total: number,
  level = 0.95
): [number, number] {
  if (total === 0) return [0, 1];
  const pHat = heads / total;
  const z = jStat.normal.inv(1 - (1 - level) / 2, 0, 1) as number;
  const se = Math.sqrt((pHat * (1 - pHat)) / total);
  return [Math.max(0, pHat - z * se), Math.min(1, pHat + z * se)];
}

/** Two-sided binomial test p-value for H₀: p = p0 */
export function binomialTestPValue(
  heads: number,
  total: number,
  p0 = 0.5
): number {
  if (total === 0) return 1;
  // Sum probabilities of outcomes as extreme or more extreme than observed
  let pValue = 0;
  const observedProb = jStat.binomial.pdf(heads, total, p0) as number;
  for (let k = 0; k <= total; k++) {
    const prob = jStat.binomial.pdf(k, total, p0) as number;
    if (prob <= observedProb + 1e-10) {
      pValue += prob;
    }
  }
  return Math.min(1, pValue);
}

/** Generate beta distribution curve data points */
export function betaCurvePoints(
  alpha: number,
  beta: number,
  numPoints = 200
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const x = i / numPoints;
    // Avoid exact 0 and 1 for numerical stability
    const xClamped = Math.max(0.001, Math.min(0.999, x));
    const y = betaPdf(xClamped, alpha, beta);
    points.push({ x, y: isFinite(y) ? y : 0 });
  }
  return points;
}
