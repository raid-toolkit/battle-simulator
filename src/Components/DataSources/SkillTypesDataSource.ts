import { RTK } from "../../Data";
import { createAsyncDataSource } from "../Hooks";

export const skillTypesDataSource = createAsyncDataSource(
  () => RTK.wait().then((rtk) => rtk.skillTypes),
  {}
);
