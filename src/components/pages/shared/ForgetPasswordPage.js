import React from 'react'
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import './ForgetPasswordPage.css'

export default function ForgetPasswordPage({ setForgetPass }) {
    const onFinish = (values) => {
        setForgetPass(false);
    };

    return (
        <div class="content">
            <h2>Нууц үгээ шинэчилэх</h2>
            <h5>Имэйл хаягаа оруулна уу, бид танд шинэ нууц үг илгээх болно</h5>
            <Form onFinish={onFinish} >


                <Form.Item name="email" label="Имэйл хаяг" rules={[{ required: true, type: 'email', message: 'Имэйл хаягаа оруулна уу!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Нууц үг шинэчлэх имэйл илгээх
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

ForgetPasswordPage.propTypes = {
    setForgetPass: PropTypes.func.isRequired
};
