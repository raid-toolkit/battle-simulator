import { Segmented } from 'antd';
import { useAppModel } from '../../Model';
import type { SegmentedLabeledOption } from 'antd/es/segmented';

const options: SegmentedLabeledOption[] = [
  { label: 'Battle', value: 'battle' },
  { label: 'Team', value: 'team' },
];

export const ViewMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  return (
    <Segmented
      options={options}
      value={state.visiblePanel}
      onChange={dispatch.setSelectedPanel as (value: string | number) => void}
    />
  );
};
