import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './HomePage.css';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';

import UserListPage from './user/UserListPage'
import UserPage from './user/UserPage'

const { Header, Sider, Content } = Layout;

export default function HomePage() {

    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const onClick = async (item, key, keyPath, domEvent) => {

        console.log(item, key, keyPath);

        navigate('/home/userlistpage');
    }

    const onLogoutClick = async (event) => {
        navigate('/');
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
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
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

                    <Button
                        style={{  position: 'sticky', ri : 0, zIndex: 1 }}
                        shape="circle"
                        icon={<LogoutOutlined />}
                        onClick={onLogoutClick}
                    />

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

                        <Route path="/userlistpage" element={<UserListPage />} />
                        <Route path="/userpage/:userid" element={<UserPage />} />

                    </Routes>
                </Content>
            </Layout>
        </Layout>


    )
}
