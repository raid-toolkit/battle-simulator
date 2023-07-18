import type { BossSetup } from './AppState';

export const BossSetupByStage: Record<number, BossSetup> = {
  1: {
    typeId: 26576, // spirit
    speed: 105,
    shieldHits: 15,
  },
  2: {
    typeId: 26566, // void
    speed: 110,
    shieldHits: 15,
  },
  3: {
    typeId: 26596, // magic
    speed: 115,
    shieldHits: 15,
  },
  4: {
    typeId: 26586, // force
    speed: 120,
    shieldHits: 15,
  },
  5: {
    typeId: 26576, // spirit
    speed: 125,
    shieldHits: 18,
  },
  6: {
    typeId: 26566, // void
    speed: 150,
    shieldHits: 18,
  },
  7: {
    typeId: 26596, // magic
    speed: 175,
    shieldHits: 18,
  },
  8: {
    typeId: 26586, // force
    speed: 200,
    shieldHits: 21,
  },
  9: {
    typeId: 26576, // spirit
    speed: 225,
    shieldHits: 21,
  },
  10: {
    typeId: 26566, // void
    speed: 250,
    shieldHits: 21,
  },
};
