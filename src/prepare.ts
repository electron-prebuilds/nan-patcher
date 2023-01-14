import 'zx/globals';

import type { PackageContext } from './defs';

const BASE_IGNORE_LIST = ['.npmrc'];

export default async function prepare(ctx: PackageContext) {
  cd(ctx.path);

  await fs.appendFile(
    path.join(ctx.path, '.npmignore'),
    `\n\n${BASE_IGNORE_LIST.join('\n')}}`,
    { encoding: 'utf-8' },
  );
}
