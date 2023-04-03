import React from 'react';
import { SearchOutlined, HighlightOutlined, CoffeeOutlined, TeamOutlined } from '@ant-design/icons';
import { Space, Button, Popover, Modal, Typography, Avatar } from 'antd';
import isMobile from 'is-mobile';
import { useAppModel } from '../../Model';
import { SaveTeamButton } from './SaveTeamButton';
import './AppMenu.css';

export const AppMenu: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const [showThanks, setShowThanks] = React.useState(false);
  const hideThanks = React.useCallback(() => setShowThanks(false), []);

  const renderMenu = React.useCallback(() => {
    return (
      <Space.Compact direction="vertical">
        <Button
          size="large"
          icon={
            <img
              src="/logo.png"
              alt="Raid Toolkit Logo"
              style={{ objectFit: 'scale-down', height: '1rem', paddingRight: 4 }}
            />
          }
          target="_blank"
          href="https://raidtoolkit.com"
          type="text"
          style={{ textAlign: 'left' }}
        >
          Raid Toolkit
        </Button>
        <Button
          size="large"
          icon={<TeamOutlined />}
          type="text"
          style={{ textAlign: 'left' }}
          onClick={() => setShowThanks(true)}
        >
          Special thanks to...
        </Button>
      </Space.Compact>
    );
  }, []);
  return (
    <Space>
      <Space.Compact className="mobile-only">
        <SaveTeamButton />
      </Space.Compact>
      <Space.Compact className="desktop-only">
        <SaveTeamButton />
        {!isMobile() && (
          <Button icon={<SearchOutlined />} onClick={() => state.tourStep === undefined && dispatch.setTourStep(0)}>
            Take the tour
          </Button>
        )}
        <Button icon={<HighlightOutlined />} onClick={dispatch.changeTheme}>
          Change theme
        </Button>
        <Popover
          placement="bottomLeft"
          arrow={false}
          color="var(--color-primary)"
          overlayInnerStyle={{ padding: 2 }}
          trigger={['click']}
          content={renderMenu}
        >
          <Button type="dashed" icon={<CoffeeOutlined />}>
            Powered by...
          </Button>
        </Popover>
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
          <Avatar
            size="large"
            style={{ backgroundColor: 'var(--blue)' }}
            // src="/images/thanks/pavo.png"
          >
            P
          </Avatar>
          <div>
            <div className="thanks-to-name">Pavo</div>
            <div className="thanks-to-reason">
              Testing and getting the math <em>just right</em>. Filling our discord with really fucking long links that
              made me finally shorten them.
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar
            size="large"
            style={{ backgroundColor: 'var(--orange)' }}
            // src="/images/thanks/sent.png"
          >
            S
          </Avatar>
          <div>
            <div className="thanks-to-name">Sent</div>
            <div className="thanks-to-reason">
              Testing, late night theory crafting and trying some really broken tunes while I sorted out the right
              mechanics.
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar size="large" src="/images/thanks/nonrg.png">
            NE
          </Avatar>
          <div>
            <div className="thanks-to-name">NoEnergy</div>
            <div className="thanks-to-reason">
              All the crazy ideas- plenty of champs + skills are added based on your feedback
            </div>
          </div>
        </div>
        <div className="thanks-to">
          <Avatar
            size="large"
            style={{ backgroundColor: 'var(--pink)' }}
            // src="/images/thanks/spliitzy.png"
          >
            S
          </Avatar>
          <div>
            <div className="thanks-to-name">Spliitzy</div>
            <div className="thanks-to-reason">Theory crafting and resident eye candy.</div>
          </div>
        </div>
      </Modal>
    </Space>
  );
};
