import React from "react";

const forageCache = new Map<LocalForage, Record<string, any>>();

function getCache(forage: LocalForage) {
  let cache = forageCache.get(forage);
  if (!cache) {
    cache = {};
    forageCache.set(forage, cache);
  }
  return cache;
}

export function useForage<T>(
  forage: LocalForage,
  key: string,
  defaultValue: T,
  validate: (value: T) => T = (a) => a
): [T, React.Dispatch<React.SetStateAction<T | null>>] {
  forage.getItem(key);

  const [state, setState] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    // previously loaded
    // if (forageValue.current === defaultValue) {
    //   return;
    // }
    forage.getItem<T>(key).then((value) => {
      setState(validate(value ?? defaultValue));
    });
  }, [defaultValue, forage, key, validate]);

  const setValue = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (value) => {
      const valueFn = (typeof value === "function" ? value : () => value) as (
        state: T
      ) => T;
      setState((oldValue) => {
        const newValue = valueFn(oldValue);
        forage.setItem(key, newValue).then(() => {
          getCache(forage)[key] = newValue;
        });
        return validate(newValue);
      });
    },
    [forage, key, validate]
  );
  return [state, setValue as React.Dispatch<React.SetStateAction<T | null>>];
}
