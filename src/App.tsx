import React from 'react';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { AppTour, TeamView, TurnSimulatorView } from './Views';
import { DevOnly } from './Components';
import { SavedTeamsView } from './Views/SavedTeamsView';
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
        <div className="desktop-only">
          <SavedTeamsView />
        </div>
        <DevOnly>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button title="Sign in" icon={<LoginOutlined />} onClick={() => openSignIn()} />
          </SignedOut>
        </DevOnly>
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
    </section>
  );
};
