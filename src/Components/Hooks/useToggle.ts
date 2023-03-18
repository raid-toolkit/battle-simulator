import React from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(() => setValue((value) => !value), []);
  return [value, toggle] as const;
}
