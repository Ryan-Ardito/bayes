import { useCallback, useEffect, useRef } from "react";

/**
 * Provides step / run / reset controls for iterative algorithms.
 * `onStep` is called on each tick; the loop runs at ~20 fps when playing.
 */
export function useAnimationLoop(onStep: () => boolean) {
  const rafId = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lastTime = useRef(0);
  const onStepRef = useRef(onStep);
  const tickRef = useRef<(time: number) => void>(() => {});

  useEffect(() => {
    onStepRef.current = onStep;
  });

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  // Initialize tickRef once — it reads everything through refs, so no stale closures
  useEffect(() => {
    tickRef.current = (time: number) => {
      if (!runningRef.current) return;
      if (time - lastTime.current >= 50) {
        lastTime.current = time;
        const shouldContinue = onStepRef.current();
        if (!shouldContinue) {
          stop();
          return;
        }
      }
      rafId.current = requestAnimationFrame((t) => tickRef.current(t));
    };
  }, [stop]);

  const run = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastTime.current = 0;
    rafId.current = requestAnimationFrame((t) => tickRef.current(t));
  }, []);

  const step = useCallback(() => {
    stop();
    onStepRef.current();
  }, [stop]);

  return { step, run, stop, isRunning: runningRef };
}
