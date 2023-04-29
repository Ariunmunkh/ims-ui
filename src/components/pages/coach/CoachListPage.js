import React, { useState, useEffect } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input, InputNumber, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function CoachListPage() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [project, setproject] = useState([]);
    const [district, setdistrict] = useState([]);
    const sections = [];
    for (let i = 1; i < 50; i++) {
        sections.push({
            label: i.toString(),
            value: i.toString(),
        });
    }

    const fetchData = async () => {
        setLoading(true);

        await api
            .get(`/api/record/coach/get_coach_list`)
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
        api.get(`/api/record/coach/get_project_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setproject(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_district_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrict(res?.data?.retdata);
                }
            });
        fetchData();
    }, []);
    const gridcolumns = [
        {
            title: "Коучийн дугаар",
            dataIndex: "coachid",
        },
        {
            title: "Коучийн нэр",
            dataIndex: "name",
        },
        {
            title: "Утас",
            dataIndex: "phone",
        },
        {
            title: "Дүүрэг",
            dataIndex: "districtname",
        },
        {
            title: "Хороо",
            dataIndex: "section",
        },
        {
            title: "Хариуцсан өрхийн тоо",
            dataIndex: "householdcount",
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
        await api.delete(`/api/record/coach/delete_coach?id=${formdata.getFieldValue("coachid")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        await api
            .post(`/api/record/coach/set_coach`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (coachid) => {
        await api.get(`/api/record/coach/get_coach?id=${coachid}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({ coachid: 0, name: null, phone: null, projectid: 0, districtid: 0, section: null });
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
                Коуч нэмэх
            </Button>

            <Table
                size="small"
                title={() => `Коучийн мэдээлэл:`}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.coachid}
            ></Table>

            <Drawer
                forceRender
                title="Коучийн бүртгэл"
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
                    <Form.Item name="coachid" label="Дугаар" >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="name" label="Коучийн нэр">
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Утас">
                        <Input />
                    </Form.Item>
                    <Form.Item name="projectid" label="Төслийн нэр" hidden={true}>
                        <Select style={{ width: "100%" }}>
                            {project?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="districtid" label="Дүүрэг">
                        <Select style={{ width: "100%" }}>
                            {district?.map((t, i) => (<Select.Option key={i} value={t.districtid}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="section" label="Хороо">
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            options={sections}
                        >
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
