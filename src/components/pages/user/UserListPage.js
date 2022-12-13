import React, { useState, useEffect } from 'react'
import { api } from '../../system/api'
import { Table, Modal, Form, Button, Input, Select } from 'antd';

export default function UserListPage() {

    const nulldata = { userid: 0, roleid: 1, username: null, email: null, password: null };
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        await api.get(`/api/systems/User/get_user_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.userid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const gridcolumns = [
        {
            title: "Нэвтрэх нэр",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Имэйл",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
            key: "updated",
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        fetchData();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values: any) => {

        await api.post(`/api/systems/User/set_user`, values)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    handleOk();
                }
            });
    };

    const getFormData = async (userid) => {

        await api.get(`/api/systems/User/get_user?userid=${userid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    form.setFieldsValue(nulldata);
                    form.setFieldsValue(res?.data?.retdata[0]);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        form.setFieldsValue(nulldata);
        showModal();
    };

    return (
        <div >
            <Button type="primary" onClick={e => newFormData()}>Шинэ</Button>
            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}>

            </Table>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    form={form}
                    name="nest-messages"
                    onFinish={onFinish}  >
                    <Form.Item name="userid" hidden={false} />
                    <Form.Item name="roleid" label="Role" rules={[{ required: true }]}>
                        <Select
                            defaultValue='1'
                            style={{ width: 275 }}
                            options={[
                                {
                                    value: 1,
                                    label: 'Admin',
                                },
                                {
                                    value: 2,
                                    label: 'Sub-admin',
                                },
                                {
                                    value: 3,
                                    label: 'Coach',
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="username" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
