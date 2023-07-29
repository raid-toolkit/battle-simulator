import { EffectKindId, EffectType, SkillType } from '@raid-toolkit/webclient';
import { RTK, statusEffectImage } from '../../../Data';
import React from 'react';
import './SkillEffectView.css';
import { AbilitySetup, ChampionSetup, useAppModel } from '../../../Model';
import { Button, Typography, theme } from 'antd';
import { StopOutlined } from '@ant-design/icons';

export interface SkillEffectViewProps {
  ownerIndex: number;
  abilityIndex: number;
  skillTypeId: number;
  skillEffectId: number;
}

interface RowProps {
  icon?: string;
  description?: string;
  title: string;

  onDisabledChanged?: (value: boolean) => void;
  disabled?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, description, title, disabled, onDisabledChanged }) => {
  const { token } = theme.useToken();
  const disabledCallback = React.useCallback(() => {
    onDisabledChanged?.(!disabled);
  }, [disabled, onDisabledChanged]);
  return (
    <div className="table-row skill-effect">
      {icon && <img className="inline-icon" alt={title || title} src={icon} />}
      {disabled !== undefined && (
        <Button
          type="text"
          title="Disable"
          icon={<StopOutlined style={{ color: disabled ? 'red' : token.colorTextDisabled }} />}
          onClick={disabledCallback}
        />
      )}
      {description && (
        <Typography.Text code disabled={disabled}>
          {description}
        </Typography.Text>
      )}
      <div style={{ flex: 1 }} />
      {<Typography.Text disabled={disabled}>{title}</Typography.Text>}
    </div>
  );
};

export const Icon: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span className="effect-icon">{children}</span>;
};

export const Title: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span className="effect-title">{children}</span>;
};

export const Description: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Typography.Text disabled style={{ flex: 1 }}>
      {children}
    </Typography.Text>
  );
};

export interface InnerViewProps {
  skillEffect: EffectType;
  skillEffectId: number;

  skillType: SkillType;
  abilitySetup: AbilitySetup;
  ownerIndex: number;
  skillIndex: number;
  owner: ChampionSetup;
}

export const DamageEffectView: React.FC<InnerViewProps> = ({ abilitySetup, skillType, skillEffect, owner }) => {
  return <Row title="Apply Damage" description={skillEffect.multiplier} icon="/images/sets/Offense.png" />;
};

export const ApplyStatusView: React.FC<InnerViewProps & { title: string }> = ({
  title,
  abilitySetup,
  skillEffect,
  skillEffectId,
  ownerIndex,
  skillIndex,
}) => {
  const { dispatch } = useAppModel();
  const setSkillEffectDisabled = React.useCallback(
    (statusEffectIndex: number, disabled: boolean) => {
      dispatch.updateChampionSkill(ownerIndex, skillIndex, (ability) => {
        const mods = (ability.effectMods ??= {});
        const mod = (mods[skillEffectId] ??= {});
        const disabledIndexes = (mod.disabledStatusEffectIndexes ??= {});
        disabledIndexes[statusEffectIndex] = disabled;
      });
    },
    [dispatch, ownerIndex, skillIndex, skillEffectId]
  );
  return (
    <>
      {skillEffect.applyStatusEffectParams?.statusEffectInfos.map((info, index) => {
        return (
          <Row
            key={`skillEffect_${index}_${info.typeId}`}
            title={title}
            description={skillEffect.condition}
            icon={statusEffectImage(info.typeId)}
            onDisabledChanged={(disabled) => setSkillEffectDisabled(index, disabled)}
            disabled={!!abilitySetup.effectMods?.[skillEffectId]?.disabledStatusEffectIndexes?.[index]}
          />
        );
      })}
    </>
  );
};

export const SkillEffectView: React.FC<SkillEffectViewProps> = ({
  ownerIndex,
  abilityIndex,
  skillTypeId,
  skillEffectId,
}) => {
  const { state } = useAppModel();
  const skillEffect = RTK.skillTypes[skillTypeId].effects.find((effect) => effect.id === skillEffectId);
  const owner = state.tuneState.championList[ownerIndex];
  const abilitySetup = owner.abilities[abilityIndex];
  const skillType = RTK.skillTypes[skillTypeId];

  if (!skillEffect) {
    return <></>; // skill effect not found
  }

  const innerProps: InnerViewProps = {
    abilitySetup,
    skillType,
    skillEffect,
    skillEffectId,
    skillIndex: abilityIndex,
    ownerIndex,
    owner,
  };

  if (!skillEffect) {
    return <></>;
  }
  switch (skillEffect.kindId) {
    case EffectKindId.Damage: {
      return <DamageEffectView {...innerProps} />;
    }
    case EffectKindId.ApplyBuff: {
      return <ApplyStatusView {...innerProps} title="Apply Buff" />;
    }
    case EffectKindId.ApplyDebuff: {
      return <ApplyStatusView {...innerProps} title="Apply Debuff" />;
    }
  }
  return <></>;
};
