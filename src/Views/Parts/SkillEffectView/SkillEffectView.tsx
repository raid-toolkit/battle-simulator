import { EffectKindId, EffectType, SkillType } from '@raid-toolkit/webclient';
import { RTK, statusEffectImage } from '../../../Data';
import React from 'react';
import './SkillEffectView.css';
import { AbilitySetup, ChampionSetup, useAppModel } from '../../../Model';
import { Button, Typography, theme } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { getSkillChanceUpgrade } from '../../../Model/SimulateTurns/Helpers';

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
  chance?: number;

  onDisabledChanged?: (value: boolean) => void;
  disabled?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, description, title, disabled, chance, onDisabledChanged }) => {
  const { token } = theme.useToken();
  const disabledCallback = React.useCallback(() => {
    onDisabledChanged?.(!disabled);
  }, [disabled, onDisabledChanged]);
  return (
    <div className={['table-row', 'skill-effect', disabled && 'modified'].filter(Boolean).join(' ')}>
      {icon && <img className="inline-icon" alt={title || title} src={icon} />}
      {disabled !== undefined && (
        <Button
          type="text"
          title="Disable"
          icon={<StopOutlined style={{ color: disabled ? 'red' : token.colorTextDisabled }} />}
          onClick={disabledCallback}
        />
      )}
      {chance && (
        <Typography.Text disabled={disabled} style={{ whiteSpace: 'nowrap' }}>
          {Math.min(100, Math.round(chance * 100))}%
        </Typography.Text>
      )}
      {description && (
        <Typography.Text
          code
          disabled={disabled}
          style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
        >
          {description}
        </Typography.Text>
      )}
      <div style={{ flex: 1 }} />
      <span style={{ whiteSpace: 'nowrap' }}>{title}</span>
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
  skillType,
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
            chance={(skillEffect.chance ?? 1) + getSkillChanceUpgrade(skillType)}
            icon={statusEffectImage(info.typeId)}
            onDisabledChanged={(disabled) => setSkillEffectDisabled(index, disabled)}
            disabled={!!abilitySetup.effectMods?.[skillEffectId]?.disabledStatusEffectIndexes?.[index]}
          />
        );
      })}
    </>
  );
};

export const ChangeStamina: React.FC<InnerViewProps> = ({
  abilitySetup,
  skillEffect,
  skillEffectId,
  skillType,
  ownerIndex,
  skillIndex,
}) => {
  const { dispatch } = useAppModel();
  const setSkillEffectDisabled = React.useCallback(
    (disabled: boolean) => {
      dispatch.updateChampionSkill(ownerIndex, skillIndex, (ability) => {
        const mods = (ability.effectMods ??= {});
        const mod = (mods[skillEffectId] ??= {});
        mod.disabled = disabled;
      });
    },
    [dispatch, ownerIndex, skillIndex, skillEffectId]
  );
  const { title, icon } =
    skillEffect.kindId === EffectKindId.ReduceStamina
      ? { title: 'Reduce Turn Meter', icon: '/images/effects/ReduceStamina.png' }
      : { title: 'Increase Turn Meter', icon: '/images/effects/IncreaseStamina.png' };

  return (
    <Row
      title={title}
      icon={icon}
      chance={(skillEffect.chance ?? 1) + getSkillChanceUpgrade(skillType)}
      description={[skillEffect.condition, skillEffect.multiplier].filter(Boolean).join(': ')}
      onDisabledChanged={setSkillEffectDisabled}
      disabled={!!abilitySetup.effectMods?.[skillEffectId]?.disabled}
    />
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
    case EffectKindId.IncreaseStamina:
    case EffectKindId.ReduceStamina: {
      return <ChangeStamina {...innerProps} />;
    }
  }
  return <></>;
};
