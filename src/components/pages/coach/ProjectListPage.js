import React, { useState, useEffect } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input, InputNumber } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function ProjectListPage() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        await api
            .get(`/api/record/coach/get_project_list`)
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
                getFormData(record.coachid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const gridcolumns = [
        {
            title: "Төслийн дугаар",
            dataIndex: "id",
        },
        {
            title: "Төслийн нэр",
            dataIndex: "name",
        },
        {
            title: "Төслийн удирдагчийн нэр",
            dataIndex: "leadername",
        },
        {
            title: "Утас",
            dataIndex: "leaderphone",
        },
        {
            title: "Төслийн нэр",
            dataIndex: "projectname",
        },
        {
            title: "Төслийн байршил",
            dataIndex: "location",
        },
        {
            title: "Төсөл хэрэгжих хороо/сум",
            dataIndex: "implementation",
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
            okText: "Тийм",
            okType: "danger",
            cancelText: "Үгүй",
            onOk() { onDelete(); },
        });
    };

    const onDelete = async () => {
        await api.delete(`/api/record/coach/delete_project?id=${formdata.getFieldValue("id")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        await api
            .post(`/api/record/coach/set_project`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/record/coach/get_project?id=${id}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            name: null,
            leadername: null,
            leaderphone: null,
            location: null,
            implementation: null
        });
        showModal();
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={(e) => newFormData()}
            >
                Төсөл нэмэх
            </Button>

            <Table
                size="small"
                title={() => `Төслийн мэдээлэл:`}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.coachid}
            ></Table>

            <Drawer
                forceRender
                title="Төслийн бүртгэл"
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
                            hidden={formdata.getFieldValue("coachid") === 0}
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
                    <Form.Item name="id" label="Төслийн дугаар" >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="name" label="Төслийн нэр">
                        <Input />
                    </Form.Item>
                    <Form.Item name="leadername" label="Төслийн удирдагчийн нэр">
                        <Input />
                    </Form.Item>
                    <Form.Item name="leaderphone" label="Утас">
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Төслийн байршил">
                        <Input />
                    </Form.Item>
                    <Form.Item name="implementation" label="Төсөл хэрэгжих хороо/сум">
                        <Input />
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}
