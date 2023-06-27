import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Modal, Drawer, Space, Form, Button, Input, Select, DatePicker, InputNumber, Typography, } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;
const { Text } = Typography;

export default function Employment() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(false);
    const [formdata] = Form.useForm();
    const [loanpurpose, setloanpurpose] = useState([]);

    const fetchData = useCallback(() => {
        //setLoading(true);
        //api
        //    .get(`/api/record/coach/get_loan_list?id=${volunteerid}`)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            setGridData(res?.data?.retdata);
        //        }
        //    })
        //    .finally(() => {
        //        setLoading(false);
        //    });
    }, [volunteerid]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.entryid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Ажлын салбар",
            dataIndex: "worktype",
        },
        {
            title: "Ажлын газар",
            dataIndex: "workname",
        },
        {
            title: "Албан тушаал",
            dataIndex: "position",
        },
        {
            title: "Эхэлсэн огноо",
            dataIndex: "startdate",
        },
        {
            title: "Дууссан огноо",
            dataIndex: "enddate",
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
        //await api
        //    .delete(
        //        `/api/record/coach/delete_loan?id=${formdata.getFieldValue("entryid")}`
        //    )
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            setIsModalOpen(false);
        //            fetchData();
        //        }
        //    });
    };

    const onFinish = async (values) => {
        //let fdata = formdata.getFieldsValue();
        //fdata.loandate = fdata.loandate.format('YYYY.MM.DD HH:mm:ss');
        //await api
        //    .post(`/api/record/coach/set_loan`, fdata)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            setIsModalOpen(false);
        //            fetchData();
        //        }
        //    });
    };

    const getFormData = async (entryid) => {
        //await api.get(`/api/record/coach/get_loan?id=${entryid}`).then((res) => {
        //    if (res?.status === 200 && res?.data?.rettype === 0) {
        //        let fdata = res?.data?.retdata[0];
        //        fdata.loandate = dayjs(fdata.loandate, 'YYYY.MM.DD HH:mm:ss');
        //        formdata.setFieldsValue(fdata);
        //        showModal();
        //    }
        //});
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
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
                rowKey={(record) => record.entryid}
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
                            hidden={formdata.getFieldValue("entryid") === 0}
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
                    <Form.Item name="worktype" label="Ажлын салбар">
                        <Select style={{ width: '100%' }}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="workname" label="Ажлын газар">
                        <Select style={{ width: '100%' }}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="position" label="Албан тушаал" hidden={true}>
                        <Input  style={{ width: "100%" }} placeholder="Албан тушаал" />
                    </Form.Item>
                    <Form.Item name="startdate" label="Эхэлсэн огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Эхэлсэн огноо" />
                    </Form.Item>
                    <Form.Item name="enddate" label="Дууссан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Дууссан огноо" />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
