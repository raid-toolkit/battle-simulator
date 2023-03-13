import React from "react";
import { Divider, DividerProps, theme } from "antd";
import "./CardDivider.css";

const { useToken } = theme;

export const CardDivider: React.FC<DividerProps> = ({ children, ...props }) => {
  const { token } = useToken();

  return (
    <div className="card-divider">
      <Divider {...props} />
      {children && (
        <div
          className="card-divider-title"
          style={{
            color: token.colorText,
            fontWeight: token.fontWeightStrong,
            backgroundColor: token.colorBgContainer,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
