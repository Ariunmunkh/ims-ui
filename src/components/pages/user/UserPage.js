import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Button, Form, Input, InputNumber } from 'antd';
import { api } from '../../../api/api'

export default function UserPage() {

    const { userid } = useParams();

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const getData = async () => {

        await api.get(`/api/systems/User/get_user?userid=${userid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    form.setFieldsValue(res?.data?.retdata[0]);
                }
            });
    };

    const onFinish = async (values: any) => {

        console.log(values);

        await api.post(`/api/systems/User/set_user`, values)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {

                }
            });
    };

    useEffect(() => {
        getData();
        console.log(userid);
    }, []);

    return (
        <div className="text-center">
            <Form {...layout} form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} >
                <Form.Item name="userid" hidden={false} />
                <Form.Item name="username" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ type: 'number', min: 0, max: 99 }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
