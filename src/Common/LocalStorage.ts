/* eslint-disable react-hooks/rules-of-hooks */
function localStorageAvailable() {
  const inWindow = typeof window.localStorage === 'object' && typeof window.localStorage.setItem === 'function';
  if (!inWindow) {
    return false;
  }
  // Safari private mode has localStorage in the window, but throws when `setItem` is called
  const key = 'safeLocalStorageTest';
  try {
    window.localStorage.setItem(key, 'succeeds');
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

function noop() {}

function useStorageWhenAvailable<K extends keyof typeof localStorage>(
  nativeMethod: K,
  args: Parameters<typeof localStorage[K]>,
  callback: typeof localStorage[K] = noop
): ReturnType<typeof localStorage[K]> {
  if (localStorageAvailable()) {
    return window.localStorage[nativeMethod](...args);
  } else {
    return callback();
  }
}

const safeLocalStorage: typeof localStorage = {
  get length(): number {
    return localStorageAvailable() ? window.localStorage.length : 0;
  },
  key(index: number, onLocalStorageNotAvailable?: (index: number) => string): string | null {
    return useStorageWhenAvailable('key', [index], onLocalStorageNotAvailable);
  },
  getItem(key: string, onLocalStorageNotAvailable?: (key: string) => string): string | null {
    return useStorageWhenAvailable('getItem', [key], onLocalStorageNotAvailable);
  },
  setItem(key: string, value: string, onLocalStorageNotAvailable?: (key: string, value: string) => void): void {
    useStorageWhenAvailable('setItem', [key, value], onLocalStorageNotAvailable);
  },
  removeItem(key: string, onLocalStorageNotAvailable?: (key: string) => string): void {
    useStorageWhenAvailable('removeItem', [key], onLocalStorageNotAvailable);
  },
  clear: (onLocalStorageNotAvailable?: () => void) => {
    useStorageWhenAvailable('clear', [], onLocalStorageNotAvailable);
  },
};

export default safeLocalStorage;
