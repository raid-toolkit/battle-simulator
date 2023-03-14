export function round(value: number, places: number) {
  const multiplier = Math.pow(10, places);
  return Math.round(value * multiplier) / multiplier;
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}
