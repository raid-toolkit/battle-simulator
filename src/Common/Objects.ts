export function cloneObject<T extends {}>(obj: Readonly<T>): T {
  return JSON.parse(JSON.stringify(obj));
}
