import fs from 'fs';
import util from 'util';

const { StageData, HeroData } = JSON.parse(fs.readFileSync('./scripts/data/static-data.json', 'utf8'));
const { Areas, Stages } = StageData;

const seasonNames = {
  'l10n:region/name?id=801#static': 'Rotation #1',
  'l10n:region/name?id=802#static': 'Rotation #2',
  'l10n:region/name?id=803#static': 'Rotation #3',
  'l10n:region/name?id=804#static': 'Rotation #4',
  'l10n:region/name?id=805#static': 'Rotation #5',
  'l10n:region/name?id=806#static': 'Rotation #6',
};

const difficultyNames = {
  0: 'Normal',
  1: 'Hard',
  2: 'Brutal',
  3: 'Nightmare',
};

function filterArea(area) {
  return area.Name.DefaultValue === 'Hydra';
}

function fixedInt(n) {
  return Math.round(n / 0xffffffff);
}

function selectRotation(region) {
  return region.StageIdsByDifficulty[9].map((stageId, idx) => ({
    rotation: [region.Id, seasonNames[region.Name.Key]],
    difficulty: [idx, difficultyNames[idx]],
    stageId,
  }));
}

function selectSlot(slot) {
  const speedModifier = fixedInt(slot.Modifiers.FlatBonus.Speed);
  const typeId = slot.HeroTypeId;
  const heroType = HeroData.HeroTypes.filter((heroType) => heroType.Id === typeId)[0];
  const speed = fixedInt(heroType.BaseStats.Speed) + speedModifier;
  return {
    typeId,
    speed,
  };
}

const regions = Areas.filter(filterArea).flatMap((area) => area.Regions);
const options = regions.flatMap(selectRotation);
const stageIds = options.map((options) => options.stageId);
const rawStages = stageIds.flatMap((stageId) => Stages.filter((stage) => stage.Id === stageId));
const stages = Object.fromEntries(
  rawStages.map((stage) => [
    stage.Id,
    {
      slots: stage.Formations.slice(-1)[0].HeroSlotsSetup.map(selectSlot),
    },
  ])
);

const rotations = Object.fromEntries(options.map((options) => options.rotation));
const difficulties = Object.fromEntries(options.map((options) => options.difficulty));
const stageLookup = {};
for (const option of options) {
  const [rotation] = option.rotation;
  const [difficulty] = option.difficulty;
  stageLookup[rotation] ??= {};
  stageLookup[rotation][difficulty] ??= {};
  stageLookup[rotation][difficulty] = option.stageId;
}

fs.writeFileSync('./src/Static/stages.json', JSON.stringify({ rotations, difficulties, stageLookup, stages }, null, 2));
