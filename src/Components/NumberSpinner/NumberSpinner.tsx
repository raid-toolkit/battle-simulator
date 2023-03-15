import React from "react";
import { InputNumber, InputNumberProps } from "antd";
import { useRefWithWheelHandler } from "../Hooks";
import { round } from "../../Common";

export interface NumberSpinnerProps extends InputNumberProps<number> {
  scalar?: number;
  initialValue?: number;
  precision?: number;
}

export const NumberSpinner: React.FC<NumberSpinnerProps> = ({
  scalar = 0.01,
  initialValue,
  value: userValue,
  precision = 0,
  onChange,
  ...props
}) => {
  const [rawValue, setRawValue] = React.useState(initialValue ?? userValue);

  const roundedValue = React.useMemo(() => {
    return rawValue !== null && rawValue !== undefined
      ? round(rawValue, precision)
      : rawValue;
  }, [rawValue, precision]);

  React.useEffect(() => {
    onChange?.(roundedValue || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundedValue]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent | WheelEvent) =>
      setRawValue((value) => (value ?? 0) + e.deltaY * -0.01),
    []
  );

  const captureWheelHack = useRefWithWheelHandler(onWheel);

  const realValue = userValue ?? rawValue;
  return (
    <InputNumber
      {...props}
      value={realValue ? round(realValue, precision) : undefined}
      onChange={(value) => setRawValue(value || 0)}
      ref={captureWheelHack}
    />
  );
};
