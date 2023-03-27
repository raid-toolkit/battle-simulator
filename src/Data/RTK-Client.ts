/* eslint-disable react-hooks/rules-of-hooks */
import { useRaidToolkitApi, IStaticDataApi, HeroType, SkillType, LocalizedText } from '@raid-toolkit/webclient';
import { staticDataStore } from './Forage';

export class RTKClient {
  public readonly heroTypes: Record<number, HeroType> = {};
  public readonly skillTypes: Record<number, SkillType> = {};
  public readonly strings: Record<string, string | undefined> = {};
  private _loadPromise?: Promise<void>;

  public async wait(): Promise<this> {
    this._loadPromise ??= this.load();
    await this._loadPromise;
    return this;
  }

  public getString(value: LocalizedText | undefined): string {
    return value ? this.strings[value.key] || value.localizedValue || value.defaultValue : '';
  }

  public async load(): Promise<void> {
    const staticApi = useRaidToolkitApi(IStaticDataApi);
    const loadMap: { [key in keyof RTKClient]?: () => Promise<RTKClient[key]> } = {
      heroTypes: () => staticApi.getHeroData().then((data) => data.heroTypes),
      skillTypes: () => staticApi.getSkillData().then((data) => data.skillTypes),
      strings: () => staticApi.getLocalizedStrings(),
    };
    await Promise.all(Object.entries(loadMap).map(([key, load]) => this.loadData(key as keyof RTKClient, load)));
  }

  private async loadData<P extends keyof RTKClient>(key: P, load: () => Promise<RTKClient[P]>) {
    let data = await staticDataStore.getItem<RTKClient[P]>(key);
    if (!data) {
      data = await load();
      await staticDataStore.setItem(key, data);
    }
    Object.assign(this[key] as {}, data);
  }
}

// export const RTK = new RTKClient();
