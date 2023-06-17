import React from 'react'
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { api } from "../../system/api";
import './Register.css'

export default function Register({ setRegister }) {

    async function addVolunteer(volunteerdata) {
        return api
            .post("/api/Volunteer/set_Volunteer", volunteerdata)
            .then((response) => response?.data?.retdata);
    }
    async function addUser(userdata) {
        return api
            .post("/api/systems/User/set_user", userdata)
            .then((response) => response?.data?.retdata);
    }

    const onFinish = async (values) => {

        var volunteerdata = await addVolunteer(values);
        await addUser({
            username: values.email,
            password: values.password,
            email: values.email,
            roleid:5,
            volunteerid: volunteerdata.volunteerid
        });

        setRegister(false);
    };

    return (
        <div className="content">

            <h5>Бүртгэл үүсгэх</h5>

            <Form onFinish={onFinish} >


                <Form.Item name="lastname" label="Эцэг\Эх\-н нэр">
                    <Input />
                </Form.Item>

                <Form.Item
                    name="firstname"
                    label="Өөрийн нэр"
                    rules={[
                        {
                            required: true,
                            message: 'Өөрийн нэрийг оруулна уу!',
                        },
                    ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Имэйл" rules={[{ required: true, type: 'email', message: 'Имэйл хаягаа оруулна уу!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Нууц үг"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Нууц үг давтах"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        type="password"
                        placeholder="Password"
                    />
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

Register.propTypes = {
    setForgetPass: PropTypes.func.isRequired
};
