import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Modal, Drawer, Space, Form, Button, Input,  DatePicker } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;

export default function Employment() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(false);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/Volunteer/get_VolunteerEmployment_list?id=${volunteerid ?? userinfo.volunteerid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }, [volunteerid, userinfo.volunteerid]);

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
            title: "Ажлын салбар",
            dataIndex: "employment",
        },
        {
            title: "Ажлын газар",
            dataIndex: "company",
        },
        {
            title: "Албан тушаал",
            dataIndex: "job",
        },
        {
            title: "Эхэлсэн огноо",
            dataIndex: "begindate",
            render: (text, record, index) => {
                return (<DatePicker value={dayjs(record?.begindate, 'YYYY.MM.DD HH:mm:ss')} disabled bordered={false} />);
            },
        },
        {
            title: "Дууссан огноо",
            dataIndex: "enddate",
            render: (text, record, index) => {
                return (<DatePicker value={dayjs(record?.enddate, 'YYYY.MM.DD HH:mm:ss')} disabled bordered={false} />);
            },
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
            onOk() {
                onDelete();
            },
        });
    };

    const onDelete = async () => {
        await api
            .delete(
                `/api/Volunteer/delete_VolunteerEmployment?id=${formdata.getFieldValue("id")}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        fdata.begindate = fdata.begindate.format('YYYY.MM.DD HH:mm:ss');
        fdata.enddate = fdata.enddate.format('YYYY.MM.DD HH:mm:ss');
        await api
            .post(`/api/Volunteer/set_VolunteerEmployment`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/Volunteer/get_VolunteerEmployment?id=${id}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                let fdata = res?.data?.retdata[0];
                fdata.begindate = dayjs(fdata.begindate, 'YYYY.MM.DD HH:mm:ss');
                fdata.enddate = dayjs(fdata.enddate, 'YYYY.MM.DD HH:mm:ss');
                formdata.setFieldsValue(fdata);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            employment: null,
            company: null,
            job: null,
            begindate: null,
            enddate: null,
            note: null
        });
        showModal();
    };
    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => newFormData()}
            >
                Ажлын мэдээлэл нэмэх
            </Button>

            <Table
                size="small"
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.id}
            ></Table>

            <Drawer
                forceRender
                title="Ажлын мэдээлэл"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
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
                    labelAlign="left"
                    labelWrap
                >
                    <Form.Item name="id" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="volunteerid" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="employment" label="Ажлын салбар">
                        <Input placeholder="Ажлын салбар" />
                    </Form.Item>
                    <Form.Item name="company" label="Ажлын газар">
                        <Input placeholder="Ажлын газар" />
                    </Form.Item>
                    <Form.Item name="job" label="Албан тушаал">
                        <Input style={{ width: "100%" }} placeholder="Албан тушаал" />
                    </Form.Item>
                    <Form.Item name="begindate" label="Эхэлсэн огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Эхэлсэн огноо" />
                    </Form.Item>
                    <Form.Item name="enddate" label="Дууссан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Дууссан огноо" />
                    </Form.Item>
                    <Form.Item name="note" label="Нэмэлт мэдээлэл">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
