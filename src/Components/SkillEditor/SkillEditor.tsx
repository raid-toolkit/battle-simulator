import React from "react";
import { SkillType } from "@raid-toolkit/webclient";
import { Card, Descriptions, InputNumber, Space } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import {
  getString,
  skillTypesDataSource,
  stringsDataSource,
} from "../DataSources";
import { useAsyncDataSource, useForage } from "../Hooks";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";
import "./SkillEditor.css";
import { CardDivider } from "../CardDivider/CardDivider";
import { RichString } from "../RichString/RichString";
import { userDataStore } from "../../Data/Forage";

export interface SkillEditorProps {
  skillId: number;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({ skillId }) => {
  const skillTypes = useAsyncDataSource(skillTypesDataSource);
  const skillType = skillTypes[skillId] as SkillType | undefined;
  const strings = useAsyncDataSource(stringsDataSource);
  const name = getString(strings, skillType?.name);
  const description = getString(strings, skillType?.description);

  const [hits, setHits] = useForage<number | null>(
    userDataStore,
    `(skill:${skillId}).hits`,
    1
  );

  return (
    <ThemeWrapper>
      <Card title={name} actions={[<SettingOutlined key="setting" />]}>
        <Space>
          <InputNumber
            addonBefore="# of hits"
            value={hits}
            onChange={setHits}
            min={0}
            max={10}
            maxLength={2}
            onWheel={(e) => {
              if (e.deltaY > 0) {
                setHits((hits) => (hits ?? 1) - 1);
              } else if (e.deltaY < 0) {
                setHits((hits) => (hits ?? 1) + 1);
              }
              e.preventDefault();
            }}
            style={{ width: 136 }}
          />
        </Space>
        <CardDivider>Description</CardDivider>
        <RichString>{description}</RichString>
      </Card>
    </ThemeWrapper>
  );
};
