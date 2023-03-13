/* eslint-disable react-hooks/rules-of-hooks */
import {
  useRaidToolkitApi,
  IAccountApi,
  IStaticDataApi,
  HeroType,
} from "@raid-toolkit/webclient";
import { staticDataStore } from "./Forage";

export class RTKApp {
  public readonly accountApi: IAccountApi;
  public readonly staticApi: IStaticDataApi;

  public readonly heroTypes: Record<number, HeroType> = {};
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

  public async load() {
    await Promise.all([this.loadHeroTypes()]);
  }

  private async loadHeroTypes() {
    let data = await staticDataStore.getItem<Record<number, HeroType>>(
      "heroTypes"
    );
    if (!data) {
      data = (await RTK.staticApi.getHeroData()).heroTypes;
      await staticDataStore.setItem("heroTypes", data);
    }
    Object.assign(this.heroTypes, data);
  }
}

export const RTK = new RTKApp();
