/**
 * Loss function and optimization utilities for the shower knob metaphor.
 *
 * Two parameters (hot, cold) in [0, 1] control:
 *   - temperature = weighted blend of hot (60°C) and cold (10°C)
 *   - flow        = total water (hot + cold), range [0, 2]
 *
 * Loss = 1 / comfort.  Comfort is a product of temperature comfort and
 * flow comfort, both Gaussian-peaked at their ideal values.  This means
 * loss is always positive and a dribble is *extremely* uncomfortable
 * regardless of temperature.
 */

// ── physical model ─────────────────────────────────────────────
export const IDEAL_TEMP = 38;
export const IDEAL_FLOW = 0.7;

export function temperature(hot: number, cold: number): number {
  return (hot * 60 + cold * 10) / (hot + cold + 0.01);
}

export function flow(hot: number, cold: number): number {
  return hot + cold;
}

// ── comfort → loss (inverse relationship) ──────────────────────
export function comfort(hot: number, cold: number): number {
  const temp = temperature(hot, cold);
  const f = flow(hot, cold);

  // Temperature comfort: Gaussian peaked at IDEAL_TEMP, σ ≈ 5°C
  const tempC = Math.exp(-((temp - IDEAL_TEMP) ** 2) / 50);

  // Flow comfort: asymmetric Gaussian — dribble is much worse than excess
  const flowSigma = f < IDEAL_FLOW ? 0.2 : 0.5;
  const flowC = Math.exp(-((f - IDEAL_FLOW) ** 2) / (2 * flowSigma ** 2));

  // Flow existence: drops to 0 when no water flows
  const flowExists = 1 - Math.exp(-f * 10);

  return tempC * flowC * flowExists;
}

export function loss(hot: number, cold: number): number {
  return 1 / (comfort(hot, cold) + 0.005);
}

/**
 * Enhanced loss with a Gaussian "trap" (local minimum) for SA demos.
 * The trap is proportional to base loss so result stays positive.
 * Located at a cold, decent-flow setting where GD gets stuck.
 */
export function lossWithTrap(hot: number, cold: number): number {
  const base = loss(hot, cold);
  const trapX = 0.15,
    trapY = 0.65;
  const dist2 = (hot - trapX) ** 2 + (cold - trapY) ** 2;
  // Reduces local loss by up to 80%; minimum is base * 0.2 > 0
  const trap = base * 0.8 * Math.exp(-dist2 / (2 * 0.06 ** 2));
  return base - trap;
}

// ── numerical gradient (central differences) ──────────────────
const H = 1e-4;

export function gradient(
  hot: number,
  cold: number,
  lossFn: (h: number, c: number) => number = loss
): [number, number] {
  const dHot = (lossFn(hot + H, cold) - lossFn(hot - H, cold)) / (2 * H);
  const dCold = (lossFn(hot, cold + H) - lossFn(hot, cold - H)) / (2 * H);
  return [dHot, dCold];
}

/**
 * Decompose the loss gradient into its temperature and flow components.
 *
 * The chain rule gives:
 *   ∂loss/∂hot  = (∂loss/∂temp)(∂temp/∂hot)  + (∂loss/∂flow)(∂flow/∂hot)
 *   ∂loss/∂cold = (∂loss/∂temp)(∂temp/∂cold) + (∂loss/∂flow)(∂flow/∂cold)
 *
 * Since ∂flow/∂hot = ∂flow/∂cold = 1, we can solve for the two
 * scalar partials ∂loss/∂temp and ∂loss/∂flow, then reconstruct
 * the temperature-component and flow-component vectors.
 */
export function gradientDecomposed(
  hot: number,
  cold: number,
  lossFn: (h: number, c: number) => number = loss
): { temp: [number, number]; flow: [number, number]; total: [number, number] } {
  const total = gradient(hot, cold, lossFn);

  // Jacobian of (temp, flow) w.r.t. (hot, cold)
  const denom = hot + cold + 0.01;
  const dtdh = (50 * cold + 0.6) / (denom * denom); // ∂temp/∂hot
  const dtdc = (-50 * hot + 0.1) / (denom * denom); // ∂temp/∂cold
  // ∂flow/∂hot = 1, ∂flow/∂cold = 1

  // Solve 2×2 system:
  //   total[0] = dLdTemp * dtdh + dLdFlow * 1
  //   total[1] = dLdTemp * dtdc + dLdFlow * 1
  const det = dtdh - dtdc;
  if (Math.abs(det) < 1e-10) {
    // Degenerate — attribute all to total
    return { temp: [0, 0], flow: total, total };
  }

  const dLdTemp = (total[0] - total[1]) / det;
  const dLdFlow = total[0] - dLdTemp * dtdh;

  const tempComponent: [number, number] = [dLdTemp * dtdh, dLdTemp * dtdc];
  const flowComponent: [number, number] = [dLdFlow, dLdFlow]; // always diagonal

  return { temp: tempComponent, flow: flowComponent, total };
}

// ── flow iso-line positions ────────────────────────────────────
/** Flow values at which to draw iso-lines on the contour plot. */
export const FLOW_ISO_VALUES = [0.25, 0.5, 0.7, 1.0, 1.25];

// ── pre-computed loss grid for contour rendering ───────────────
export interface LossGrid {
  data: Float64Array;
  width: number;
  height: number;
  min: number;
  max: number;
}

export function computeLossGrid(
  resolution: number,
  lossFn: (h: number, c: number) => number = loss
): LossGrid {
  const data = new Float64Array(resolution * resolution);
  let min = Infinity;
  let max = -Infinity;

  for (let row = 0; row < resolution; row++) {
    const cold = row / (resolution - 1);
    for (let col = 0; col < resolution; col++) {
      const hot = col / (resolution - 1);
      const v = lossFn(hot, cold);
      data[row * resolution + col] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  return { data, width: resolution, height: resolution, min, max };
}

// ── helpers ────────────────────────────────────────────────────
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export interface Point {
  hot: number;
  cold: number;
  loss: number;
}
