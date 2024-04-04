import { Header } from "antd/lib/layout/layout";
import { useAppContext } from "../App/Context";
import {
    LogoutOutlined,
    UserOutlined,
  } from "@ant-design/icons";
import { useHistory } from "react-router";
  
export const DashboardHeader = (props) => {
    const { logout } = useAppContext();

    return (
      <Header
        className="site-layout-background"
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <div style={{ display: "flex" }}>
          <div className="nav-item" onClick={() => console.log('hellooo')}>
            <UserOutlined style={{ fontSize: "26px" }} />
          </div>
          <div className="nav-item" onClick={logout}>
            <LogoutOutlined style={{ fontSize: "26px" }} />
          </div>
        </div>
      </Header>
    );
  };
  