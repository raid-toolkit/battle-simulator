import React from "react";
import { SkillType } from "@raid-toolkit/webclient";
import { Card, Space, Button } from "antd";
import {
  getString,
  skillTypesDataSource,
  stringsDataSource,
} from "../DataSources";
import { useAsyncDataSource } from "../Hooks";
import { ThemeWrapper } from "../Storybook/ThemeWrapper";
import { RichString } from "../RichString/RichString";
import { NumberSpinner } from "../NumberSpinner/NumberSpinner";

export interface SkillEditorProps {
  skillId: number;
}

const Addon: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span style={{ width: 75, textAlign: "left", display: "inline-block" }}>
    {children}
  </span>
);

export const SkillEditor: React.FC<SkillEditorProps> = ({ skillId }) => {
  const skillTypes = useAsyncDataSource(skillTypesDataSource);
  const skillType = skillTypes[skillId] as SkillType | undefined;
  const strings = useAsyncDataSource(stringsDataSource);
  const description = getString(strings, skillType?.description);

  return (
    <ThemeWrapper>
      <Card
        title={skillType?.name.defaultValue}
        size="small"
        style={{ width: 250 }}
      >
        <Space direction="vertical">
          <RichString>{description}</RichString>
          <NumberSpinner
            addonAfter={<Addon>cooldown</Addon>}
            min={0}
            max={10}
            maxLength={2}
            precision={0}
          />
          <NumberSpinner
            addonAfter={<Addon>hits</Addon>}
            min={0}
            max={10}
            maxLength={2}
            precision={0}
          />
          <Space.Compact>
            <Button type={"primary"}>
              <img
                alt="block heal"
                src="/images/effects/BlockHeal2.png"
                style={{ width: 24, height: 24 }}
              />
            </Button>
            <NumberSpinner
              addonAfter={<Addon>turns</Addon>}
              min={0}
              max={10}
              maxLength={2}
              precision={0}
            />
          </Space.Compact>
        </Space>
      </Card>
    </ThemeWrapper>
  );
};
