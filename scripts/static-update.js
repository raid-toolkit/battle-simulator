const fs = require('fs');
const path = require('path');

fs.copyFileSync(
  path.resolve(
    process.env.LOCALAPPDATA,
    'RaidToolkit/Data/extensions/Raid.Toolkit.Extension.Account/hero-types.static.json'
  ),
  path.resolve(__dirname, '../src/Static/hero-types.json')
);
fs.copyFileSync(
  path.resolve(
    process.env.LOCALAPPDATA,
    'RaidToolkit/Data/extensions/Raid.Toolkit.Extension.Account/skill-types.static.json'
  ),
  path.resolve(__dirname, '../src/Static/skill-types.json')
);
fs.copyFileSync(
  path.resolve(
    process.env.LOCALAPPDATA,
    'RaidToolkit/Data/extensions/Raid.Toolkit.Extension.Account/strings.static.json'
  ),
  path.resolve(__dirname, '../src/Static/strings.json')
);
