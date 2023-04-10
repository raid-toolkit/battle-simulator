import React from 'react';
import {
  EnvironmentOutlined,
  ExperimentFilled,
  ExperimentOutlined,
  HighlightOutlined,
  MenuOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import { useAppModel } from '../../Model';
import isMobile from 'is-mobile';
import { isDev, isLocal } from '../../Model/Dev';

type MenuItem = Required<MenuProps>['items'][number];
type AppMenuItem = MenuItem & {
  visible?: boolean;
};

export const AppMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const items: AppMenuItem[] = React.useMemo<AppMenuItem[]>(
    () =>
      [
        {
          key: 'dev',
          icon: isLocal ? <ExperimentFilled style={{ color: 'var(--color-success)' }} /> : <ExperimentOutlined />,
          label: 'Switch environment',
          visible: isDev,
          onClick() {
            const url = new URL(document.location.href);
            if (isLocal) {
              url.host = url.host.replace(/^local\./g, '');
            } else {
              url.host = `local.${url.host}`;
            }
            document.location.href = url.toString();
          },
        },
        { key: 'divdev', type: 'divider', visible: isDev },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: 'Settings',
          onClick() {
            dispatch.setSettingsVisible(true);
          },
        },
        {
          key: 'theme',
          icon: <HighlightOutlined />,
          label: 'Toggle theme',
          onClick: dispatch.changeTheme,
        },
        {
          key: 'tour',
          icon: <EnvironmentOutlined />,
          label: 'Take the tour',
          visible: !isMobile(),
          onClick() {
            state.tourStep === undefined && dispatch.setTourStep(0);
          },
        },
        { key: 'divz', type: 'divider' },
        {
          key: 'about',
          icon: <QuestionCircleOutlined />,
          label: 'About',
          onClick() {
            dispatch.setInfoDialogTab('about');
          },
        },
        {
          key: 'changelog',
          icon: <NotificationOutlined />,
          label: 'Release notes',
          onClick() {
            dispatch.setInfoDialogTab('changelog');
          },
        },
        {
          key: 'ack',
          icon: <TrophyOutlined />,
          label: 'Acknowledgements',
          onClick() {
            dispatch.setInfoDialogTab('acknowledgements');
          },
        },
      ].filter((item) => item.visible !== false),
    [dispatch, state.tourStep]
  );
  return (
    <span>
      <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
        <Button icon={<MenuOutlined />} title="Menu" />
      </Dropdown>
    </span>
  );
};
