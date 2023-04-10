import { ExperimentOutlined, RocketOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import safeLocalStorage from '../../Common/LocalStorage';

try {
  const initialParams = new URLSearchParams(document.location.search);
  const isDev = initialParams.get('dev');
  if (isDev !== null) {
    localStorage.setItem('dev', isDev ? 'true' : 'false');
  } else if (document.referrer) {
    const refUrl = new URL(document.referrer);
    if (refUrl.host.startsWith('local.')) {
      localStorage.setItem('dev', 'true');
    }
  }
} catch {}

const isLocal = document.location.hostname.startsWith('local.');
const isDev = safeLocalStorage.getItem('dev') === 'true';

export const ToggleEnvironmentButton: React.FC = () => {
  const icon = isLocal ? <ExperimentOutlined /> : <RocketOutlined />;
  const text = isLocal ? 'Local' : 'Production';
  const onClick = React.useCallback(() => {
    const url = new URL(document.location.href);
    if (isLocal) {
      url.host = url.host.replace(/^local\./g, '');
    } else {
      url.host = `local.${url.host}`;
    }
    document.location.href = url.toString();
  }, []);

  return isDev ? <Button icon={icon} title={text} onClick={onClick} /> : null;
};
