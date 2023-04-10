import React from 'react';
import { Typography } from 'antd';
import safeLocalStorage from '../../Common/LocalStorage';
import { LocalStorageKeys } from '../../Model/LocalStorageKeys';
const { Paragraph, Title } = Typography;

export const WelcomeBody: React.FC = () => {
  React.useEffect(() => {
    safeLocalStorage.setItem(LocalStorageKeys.SeenWelcomeDialog, 'true');
  }, []);
  return (
    <>
      <Title level={4}>Welcome to Raid Fire Knight turn simulator!</Title>
      <Paragraph>
        This tool is designed to help you craft different kinds of speed tunes for the FK10 dungeon and share them with
        the community.
      </Paragraph>
      <Paragraph>
        <span className="emphasis">This tool is still in beta</span>, and there are limited ability types which are
        coded to work as intended against this boss. Below are the major known limitations:
      </Paragraph>
      <ul>
        <li>
          Freeze debuffs will decrease the bosses turn meter as intended. This is an intentional limitation due to the
          inconsistent nature of non-100% debuff rates for freeze champions. This will be added with a new "RNG Mode"
          that is planned to handle these challenges.
        </li>
        <li>
          Passive skills are not yet implemented, with the exception of Valkyrie's passive due to the prevalence of her
          in the FK10 meta. These are already being worked on and will be added in the near future.
        </li>
      </ul>
    </>
  );
};
