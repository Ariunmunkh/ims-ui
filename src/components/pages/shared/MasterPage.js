import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./MasterPage.css";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UsergroupAddOutlined,
    SolutionOutlined,
    FileSearchOutlined,
    AppstoreAddOutlined,
    SettingOutlined,
    HomeOutlined,
    LogoutOutlined,
    StockOutlined,
    SketchOutlined,
    ApiOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Space, Button, Typography } from "antd";
import logo from "../../../assets/images/logo.png";

import AdminPage from "./AdminPage";
import HouseHoldListPage from "../household/HouseHoldListPage";
import HouseHoldPage from "../household/HouseHoldPage";
import useToken from "../../system/useToken";
import useUserInfo from "../../system/useUserInfo";
import NotFound from "./NotFound";
import AccessDenied from "./AccessDenied";
import Visit from "../coach/Visit";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
export default function MasterPage() {
    const navigate = useNavigate();
    const { setToken } = useToken();
    const { userinfo } = useUserInfo();
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();

    const getMenu = () => {
        switch (userinfo?.roleid) {
            case "1":
                return [
                    {
                        key: "adminpage",
                        icon: <SettingOutlined />,
                        label: "Суурь бүртгэл",
                    },
                    {
                        key: "householdlist",
                        icon: <HomeOutlined />,
                        label: "Өрхийн бүртгэл",
                    },
                    {
                        key: "visit",
                        icon: <UsergroupAddOutlined />,
                        label: "Айлчлалын бүртгэл",
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: "Хурлын ирцийн бүртгэл",
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        icon: <StockOutlined />,
                        label: "Үр дүн",
                    },
                ];
            case "2":
                return [
                    {
                        key: "adminpage",
                        icon: <SettingOutlined />,
                        label: "Суурь бүртгэл",
                    },
                    {
                        key: "householdlist",
                        icon: <HomeOutlined />,
                        label: "Өрхийн бүртгэл",
                    },
                    {
                        key: "visit",
                        icon: <UsergroupAddOutlined />,
                        label: "Айлчлалын бүртгэл",
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: "Хурлын ирцийн бүртгэл",
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        icon: <StockOutlined />,
                        label: "Үр дүн",
                    },
                ];
            case "3":
                return [
                    {
                        key: "householdlist",
                        icon: <HomeOutlined />,
                        label: "Өрхийн бүртгэл",
                    },
                    {
                        key: "visit",
                        icon: <UsergroupAddOutlined />,
                        label: "Айлчлалын бүртгэл",
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: "Хурлын ирцийн бүртгэл",
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        icon: <StockOutlined />,
                        label: "Үр дүн",
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
                <img className="logo" src={logo} alt="logo"></img>
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
                            <Text code>Нэвтэрсэн хэрэглэгч: <b>{userinfo?.username}</b></Text>
                            <Text code>Харьяа дүүрэг: <b>БЗД</b></Text>
                            <Text code>Өрхийн тоо: <b>50</b></Text>
                        </Space>
                    </Space>

                    <Button
                        type="primary"
                        style={{ float: 'right', margin: '16px' }}
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
                        minHeight: "90vh",
                        background: colorBgContainer,
                    }}
                >
                    <Routes>
                        <Route
                            path="/adminpage"
                            element={userinfo?.roleid === "1" ? <AdminPage /> : <AccessDenied />}
                        />
                        <Route
                            path="/householdlist"
                            element={userinfo?.roleid ? <HouseHoldListPage /> : <AccessDenied />}
                        />
                        <Route
                            path="/visit"
                            element={userinfo?.roleid ? <Visit /> : <AccessDenied />}
                        />
                        <Route
                            path="/household/:householdid"
                            element={userinfo?.roleid ? <HouseHoldPage /> : <AccessDenied />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}
