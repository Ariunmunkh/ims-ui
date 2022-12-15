import React, { useState, useEffect } from 'react'
import { api } from '../../system/api'
import { Table, Modal, Form, Button, Input, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;
export default function UserListPage() {

    const nulldata = { userid: 0, roleid: 1, username: null, email: null, password: null };
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata, setFromData] = useState(nulldata);

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
            title: "Үүрэг",
            dataIndex: "roleid",
            render: (text, record, index) => {
                return (
                    <Select
                        value={record?.roleid}
                        disabled
                        options={
                            [
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

                );
            }
        },
        {
            title: "Нэвтрэх нэр",
            dataIndex: "username",
        },
        {
            title: "Имэйл",
            dataIndex: "email",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
        }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Устгах уу?',
            icon: <ExclamationCircleFilled />,
            //content: 'Some descriptions',
            okText: 'Тийм',
            okType: 'danger',
            cancelText: 'Үгүй',
            onOk() {
                onDelete();
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };

    const onDelete = async () => {
        await api.delete(`/api/systems/User/delete_user?userid=${formdata?.userid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {

        await api.post(`/api/systems/User/set_user`, formdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (userid) => {

        await api.get(`/api/systems/User/get_user?userid=${userid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setFromData(res?.data?.retdata[0]);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        setFromData(nulldata);
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
                pagination={false}
                rowKey={(record) => record.userid}
            >

            </Table>
            <Modal
                title="Хэрэглэгч"
                open={isModalOpen}
                onOk={onFinish}
                onCancel={handleCancel}
                footer={[
                    <Button danger onClick={showDeleteConfirm} hidden={formdata?.userid === 0}>
                        Устгах
                    </Button>,
                    <Button onClick={handleCancel}>
                        Болих
                    </Button>,
                    <Button type="primary" onClick={onFinish}>
                        Хадгалах
                    </Button>,
                ]}
            >
                <Form

                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                     >
                    <Form.Item hidden={false} />
                    <Form.Item label="Үүрэг" rules={[{ required: true }]}>
                        <Select
                            onChange={(e) => { formdata.roleid = e }}
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
                    <Form.Item label="Нэвтрэх нэр" rules={[{ required: true }]} >
                        <Input onChange={e => { formdata.username = e.target.value }} />
                    </Form.Item>
                    <Form.Item label="Имэйл" rules={[{ required: true, type: 'email' }]}>
                        <Input onChange={e => { formdata.email = e.target.value }} />
                    </Form.Item>
                    <Form.Item label="Нууц үг" >
                        <Input onChange={e => { formdata.password = e.target.value }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
