import React from 'react';
import { Button, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { AppTour, TeamView, TurnSimulatorView, WelcomeDialog } from './Views';
import { themeClassName } from './Styles/Variables';
import { AppMenu, SettingsButton, ViewMenu } from './Views/Parts';
import { useAppModel } from './Model';
import { isMobile } from 'is-mobile';
import './App.css';
import { round } from './Common';

export const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, top: 48 });
  const { state } = useAppModel();
  const { openSignIn } = useClerk();

  React.useEffect(() => {
    // finished
    if (state.turnWorkerState === 'idle') {
      messageApi.success(`Turn simulation took ${round(state.turnWorkerDuration, 1)}ms`, 2.5);
    }
    if (state.turnWorkerState === 'running') {
      messageApi.loading(`Running simulation`, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.turnWorkerState]);

  return (
    <section className={`root-section ${themeClassName}`}>
      <section className="site-header">
        <AppMenu />
        <div className="mobile-only">
          <ViewMenu />
        </div>
        <div style={{ flex: 1 }} className="desktop-only" />
        <div style={{ justifySelf: 'flex-end' }}>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button title="Sign in" shape="circle" icon={<LoginOutlined />} onClick={() => openSignIn()} />
          </SignedOut>
        </div>
        <div style={{ justifySelf: 'flex-end' }}>
          <SettingsButton />
        </div>
      </section>
      <section className="site-content">
        <main className={`site-panel site-main ${state.visiblePanel === 'battle' ? 'panel-visible' : ''}`}>
          <TurnSimulatorView />
        </main>
        <aside className={`site-panel site-sidebar ${state.visiblePanel === 'team' ? 'panel-visible' : ''}`}>
          <TeamView />
        </aside>
      </section>
      {contextHolder}
      {!isMobile() && <AppTour />}
      <WelcomeDialog />
    </section>
  );
};
