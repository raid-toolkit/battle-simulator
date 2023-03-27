import React from 'react';
import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { theme, Button } from 'antd';

export type CopyLinkProps =
  | {
      link?: never;
      getLink: () => string;
    }
  | {
      link: string;
      getLink?: never;
    };

export const CopyLink: React.FC<CopyLinkProps> = ({ link, getLink }) => {
  const { token } = theme.useToken();
  const [copied, setCopied] = React.useState(false);
  const onClick = React.useCallback(() => {
    const linkToCopy = link ?? getLink?.();
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
      style={{ width: 115 }}
      color={token.colorSuccess}
      type={copied ? 'primary' : 'default'}
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </Button>
  );
};
