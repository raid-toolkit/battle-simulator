import { DownOutlined, MinusOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Input, Space, Switch } from 'antd';
import React from 'react';
import { useCollapse } from 'react-collapsed';
import { useAppModel } from '../../../Model';

export const RandomPanel: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const { getCollapseProps, setExpanded, isExpanded } = useCollapse({
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    duration: 500,
  });
  return (
    <div className="random-panel">
      <div className="random-panel-container" {...getCollapseProps()}>
        <div className="random-panel-content">
          <Space>
            <span>Effect chances</span>
            <Switch
              checkedChildren="Simulated"
              unCheckedChildren="100%"
              checked={state.tuneState.chanceMode === 'rng'}
              onChange={() => dispatch.setChanceMode(state.tuneState.chanceMode === 'rng' ? 'guaranteed' : 'rng')}
            />
          </Space>
          <Space>
            <Button icon={<MinusOutlined />} onClick={() => dispatch.setRandomSeed((seed) => --seed)} />
            <Input
              type="number"
              addonBefore="Random Seed"
              style={{ width: 200 }}
              value={state.tuneState.randomSeed ?? 0}
              onChange={(e) => dispatch.setRandomSeed(parseInt(e.target.value, 10) ?? state.tuneState.randomSeed)}
            />
            <Button icon={<PlusOutlined />} onClick={() => dispatch.setRandomSeed((seed) => ++seed)} />
          </Space>
        </div>
      </div>
      <Button
        type={state.tuneState.chanceMode === 'rng' ? 'primary' : 'dashed'}
        size="small"
        icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
        onClick={() => setExpanded((value) => !value)}
      >
        RNG
      </Button>
    </div>
  );
  // <ExperimentOutlined />
};
