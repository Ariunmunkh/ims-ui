import React, { useState, useEffect } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function UserListPage() {
    const nulldata = {
        userid: 0,
        roleid: 1,
        username: null,
        email: null,
        password: null,
    };
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [iscoach, setiscoach] = useState(true);
    const [formdata] = Form.useForm();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachlist, setcoachlist] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        await api
            .get(`/api/systems/User/get_user_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.userid);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/base/get_district_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrictlist(res?.data?.retdata);
                }
            });
        api.get(`/api/record/coach/get_coach_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setcoachlist(res?.data?.retdata);
                }
            });
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
                        options={[
                            {
                                value: 1,
                                label: "Admin",
                            },
                            {
                                value: 2,
                                label: "Sub-admin",
                            },
                            {
                                value: 3,
                                label: "Coach",
                            },
                        ]}
                    />
                );
            },
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
            title: "Коуч",
            dataIndex: "coachname",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
        },
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
            title: "Устгах уу?",
            icon: <ExclamationCircleFilled />,
            //content: 'Some descriptions',
            okText: "Тийм",
            okType: "danger",
            cancelText: "Үгүй",
            onOk() {
                onDelete();
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };

    const onDelete = async () => {
        await api
            .delete(
                `/api/systems/User/delete_user?userid=${formdata.getFieldValue(
                    "userid"
                )}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {

        let sdata = formdata.getFieldsValue();

        if (sdata.coachid) {
            api.post(`/api/record/coach/set_coach`, sdata).then((res) => { });
        }
        await api
            .post(`/api/systems/User/set_user`, sdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (userid) => {
        await api.get(`/api/systems/User/get_user?userid=${userid}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                setiscoach(res?.data?.retdata[0].roleid !== 3);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue(nulldata);
        showModal();
    };

    const roleidChange = (value) => {
        setiscoach(value !== 3);
        formdata.setFieldValue("coachid", null);
        formdata.setFieldValue("name", null);
        formdata.setFieldValue("phone", null);
        formdata.setFieldValue("districtid", null);
    };

    const coachidChange = (value) => {
        const found = coachlist.find(element => element.coachid === value);
        if (found) {
            formdata.setFieldValue("name", found.name);
            formdata.setFieldValue("phone", found.phone);
            formdata.setFieldValue("districtid", found.districtid);
        }
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={(e) => newFormData()}
            >
                Хэрэглэгч нэмэх
            </Button>

            <Table
                title={() => `Бүртгэлтэй хэрэглэгчийн жагсаалт:`}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.userid}
            ></Table>

            <Drawer
                forceRender
                title="Хэрэглэгч нэмэх"
                width={720}
                onClose={handleCancel}
                open={isModalOpen}
                bodyStyle={{ paddingBottom: 80, }}
                extra={
                    <Space>
                        <Button
                            key="delete"
                            danger
                            onClick={showDeleteConfirm}
                            hidden={formdata.getFieldValue("userid") === 0}
                        >
                            Устгах
                        </Button>
                        <Button key="cancel" onClick={handleCancel}>
                            Болих
                        </Button>
                        <Button key="save" type="primary" onClick={onFinish}>
                            Хадгалах
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={formdata}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item name="userid" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="roleid" label="Үүрэг" rules={[{ required: true }]}>
                        <Select
                            onChange={roleidChange}
                            style={{ width: 275 }}
                            options={[
                                {
                                    value: 1,
                                    label: "Admin",
                                },
                                {
                                    value: 2,
                                    label: "Sub-admin",
                                },
                                {
                                    value: 3,
                                    label: "Coach",
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="coachid" label="Коучийн нэр" hidden={iscoach}>
                        <Select style={{ width: "100%" }}
                            onChange={coachidChange}>
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="Коучийн нэр" hidden={true}/>
                    <Form.Item name="phone" label="Утас" hidden={iscoach}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="districtid" label="Дүүрэг" hidden={iscoach}>
                        <Select style={{ width: "100%" }}>
                            {districtlist?.map((t, i) => (
                                <Select.Option key={i} value={t.districtid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Нэвтрэх нэр"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Имэйл"
                        rules={[{ required: true, type: "email" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Нууц үг">
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
