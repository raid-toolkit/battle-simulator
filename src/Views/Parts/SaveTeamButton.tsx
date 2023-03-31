import React from 'react';
import { CopyLink } from '../../Components';
import { useAccountModel, useAppModel, validateSetup } from '../../Model';
import { Alert, Input, Modal, Typography } from 'antd';
import { pack } from 'jsonpack';
import { DeferredResult } from '../../Common';

export const SaveTeamButton: React.FC = () => {
  const { state } = useAppModel();
  const account = useAccountModel();
  const [open, setOpen] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [, setTeamName] = React.useState<string>();

  const deferredLink = React.useRef<DeferredResult<string>>();
  const teamNameRef = React.useRef<string>();

  const getLink = React.useCallback(async () => {
    if (deferredLink.current) {
      deferredLink.current.cancel(new Error('Cancelled'));
    }
    if (teamNameRef.current) teamNameRef.current = undefined;
    deferredLink.current = new DeferredResult();
    setError(undefined);
    setConfirmLoading(false);
    setTeamName(undefined);
    setOpen(true);

    const url = new URL(document.location.href);
    const qs = new URLSearchParams();
    try {
      const id = await deferredLink.current;
      const urlName = teamNameRef.current?.replace(/\s\w]/g, (m) => m.toUpperCase()).replace(/[^\w]/g, '');
      urlName && qs.set('n', urlName);
      qs.set('id', id);
    } catch (e) {
      setError('An error occurred saving the team');
      const packed = pack(state.tuneState);
      qs.set('ts', btoa(packed));
    }
    url.hash = '';
    url.search = qs.toString();
    setOpen(false);
    setConfirmLoading(false);
    window.history.replaceState(undefined, '', url.toString());
    return url.toString();
  }, [state.tuneState]);

  const shareTeam = React.useCallback(async () => {
    if (!account.userId) {
      // setError('Please log in to save a team');
      deferredLink.current?.reject(new Error('Not logged in'));
      return;
    }
    if (!teamNameRef.current) {
      setError('Please enter a team name');
      return;
    }
    setConfirmLoading(true);
    const teamId = await account.createTeam(teamNameRef.current, state.tuneState);
    deferredLink.current?.resolve(teamId);
  }, [teamNameRef, account, state.tuneState]);

  return (
    <>
      <CopyLink getLink={getLink} />
      <Modal
        title="Share team"
        onOk={shareTeam}
        open={open}
        onCancel={() => setOpen(false)}
        confirmLoading={confirmLoading}
        okText="Share team"
        okButtonProps={{
          disabled: !teamNameRef.current && state.tuneState.championList.flatMap(validateSetup).length === 0,
        }}
      >
        {error && <Alert message={error} type="error" showIcon />}
        <Typography.Paragraph>
          Enter a name for your team and click "Share team" to create a link that you can share with your friends.
        </Typography.Paragraph>
        <Input addonBefore="Team name" onChange={(e) => setTeamName((teamNameRef.current = e.target.value))} />
      </Modal>
    </>
  );
};
