import type { HeroType, SkillType, LocalizedText } from '@raid-toolkit/webclient';

export class RTKStatic {
  public readonly heroTypes: Record<number, HeroType> = {};
  public readonly skillTypes: Record<number, SkillType> = {};
  public readonly strings: Record<string, string | undefined> = {};
  private readonly _loadPromise: Promise<void>;

  public async wait(): Promise<this> {
    await this._loadPromise;
    return this;
  }

  constructor() {
    this._loadPromise = this.load();
  }

  public getString(value: LocalizedText | undefined): string {
    return value ? this.strings[value.key] || value.localizedValue || value.defaultValue : '';
  }

  public async load(): Promise<void> {
    const loadMap: { [key in keyof RTKStatic]?: () => Promise<RTKStatic[key]> } = {
      heroTypes: () =>
        import(/* webpackChunkName: "hero-types" */ '../Static/hero-types.json').then((data: any) => data.heroTypes),
      skillTypes: () =>
        import(/* webpackChunkName: "skill-types" */ '../Static/skill-types.json').then((data: any) => data.skillTypes),
      strings: (): Promise<any> => import(/* webpackChunkName: "strings" */ '../Static/strings.json'),
    };
    await Promise.all(Object.entries(loadMap).map(([key, load]) => this.loadData(key as keyof RTKStatic, load)));
  }

  private async loadData<P extends keyof RTKStatic>(key: P, load: () => Promise<RTKStatic[P]>) {
    const data = await load();
    Object.assign(this[key] as {}, data);
  }
}

export const RTK = new RTKStatic();
