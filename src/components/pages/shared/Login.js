import React, { useState } from "react";
import PropTypes from "prop-types";
import { api } from "../../system/api";
import ForgetPasswordPage from "./ForgetPasswordPage";
import Register from "./Register";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Popconfirm, Spin, Row, Col } from "antd";
import "./Login.css";

import logo from "../../../assets/images/logo.png";
import ims1 from "../../../assets/images/ims1.svg";
import bg from "../../../assets/images/bg.jpg";



async function loginUser(credentials) {
    return api
        .post("/api/Systems/login", credentials)
        .then((response) => response?.data?.retdata);
}

export default function Login({ setToken }) {
    const [loading, setLoading] = useState(false);
    const [forgetpass, setForgetPass] = useState(false);
    const [register, setRegister] = useState(false);

    const onFinish = async (values) => {
        try {

            setLoading(true);

            const token = await loginUser({ ...values });
            setToken(token);
            setLoading(false);
            if (token) {
                window.location.reload(false);
            } else {
                message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
            }
        } catch (e) {
            setLoading(false);
            if (e.response.status === 401) {
                message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
            } else
                message.error(e.message);
        }
    };

    if (forgetpass)
        return <ForgetPasswordPage setForgetPass={setForgetPass} />;
    else if (register)
        return <Register setRegister={setRegister} />;
    return (
        <Spin spinning={loading}>

            <Row>
                <Col span={6}>
                    <div className="content">
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <Button type="link" onClick={() => setForgetPass(true)} >Forgot password</Button>

                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                 Or
                                <Button type="link" onClick={() => setRegister(true)} >register now!</Button>

                            </Form.Item>
                        </Form>

                    </div>
                </Col>
                <Col span={18}>
                    <img
                        src={bg}
                        alt="zurag"
                        className="w-100 vh-100"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </Col>
            </Row>
        </Spin>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
