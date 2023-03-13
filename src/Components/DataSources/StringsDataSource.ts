import { LocalizedText } from "@raid-toolkit/webclient";
import { RTK } from "../../Data";
import { createAsyncDataSource } from "../Hooks";

export const stringsDataSource = createAsyncDataSource(
  () => RTK.wait().then((rtk) => rtk.strings),
  {}
);

export function getString(
  dataSource: Record<string, string | undefined>,
  value: LocalizedText | undefined
): string {
  return value
    ? dataSource[value.key] || value.localizedValue || value.defaultValue
    : "";
}
