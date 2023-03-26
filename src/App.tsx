import React from 'react';
import { Button, Layout, Space, theme } from 'antd';
import { HighlightOutlined } from '@ant-design/icons';
import { useAppModel } from './Model';
import { TeamView, TurnSimulatorView } from './Views';
import './App.css';

export const App: React.FC = () => {
  const { dispatch } = useAppModel();
  const { token } = theme.useToken();
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
      <Layout.Content className="full-height">
        <Layout className="full-height">
          <Layout.Header
            style={{ background: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <div style={{ flex: 1 }} />
            <Space.Compact>
              <Button
                type="dashed"
                icon={
                  <img
                    src="/logo.png"
                    alt="Raid Toolkit Logo"
                    style={{ objectFit: 'scale-down', height: '1rem', paddingRight: 4 }}
                  />
                }
                target="_blank"
                style={{ fontSize: 12, fontVariant: 'all-small-caps' }}
                href="https://raidtoolkit.com"
              >
                Powered by: Raid Toolkit
              </Button>
              <Button icon={<HighlightOutlined />} onClick={dispatch.changeTheme}>
                Change theme
              </Button>
            </Space.Compact>
          </Layout.Header>
          <Layout.Content className="full-height">
            <div style={{ height: '100%', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
              <TurnSimulatorView />
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
        <TeamView />
      </Layout.Sider>
    </Layout>
  );
};
