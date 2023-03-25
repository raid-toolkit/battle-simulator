import { theme } from 'antd';
import React from 'react';
import { BlessingTypeId } from '../../Model';
import './Blessing.css';

export interface BlessingProps {
  id: BlessingTypeId;
  width?: number | string;
  height?: number | string;
  borderColor?: string;
  borderWidth?: number;
  style?: React.CSSProperties;
}

const blessingMaps: Partial<Record<BlessingTypeId, string>> = {
  [BlessingTypeId.Necromancy]: '600010',
  [BlessingTypeId.TimeSlowdown]: '600020',
  [BlessingTypeId.ToxicBlade]: '600030',
  [BlessingTypeId.Exterminator]: '600040',
  [BlessingTypeId.MagicOrb]: '600050',
  [BlessingTypeId.Fearless]: '600060',

  [BlessingTypeId.LightOrbs]: '600070',
  [BlessingTypeId.LeadershipDomination]: '600080',
  [BlessingTypeId.EnhancedWeapon]: '600090',
  [BlessingTypeId.Vanguard]: '600100',
  [BlessingTypeId.AdvancedHeal]: '600110',
  [BlessingTypeId.Courage]: '600120',

  [BlessingTypeId.Execute]: '600130',
  [BlessingTypeId.SoulDrinker]: '600140',
  [BlessingTypeId.ChainBreaker]: '600150',
  [BlessingTypeId.AdvancedLeadership]: '600160',
  [BlessingTypeId.Adaptation]: '600170',
  [BlessingTypeId.Amplification]: '600180',

  [BlessingTypeId.Meteor]: '600190',
  [BlessingTypeId.Polymorph]: '600200',
  [BlessingTypeId.MagicFlame]: '600210',
  [BlessingTypeId.Penetrator]: '600220',
  [BlessingTypeId.Agility]: '600230',
  [BlessingTypeId.Carapace]: '600240',
};

export const Blessing: React.FC<BlessingProps> = ({ id, style, width, height, borderColor, borderWidth }) => {
  const { token } = theme.useToken();
  const color = borderColor || token.colorPrimaryBorder;
  const borderSize =
    borderWidth ??
    Math.ceil(Math.max((parseFloat(width as string) || 130) / 130, (parseFloat(height as string) || 177) / 177) * 3);
  const borderStyle = React.useMemo(
    () =>
      ({
        '--border-color': color,
        '--border-size': `${borderSize}px`,
      } as React.CSSProperties),
    [borderSize, color]
  );
  const imgStyle = React.useMemo(() => ({ ...style, width, height }), [style, width, height]);
  return (
    <div className="blessing-border" style={borderStyle}>
      <img
        className="blessing"
        style={imgStyle}
        alt="blessing"
        src={`/images/blessings/${blessingMaps[id] || id}.png`}
      />
    </div>
  );
};
