import { Collapse, Typography } from 'antd';
import { changeLog, hasUnseenChanges, lastNumericVersionSeen, numericVersion } from '../ChangeLog';
import './ReleaseNotes.css';
import React from 'react';

const reverseLog = changeLog.slice().reverse();

function renderVersion([version, render]: [[number, number, number], () => JSX.Element]) {
  return (
    <div
      key={`version_${version}`}
      className={`version-update ${numericVersion(version) > lastNumericVersionSeen ? '' : 'previously-seen'}`}
    >
      <div className="version-heading version-label">v{version.join('.')}</div>
      <div className="version-description">{render()}</div>
    </div>
  );
}

export const ReleaseNotes = () => {
  const newChanges: JSX.Element[] = React.useMemo(() => reverseLog.slice(0, 3).map(renderVersion), []);
  const oldChanges: JSX.Element[] = React.useMemo(() => reverseLog.slice(3).map(renderVersion), []);

  return (
    <div>
      {hasUnseenChanges() && <Typography.Title level={4}>New changes since your last visit!</Typography.Title>}
      {newChanges}
      {oldChanges.length > 0 && (
        <Collapse ghost>
          <Collapse.Panel key="1" header="Older updates">
            {oldChanges}
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
};
