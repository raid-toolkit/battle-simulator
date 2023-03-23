import React from 'react';
import { round } from '../../Common';
import './TurnMeter.css';

export interface TurnMeterProps extends React.PropsWithChildren {
  value: number;
  showLabel?: boolean;
  winner?: boolean;
  width?: number | string;
  height?: number | string;
}

export const TurnMeter: React.FC<TurnMeterProps> = ({
  value,
  showLabel,
  winner = false,
  width = 300,
  height = 10,
  children,
}) => {
  const hasDetails = React.Children.count(children) > 0;
  const label = round(value * 100, 6).toString();
  const fontSize = `calc(${typeof height === 'number' ? `${height}px` : height} + 5px)`;
  return (
    <div title={label} className={`turn-meter-container ${hasDetails ? 'has-details' : ''}`} style={{ width, height }}>
      <div
        tabIndex={hasDetails ? 0 : undefined}
        className={['turn-meter', 'shadow-small', winner ? 'winner' : ''].join(' ')}
        style={{ height }}
      >
        {hasDetails && (
          <div className="layer">
            <div tabIndex={0} className="turn-meter-details">
              {children}
            </div>
          </div>
        )}
        <div className="layer fill">
          <div
            className={['filled', winner ? 'winner' : ''].join(' ')}
            style={{ width: `${Math.min(1, value) * 100}%` }}
          />
          {value > 1 && (
            <div
              className={['over-filled', winner ? 'winner' : ''].join(' ')}
              style={{
                paddingLeft: `${(1 - Math.max(0, value - 1)) * 100}%`,
              }}
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
      {showLabel && (
        <div className="turn-meter-label" style={{ fontSize, lineHeight: fontSize }}>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};
