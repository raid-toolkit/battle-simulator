import Icon from '@ant-design/icons/lib/components/Icon';
import { IconBaseProps } from 'react-icons';
import { CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6 } from 'react-icons/cg';

export interface DiceProps extends IconBaseProps {
  value: number;
}

export const Dice: React.FC<DiceProps> = ({ value, ...props }) => {
  const DiceIcon = [CgDice1, CgDice2, CgDice3, CgDice4, CgDice5, CgDice6][value % 6];

  return (
    <Icon>
      <DiceIcon {...props} />
    </Icon>
  );
};
