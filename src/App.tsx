import React from 'react';
import { Button, ConfigProvider, Layout, theme, ThemeConfig } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import { ChampionSetup, useAppModel, validateSetup } from './Model';
import { TeamView, TurnSimulatorView } from './Views';
import './App.css';

function App() {
  const { dispatch } = useAppModel();
  const { token } = theme.useToken();
  const [championList, onChampionListUpdated] = React.useState<readonly Readonly<ChampionSetup>[]>([]);
  return (
    <Layout
      className="full-height"
      style={
        {
          '--color-border': token.colorBorder,
          '--color-border-hover': token.colorPrimaryHover,
        } as React.CSSProperties
      }
    >
      {/* <Layout.Sider
        width={332}
        style={{
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BossSelectionView />
      </Layout.Sider> */}
      <Layout.Content className="full-height">
        <Layout className="full-height">
          <Layout.Header style={{ background: 'transparent' }}>
            <Button icon={<HighlightOutlined />} onClick={dispatch.changeTheme}>
              Change theme
            </Button>
          </Layout.Header>
          <Layout.Content className="full-height">
            <div style={{ height: '100%', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
              {championList.length && championList.every((item) => validateSetup(item).length === 0) ? (
                <TurnSimulatorView championList={championList} />
              ) : null}
            </div>
          </Layout.Content>
        </Layout>
      </Layout.Content>

      <Layout.Sider
        width={432}
        style={{
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TeamView championList={championList} onChampionListUpdated={onChampionListUpdated} />
      </Layout.Sider>
    </Layout>
  );
}

const AppHost = () => {
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

export default AppHost;
