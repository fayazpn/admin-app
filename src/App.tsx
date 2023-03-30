import { QueryClient,  QueryClientProvider } from "@tanstack/react-query";
import {
  ConfigProvider,
  Layout,
  Switch,
  theme,
} from "antd";
import AdminTable from "./components/Table";
import "./global.css";
import { useTheme } from "./utils/ThemeContext";

const { Header, Content, Footer } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

const queryClient = new QueryClient();

const App: React.FC = () => {
    // Hook to change the theme
  const { darkMode, setDarkMode } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
          token: {
            fontFamily: "Inter",
          },
        }}
      >
        <Layout className="layout" style={{ minHeight: "100vh"}} >
          <Header
            className="flex justify-between items-center px-5"
            style={{
              backgroundColor: darkMode ? "#141414" : "#efefef",
              borderBottom: darkMode
                ? "1px solid rgba(255, 255, 255, 0.26)"
                : " 1px solid rgba(5, 5, 5, 0.06)",
            }}
          >
            <div className="text-lg font-regular flex items-center justify-center">
              Admin Panel
            </div>

            <Switch
              onChange={() => setDarkMode(!darkMode)}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </Header>
          <Content style={{ padding: "0 10px", overflowY: 'auto' }}>
            <div className="flex items-center justify-center w-full">
              <AdminTable />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
