import React from "react";
import "./Avatar.css";

export interface AvatarProps {
  id: string;
  width?: number | string;
  height?: number | string;
}

export const Avatar: React.FC<AvatarProps> = ({ id, width, height }) => {
  const style = React.useMemo(() => ({ width, height }), [width, height]);
  return (
    <img
      className="avatar"
      style={style}
      alt="hero avatar"
      src={`/images/avatars/${id}.png`}
    />
  );
};
