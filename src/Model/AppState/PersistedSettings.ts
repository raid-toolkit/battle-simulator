import safeLocalStorage from '../../Common/LocalStorage';

function readLocalStorageValue(key: string): any | undefined {
  const storedValue = safeLocalStorage.getItem(key);
  if (!storedValue) return undefined;
  return JSON.parse(storedValue);
}

class PersistedSetting<T> {
  private value?: T;
  constructor(
    private readonly key: string,
    private readonly defaultValue: T
  ) {
    this.value = readLocalStorageValue(key);
  }
  get(): T {
    return this.value ?? this.defaultValue;
  }
  set(value: T): void {
    if (value === null || value === undefined) safeLocalStorage.removeItem(this.key);
    else safeLocalStorage.setItem(this.key, JSON.stringify(value));
  }
}

export function persistedSetting<T>(defaultValue: T, key: string): T {
  return new PersistedSetting(key, defaultValue) as T;
}

export function createPersistedSettings<T extends { [key: string]: any | PersistedSetting<unknown> }>(map: T): T {
  const proxy = {};
  for (const key of Object.keys(map)) {
    const entry = map[key as keyof T] as any | PersistedSetting<unknown>;
    const setting = entry instanceof PersistedSetting ? entry : new PersistedSetting(key, entry);
    Object.defineProperty(proxy, key, {
      get: () => setting.get(),
      set: (value?: T) => setting.set(value),
    });
  }
  return proxy as T;
}
