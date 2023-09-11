export type ColorPalette = 'rainbow' | 'red' | 'blue' | 'friendly' | 'enemy';

export const colors: Record<ColorPalette, readonly string[]> = {
  friendly: ['--red6', '--orange6', '--yellow6', '--green6', '--blue6', '--purple6'],
  enemy: ['--red2', '--orange2', '--yellow2', '--green2', '--blue2', '--purple2'],

  rainbow: ['--red', '--yellow', '--orange', '--green', '--blue', '--purple'],
  blue: ['--blue5', '--blue6', '--blue8', '--blue9', '--blue10', '--blue1', '--blue2', '--blue3', '--blue4'],
  red: ['--red5', '--red6', '--red8', '--red9', '--red10', '--red1', '--red2', '--red3', '--red4'],
} as const;

export function useColor(index: number, palette: ColorPalette = 'rainbow') {
  const themeColors = colors[palette];
  return `var(${themeColors[index % themeColors.length]}`;
}
