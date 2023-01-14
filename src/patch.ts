import 'zx/globals';

import type { PackageJson } from 'type-fest';

import type { PackageContext } from './defs.js';

async function getNewBuildVersion(packageName: string, baseVersion: string) {
  try {
    const { stdout } = await $`npm show ${packageName} time --json`;

    const result = JSON.parse(stdout);

    const versions = Object.keys(result)
      .filter(k => k !== 'modified' && k !== 'created')
      .filter(k => new RegExp(`^${baseVersion}-prebuild\\.\\d+$`).test(k))
      .sort((a, b) => (result[a] > result[b] ? -1 : 1));

    if (versions.length > 0) {
      return Number(versions[0].substring(baseVersion.length + '-prebuild.'.length)) + 1;
    }
  } catch {} // eslint-disable-line no-empty

  return 1;
}

async function patchPackageJSON(ctx: PackageContext) {
  const packageJSONPath = path.join(ctx.path, 'package.json');
  const packageJSON: PackageJson = JSON.parse(await fs.readFile(packageJSONPath, 'utf-8'));

  packageJSON.name = ctx.npmName;

  const buildVersion = await getNewBuildVersion(packageJSON.name, packageJSON.version);
  packageJSON.version = `${packageJSON.version}-prebuild.${buildVersion}`;
  console.log('decided version', packageJSON.version);

  ctx.newVersion = packageJSON.version;

  packageJSON.repository = {
    type: 'git',
    url: 'git://github.com/electron-prebuilds/nan-patcher.git',
  };

  await fs.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 4));
}

export default async function patch(ctx: PackageContext) {
  cd(ctx.path);

  const patchData = JSON.parse(await fs.readFile('../patches/data.json', 'utf-8'));
  const patches = patchData[ctx.input.version] || [];

  for (const entry of patches) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await $`patch -p1 < ../patches/${entry}`;
    } catch {} // eslint-disable-line no-empty
  }

  await patchPackageJSON(ctx);

  echo('patch finished');
}
