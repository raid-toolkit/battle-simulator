import "./App.css";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Input,
  Layout,
  theme,
} from "antd";
import { TeamView } from "./Views";
import React from "react";
import {
  CompressOutlined,
  HighlightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { ChampionSetup } from "./Model";

export interface AppProps {
  toggleTheme: () => void;
}
function App({ toggleTheme }: AppProps) {
  const [championList, onChampionListUpdated] = React.useState<
    readonly Readonly<ChampionSetup>[]
  >([]);
  return (
    <Layout>
      <Layout.Sider
        width={225}
        style={{
          background: "transparent",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Badge.Ribbon text="Boss">
          <Card>
            <Input
              addonBefore="Boss Speed"
              defaultValue={250}
              style={{ textAlign: "right" }}
              suffix={<ThunderboltOutlined />}
            />
            <Input
              addonBefore="Shield Hits"
              defaultValue={21}
              style={{ textAlign: "right" }}
              suffix={<CompressOutlined />}
            />
          </Card>
        </Badge.Ribbon>
      </Layout.Sider>
      <Layout.Content>
        <Layout>
          <Layout.Header style={{ background: "transparent" }}>
            <Button icon={<HighlightOutlined />} onClick={toggleTheme}>
              Change theme
            </Button>
          </Layout.Header>
        </Layout>
      </Layout.Content>

      <Layout.Sider
        width={532}
        style={{
          background: "transparent",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TeamView
          championList={championList}
          onChampionListUpdated={onChampionListUpdated}
        />
      </Layout.Sider>
    </Layout>
  );
}

const AppHost = () => {
  const [themeName, setThemeName] = React.useState("dark");
  const toggleTheme = React.useCallback(() => {
    setThemeName((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  React.useEffect(() => {
    document.body.style.colorScheme = themeName;
  }, [themeName]);
  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeName === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <App toggleTheme={toggleTheme} />
    </ConfigProvider>
  );
};

export default AppHost;
