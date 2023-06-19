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
            title: "Зээл авсан огноо",
            dataIndex: "loandate",
            width: 200,
        },
        {
            title: "Бүлгээс зээлсэн мөнгөн дүн",
            dataIndex: "amount",
            align: 'right',
        },
        {
            title: "Зээлийн зориулалт",
            dataIndex: "loanpurpose",
        },
        {
            title: "Зээлийн зориулалтын тайлбар",
            dataIndex: "loanpurposenote",
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
                Зээлийн мэдээлэл нэмэх
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
                title="Зээлийн мэдээлэл нэмэх"
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
                    <Form.Item name="loandate" label="Зээл авсан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="volunteerid" label="volunteerid" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="amount" label="Бүлгээс зээлсэн мөнгөн дүн">
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Мөнгөн дүн"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item name="loanpurposeid" label="Зээлийн зориулалт">
                        <Select style={{ width: '100%' }}>
                            {loanpurpose?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="loanpurposenote" label="Зээлийн зориулалтын тайлбар">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
