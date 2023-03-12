import React from "react";
import "./TurnMeter.css";

export interface TurnMeterProps extends React.PropsWithChildren {
  value: number;
  width?: number | string;
  height?: number | string;
}

export const TurnMeter: React.FC<TurnMeterProps> = ({
  value,
  width = 300,
  height = 10,
  children,
}) => {
  const hasDetails = React.Children.count(children) > 0;
  return (
    <div
      tabIndex={hasDetails ? 0 : undefined}
      title={`${Math.round(value * 100)}%`}
      className={`turn-meter ${hasDetails ? "has-details" : ""}`}
      style={{ width, height }}
    >
      {hasDetails && (
        <div
          tabIndex={0}
          style={{ paddingTop: height }}
          className="turn-meter-details"
        >
          {children}
        </div>
      )}
      <div className="layer">
        <div
          className="filled"
          style={{ width: `${Math.min(1, value) * 100}%` }}
        />
        {value > 1 && (
          <div
            className="over-filled"
            style={{ width: `${Math.max(0, value - 1) * 100}%` }}
          />
        )}
      </div>
      <div className="layer grid">
        <div className="cell" />
        <div className="cell" />
        <div className="cell" />
        <div className="cell" />
      </div>
    </div>
  );
};
