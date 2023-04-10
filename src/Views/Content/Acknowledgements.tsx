import React from 'react';
import { Typography, Avatar } from 'antd';
import './Acknowledgements.css';

export const Acknowledgements: React.FC = () => {
  return (
    <div>
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
    </div>
  );
};
