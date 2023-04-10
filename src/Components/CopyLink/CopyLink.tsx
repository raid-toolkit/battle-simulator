import React from 'react';
import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { theme, Button } from 'antd';
import { useAppModel } from '../../Model';

export type CopyLinkProps =
  | {
      link?: never;
      getLink: () => Promise<string>;
    }
  | {
      link: string;
      getLink?: never;
    };

export const CopyLink: React.FC<CopyLinkProps> = ({ link, getLink }) => {
  const { token } = theme.useToken();
  const { state } = useAppModel();
  const [copied, setCopied] = React.useState(false);
  const onClick = React.useCallback(async () => {
    const linkToCopy = await (link ?? getLink?.());
    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [getLink, link]);
  return (
    <Button
      icon={copied ? <CheckOutlined /> : <LinkOutlined />}
      onClick={onClick}
      style={{ width: 100 }}
      color={token.colorSuccess}
      type={copied ? 'primary' : 'default'}
      disabled={state.tuneState.championList.length < 3}
    >
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
};
