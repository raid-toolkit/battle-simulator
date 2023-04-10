import React from 'react';
import { HighlightOutlined, TeamOutlined, EnvironmentOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Space, Button, Modal, Typography, Avatar, Dropdown, MenuProps } from 'antd';
import isMobile from 'is-mobile';
import { useAppModel } from '../../Model';
import { SaveTeamButton } from './SaveTeamButton';
import './AppMenu.css';
import { ToggleEnvironmentButton } from './ToggleEnvironmentButton';

export const AppMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const [showThanks, setShowThanks] = React.useState(false);
  const hideThanks = React.useCallback(() => setShowThanks(false), []);

  const items: MenuProps['items'] = React.useMemo(
    () => [
      {
        key: 'rtk',
        icon: <img src="/logo.png" alt="Raid Toolkit Logo" style={{ objectFit: 'scale-down', height: '1rem' }} />,
        label: 'Raid Toolkit',
        onClick: () => window.open('https://raidtoolkit.com', '_blank'),
      },
      {
        key: 'thanks',
        icon: <TeamOutlined />,
        label: 'Acknowledgements',
        onClick: () => setShowThanks(true),
      },
    ],
    []
  );

  return (
    <Space>
      <Space.Compact>
        <SaveTeamButton />
      </Space.Compact>
      <Space.Compact className="desktop-only">
        {!isMobile() && (
          <Button
            title="Take the tour"
            icon={<EnvironmentOutlined />}
            onClick={() => state.tourStep === undefined && dispatch.setTourStep(0)}
          />
        )}
        <Button icon={<HighlightOutlined />} title="Change theme" onClick={dispatch.changeTheme} />
        <ToggleEnvironmentButton />
        <Dropdown placement="bottomRight" arrow={false} trigger={['click']} menu={{ items }}>
          <Button title="Menu" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space.Compact>
      <Modal
        open={showThanks}
        onCancel={hideThanks}
        title="Special thanks to..."
        footer={[
          <Button type="primary" onClick={hideThanks}>
            OK
          </Button>,
        ]}
      >
        <Typography.Paragraph>
          This tool has been created through collaboration with several members of the community.
        </Typography.Paragraph>
        <Typography.Paragraph>Special thanks to the following folks who made this tool possible:</Typography.Paragraph>
        <div className="thanks-to">
          <Avatar size="large" src="/images/thanks/pavo.png" />
          <div>
            <div className="thanks-to-name">Pavo</div>
            <div className="thanks-to-reason">
              Testing and getting the math <em>just right</em>. Filling our discord with really fucking long links that
              made me finally shorten them.
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar size="large" src="/images/thanks/sent.png" />
          <div>
            <div className="thanks-to-name">Sent</div>
            <div className="thanks-to-reason">
              Testing, late night theory crafting and trying some really broken tunes while I sorted out the right
              mechanics.
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar size="large" src="/images/thanks/nonrg.png" />
          <div>
            <div className="thanks-to-name">NoEnergy</div>
            <div className="thanks-to-reason">
              All the crazy ideas- plenty of champs + skills are added based on your feedback
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar size="large" src="/images/thanks/spliitzy.png" />
          <div>
            <div className="thanks-to-name">Spliitzy</div>
            <div className="thanks-to-reason">Theory crafting and resident eye candy.</div>
          </div>
        </div>
      </Modal>
    </Space>
  );
};
