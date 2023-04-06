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
    DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Space, Button, Typography } from "antd";

import AdminPage from "./AdminPage";
import HouseHoldListPage from "../household/HouseHoldListPage";
import HouseHoldPage from "../household/HouseHoldPage";
import useToken from "../../system/useToken";
import useUserInfo from "../../system/useUserInfo";
import NotFound from "./NotFound";
import AccessDenied from "./AccessDenied";
import Visit from "../coach/Visit";
import Meeting from "../coach/Meeting";
import Loan from "../coach/Loan";
import Training from "../coach/Training";
import Investment from "../coach/Investment";
import Contact from "../coach/Contact";
import MapPage from "../coach/MapPage";
import Monitor from "./Monitor";
import Report from "../report/Report";
import ProgressReport from "../report/ProgressReport";

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
                        key: "meeting",
                        icon: <SolutionOutlined />,
                        label: "Бүлгийн хурлын мэдээлэл",
                    },
                    {
                        key: "loan",
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        key: "training",
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        key: "investment",
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        key: "contact",
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        key: "report",
                        icon: <StockOutlined />,
                        label: "Төгсөлтийн үр дүн",
                    },
                    {
                        key: "progressreport",
                        icon: <StockOutlined />,
                        label: "Явцын үр дүн",
                    },
                    {
                        key: "monitor",
                        icon: <DashboardOutlined />,
                        label: "Хянах самбар",
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
                        key: "meeting",
                        icon: <SolutionOutlined />,
                        label: "Бүлгийн хурлын мэдээлэл",
                    },
                    {
                        key: "loan",
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        key: "training",
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        key: "investment",
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        key: "contact",
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        key: "report",
                        icon: <StockOutlined />,
                        label: "Төгсөлтийн үр дүн",
                    },
                    {
                        key: "progressreport",
                        icon: <StockOutlined />,
                        label: "Явцын үр дүн",
                    },
                    {
                        key: "monitor",
                        icon: <DashboardOutlined />,
                        label: "Хянах самбар",
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
                        key: "meeting",
                        icon: <SolutionOutlined />,
                        label: "Бүлгийн хурлын мэдээлэл",
                    },
                    {
                        key: "loan",
                        icon: <AppstoreAddOutlined />,
                        label: "Зээлийн бүртгэл",
                    },
                    {
                        key: "training",
                        icon: <FileSearchOutlined />,
                        label: "Сургалт, үйл ажиллагааны бүртгэл",
                    },
                    {
                        key: "investment",
                        icon: <SketchOutlined />,
                        label: "Хөрөнгө оруулалт, тусламжийн бүртгэл",
                    },
                    {
                        key: "contact",
                        icon: <ApiOutlined />,
                        label: "Холбон зуучилсан үйл ажиллаагааны бүртгэл",
                    },
                    {
                        key: "report",
                        icon: <StockOutlined />,
                        label: "Төгсөлтийн үр дүн",
                    },
                    {
                        key: "progressreport",
                        icon: <StockOutlined />,
                        label: "Явцын үр дүн",
                    },
                    {
                        key: "monitor",
                        icon: <DashboardOutlined />,
                        label: "Хянах самбар",
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
            <Sider trigger={null} collapsible collapsed={collapsed}><br />
                <h5 className="text-white text-center" onClick={() => navigate("/")}>DMS систем</h5>
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
                            <Text code>Хэрэглэгч: <b>{userinfo?.username}</b></Text>
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
                        minHeight: "89vh",
                        background: colorBgContainer,
                    }}
                >
                    <Routes>
                        <Route
                            path="/"
                            element={userinfo?.roleid ? <MapPage /> : <AccessDenied />}
                        />
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
                            path="/meeting"
                            element={userinfo?.roleid ? <Meeting /> : <AccessDenied />}
                        />
                        <Route
                            path="/loan"
                            element={userinfo?.roleid ? <Loan /> : <AccessDenied />}
                        />
                        <Route
                            path="/training"
                            element={userinfo?.roleid ? <Training /> : <AccessDenied />}
                        />
                        <Route
                            path="/investment"
                            element={userinfo?.roleid ? <Investment /> : <AccessDenied />}
                        />
                        <Route
                            path="/contact"
                            element={userinfo?.roleid ? <Contact /> : <AccessDenied />}
                        />
                        <Route
                            path="/household/:householdid"
                            element={userinfo?.roleid ? <HouseHoldPage /> : <AccessDenied />}
                        />
                        <Route
                            path="/report"
                            element={userinfo?.roleid ? <Report /> : <AccessDenied />}
                        />
                        <Route
                            path="/progressreport"
                            element={userinfo?.roleid ? <ProgressReport /> : <AccessDenied />}
                        />
                        <Route
                            path="/monitor"
                            element={userinfo?.roleid ? <Monitor /> : <AccessDenied />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}
