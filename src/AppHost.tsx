import React from 'react';
import { ConfigProvider, theme, ThemeConfig } from 'antd';
import { useAppModel } from './Model';
import { App } from './App';

export const AppHost: React.FC = () => {
  const { state } = useAppModel();

  const themeConfig: ThemeConfig = React.useMemo(
    () => ({
      algorithm: state.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }),
    [state.theme]
  );
  return (
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  );
};
