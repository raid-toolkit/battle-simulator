const rootDir = process.env.USERPROFILE + '\\AppData\\Local\\PlariumPlay\\StandAloneApps\\raid';

const assetPatterns = {
  avatars: [
    {
      rootDir,
      outputDir: './public/images/avatars',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: ['*Avatars_*', '*AvatarsLocal'],
    },
  ],
  skills: [
    {
      rootDir,
      outputDir: './public/images/skills',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: 'SkillIcons*',
    },
  ],
  blessings: [
    {
      rootDir,
      outputDir: './public/images/blessings',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: 'BlessingIcon_*',
      default: false,
    },
  ],
  effects: [
    {
      rootDir,
      outputDir: './public/images/effects',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: '*StatusEffectIcons*',
    },
  ],
  factions: [
    {
      rootDir,
      outputDir: './public/images/faction/banners',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: '*FractionAvatars*',
      default: false,
    },
  ],
  artifactSets: [
    {
      rootDir,
      outputDir: './public/images/sets',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: '*ArtifactSets*',
    },
  ],
  artifacts: [
    {
      rootDir,
      outputDir: './public/images/artifacts',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: '*Artifacts*',
    },
  ],
  leaderSkills: [
    {
      rootDir,
      outputDir: './public/images/aura',
      assetDir: ['resources', '*/Raid_Data/StreamingAssets/AssetBundles'],
      bundleFiles: '*LeaderSkillIcons*',
      default: false,
    },
  ],
};

export default assetPatterns;
