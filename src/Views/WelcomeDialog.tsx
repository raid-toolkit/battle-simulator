import React from 'react';
import { Button, Modal, Typography } from 'antd';
import safeLocalStorage from '../Common/LocalStorage';
import './WelcomeDialog.css';
import {
  UserOutlined,
  ShareAltOutlined,
  StopOutlined,
  UsergroupAddOutlined,
  ThunderboltOutlined,
  PlusSquareOutlined,
  FlagFilled,
} from '@ant-design/icons';
import { PhantomTouchIcon } from './PhantomTouchIcon';

const { Paragraph, Text, Title } = Typography;

const changeLog: [version: [number, number, number], render: () => JSX.Element][] = [
  [
    [0, 8, 0],
    () => (
      <ul>
        <li className="version-heading">Alpha release</li>
        <li>
          <UsergroupAddOutlined />
          Ally attack abilities
        </li>
        <li>
          <ThunderboltOutlined />
          TM increase abilities
        </li>
        <li>
          <PlusSquareOutlined />
          Increase buff duration
        </li>
      </ul>
    ),
  ],
  [
    [0, 8, 1],
    () => (
      <ul>
        <li className="version-heading">Feature updates</li>
        <li>
          <UserOutlined />
          Account login
        </li>
        <li>
          <ShareAltOutlined />
          Short links <aside>(for logged in users only)</aside>
        </li>
        <li>
          <PhantomTouchIcon />
          Phantom touch <aside>(assumes 1 extra hit per turn)</aside>
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 0],
    () => (
      <ul>
        <li className="version-heading">Public Beta</li>
        <li>
          <StopOutlined />
          Honor{' '}
          <Text code>
            <FlagFilled style={{ color: 'var(--color-primary-text)' }} /> opener
          </Text>{' '}
          option for abilities marked{' '}
          <Text code>
            <StopOutlined style={{ color: 'var(--color-error-text)' }} /> don't use
          </Text>
        </li>
      </ul>
    ),
  ],
];

function numericVersion(version: [number, number, number]) {
  return version[0] * 10000 + version[1] * 100 + version[2];
}

function parseVersion(version: string): [number, number, number] {
  return version.split('.').map((v) => parseInt(v, 10)) as [number, number, number];
}

const [lastChange] = changeLog[changeLog.length - 1];

const enum LocalStorageKeys {
  SeenWelcomeDialog = 'seen_welcome_dialog',
  LastChangeSeen = 'last_change_seen',
}

export const WelcomeDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(false);
  const [sinceChange, setSinceChange] = React.useState<[number, number, number]>([0, 0, 0]);

  const closeDialog = React.useCallback(() => {
    setOpen(false);
    setFirstRun(false);
    safeLocalStorage.setItem(LocalStorageKeys.SeenWelcomeDialog, 'true');
    safeLocalStorage.setItem(LocalStorageKeys.LastChangeSeen, `${lastChange}`);
  }, []);

  React.useEffect(() => {
    let open = false;
    if (safeLocalStorage.getItem(LocalStorageKeys.SeenWelcomeDialog) !== 'true') {
      setFirstRun(true);
      open = true;
    }
    const lastChangeSeen = parseVersion(safeLocalStorage.getItem(LocalStorageKeys.LastChangeSeen) ?? '0.0.0');
    if (numericVersion(lastChangeSeen) < numericVersion(lastChange)) {
      setSinceChange(lastChangeSeen);
      open = true;
    }
    setOpen(open);
  }, []);

  const title = firstRun ? (
    <Title level={4}>Welcome to Raid Fire Knight turn simulator!</Title>
  ) : (
    <Title level={4}>New changes since your last visit!</Title>
  );

  const renderUpdatesSinceLastVisit = React.useCallback(
    () => (
      <>
        {firstRun && <Title level={5}>Recent changes</Title>}
        {changeLog
          .map(([version, render]) => (
            <div
              key={`version_${version}`}
              className={`version-update ${
                numericVersion(version) > numericVersion(sinceChange) ? '' : 'previously-seen'
              }`}
            >
              <div className="version-heading version-label">v{version.join('.')}</div>
              <div className="version-description">{render()}</div>
            </div>
          ))
          .reverse()}
      </>
    ),
    [sinceChange, firstRun]
  );

  const renderWelcome = React.useCallback(
    () => (
      <>
        <Paragraph>
          This tool is designed to help you craft different kinds of speed tunes for the FK10 dungeon and share them
          with the community.
        </Paragraph>
        <Paragraph>
          <span className="emphasis">This tool is still in beta</span>, and there are limited ability types which are
          coded to work as intended against this boss. Below are the major known limitations:
        </Paragraph>
        <ul>
          <li>
            Freeze debuffs will decrease the bosses turn meter as intended. This is an intentional limitation due to the
            inconsistent nature of non-100% debuff rates for freeze champions. This will be added with a new "RNG Mode"
            that is planned to handle these challenges.
          </li>
          <li>
            Passive skills are not yet implemented, with the exception of Valkyrie's passive due to the prevalence of
            her in the FK10 meta. These are already being worked on and will be added in the near future.
          </li>
        </ul>
      </>
    ),
    []
  );

  return (
    <Modal
      open={open}
      title={title}
      onCancel={closeDialog}
      bodyStyle={{ maxHeight: 'calc(80vh - 240px)', overflowY: 'auto', scrollbarGutter: 'stable' }}
      footer={[
        <Button type="primary" key="ok" onClick={closeDialog}>
          OK
        </Button>,
      ]}
    >
      {firstRun && renderWelcome()}
      {renderUpdatesSinceLastVisit()}
    </Modal>
  );
};
