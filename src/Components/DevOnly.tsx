import React from 'react';
const isDev = process.env.NODE_ENV === 'development';

export const DevOnly: React.FC<React.PropsWithChildren> = ({ children }) => {
  if (isDev) {
    return <>{children}</>;
  }
  return null;
};
