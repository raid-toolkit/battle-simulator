import { CompressOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Badge, Card, Input } from 'antd';
import React from 'react';

export const BossSelectionView: React.FC = () => {
  return (
    <Badge.Ribbon text="Boss">
      <Card>
        <Input
          addonBefore="Boss Speed"
          defaultValue={250}
          style={{ textAlign: 'right' }}
          suffix={<ThunderboltOutlined />}
        />
        <Input
          addonBefore="Shield Hits"
          defaultValue={21}
          style={{ textAlign: 'right' }}
          suffix={<CompressOutlined />}
        />
      </Card>
    </Badge.Ribbon>
  );
};
