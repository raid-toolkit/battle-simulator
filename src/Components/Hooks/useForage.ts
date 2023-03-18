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

export function useForageCollection<T>(forage: LocalForage): {
  items: Readonly<Record<string, Readonly<T>>>;
  addOrUpdate(key: string, item: T, update: (existing: T) => T): Promise<void>;
  remove(key: string): Promise<void>;
} {
  const [items, setItems] = React.useState<Readonly<Record<string, T>>>({});
  React.useEffect(() => {
    async function init() {
      const keys = await forage.keys();
      const items: [string, T][] = [];
      for (const key of keys) {
        const item = await forage.getItem<T>(key);
        if (item) {
          items.push([key, item]);
        }
      }
      setItems(Object.fromEntries(items));
    }
    init();
  }, [forage]);
  return {
    items,
    async addOrUpdate(key, item, updateFn) {
      const existing = await forage.getItem<T>(key);
      const newItem = existing ? updateFn(existing) : item;
      await forage.setItem(key, newItem);
      setItems((items) => {
        const newItems = { ...items };
        newItems[key] = newItem;
        return newItems;
      });
    },
    async remove(key) {
      await forage.removeItem(key);
      setItems((items) => {
        const newItems = { ...items };
        delete newItems[key];
        return newItems;
      });
    },
  };
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
        const newValue = validate(valueFn(oldValue));
        getCache(forage)[key] = newValue;
        forage.setItem(key, newValue);
        return newValue;
      });
    },
    [forage, key, validate]
  );
  return [state, setValue as React.Dispatch<React.SetStateAction<T | null>>];
}
