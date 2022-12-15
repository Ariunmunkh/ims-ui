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

import UserListPage from './user/UserListPage'
import useToken from '../system/useToken';
import NotFound from './NotFound';

const { Header, Sider, Content } = Layout;

export default function MasterPage() {

    const navigate = useNavigate();
    const { setToken } = useToken();
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer }, } = theme.useToken();

    const onClick = async (item, key, keyPath, domEvent) => {

        console.log(item, key, keyPath);

        navigate('/userlist');
    }

    const onLogoutClick = async (event) => {

        setToken({ access_token: null });
        window.location.reload();
    }

    return (

        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />

                <Menu
                    style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}
                    theme="dark"
                    mode="inline"
                    onClick={onClick}
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Хэрэглэгч',
                        },
                        {
                            key: '2',
                            icon: <HomeOutlined />,
                            label: 'Өрхийн бүртгэл',
                        },
                        {
                            key: '3',
                            icon: <UsergroupAddOutlined />,
                            label: 'Бүлгийн бүртгэл',
                        },
                        {
                            key: '4',
                            icon: <SolutionOutlined />,
                            label: 'Сургалтын бүртгэл',
                        },
                        {
                            key: '5',
                            icon: <AppstoreAddOutlined />,
                            label: 'Хөрөнгийн бүртгэл',
                        },
                        {
                            key: '6',
                            icon: <FileSearchOutlined />,
                            label: 'Холбон зуучлалын бүртгэл',
                        },
                        {
                            key: '7',
                            icon: <CrownOutlined />,
                            label: 'Үр дүн',
                        },
                    ]}
                />

            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 1, width: '100%' }} >
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
                        minHeight: '100vh',
                        background: colorBgContainer,
                    }}
                >
                    <Routes>

                        <Route path="/userlist" element={<UserListPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>


    )
}
