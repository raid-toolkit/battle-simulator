import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "battle-simulator",
  version: 1.0,
  storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
});

export const staticDataStore = localforage.createInstance({
  name: "static-data",
});
