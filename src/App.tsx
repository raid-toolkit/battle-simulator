import React from 'react';
import { Badge, Button, Card, ConfigProvider, Input, Layout, theme } from 'antd';
import { CompressOutlined, HighlightOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { ChampionSetup, validateSetup } from './Model';
import { TeamView, TurnSimulatorView } from './Views';
import './App.css';

export interface AppProps {
  toggleTheme: () => void;
}
function App({ toggleTheme }: AppProps) {
  const [championList, onChampionListUpdated] = React.useState<readonly Readonly<ChampionSetup>[]>([]);
  return (
    <Layout>
      <Layout.Sider
        width={225}
        style={{
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Badge.Ribbon text="Boss">
          <Card>
            <Input
              addonBefore="Boss Speed"
              defaultValue={250}
              style={{ textAlign: 'right' }}
              suffix={<ThunderboltOutlined />}
            />
            <Input
              addonBefore="Shield Hits"
              defaultValue={21}
              style={{ textAlign: 'right' }}
              suffix={<CompressOutlined />}
            />
          </Card>
        </Badge.Ribbon>
      </Layout.Sider>
      <Layout.Content>
        <Layout>
          <Layout.Header style={{ background: 'transparent' }}>
            <Button icon={<HighlightOutlined />} onClick={toggleTheme}>
              Change theme
            </Button>
          </Layout.Header>
          <Layout.Content>
            <div style={{ height: '100%', overflowY: 'auto' }}>
              {championList.length && championList.every((item) => validateSetup(item).length === 0) && (
                <TurnSimulatorView bossSpeed={250} championList={championList} shieldHits={21} speedAura={19} />
              )}
            </div>
          </Layout.Content>
        </Layout>
      </Layout.Content>

      <Layout.Sider
        width={532}
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
