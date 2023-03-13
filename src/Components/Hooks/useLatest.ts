import * as React from "react";

export function useLatest<T extends any>(current: T) {
  const storedValue = React.useRef(current);
  React.useEffect(() => {
    storedValue.current = current;
  });
  return storedValue;
}
