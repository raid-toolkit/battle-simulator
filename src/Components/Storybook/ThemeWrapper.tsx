import { ConfigProvider, theme } from "antd";
import React from "react";

function getTheme(backgroundValue?: string) {
  switch (backgroundValue) {
    case "#F8F8F8":
      return theme.defaultAlgorithm;
    case "transparent":
    case "#333333":
    default:
      return theme.darkAlgorithm;
  }
}

export const ThemeWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [algorithm, setAlgorithm] = React.useState<any>(() =>
    getTheme(
      __STORYBOOK_CLIENT_API__?.storyStore?.globals.globals.backgrounds?.value
    )
  );

  React.useEffect(() => {
    const listener = ({ globals }: any) => {
      const backgroundValue = globals.backgrounds?.value;
      setAlgorithm(() => getTheme(backgroundValue));
    };

    const currentValue = __STORYBOOK_CLIENT_API__?.storyStore?.globals;
    currentValue && listener(currentValue);
    __STORYBOOK_PREVIEW__?.channel.addListener("updateGlobals", listener);
    __STORYBOOK_PREVIEW__?.channel.addListener("setGlobals", listener);
    return () => {
      __STORYBOOK_PREVIEW__?.channel.removeListener("setGlobals", listener);
      __STORYBOOK_PREVIEW__?.channel.removeListener("updateGlobals", listener);
    };
  }, []);
  return <ConfigProvider theme={{ algorithm }}>{children}</ConfigProvider>;
};
