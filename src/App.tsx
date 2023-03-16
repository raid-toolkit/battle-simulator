import "./App.css";
import { ChampionSetupListView } from "./Views/ChampionSetupListView";
import { ConfigProvider, Input, Layout, theme } from "antd";

function App() {
  const {
    token: { colorBgContainerDisabled, borderRadius, colorBorder },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Header
        style={{ background: colorBgContainerDisabled }}
      ></Layout.Header>
      <Layout>
        <Layout.Sider
          width={532}
          style={{
            background: colorBgContainerDisabled,
            borderWidth: "1px 1px 1px 0px",
            borderColor: colorBorder,
            borderStyle: "solid",
            borderBottomRightRadius: borderRadius,
            display: "flex",
            flexDirection: "column",
            padding: 8,
          }}
        >
          <Input addonBefore="Boss Speed" />
          <Input addonBefore="Shield Hit Count" />
          <Input addonBefore="Speed Aura" suffix="%" />
          <ChampionSetupListView />
        </Layout.Sider>
        <Layout.Content></Layout.Content>
      </Layout>
      <Layout.Footer></Layout.Footer>
    </Layout>
  );
}

const AppHost = () => (
  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
    <App />
  </ConfigProvider>
);

export default AppHost;
