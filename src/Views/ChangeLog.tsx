import React from 'react';
import {
  UserOutlined,
  ShareAltOutlined,
  StopOutlined,
  UsergroupAddOutlined,
  ThunderboltOutlined,
  PlusSquareOutlined,
  FlagFilled,
  FieldNumberOutlined,
  MobileOutlined,
  ClearOutlined,
  FunctionOutlined,
  SlidersOutlined,
  HistoryOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { PhantomTouchIcon } from './PhantomTouchIcon';
import { Typography } from 'antd';

const { Text } = Typography;

export const changeLog: [version: [number, number, number], render: () => JSX.Element][] = [
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
  [
    [0, 9, 1],
    () => (
      <ul>
        <li className="version-heading">Feature updates</li>
        <li>
          <ThunderboltOutlined />
          Speed aura is now automatically set based on first team slot
        </li>
        <li>
          <FieldNumberOutlined />
          Boss stage can now be set to 1-10! <aside>Time to git gud!</aside>
        </li>
        <li>
          <MobileOutlined />
          Current setup is now kept in the URL. <aside>Reload without fear!</aside>
        </li>
        <li>
          <ClearOutlined />
          Reset button added to clear the current setup.
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 2],
    () => (
      <ul>
        <li className="version-heading">Feature requests #1</li>
        <li>
          <FunctionOutlined />
          <Text code>AllyTeamContainsHero</Text> function added for skill conditions required for Oella A1.
        </li>
        <li>
          <SlidersOutlined />
          Turn limit slider added to settings.
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 3],
    () => (
      <ul>
        <li className="version-heading">Bug fixes</li>
        <li>
          <HistoryOutlined />
          Cooldown reduction implemented.
        </li>
        <li>
          <PlusCircleOutlined />
          Tomb lord extra turns fixed.
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 4],
    () => (
      <ul>
        <li className="version-heading">Bug fixes</li>
        <li>
          <PhantomTouchIcon />
          Phantom touch will now correctly go on cooldown even if the shield is already down.
        </li>
        <li>
          <HistoryOutlined />
          Cooldowns now default to their fully-booked minimums.
        </li>
      </ul>
    ),
  ],
];
