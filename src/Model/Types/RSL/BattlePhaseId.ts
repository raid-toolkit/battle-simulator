export enum BattlePhaseId {
  Unknown = 0,
  BattleStarted = 10,
  BattleFinished = 11,
  BeforeTurnStarted = 20,
  AfterTurnStarted = 21,
  TurnFinished = 22,
  RoundStarted = 30,
  RoundFinished = 31,
  ImmunitiesProcessing = 32,
  BeforeEffectProcessed = 40,
  BeforeEffectProcessedOnTarget = 41,
  BeforeEffectAppliedOnTarget = 42,
  AfterEffectAppliedOnTarget = 43,
  /**
   * Valkyrie P1 - Increase TM
   *  !relationTargetIsAlly&&relationProcessedTargetCount==0&&statusEffectIsApplied
   */
  AfterEffectProcessedOnTarget = 44,
  AfterEffectProcessed = 45,
  EffectExpired = 46,
  BeforeEffectChanceRolling = 47,
  AfterEffectChanceRolling = 48,
  TargetContextHasJustBeenCreated = 49,
  /**
   * Knight Errant A3 - Increase damage by 75% if at full HP
   *  KindId = ChangeDamageMultiplier
   */
  BeforeDamageCalculated = 50,
  AfterDamageCalculated = 51,
  /**
   * Swift Parry (Set)
   * Skull Crown P1
   * Maeve A2
   *  Attack: single target, 1 hit; Places on target Stun for 2 turns if the target has Sleep
   *  Applied before dealing damage-- so DamageDealt is where sleep is removed?
   * Black Knight P1
   *  if incoming damage exceeds 30% of MAX_HP. places Unkillable on self for 1 turn
   * Knight Errant A3 - Apply weaken before damage dealt
   * Leorius P1
   *  Unkillable
   */
  BeforeDamageDealt = 52,
  /**
   * Destroy (Set)
   * Debuffs
   */
  AfterDamageDealt = 53,
  BlockDamageProcessing = 54,
  /**
   * KindId 7005 - Ignore Protection Effects
   *  CB Passive - Ignore Protection Effects Turn > 50
   *  Kuldath - Ignore Protection Effects (Based on Mark)
   * 7014 = ExcludeHitType?
   *  Harima - No Critical Hits from/weak hits against Demonspawn
   */
  AfterDamageContextCreated = 55,
  AfterHealthReduced = 56,
  AfterHitTypeCalculated = 57,
  UnkillableProcessing = 58,
  CocoonProcessing = 59,
  BeforeHealDealt = 60,
  AfterHealDealt = 61,
  BeforeHealCalculated = 62,
  AllHeroesDeathProcessed = 70,
  HeroDead = 71,
  AfterSkillEffectsProcessed = 72,
  AfterHeroSummoned = 80,
  BeforeAppliedEffectsUpdate = 100,
  FearProcessing = 111,
  AfterSkillUsed = 112,
  AfterAllSkillsUsed = 113,
  BeforeSkillProcessed = 114,
  AfterStatusEffectToApplySelected = 120,
  CancelEffectProcessing = 130,
  BeforeEffectUnappliedFromHero = 140,
  AfterEffectUnappliedFromHero = 141,
  BeforeDestroyHpDealt = 150,
  CrabShellProcessing = 160,
  BeforeStaminaChanged = 170,
  StatusReviveOnDeathProcessing = 180,
  PassiveReviveOnDeathProcessing = 181,
  EffectBlocked = 190,
  StoneSkinAbsorptionProcessing = 200,
  AfterHeroDevoured = 210,
  DigestionAbsorptionProcessing = 220,
  HydraHeadGrown = 230,
}
