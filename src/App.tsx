import React from 'react';
import { Button, Layout, Space, theme } from 'antd';
import { HighlightOutlined, LoginOutlined } from '@ant-design/icons';
import { useAppModel } from './Model';
import { TeamView, TurnSimulatorView } from './Views';
import './App.css';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { DevOnly } from './Components';

export const App: React.FC = () => {
  const { dispatch } = useAppModel();
  const { token } = theme.useToken();
  const { openSignIn } = useClerk();
  return (
    <Layout
      className="full-height"
      style={
        {
          '--color-border': token.colorBorder,
          '--color-border-hover': token.colorPrimaryHover,
          '--success': token.colorSuccess,
          '--success-active': token.colorSuccessActive,
        } as React.CSSProperties
      }
    >
      <Layout.Content className="full-height">
        <Layout className="full-height">
          <Layout.Header
            style={{
              background: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: '0px 16px',
            }}
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
            <DevOnly>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Button title="Sign in" icon={<LoginOutlined />} onClick={() => openSignIn()} />
              </SignedOut>
            </DevOnly>
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
