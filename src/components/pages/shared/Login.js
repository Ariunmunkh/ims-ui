import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../system/api'
import './Login.css';
import ForgetPasswordPage from './ForgetPasswordPage'

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';

async function loginUser(credentials) {
    return api.post("/api/Systems/login", credentials).then(response => response?.data?.retdata);
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errormsg, setErrorMgs] = useState();
    const [forgetpass, setForgetPass] = useState(false);

    const handleSubmit = async e => {

        try {
            const token = await loginUser({
                username,
                password
            });
            setToken(token);
            if (token)
                window.location.reload(false);
            else
                setErrorMgs('Нэвтрэх нэр эсвэл нууц үг буруу байна');

        } catch (e) {
            if (e.response.status === 401)
                setErrorMgs('Нэвтрэх нэр эсвэл нууц үг буруу байна');
            else
                setErrorMgs(e.message);
        }
    }
    if (forgetpass)
        return <ForgetPasswordPage setForgetPass={setForgetPass} />

    return (

        <div className="content">

            <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={handleSubmit}>
                <Form.Item name="username" rules={[{ required: true, message: 'Хэрэглэгчийн нэрээ оруулна уу!' }]}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Хэрэглэгчийн нэр" onChange={e => setUserName(e.target.value)} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Нууц үгээ оруулна уу!' }]}>
                    <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Нууц үг" onChange={e => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Намайг санаарай</Checkbox>
                    </Form.Item>

                    <Button className="login-form-forgot" onClick={e => setForgetPass(true)} >
                        Нууц үгээ мартсан
                    </Button>

                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Нэвтрэх
                    </Button>
                </Form.Item>
                <Form.Item>
                    {errormsg}
                </Form.Item>
            </Form>
        </div>

    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};