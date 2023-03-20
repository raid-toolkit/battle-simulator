import React from 'react';
import './Avatar.css';

export interface AvatarProps {
  id: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

const avatarMaps: Record<string, string | undefined> = {
  '910': '21010',
  '930': '21030',
  '940': '21050',
  '950': '21060',
  '960': '21080',
  '970': '21090',
  '980': '21110',
  '990': '21120',
  '1190': '1190temp',
  '1410': '1410_temp',
  '1580': '1580_temp',
  '1610': '1610_temp',
  '1770': '1770_temp',
  '1780': '1780_temp',
  '6480': '6480_avatar',
};

export const Avatar: React.FC<AvatarProps> = ({ id, style, width, height }) => {
  const imgStyle = React.useMemo(() => ({ ...style, width, height }), [style, width, height]);
  return (
    <img className="avatar" style={imgStyle} alt="hero avatar" src={`/images/avatars/${avatarMaps[id] || id}.png`} />
  );
};
