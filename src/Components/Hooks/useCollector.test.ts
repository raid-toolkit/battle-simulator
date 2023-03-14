import { renderHook, act } from "@testing-library/react";
import { useCollector } from "./useCollector";

function renderDebounceCallback<CallbackArgs extends any[], CallbackState>(
  callback: (state: CallbackState) => void,
  collect: (
    state: CallbackState | undefined,
    ...args: CallbackArgs
  ) => CallbackState,
  wait = 100,
  leading = false
) {
  return renderHook(() => useCollector(callback, collect, wait, leading));
}

describe("useDebounce()", () => {
  jest.useFakeTimers();

  /**
   * @jest-environment jsdom
   */
  it("should invoke the callback on the leading edge", () => {
    const cb = jest.fn();
    const tick = jest.fn((n = 0) => n++);
    const { result } = renderDebounceCallback(cb, tick, 100, true);

    act(result.current);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(tick).toHaveBeenCalledTimes(1);

    act(result.current);
    act(result.current);
    act(result.current);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(tick).toHaveBeenCalledTimes(4);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(cb).toHaveBeenCalledTimes(2);
    expect(tick).toHaveBeenCalledTimes(4);

    act(result.current);
    expect(cb).toHaveBeenCalledTimes(3);
    expect(tick).toHaveBeenCalledTimes(5);

    act(result.current);
    act(result.current);
    act(result.current);

    expect(cb).toHaveBeenCalledTimes(3);
    expect(tick).toHaveBeenCalledTimes(8);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(cb).toHaveBeenCalledTimes(4);
    expect(tick).toHaveBeenCalledTimes(8);
  });
});
