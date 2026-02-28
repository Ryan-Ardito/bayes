import { useCallback, useEffect, useRef, useState } from "react";
import { type Point, loss } from "../utils/optimization";
import { useAnimationLoop } from "./useAnimationLoop";

export interface MCState {
  samples: Point[];
  best: Point | null;
  stepCount: number;
  done: boolean;
}

export function useMonteCarloSearch(
  lossFn: (h: number, c: number) => number = loss,
  maxSamples = 500
) {
  const [state, setState] = useState<MCState>({
    samples: [],
    best: null,
    stepCount: 0,
    done: false,
  });

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const onStep = useCallback((): boolean => {
    const cur = stateRef.current;
    if (cur.done) return false;
    if (cur.stepCount >= maxSamples) {
      setState((s) => ({ ...s, done: true }));
      return false;
    }

    const hot = Math.random();
    const cold = Math.random();
    const l = lossFn(hot, cold);
    const point: Point = { hot, cold, loss: l };

    const newBest =
      cur.best === null || l < cur.best.loss ? point : cur.best;

    setState({
      samples: [...cur.samples, point],
      best: newBest,
      stepCount: cur.stepCount + 1,
      done: cur.stepCount + 1 >= maxSamples,
    });
    return cur.stepCount + 1 < maxSamples;
  }, [lossFn, maxSamples]);

  const { step, run, stop, isRunning } = useAnimationLoop(onStep);

  const reset = useCallback(() => {
    stop();
    setState({ samples: [], best: null, stepCount: 0, done: false });
  }, [stop]);

  return { ...state, reset, step, run, stop, isRunning };
}
