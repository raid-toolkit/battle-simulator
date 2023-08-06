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
  HighlightOutlined,
  UpCircleOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import { CgDice5 } from 'react-icons/cg';
import { ImmunityIcon, PhantomTouchIcon } from '../Icons';
import { Typography } from 'antd';
import safeLocalStorage from '../Common/LocalStorage';
import { LocalStorageKeys } from '../Model/LocalStorageKeys';

const { Text } = Typography;

export function numericVersion(version: [number, number, number]) {
  return version[0] * 10000 + version[1] * 100 + version[2];
}

export function parseVersion(version: string): [number, number, number] {
  return version.split(',').map((v) => parseInt(v, 10)) as [number, number, number];
}

export const lastNumericVersionSeen = numericVersion(
  parseVersion(safeLocalStorage.getItem(LocalStorageKeys.LastChangeSeen) ?? '0.0.0')
);

export function hasUnseenChanges() {
  return changeLog.some(([version]) => numericVersion(version) > lastNumericVersionSeen);
}

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
  [
    [0, 9, 5],
    () => (
      <ul>
        <li className="version-heading">Style updates</li>
        <li>
          <HighlightOutlined />
          Reorganized the UI a bit, moving most extra functions into the top right menu; made other UI elements more
          mobile friendly
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 6],
    () => (
      <ul>
        <li className="version-heading">Game Version 36872 update</li>
        <li>
          <UpCircleOutlined />
          Added & updated new champs and skills
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 7],
    () => (
      <ul>
        <li className="version-heading">Immunity set support</li>
        <li>
          <ImmunityIcon />
          Added immunity artifact set toggle to start the battle with 2 turn block debuffs.
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 8],
    () => (
      <ul>
        <li className="version-heading">Freeze skill support</li>
        <li>
          <HourglassOutlined />
          Freeze debuffs will now correctly reduce the turnmeter of Fyro by 15%.
        </li>
      </ul>
    ),
  ],
  [
    [0, 9, 9],
    () => (
      <ul>
        <li className="version-heading">RNG Mode</li>
        <li>
          <CgDice5 />
          You can now enable RNG mode at the top of the turn simulator to test different outcomes.
        </li>
      </ul>
    ),
  ],
];

export const [lastChange] = changeLog[changeLog.length - 1];

export function markChangesSeen() {
  safeLocalStorage.setItem(LocalStorageKeys.LastChangeSeen, lastChange.join(','));
}
