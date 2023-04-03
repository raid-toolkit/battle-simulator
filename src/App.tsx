import React from 'react';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { AppTour, TeamView, TurnSimulatorView, WelcomeDialog } from './Views';
import { themeClassName } from './Styles/Variables';
import { AppMenu, ViewMenu } from './Views/Parts';
import { useAppModel } from './Model';
import { isMobile } from 'is-mobile';
import './App.css';

export const App: React.FC = () => {
  const { state } = useAppModel();
  const { openSignIn } = useClerk();
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
      </section>
      <section className="site-content">
        <main className={`site-panel site-main ${state.visiblePanel === 'battle' ? 'panel-visible' : ''}`}>
          <TurnSimulatorView />
        </main>
        <aside className={`site-panel site-sidebar ${state.visiblePanel === 'team' ? 'panel-visible' : ''}`}>
          <TeamView />
        </aside>
      </section>
      {!isMobile() && <AppTour />}
      <WelcomeDialog />
    </section>
  );
};
