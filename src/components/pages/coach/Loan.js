import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Table,
    Modal,
    Drawer,
    Space,
    Form,
    Button,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Typography, Tag
} from "antd";
import { ExclamationCircleFilled, UserOutlined, DownloadOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
const { confirm } = Modal;
const { Text } = Typography;

export default function Loan() {
    const { userinfo } = useUserInfo();
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [loanpurpose, setloanpurpose] = useState([]);

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = (isNaN(userinfo.coachid) ? 0 : userinfo.coachid) * 1;
        api
            .get(`/api/record/coach/get_loan_list?coachid=${coachid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                    setexceldata(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.entryid);
            },
        };
    };

    useEffect(() => {
        api
            .get(`/api/record/base/get_dropdown_item_list?type=loanpurpose`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setloanpurpose(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Зээл авсан огноо",
            dataIndex: "loandate",
            width: 200,
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
            title: "Гол оролцогч",
            dataIndex: "householdname",
        },
        {
            title: "Бүлгээс зээлсэн мөнгөн дүн",
            dataIndex: "amount",
            align: "right",
        },
        {
            title: "Зээлийн зориулалт",
            dataIndex: "loanpurpose",
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
                `/api/record/coach/delete_loan?id=${formdata.getFieldValue("entryid")}`
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
        fdata.loandate = fdata.loandate.format("YYYY.MM.DD HH:mm:ss");
        await api.post(`/api/record/coach/set_loan`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
        });
    };

    const getFormData = async (entryid) => {
        await api.get(`/api/record/coach/get_loan?id=${entryid}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                let fdata = res?.data?.retdata[0];
                fdata.loandate = dayjs(fdata.loandate, "YYYY.MM.DD HH:mm:ss");
                formdata.setFieldsValue(fdata);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            entryid: 0,
            householdid: null,
            loandate: null,
            amount: null,
            loanpurposeid: null,
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
                bordered
                title={() => (
                    <>
                        <Tag icon={<UserOutlined />} color="magenta">
                            Зээлийн мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                        </Tag>

                        <CSVLink data={exceldata} filename={"Зээлийн жагсаалт.csv"}>
                            <Button type="primary" icon={<DownloadOutlined />} size="small">
                                Татах
                            </Button>
                        </CSVLink>
                    </>
                )}
                onChange={(pagination, filters, sorter, extra) =>
                    setexceldata(extra.currentDataSource)
                }
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.entryid}
                summary={(pageData) => {
                    let totalamount = 0;
                    pageData.forEach(({ amount }) => {
                        totalamount += parseFloat(amount.replaceAll(",", ""));
                    });
                    totalamount = totalamount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    return (
                        <>
                            <Table.Summary.Row style={{ background: "#fafafa" }}>
                                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} />
                                <Table.Summary.Cell index={2} />
                                <Table.Summary.Cell index={3} />
                                <Table.Summary.Cell index={4} align="right">
                                    <Text>{totalamount}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} />
                            </Table.Summary.Row>
                        </>
                    );
                }}
            ></Table>

            <Drawer
                forceRender
                title="Зээлийн мэдээлэл нэмэх"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
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
                    <Form.Item name="householdid" label="householdid" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="amount" label="Бүлгээс зээлсэн мөнгөн дүн">
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Мөнгөн дүн"
                            formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                    </Form.Item>
                    <Form.Item name="loanpurposeid" label="Зээлийн зориулалт">
                        <Select style={{ width: "100%" }}>
                            {loanpurpose?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
