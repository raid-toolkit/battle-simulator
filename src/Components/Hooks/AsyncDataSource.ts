/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

export interface AsyncDataSource<T> {
  __hook(): T;
}

export function createAsyncDataSource<T>(
  getData: () => Promise<T>,
  initial: T
): AsyncDataSource<T> {
  let current: T | undefined = undefined;
  return {
    __hook() {
      const [state, setState] = React.useState(current);

      React.useEffect(() => {
        // previously loaded
        if (current) {
          return;
        }
        getData().then((value) => {
          current = value;
          setState(value);
        });
      }, []);
      return state ?? initial;
    },
  };
}

export function useAsyncDataSource<T>(dataSource: AsyncDataSource<T>): T {
  return dataSource.__hook();
}
