import React from 'react';
import { Button, Spin } from 'antd';
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import { SignedIn, SignedOut, useClerk, UserButton } from '@clerk/clerk-react';
import { AppTour, TeamView, TurnSimulatorView } from './Views';
import { themeClassName } from './Styles/Variables';
import { SaveTeamButton, ViewMenu } from './Views/Parts';
import { useAppModel } from './Model';
import { isMobile } from 'is-mobile';
import './App.css';
// import { round } from './Common';
import { AppMenu } from './Views/App/AppMenu';
import { InformationDialog } from './Views/App/InformationDialog';
import { SettingsDialog } from './Views/App/SettingsDialog';
import { RandomPanel } from './Views/Parts/RandomPanel';

export const App: React.FC = () => {
  // const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, top: 0 });
  const { state } = useAppModel();
  const { openSignIn } = useClerk();

  // React.useEffect(() => {
  //   // finished
  //   if (state.turnWorkerState === 'idle') {
  //     messageApi.success(`Turn simulation took ${round(state.turnWorkerDuration, 1)}ms`, 2.5);
  //   }
  //   if (state.turnWorkerState === 'running') {
  //     messageApi.loading(`Running simulation`, 0);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.turnWorkerState]);

  return (
    <section className={`root-section ${themeClassName}`}>
      <section className="site-header">
        <div>
          <SaveTeamButton />
        </div>
        <div className="mobile-only">
          <ViewMenu />
        </div>
        <div className="user-corner">
          {state.turnWorkerState === 'running' && (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          )}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Button title="Sign in" shape="circle" icon={<LoginOutlined />} onClick={() => openSignIn()} />
          </SignedOut>

          <AppMenu />
        </div>
      </section>
      <section className="site-content">
        <main className={`site-panel site-main ${state.visiblePanel === 'battle' ? 'panel-visible' : ''}`}>
          <RandomPanel />
          <TurnSimulatorView />
        </main>
        <aside className={`site-panel site-sidebar ${state.visiblePanel === 'team' ? 'panel-visible' : ''}`}>
          <TeamView />
        </aside>
      </section>
      {/* {contextHolder} */}
      {!isMobile() && <AppTour />}
      <InformationDialog />
      <SettingsDialog />
    </section>
  );
};
