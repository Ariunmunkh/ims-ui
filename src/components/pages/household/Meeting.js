import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Space, Form, Button, Typography, Switch, DatePicker, InputNumber, } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;
const { Text } = Typography;

export default function Meeting() {
    const { householdid } = useParams();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api
            .get(`/api/record/coach/get_meetingattendance_list?id=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [householdid]);

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
            title: "Бүлгийн хурал зохион байгуулагдсан огноо",
            dataIndex: "meetingdate",
        },
        {
            title: "Бүлгийн хуралд оролцсон эсэх",
            dataIndex: "isjoin",
        },
        {
            title: "Худалдан авсан хувьцааны тоо",
            dataIndex: "quantity",
        },
        {
            title: "Хуримтлуулсан мөнгөн дүн",
            dataIndex: "famount",
            align: 'right',
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
                `/api/record/coach/delete_meetingattendance?id=${formdata.getFieldValue(
                    "entryid"
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
        let fdata = formdata.getFieldsValue();
        fdata.meetingdate = fdata.meetingdate.format('YYYY.MM.DD HH:mm:ss');
        await api
            .post(`/api/record/coach/set_meetingattendance`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (entryid) => {
        await api
            .get(`/api/record/coach/get_meetingattendance?id=${entryid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.meetingdate = dayjs(fdata.meetingdate, 'YYYY.MM.DD HH:mm:ss');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            entryid: 0,
            memberid: null,
            householdid: householdid,
            meetingdate: null,
            isjoin: true,
            quantity: null,
            amount: null,
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
                Хурлын ирцийн мэдээлэл нэмэх
            </Button>

            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.entryid}
                summary={(pageData) => {

                    let totalamount = 0;
                    let totalquantity = 0;
                    pageData.forEach(({ amount, quantity }) => {
                        totalamount += parseFloat(amount);
                        totalquantity += quantity;
                    });
                    totalamount = totalamount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                    return (
                        <>
                            <Table.Summary.Row style={{ background: '#fafafa' }}>
                                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} />
                                <Table.Summary.Cell index={2} >
                                    <Text>{totalquantity}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align='right'>
                                    <Text>{totalamount}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            ></Table>
            <Drawer
                forceRender
                title="Хурлын ирцийн мэдээлэл нэмэх"
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

                    <Form.Item name="entryid" hidden={true} />
                    <Form.Item name="coachid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item
                        name="meetingdate"
                        label="Бүлгийн хурал зохион байгуулагдсан огноо"
                    >
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item
                        name="isjoin"
                        label="Бүлгийн хуралд оролцсон эсэх"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="quantity" label="Худалдан авсан хувьцааны тоо">
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="Хувьцааны тоо"
                        />
                    </Form.Item>
                    <Form.Item name="amount" label="Хуримтлуулсан мөнгөн дүн">
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Мөнгөн дүн"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
