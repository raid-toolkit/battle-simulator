import { RTK } from "../../Data";
import { Faction } from "@raid-toolkit/webclient";
import { createAsyncDataSource } from "../Hooks";

export const heroTypesDataSource = createAsyncDataSource(() => {
  return RTK.wait().then((rtk) => {
    return Object.entries(rtk.heroTypes).filter(
      ([id, type]) =>
        parseInt(id, 10) % 10 === 0 && type.faction !== Faction.Unknown
    );
  });
}, []);
