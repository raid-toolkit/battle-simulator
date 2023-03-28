import React from 'react';
import { Button, Layout, Space } from 'antd';
import { HighlightOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { useAppModel } from './Model';
import { AppTour, TeamView, TurnSimulatorView } from './Views';
import { DevOnly } from './Components';
import './App.css';
import { SavedTeamsView } from './Views/SavedTeamsView';
import { CssVariable, useThemeStyleVariables } from './Styles/Variables';

console.log({ CssVariable });

export const App: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const { openSignIn } = useClerk();
  const themeClassName = useThemeStyleVariables();
  return (
    <Layout className={['full-height', themeClassName].join(' ')}>
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
            <SavedTeamsView />
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
              <Button icon={<SearchOutlined />} onClick={() => state.tourStep === undefined && dispatch.setTourStep(0)}>
                Take the tour
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
      <AppTour />
    </Layout>
  );
};
