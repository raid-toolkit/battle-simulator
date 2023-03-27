import React from 'react';
const isDev = !!process.env.DEVELOPMENT;

export const DevOnly: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (isDev) {
    return <>{children}</>;
  }
  return null;
};
