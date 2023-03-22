import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
    Table,
    Modal,
    Drawer,
    Space,
    Form,
    Button,
    Input,
    DatePicker,
    Divider,
    Select,
    InputNumber,
    Typography,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;
const { Text } = Typography;

export default function Investment() {
    const { householdid } = useParams();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [assetreceivedtype, setassetreceivedtype] = useState([]);
    const [assetreceived, setassetreceived] = useState([]);

    const fetchData = useCallback(() => {
        setLoading(true);
        api
            .get(`/api/record/coach/get_investment_list?id=${householdid}`)
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
        api.get(`/api/record/base/get_dropdown_item_list?type=assetreceivedtype`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setassetreceivedtype(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=assetreceived`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setassetreceived(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Хөрөнгө хүлээн авсан огноо",
            dataIndex: "investmentdate",
        },
        {
            title: "Хүлээн авсан хөрөнгийн төрөл",
            dataIndex: "assetreceivedtype",
        },
        {
            title: "Хүлээн авсан хөрөнгийн нэр",
            dataIndex: "assetreceived",
        },
        {
            title: "Тоо ширхэг",
            dataIndex: "quantity",
            align: 'right',
        },
        {
            title: "Нэгжийн үнэ",
            dataIndex: "funitprice",
            align: 'right',
        },
        {
            title: "Нийт үнэ",
            dataIndex: "ftotalprice",
            align: 'right',
        },
        {
            title: "Тайлбар (марк, дугаар)",
            dataIndex: "note",
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
                `/api/record/coach/delete_investment?id=${formdata.getFieldValue(
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
        fdata.investmentdate = fdata.investmentdate.format("YYYY.MM.DD HH:mm:ss");
        await api.post(`/api/record/coach/set_investment`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
        });
    };

    const getFormData = async (entryid) => {
        await api
            .get(`/api/record/coach/get_investment?id=${entryid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.investmentdate = dayjs(
                        fdata.investmentdate,
                        "YYYY.MM.DD HH:mm:ss"
                    );
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            entryid: 0,
            householdid: householdid,
            investmentdate: null,
            assetreceivedtypeid: null,
            assetreceivedid: null,
            quantity: 0,
            unitprice: 0,
            totalprice: 0,
            note: null,
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
                Хөрөнгө оруулалтын мэдээлэл
            </Button>

            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination
                rowKey={(record) => record.entryid}
                summary={(pageData) => {
                    let totalamount = 0;
                    let totalquantity = 0;
                    pageData.forEach(({ totalprice, quantity }) => {
                        totalquantity += quantity;
                        totalamount += totalprice;
                    });
                    totalamount = totalamount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    return (
                        <>
                            <Table.Summary.Row style={{ background: "#fafafa" }}>
                                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} />
                                <Table.Summary.Cell index={2} />
                                <Table.Summary.Cell index={3} align="right">
                                    <Text>{totalquantity}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4} />
                                <Table.Summary.Cell index={5} align="right">
                                    <Text>{totalamount}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6} />
                            </Table.Summary.Row>
                        </>
                    );
                }}
            ></Table>
            <Drawer
                forceRender
                title="Хөрөнгө оруулалтын мэдээлэл нэмэх"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                centered
                bodyStyle={{ paddingBottom: 80 }}
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
                <Divider />
                <Form
                    form={formdata}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    labelAlign="left"
                    labelWrap
                    onFieldsChange={(changedFields, allFields) => {
                        if (changedFields[0]?.name[0] === 'quantity' || changedFields[0]?.name[0] === 'unitprice') {
                            formdata.setFieldValue('totalprice', formdata.getFieldValue('quantity') * formdata.getFieldValue('unitprice'));
                        }
                    }}
                >
                    <Form.Item name="entryid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item name="investmentdate" label="Хөрөнгө хүлээн авсан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="assetreceivedtypeid" label="Хүлээн авсан хөрөнгийн төрөл">
                        <Select style={{ width: '100%' }}>
                            {assetreceivedtype?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="assetreceivedid" label="Хүлээн авсан хөрөнгийн нэр">
                        <Select style={{ width: '100%' }}>
                            {assetreceived?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="quantity" label="Тоо ширхэг">
                        <InputNumber
                            min={0}
                            placeholder="Тоо ширхэг"
                            style={{ width: "100%" }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                    <Form.Item name="unitprice" label="Нэгжийн үнэ">
                        <InputNumber
                            placeholder="Нэгжийн үнэ"
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                    <Form.Item name="totalprice" label="Нийт үнэ">
                        <InputNumber
                            placeholder="Нийт үнэ"
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                    <Form.Item name="note" label="Тайлбар (марк, дугаар)">
                        <Input.TextArea
                            placeholder="Тайлбар (марк, дугаар)"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
