const IS_PREVIEW = process.env.PREVIEW !== 'false';

export interface PackageInput {
  version: string;
}

export interface LibData {
  universal: boolean;
  nanVersion?: string;
}

export class PackageContext {
  public path: string = path.join(process.cwd(), 'package');

  public newVersion: string;

  public npmName = IS_PREVIEW ? '@electron-prebuilds-preview/nan' : '@electron-prebuilds/nan';

  constructor(public readonly input: PackageInput) {}

  get packageName() {
    return `nan-${this.input.version}`;
  }
}
