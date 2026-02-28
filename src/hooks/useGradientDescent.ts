import { useCallback, useEffect, useRef, useState } from "react";
import {
  type Point,
  clamp,
  gradient,
  loss,
  type LossGrid,
} from "../utils/optimization";
import { useAnimationLoop } from "./useAnimationLoop";

export interface GradientDescentState {
  trace: Point[];
  stepCount: number;
  converged: boolean;
}

export function useGradientDescent(
  learningRate: number,
  lossFn: (h: number, c: number) => number = loss,
  maxSteps = 500
) {
  const [state, setState] = useState<GradientDescentState>({
    trace: [],
    stepCount: 0,
    converged: false,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const lrRef = useRef(learningRate);
  useEffect(() => {
    lrRef.current = learningRate;
  });

  const onStep = useCallback((): boolean => {
    const cur = stateRef.current;
    if (cur.trace.length === 0 || cur.converged) return false;
    if (cur.stepCount >= maxSteps) {
      setState((s) => ({ ...s, converged: true }));
      return false;
    }

    const last = cur.trace[cur.trace.length - 1];
    const [dh, dc] = gradient(last.hot, last.cold, lossFn);
    const lr = lrRef.current;
    const newHot = clamp(last.hot - lr * dh, 0, 1);
    const newCold = clamp(last.cold - lr * dc, 0, 1);
    const newLoss = lossFn(newHot, newCold);

    const gradMag = Math.sqrt(dh * dh + dc * dc);
    const converged = gradMag < 0.5;

    const newPoint: Point = { hot: newHot, cold: newCold, loss: newLoss };
    setState({
      trace: [...cur.trace, newPoint],
      stepCount: cur.stepCount + 1,
      converged,
    });
    return !converged;
  }, [lossFn, maxSteps]);

  const { step, run, stop, isRunning } = useAnimationLoop(onStep);

  const setStart = useCallback(
    (hot: number, cold: number) => {
      stop();
      const startPoint: Point = { hot, cold, loss: lossFn(hot, cold) };
      setState({ trace: [startPoint], stepCount: 0, converged: false });
    },
    [lossFn, stop]
  );

  const reset = useCallback(() => {
    stop();
    setState({ trace: [], stepCount: 0, converged: false });
  }, [stop]);

  const bestPoint =
    state.trace.length > 0
      ? state.trace.reduce((best, p) => (p.loss < best.loss ? p : best))
      : null;

  return { ...state, setStart, reset, step, run, stop, isRunning, bestPoint };
}

// Find the global minimum of a loss grid (for display purposes)
export function findGridMinimum(grid: LossGrid): { hot: number; cold: number } {
  let minIdx = 0;
  for (let i = 1; i < grid.data.length; i++) {
    if (grid.data[i] < grid.data[minIdx]) minIdx = i;
  }
  const col = minIdx % grid.width;
  const row = Math.floor(minIdx / grid.width);
  return { hot: col / (grid.width - 1), cold: row / (grid.height - 1) };
}
