import 'zx/globals';

import tar from 'tar';

import type { PackageContext } from './defs';

export default async function fetch(ctx: PackageContext) {
  await $`rm -rf ${ctx.path}`;

  const fileName = `${ctx.packageName}.tgz`;

  await $`npm pack nan@${ctx.input.version}`;

  await tar.extract({ file: fileName });

  await $`rm -f ${fileName}`;
}
