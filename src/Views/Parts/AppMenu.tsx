import { SearchOutlined, HighlightOutlined } from '@ant-design/icons';
import { Space, Button } from 'antd';
import { useAppModel } from '../../Model';
import { SaveTeamButton } from './SaveTeamButton';

export const AppMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  return (
    <Space>
      <Space.Compact className="mobile-only">
        <SaveTeamButton />
      </Space.Compact>
      <Space.Compact className="desktop-only">
        <SaveTeamButton />
        <Button icon={<SearchOutlined />} onClick={() => state.tourStep === undefined && dispatch.setTourStep(0)}>
          Take the tour
        </Button>
        <Button icon={<HighlightOutlined />} onClick={dispatch.changeTheme}>
          Change theme
        </Button>
        <Button
          type="dashed"
          icon={
            <img
              src="/logo.png"
              alt="Raid Toolkit Logo"
              style={{ objectFit: 'scale-down', height: '1rem', paddingRight: 4 }}
            />
          }
          target="_blank"
          style={{ fontSize: 12, fontVariant: 'all-small-caps' }}
          href="https://raidtoolkit.com"
        >
          Powered by: Raid Toolkit
        </Button>
      </Space.Compact>
    </Space>
  );
};
