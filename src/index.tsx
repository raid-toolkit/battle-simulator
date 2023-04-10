import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProvideAppModel } from './Model';
import { AppHost } from './AppHost';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css';
import './Antd.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ProvideAppModel>
      <AppHost />
    </ProvideAppModel>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
