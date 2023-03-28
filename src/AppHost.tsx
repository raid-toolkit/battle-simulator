import React from 'react';
import { ConfigProvider, Progress, theme, ThemeConfig, Typography } from 'antd';
import { ClerkProvider } from '@clerk/clerk-react';
import * as ClerkThemes from '@clerk/themes';
import { useAppModel } from './Model';
import { App } from './App';
import { RTK } from './Data';
import { ThemeStyleCssContext } from './Styles/Variables';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export const AppHost: React.FC = () => {
  const { state } = useAppModel();

  const themeConfig: ThemeConfig = React.useMemo(
    () => ({
      algorithm: state.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }),
    [state.theme]
  );

  const [progress, setProgress] = React.useState(0);
  const [loadState, setLoadState] = React.useState<'loading' | 'ready' | 'error'>('loading');
  React.useEffect(() => {
    const startTime = Date.now();
    RTK.loadEvents.on('progress', (n: number, m: number) => {
      const duration = Date.now() - startTime;
      if (duration > 250) {
        setProgress(Math.round((n / m) * 100));
      }
    });
    const finish = () => setLoadState('ready');
    RTK.wait()
      .then(() => {
        const duration = Date.now() - startTime;
        if (duration < 250) {
          finish();
        } else {
          const delay = Math.max(0, 1000 - duration);
          setTimeout(finish, delay);
        }
      })
      .catch((e) => {
        console.error(e);
        finish();
      });
  }, []);

  return (
    <ClerkProvider
      publishableKey={clerkPubKey!}
      appearance={{ baseTheme: state.theme === 'dark' ? ClerkThemes.dark : undefined }}
    >
      <ConfigProvider theme={themeConfig}>
        <ThemeStyleCssContext>
          {loadState === 'ready' ? (
            <App />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Progress
                type="circle"
                percent={progress}
                status={loadState === 'loading' ? 'active' : loadState === 'error' ? 'exception' : undefined}
              />
              <Typography.Title level={2} style={{ marginTop: 16 }}>
                {loadState === 'loading' ? 'Loading...' : 'An error occurred'}
              </Typography.Title>
            </div>
          )}
        </ThemeStyleCssContext>
      </ConfigProvider>
    </ClerkProvider>
  );
};
