import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function SubBranch() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formtitle] = useState('Харьяалагдах дэд салбар');
    const [formtype] = useState('subbranch');
    const [formdata] = Form.useForm();

    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=${formtype}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [formtype]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.id);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const gridcolumns = [

        {
            title: "Бүртгэлийн дугаар",
            dataIndex: "id",
        },
        {
            title: "Нэр",
            dataIndex: "name",
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
                `/api/record/base/delete_dropdown_item?id==${formdata.getFieldValue("id")}&type=${formtype}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        await api
            .post(`/api/record/base/set_dropdown_item`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/record/base/get_dropdown_item?id==${id}&type=${formtype}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({ id: 0, name: null, type: formtype });
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
                pagination={false}
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
                    <Form.Item name="id" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="type" label="Төрөл" hidden={true} >
                        <Input />
                    </Form.Item>

                    <Form.Item name="name" label="Нэр" >
                        <Input />
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}
