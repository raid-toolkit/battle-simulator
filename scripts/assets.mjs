import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import assetPatterns from './images/asset-patterns.mjs';
import { extractAssetGroup } from './images/extract-images.mjs';

yargs(hideBin(process.argv))
  .command(
    ['extract [groups...]', '$0'],
    'Extract assets from unity bundles',
    (yargs) =>
      yargs.option('verbose', { type: 'boolean' }).positional('groups', {
        choices: Object.keys(assetPatterns),
        default: Object.entries(assetPatterns)
          .filter(([, group]) => group.default !== false)
          .map(([key]) => key),
      }),
    async (argv) => {
      await Promise.allSettled(
        argv.groups
          .flatMap((key) => extractAssetGroup(key))
          .map((p) =>
            p.catch((e) => {
              console.error(e);
            })
          )
      );
    }
  )
  .demandCommand(1)
  .parse();
