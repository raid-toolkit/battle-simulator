import { execa } from 'execa';
import path from 'path';
import { fileURLToPath } from 'url';
import multiview from 'multiview';
import assetPatterns from './asset-patterns.mjs';

const mv = multiview();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unityAssetsExe = path.resolve(__dirname, './bin/UnityAssets/UnityAssets.exe');

function exec(exe, options) {
  const args = Object.entries(options).flatMap(([key, values]) => [
    `--${key}`,
    values instanceof Array ? values.join(',') : values,
  ]);
  return execa(exe, args, { cwd: path.resolve(__dirname, '../..') });
}

const colors = [1, 2, 3, 4, 5];
const ansiReset = '\u001b[0m';
const ansiBlack = '\u001b[38;5;232m';

function extractImages({ rootDir, assetDir, bundleFiles, outputDir }) {
  const cmd = exec(unityAssetsExe, {
    rootDir,
    assetDir,
    bundleFiles,
    outputDir,
  });
  if (process.argv.includes('--verbose')) {
    const strim = mv.stream(outputDir);
    const color = colors.shift();
    const ansiColorFG = `\u001b[3${color};1m`;
    const ansiColorBG = `\u001b[4${color};1m`;
    strim.write(ansiColorFG);
    colors.push(color);
    cmd.on('exit', (code) => {
      strim.write(`\n${ansiReset}${ansiColorBG}${ansiBlack}  Done.  \n\n`);
      strim.exit(code);
    });
    cmd.stderr.on('data', (data) => strim.write(data));
    cmd.stdout.on('data', (data) => strim.write(data));
  }
  return cmd;
}

export function extractAssetGroup(groupKey) {
  const group = assetPatterns[groupKey];
  if (!group) {
    throw new Error(`Invalid asset group: ${groupKey}`);
  }
  return Promise.all(group.map(extractImages));
}
