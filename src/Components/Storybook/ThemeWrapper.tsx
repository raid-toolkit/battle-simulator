import { ConfigProvider, theme } from "antd";
import React from "react";

const storyApi = (globalThis as any).__STORYBOOK_CLIENT_API__;
const storyPreview = (globalThis as any).__STORYBOOK_PREVIEW__;

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
    getTheme(storyApi?.storyStore?.globals)
  );

  React.useEffect(() => {
    const listener = ({ globals }: any) => {
      const backgroundValue = globals.backgrounds?.value;
      setAlgorithm(() => getTheme(backgroundValue));
    };

    const currentValue = storyApi?.storyStore?.globals;
    currentValue && listener(currentValue);
    storyPreview.channel.addListener("updateGlobals", listener);
    storyPreview.channel.addListener("setGlobals", listener);
    return () => {
      storyPreview.channel.removeListener("setGlobals", listener);
      storyPreview.channel.removeListener("updateGlobals", listener);
    };
  }, []);
  return <ConfigProvider theme={{ algorithm }}>{children}</ConfigProvider>;
};
