import React from "react";
import { useLatest } from "./useLatest";

export function useCollector<CallbackArgs extends any[], CallbackState>(
  callback: (state: CallbackState) => void,
  collect: (
    state: CallbackState | undefined,
    ...args: CallbackArgs
  ) => CallbackState,
  wait = 100,
  leading = false
): (...args: CallbackArgs) => void {
  const storedCallback = useLatest(callback);
  const storedCollector = useLatest(collect);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const state = React.useRef<CallbackState | undefined>(undefined);
  // Cleans up pending timeouts when the deps change
  React.useEffect(
    () => () => {
      timeout.current && clearTimeout(timeout.current);
      timeout.current = undefined;
      state.current = undefined;
    },
    [wait, leading, storedCallback]
  );

  return React.useCallback(
    function () {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      state.current = storedCollector.current.apply(null, [
        state.current,
        ...(args as unknown as CallbackArgs),
      ]);
      const { current } = timeout;
      // Calls on leading edge
      if (current === undefined && leading) {
        timeout.current = setTimeout(() => {
          timeout.current = undefined;
        }, wait);
        // eslint-disable-next-line prefer-spread
        storedCallback.current(state.current);
        return;
      }
      // Clear the timeout every call and start waiting again
      current && clearTimeout(current);
      // Waits for `wait` before invoking the callback
      timeout.current = setTimeout(() => {
        timeout.current = undefined;
        const currentState = state.current;
        state.current = undefined;
        if (currentState === undefined) {
          console.warn("Debounce callback was called with no state");
          return;
        }
        storedCallback.current(currentState);
      }, wait);
    },
    [wait, leading, storedCallback, storedCollector]
  );
}
