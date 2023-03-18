import { AbilitySetup, ChampionSetup, Turn } from './Types';

export interface SimulateTurnsArgs {
  championSetups: readonly Readonly<Required<ChampionSetup>>[];
  bossSpeed: number;
  shieldHits: number;
  speedAura: number;

  stopAfter?: number;
}

export interface AbilityState {
  ability: Readonly<AbilitySetup>;
  cooldownRemaining: number;
}

export interface ChampionState {
  definesPhase?: boolean;
  shieldHitsRemaining?: number;

  index: number | undefined;
  setup: Readonly<Required<ChampionSetup>>;
  speed: number;
  turnMeter: number;
  abilityState: AbilityState[];
}

const TURN_METER_RATE = 0.007;

export function simulateTurns({
  championSetups,
  bossSpeed,
  shieldHits,
  speedAura,
  stopAfter = 250,
}: SimulateTurnsArgs) {
  const championStates = championSetups.map<ChampionState>((setup, index) => ({
    index,
    setup,
    speed: setup.speed + setup.baseSpeed * (speedAura / 100),
    turnMeter: 0,
    abilityState: setup.abilities.map((ability) => ({
      ability,
      cooldownRemaining: 0,
    })),
  }));

  // TODO: Make boss selectable
  championStates.push({
    index: undefined,
    definesPhase: true,
    speed: bossSpeed,
    turnMeter: 0,
    abilityState: [],
    shieldHitsRemaining: shieldHits,
    setup: {
      typeId: 26566, // FK10
      speed: bossSpeed,
      baseSpeed: bossSpeed,
      abilities: [],
    },
  });

  function tick() {
    for (const champion of championStates) {
      champion.turnMeter += champion.speed * TURN_METER_RATE;
    }
  }

  function getNextTurn() {
    let nextTurn: ChampionState | undefined;
    for (const champion of championStates) {
      if (champion.turnMeter >= 100) {
        if (!nextTurn || champion.turnMeter > nextTurn.turnMeter) {
          nextTurn = champion;
        }
      }
    }

    return nextTurn;
  }

  const turns: Turn[] = [];
  while (turns.length < stopAfter) {
    const nextTurn = getNextTurn();
    if (!nextTurn) {
      continue;
    }
    nextTurn.turnMeter = 0;
    turns.push({
      championIndex: nextTurn.index,
      abilityIndex: 0, // TODO: Select ability
    });
  }
  return turns;
}
