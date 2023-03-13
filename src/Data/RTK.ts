/* eslint-disable react-hooks/rules-of-hooks */
import {
  useRaidToolkitApi,
  IAccountApi,
  IStaticDataApi,
  HeroType,
  SkillType,
} from "@raid-toolkit/webclient";
import { staticDataStore } from "./Forage";

export class RTKApp {
  public readonly accountApi: IAccountApi;
  public readonly staticApi: IStaticDataApi;

  public readonly heroTypes: Record<number, HeroType> = {};
  public readonly skillTypes: Record<number, SkillType> = {};
  public readonly strings: Record<string, string | undefined> = {};
  private readonly _loadPromise: Promise<void>;

  public async wait(): Promise<this> {
    await this._loadPromise;
    return this;
  }

  constructor() {
    this.accountApi = useRaidToolkitApi(IAccountApi);
    this.staticApi = useRaidToolkitApi(IStaticDataApi);
    this._loadPromise = this.load();
  }

  public async load(): Promise<void> {
    const loadMap: { [key in keyof RTKApp]?: () => Promise<RTKApp[key]> } = {
      heroTypes: () =>
        RTK.staticApi.getHeroData().then((data) => data.heroTypes),
      skillTypes: () =>
        RTK.staticApi.getSkillData().then((data) => data.skillTypes),
      strings: () => RTK.staticApi.getLocalizedStrings(),
    };
    await Promise.all(
      Object.entries(loadMap).map(([key, load]) =>
        this.loadData(key as keyof RTKApp, load)
      )
    );
  }

  private async loadData<P extends keyof RTKApp>(
    key: P,
    load: () => Promise<RTKApp[P]>
  ) {
    let data = await staticDataStore.getItem<RTKApp[P]>(key);
    if (!data) {
      data = await load();
      await staticDataStore.setItem(key, data);
    }
    Object.assign(this[key] as {}, data);
  }
}

export const RTK = new RTKApp();
