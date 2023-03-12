import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Switch, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function Relationship() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formtitle] = useState('Ураг төрлийн нэршил');
    const [formdata] = Form.useForm();

    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/record/base/get_relationship_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setLoading]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.relationshipid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Нэр",
            dataIndex: "name",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
            width: 160,
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
            .delete(`/api/record/base/delete_relationship?id=${formdata.getFieldValue("relationshipid")}`).then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        await api
            .post(`/api/record/base/set_relationship`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/record/base/get_relationship?id=${id}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({ relationshipid: 0, name: null, ishead: false });
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
                {`${formtitle} нэмэх`}
            </Button>

            <Table
                title={() => formtitle}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                scroll={{ y: '50vh' }}
                rowKey={(record) => record.id}
            ></Table>

            <Drawer
                forceRender
                title={formtitle}
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
                            hidden={formdata.getFieldValue("id") === 0}
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
                    <Form.Item name="relationshipid" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="name" label="Нэр" >
                        <Input />
                    </Form.Item>

                    <Form.Item name="ishead" label="Өрхийн тэргүүн эсэх" valuePropName="checked" >
                        <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}

