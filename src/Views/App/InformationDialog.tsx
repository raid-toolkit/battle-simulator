import React from 'react';
import { Button, Modal, Tabs } from 'antd';
import { WelcomeBody } from '../Content/WelcomeBody';
import { ReleaseNotes } from '../Content/ReleaseNotes';
import { Acknowledgements } from '../Content/Acknowledgements';
import { useAppModel } from '../../Model';
import isMobile from 'is-mobile';
import { LikeOutlined, OrderedListOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import safeLocalStorage from '../../Common/LocalStorage';
import { LocalStorageKeys } from '../../Model/LocalStorageKeys';
import { hasUnseenChanges } from '../ChangeLog';

export const InformationDialog: React.FC = () => {
  const { state, dispatch } = useAppModel();
  const closeDialog = () => dispatch.setInfoDialogTab(undefined);
  const style: React.CSSProperties = {
    overflowY: 'auto',
    scrollbarGutter: 'stable',
    maxHeight: `calc(100vh - 138px)`,
  };

  React.useEffect(() => {
    if (safeLocalStorage.getItem(LocalStorageKeys.SeenWelcomeDialog) !== 'true') {
      dispatch.setInfoDialogTab('about');
    } else {
      if (hasUnseenChanges()) {
        dispatch.setInfoDialogTab('changelog');
      }
    }
  }, [dispatch]);

  return (
    <Modal
      open={!!state.infoDialogTab}
      centered
      onCancel={closeDialog}
      bodyStyle={{ maxHeight: `calc(100vh - 84px)` }}
      footer={[
        <Button type="primary" onClick={closeDialog}>
          OK
        </Button>,
      ]}
    >
      <Tabs
        activeKey={state.infoDialogTab}
        onChange={dispatch.setInfoDialogTab as any}
        centered
        size="small"
        items={[
          {
            key: 'about',
            style,
            label:
              state.infoDialogTab !== 'about' && isMobile() ? (
                <QuestionCircleOutlined style={{ marginLeft: 12 }} />
              ) : (
                'About'
              ),
            get children() {
              return <WelcomeBody />;
            },
          },
          {
            key: 'changelog',
            style,
            label:
              state.infoDialogTab !== 'changelog' && isMobile() ? (
                <OrderedListOutlined style={{ marginLeft: 12 }} />
              ) : (
                'Release Notes'
              ),
            get children() {
              return <ReleaseNotes />;
            },
          },
          {
            key: 'acknowledgements',
            style,
            label:
              state.infoDialogTab !== 'acknowledgements' && isMobile() ? (
                <LikeOutlined style={{ marginLeft: 12 }} />
              ) : (
                'Acknowledgements'
              ),
            get children() {
              return <Acknowledgements />;
            },
          },
        ]}
      />
    </Modal>
  );
};
