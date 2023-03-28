import { pack } from 'jsonpack';
import React from 'react';
import { CopyLink } from '../../Components';
import { useAppModel } from '../../Model';

export const SaveTeamButton: React.FC = () => {
  const { state } = useAppModel();

  const getLink = React.useCallback(() => {
    const packed = pack(state.tuneState);
    const link = btoa(packed);
    const url = new URL(document.location.href);
    url.hash = '';
    url.search = `?ts=${link}`;
    return url.toString();
  }, [state.tuneState]);

  return <CopyLink getLink={getLink} />;
};
