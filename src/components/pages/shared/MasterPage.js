import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./MasterPage.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Space, Button, Typography } from "antd";

import AdminPage from "./AdminPage";
import VolunteerPage from "../volunteer/VolunteerPage";
import useToken from "../../system/useToken";
import useUserInfo from "../../system/useUserInfo";
import NotFound from "./NotFound";
import AccessDenied from "./AccessDenied";
import Home from "../volunteer/Home";
import logo from "../../../assets/images/logo.png";
import Report from "../volunteer/Report";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
export default function MasterPage() {
  const navigate = useNavigate();
  const { setToken } = useToken();
  const { userinfo } = useUserInfo();
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const getMenu = () => {
    switch (userinfo?.roleid) {
      case "1":
        return [
          {
            key: "admin",
            icon: <SettingOutlined />,
            label: "Суурь бүртгэл",
          },
          {
            key: "volunteer",
            icon: <HomeOutlined />,
            label: "Нүүр",
          },
        ];
      case "2":
        return [];
      case "3":
        return [];
      case "5":
        return [
          {
            key: "admin",
            icon: <SettingOutlined />,
            label: "Суурь бүртгэл",
          },
          {
            key: "home",
            icon: <HomeOutlined />,
            label: "Нүүр",
          },
          {
            key: "report",
            icon: <BarChartOutlined />,
            label: "ДШХ-ны сарын тайлан",
          },
          {
            key: "volunteer",
            icon: <UserSwitchOutlined />,
            label: "Үндсэн мэдээлэл",
          },
        ];
      default:
        return [];
    }
  };
  const [menuitem] = useState(getMenu);

  const onClick = async (item, key, keyPath, domEvent) => {
    navigate(item?.key);
  };
  const onLogoutClick = async (event) => {
    setToken({ access_token: null });
    window.location.reload();
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="text-center">
          <img
            src={logo}
            alt="logo"
            width={40}
            className="text-center"
            style={{ paddingBottom: 5, paddingTop:10 }}
          ></img>
          <h5 className="text-white text-center" onClick={() => navigate("/")}>
            IMS систем
          </h5>
        </div>

        <hr className="text-white" />
        <Menu
          style={{ position: "sticky", top: 0, zIndex: 1 }}
          theme="dark"
          mode="inline"
          onClick={onClick}
          items={menuitem}
          className="text-white"
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}

          <Space direction="vertical">
            <Space>
              <Text code>
                Хэрэглэгч: <b>{userinfo?.username}</b>
              </Text>
            </Space>
          </Space>

          <Button
            type="primary"
            style={{ float: "right", margin: "16px" }}
            icon={<LogoutOutlined />}
            size={"middle"}
            onClick={onLogoutClick}
          >
            Гарах
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "89vh",
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={userinfo?.roleid ? <Home /> : <AccessDenied />}
            />
            <Route
              path="/volunteer/:volunteerid"
              element={userinfo?.roleid ? <VolunteerPage /> : <AccessDenied />}
            />
            <Route
              path="/admin"
              element={userinfo?.roleid ? <AdminPage /> : <AccessDenied />}
            />
            <Route
              path="/home"
              element={userinfo?.roleid ? <Home /> : <AccessDenied />}
            />
            <Route
              path="/report"
              element={userinfo?.roleid ? <Report /> : <AccessDenied />}
            />
             <Route
              path="/volunteer"
              element={userinfo?.roleid ? <VolunteerPage /> : <AccessDenied />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
