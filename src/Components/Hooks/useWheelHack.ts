import React from "react";

export function useRefWithWheelHandler(callback: (e: WheelEvent) => void) {
  const onWheel = React.useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      callback(e);
    },
    [callback]
  );

  const [inputWheelRef, cleanup] = React.useMemo(() => {
    let currentTarget: HTMLInputElement | null | undefined;
    return [
      function attachListener(target: HTMLInputElement | null | undefined) {
        currentTarget = target;
        target?.addEventListener("wheel", onWheel, { passive: false });
      },
      function cleanupListener() {
        currentTarget?.removeEventListener("wheel", onWheel);
      },
    ];
  }, [onWheel]);

  React.useEffect(() => cleanup, [cleanup]);

  return inputWheelRef;
}
