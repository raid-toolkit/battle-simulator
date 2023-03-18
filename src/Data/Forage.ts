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

export const userDataStore = localforage.createInstance({
  name: "user-data",
});

export const teamDataStore = localforage.createInstance({
  name: "saved-teams",
});
