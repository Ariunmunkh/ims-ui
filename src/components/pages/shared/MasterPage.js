import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './MasterPage.css';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UsergroupAddOutlined,
    SolutionOutlined,
    FileSearchOutlined,
    AppstoreAddOutlined,
    CrownOutlined,
    UserOutlined,
    HomeOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import logo from "../../../assets/images/logo.png";

import UserListPage from '../user/UserListPage'
import HouseHoldListPage from '../household/HouseHoldListPage'
import HouseHoldPage from '../household/HouseHoldPage'
import useToken from '../../system/useToken';
import useRole from '../../system/useRole';
import NotFound from './NotFound';
import AccessDenied from './AccessDenied';

const { Header, Sider, Content } = Layout;

export default function MasterPage() {

    const navigate = useNavigate();
    const { setToken } = useToken();
    const { roleid } = useRole();
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer }, } = theme.useToken();

    const getMenu = () => {

        switch (roleid) {
            case '1':
                return [
                    {
                        key: 'userlist',
                        icon: <UserOutlined />,
                        label: 'Хэрэглэгч',
                    },
                    {
                        key: 'householdlist',
                        icon: <HomeOutlined />,
                        label: 'Өрхийн бүртгэл',
                    },
                    {
                        icon: <UsergroupAddOutlined />,
                        label: 'Бүлгийн бүртгэл',
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: 'Сургалтын бүртгэл',
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: 'Хөрөнгийн бүртгэл',
                    },
                    {
                        icon: <FileSearchOutlined />,
                        label: 'Холбон зуучлалын бүртгэл',
                    },
                    {
                        icon: <CrownOutlined />,
                        label: 'Үр дүн',
                    },
                ];
            case '2':
                return [
                    {
                        key: 'householdlist',
                        icon: <HomeOutlined />,
                        label: 'Өрхийн бүртгэл',
                    },
                    {
                        icon: <UsergroupAddOutlined />,
                        label: 'Бүлгийн бүртгэл',
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: 'Сургалтын бүртгэл',
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: 'Хөрөнгийн бүртгэл',
                    },
                    {
                        icon: <FileSearchOutlined />,
                        label: 'Холбон зуучлалын бүртгэл',
                    },
                ];
            case '3':
                return [
                    {
                        key: 'householdlist',
                        icon: <HomeOutlined />,
                        label: 'Өрхийн бүртгэл',
                    },
                    {
                        icon: <UsergroupAddOutlined />,
                        label: 'Бүлгийн бүртгэл',
                    },
                    {
                        icon: <SolutionOutlined />,
                        label: 'Сургалтын бүртгэл',
                    },
                    {
                        icon: <AppstoreAddOutlined />,
                        label: 'Хөрөнгийн бүртгэл',
                    },
                ];
            default:
                return [];
        }
    }
    const [menuitem] = useState(getMenu);


    const onClick = async (item, key, keyPath, domEvent) => {
        navigate(item?.key);
    }

    const onLogoutClick = async (event) => {

        setToken({ access_token: null });
        window.location.reload();
    }

    return (

        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <img className="logo" src={logo} alt="logo"></img>
                <Menu
                    style={{ position: 'sticky', top: 0, zIndex: 1 }}
                    theme="dark"
                    mode="inline"
                    onClick={onClick}
                    items={menuitem}
                />

            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 1 }} >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}

                    <LogoutOutlined onClick={onLogoutClick} />

                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: '90vh',
                        background: colorBgContainer,
                    }}
                >
                    <Routes>

                        <Route path="/userlist" element={roleid === '1' ? <UserListPage /> : <AccessDenied />} />
                        <Route path="/householdlist" element={roleid === '1' ? <HouseHoldListPage /> : <AccessDenied />} />
                        <Route path="/household/:householdid" element={roleid === '1' ? <HouseHoldPage /> : <AccessDenied />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>


    )
}
