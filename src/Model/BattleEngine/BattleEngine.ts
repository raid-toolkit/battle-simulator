import { RTK } from '../../Data';
import { TuneState, isAuraApplicable, assertValidChampionSetup } from '../AppState';
import { TURN_METER_RATE } from '../Constants';
import { AreaId, BattlePhaseId, ChampionSetup, ChampionState, ChampionTeam, StatKind } from '../Types';

export class BattleEngine {
  private championStates: ChampionState[] = [];

  private setupTeam(team: ChampionTeam, ...championSetups: ChampionSetup[]) {
    const leaderSkill = RTK.heroTypes[championSetups[0].typeId!].leaderSkill;
    const speedAura =
      isAuraApplicable(leaderSkill, AreaId.dungeon) && leaderSkill.kind?.toLocaleLowerCase() === StatKind.speed
        ? leaderSkill.value * 100
        : 0;
    for (const setup of championSetups) {
      assertValidChampionSetup(setup);

      const baseSpeed = RTK.heroTypes[setup.typeId].forms[0].unscaledStats.Speed;
      const speed = setup.speed + baseSpeed * ((speedAura ?? 0) / 100);
      this.championStates.push({
        setup,
        index: this.championStates.length,
        team,
        name: RTK.getString(RTK.heroTypes[setup.typeId!].name),
        speed,
        turnMeter: speed * TURN_METER_RATE * 3,
        turnsTaken: 0,
        buffs: [],
        debuffs: [],
        abilityState: setup.abilities.map((ability, index) => ({
          index,
          ability,
          cooldownRemaining: 0,
        })),
      });
    }
  }

  constructor(private readonly userSetup: Readonly<TuneState>) {
    this.setupTeam(ChampionTeam.Friendly, ...userSetup.championList);
    // TODO
    // const bossSetup = BossSetupByStage[userSetup.stage];
    // this.setupTeam(ChampionTeam.Enemy, bossSetup);
  }

  private processPhase(phase: BattlePhaseId) {}
}
