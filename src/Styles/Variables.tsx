import { theme } from 'antd';
import type { AliasToken } from 'antd/lib/theme/interface';
import { useAppModel } from '../Model';
// import type {AliasToken} from 'antd/lib/theme';

export type ThemeToken = keyof AliasToken; //keyof ReturnType<typeof theme['useToken']>['token'];

function keyToCssVariable(key: string) {
  return `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}

export const CssVariable: Record<ThemeToken, string> = Object.fromEntries(
  Object.keys(theme.darkAlgorithm(theme.defaultSeed)).map((key) => [key, keyToCssVariable(key)])
) as Record<ThemeToken, string>;

const styleRules = new Map<string, boolean>();

export const themeClassName = 'app-theme';

function useThemeStyleVariables(): string {
  const { token } = theme.useToken();
  const {
    state: { theme: themeName },
  } = useAppModel();
  if (!styleRules.get(themeName)) {
    const style = document.createElement('style');
    style.innerHTML = `html[data-theme="${themeName}"] .${themeClassName} {\n${Object.entries(token)
      .map(([key, value]) => `  ${keyToCssVariable(key)}: ${value};\n`)
      .join('')}};`;
    document.getElementsByTagName('head')[0].appendChild(style);
    styleRules.set(themeName, true);
  }
  return themeClassName;
}

export const ThemeStyleCssContext: React.FC<React.PropsWithChildren> = ({ children }) => {
  useThemeStyleVariables();
  return <>{children}</>;
};
