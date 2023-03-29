import React from 'react';
import { Button, InputNumber, Popover, Space, theme } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  MenuOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
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

  const [showMenu, setShowMenu] = React.useState(false);

  const renderMenu = React.useCallback(() => {
    return (
      <Space.Compact direction="vertical">
        <Button size="large" danger icon={<DeleteOutlined />} type="text" onClick={deleteSetup}>
          Delete
        </Button>
        {index > 0 && (
          <Button
            type="text"
            size="large"
            icon={<ArrowUpOutlined />}
            onClick={() => {
              setShowMenu(false);
              dispatch.moveChampion(index, index - 1);
            }}
          >
            Move up
          </Button>
        )}
        {index < state.tuneState.championList.length - 1 && (
          <Button
            type="text"
            size="large"
            icon={<ArrowDownOutlined />}
            onClick={() => {
              setShowMenu(false);
              dispatch.moveChampion(index, index + 1);
            }}
          >
            Move down
          </Button>
        )}
      </Space.Compact>
    );
  }, [deleteSetup, index, state.tuneState.championList.length, dispatch]);

  return (
    <div className="champion-setup-card" style={{ margin: '1px 0px' }} tabIndex={0}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div className="ability-row">
          <Space.Compact block>
            <Popover
              arrow
              placement="leftTop"
              open={showMenu}
              onOpenChange={setShowMenu}
              overlayInnerStyle={{ padding: 2 }}
              trigger={['click']}
              content={renderMenu}
            >
              <Button
                icon={<MenuOutlined />}
                type="text"
                style={{
                  borderBottomLeftRadius: 0,
                }}
              />
            </Popover>
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
    </div>
  );
};
