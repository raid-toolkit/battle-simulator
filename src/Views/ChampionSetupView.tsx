import React from 'react';
import { Button, Dropdown, InputNumber, MenuProps, Space, theme } from 'antd';
import { DeleteOutlined, HolderOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { ChampionSelectMenu } from '../Components';
import { AbilitySetupListView } from './AbilitySetupListView';
import { BlessingTypeId, TourStep, useAppModel } from '../Model';
import { PhantomTouchIcon } from './PhantomTouchIcon';
import './ChampionSetupView.css';

export interface ChampionSetupViewProps {
  index: number;
}

export const ChampionSetupView: React.FC<ChampionSetupViewProps> = ({ index }) => {
  const { token } = theme.useToken();
  const { state, dispatch } = useAppModel();
  const setup = state.tuneState.championList[index];

  const deleteSetup = React.useCallback(() => dispatch.removeChampion(index), [dispatch, index]);
  const selectTypeId = React.useCallback(
    (typeId?: number) => {
      dispatch.setSetupTypeId(index, typeId);
      dispatch.completeTourStep(TourStep.SelectChampion);
    },
    [index, dispatch]
  );

  const setSpeed = React.useCallback(
    (value: number | null) => {
      dispatch.completeTourStep(TourStep.SetChampionSpeed);
      dispatch.updateChampion(index, (setup) => {
        setup.speed = value || undefined;
      });
    },
    [index, dispatch]
  );

  const togglePhantomTouch = React.useCallback(() => {
    dispatch.updateChampion(index, (setup) => {
      setup.blessing = setup.blessing ? null : BlessingTypeId.MagicOrb;
    });
  }, [index, dispatch]);

  const menu = React.useMemo<MenuProps>(
    () => ({
      items: [
        {
          key: 'delete',
          label: 'Delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: deleteSetup,
        },
      ],
    }),
    [deleteSetup]
  );

  return (
    <div className="champion-setup-card" style={{ margin: '8px 0px' }} tabIndex={0}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div className="ability-row">
          <Space.Compact block>
            <ChampionSelectMenu
              bordered={false}
              status={setup.typeId ? '' : 'warning'}
              style={{ flex: 1 }}
              selectedValue={setup.typeId}
              onSelect={selectTypeId}
              onClear={selectTypeId}
            />
            <Button
              type="text"
              icon={<PhantomTouchIcon />}
              onClick={togglePhantomTouch}
              title="Phantom Touch"
              style={{
                borderBottomRightRadius: 0,
                color: setup.blessing === BlessingTypeId.MagicOrb ? token.colorPrimary : token.colorText,
              }}
            />
            <InputNumber
              bordered={false}
              className="ant-input-compact-item ant-input-compact-last-item"
              status={setup.speed ? '' : 'warning'}
              style={{ width: 90, textAlign: 'right' }}
              value={setup.speed || undefined}
              onChange={setSpeed}
              prefix={<ThunderboltOutlined />}
              // addonBefore="Speed"
              min={70}
              max={600}
              step={1}
              // addonAfter={<ThunderboltOutlined />}
              // suffix={<ThunderboltOutlined />}
            />
          </Space.Compact>
        </div>
        <AbilitySetupListView ownerIndex={index} />
      </div>
      <div
        className="champion-setup-card-actions"
        style={{
          position: 'absolute',
          left: -40,
          width: 40,
          top: 0,
          bottom: 0,
        }}
      >
        <Space.Compact
          direction="vertical"
          style={{
            position: 'absolute',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <Dropdown arrow placement="topLeft" trigger={['click']} menu={menu}>
            <Button icon={<HolderOutlined />} />
          </Dropdown>
          <Button icon={<DeleteOutlined />} style={{ color: token.colorError }} onClick={deleteSetup} />
        </Space.Compact>
      </div>
    </div>
  );
};
