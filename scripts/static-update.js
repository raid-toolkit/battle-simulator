const fs = require('fs');
const path = require('path');

fs.copyFileSync(
  path.resolve(process.env.LOCALAPPDATA, 'RaidToolkit/Data/static/heroTypes'),
  path.resolve(__dirname, '../src/Static/hero-types.json')
);
fs.copyFileSync(
  path.resolve(process.env.LOCALAPPDATA, 'RaidToolkit/Data/static/skills'),
  path.resolve(__dirname, '../src/Static/skill-types.json')
);
fs.copyFileSync(
  path.resolve(process.env.LOCALAPPDATA, 'RaidToolkit/Data/static/localization'),
  path.resolve(__dirname, '../src/Static/strings.json')
);
