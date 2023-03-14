import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ChampionSetup } from "./ChampionSetup";
import { Card, ConfigProvider, Grid, Input, Layout, Space, theme } from "antd";

function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <Layout>
        <Layout.Header></Layout.Header>
        <Layout>
          <Layout.Sider width={350}>
            <Input addonBefore="Boss Speed" />
            <Input addonBefore="Shield Hit Count" />
            <Input addonBefore="Speed Aura" suffix="%" />
            <Space direction="vertical">
              <ChampionSetup index={0} />
              <ChampionSetup index={1} />
              <ChampionSetup index={2} />
              <ChampionSetup index={3} />
              <ChampionSetup index={4} />
            </Space>
          </Layout.Sider>
          <Layout.Content></Layout.Content>
        </Layout>
        <Layout.Footer></Layout.Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
