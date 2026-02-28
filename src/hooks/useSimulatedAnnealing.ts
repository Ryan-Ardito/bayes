import { useCallback, useEffect, useRef, useState } from "react";
import { type Point, clamp, lossWithTrap } from "../utils/optimization";
import { useAnimationLoop } from "./useAnimationLoop";

export interface SAState {
  trace: Point[];
  stepCount: number;
  saTemp: number;
  done: boolean;
}

const INITIAL_TEMP = 200;
const COOLING_RATE = 0.995;
const MIN_TEMP = 0.1;

export function useSimulatedAnnealing(
  lossFn: (h: number, c: number) => number = lossWithTrap,
  maxSteps = 800
) {
  const [state, setState] = useState<SAState>({
    trace: [],
    stepCount: 0,
    saTemp: INITIAL_TEMP,
    done: false,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const onStep = useCallback((): boolean => {
    const cur = stateRef.current;
    if (cur.trace.length === 0 || cur.done) return false;
    if (cur.stepCount >= maxSteps || cur.saTemp < MIN_TEMP) {
      setState((s) => ({ ...s, done: true }));
      return false;
    }

    const last = cur.trace[cur.trace.length - 1];
    // Random neighbour — step size proportional to temperature
    const radius = 0.05 * (cur.saTemp / INITIAL_TEMP) + 0.005;
    const angle = Math.random() * 2 * Math.PI;
    const newHot = clamp(last.hot + radius * Math.cos(angle), 0, 1);
    const newCold = clamp(last.cold + radius * Math.sin(angle), 0, 1);
    const newLoss = lossFn(newHot, newCold);

    const delta = newLoss - last.loss;
    const accept = delta < 0 || Math.random() < Math.exp(-delta / cur.saTemp);

    const nextPoint: Point = accept
      ? { hot: newHot, cold: newCold, loss: newLoss }
      : last;

    const nextTemp = cur.saTemp * COOLING_RATE;

    setState({
      trace: [...cur.trace, nextPoint],
      stepCount: cur.stepCount + 1,
      saTemp: nextTemp,
      done: nextTemp < MIN_TEMP,
    });
    return nextTemp >= MIN_TEMP;
  }, [lossFn, maxSteps]);

  const { step, run, stop, isRunning } = useAnimationLoop(onStep);

  const setStart = useCallback(
    (hot: number, cold: number) => {
      stop();
      const startPoint: Point = { hot, cold, loss: lossFn(hot, cold) };
      setState({
        trace: [startPoint],
        stepCount: 0,
        saTemp: INITIAL_TEMP,
        done: false,
      });
    },
    [lossFn, stop]
  );

  const reset = useCallback(() => {
    stop();
    setState({ trace: [], stepCount: 0, saTemp: INITIAL_TEMP, done: false });
  }, [stop]);

  const bestPoint =
    state.trace.length > 0
      ? state.trace.reduce((best, p) => (p.loss < best.loss ? p : best))
      : null;

  return { ...state, setStart, reset, step, run, stop, isRunning, bestPoint };
}
