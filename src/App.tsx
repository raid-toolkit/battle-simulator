import React from 'react';
import { Button, ConfigProvider, Layout, theme } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import { ChampionSetup, validateSetup } from './Model';
import { TeamView, TurnSimulatorView } from './Views';
import './App.css';

export interface AppProps {
  toggleTheme: () => void;
}
function App({ toggleTheme }: AppProps) {
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
            <Button icon={<HighlightOutlined />} onClick={toggleTheme}>
              Change theme
            </Button>
          </Layout.Header>
          <Layout.Content className="full-height">
            <div style={{ height: '100%', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
              {championList.length && championList.every((item) => validateSetup(item).length === 0) ? (
                <TurnSimulatorView bossSpeed={250} championList={championList} shieldHits={21} speedAura={19} />
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
  const [themeName, setThemeName] = React.useState('dark');
  const toggleTheme = React.useCallback(() => {
    setThemeName((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);
  React.useEffect(() => {
    const htmlRoot = document.querySelector('html');
    htmlRoot!.style.colorScheme = themeName;
  }, [themeName]);
  return (
    <ConfigProvider
      theme={{
        algorithm: themeName === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App toggleTheme={toggleTheme} />
    </ConfigProvider>
  );
};

export default AppHost;
