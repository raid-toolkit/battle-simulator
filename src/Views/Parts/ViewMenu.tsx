import { Radio } from 'antd';
import { useAppModel } from '../../Model';

export const ViewMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  return (
    <Radio.Group
      value={state.visiblePanel}
      onChange={(e) => {
        dispatch.setSelectedPanel(e.target.value);
      }}
    >
      <Radio.Button value="battle">Battle</Radio.Button>
      <Radio.Button value="team">Team</Radio.Button>
    </Radio.Group>
  );
};
