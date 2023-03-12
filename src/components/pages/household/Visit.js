import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Modal, Drawer, Space, Form, Button, Input, DatePicker, Select, Divider, } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;

export default function Visit() {
    const { userinfo } = useUserInfo();
    const { householdid } = useParams();
    const [relationship, setrelationship] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/record/coach/get_householdvisit_list?id=${householdid}`)
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
                getFormData(record.visitid);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/households/get_householdmember_list?householdid=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setrelationship(res?.data?.retdata);
                }
            });
        api.get(`/api/record/coach/get_coach_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setcoachlist(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData, householdid]);

    const gridcolumns = [
        {
            title: "Айлчилсан огноо",
            dataIndex: "visitdate",
        },
        {
            title: "Айлчлалаар уулзсан өрхийн гишүүд",
            dataIndex: "membername",
        },
        {
            title: "Тайлбар",
            dataIndex: "note",
        },
        {
            title: "Айлчилсан хүний нэр",
            dataIndex: "coachname",
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
                `/api/record/coach/delete_householdvisit?id=${formdata.getFieldValue(
                    "visitid"
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
        fdata.visitdate = fdata.visitdate.format('YYYY.MM.DD HH:mm:ss');
        await api
            .post(`/api/record/coach/set_householdvisit`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (visitid) => {
        await api
            .get(`/api/record/coach/get_householdvisit?id=${visitid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.visitdate = dayjs(fdata.visitdate, 'YYYY.MM.DD HH:mm:ss');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            visitid: 0,
            coachid: userinfo.coachid,
            memberid: null,
            householdid: householdid,
            visitdate: null,
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
                Өрхийн айлчлалын мэдээлэл нэмэх
            </Button>

            <Table
                loading={loading}
                bordered
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                rowKey={(record) => record.visitid}
                pagination={true}
            ></Table>
            <Drawer
                forceRender
                title="Өрхийн айлчлалын мэдээлэл нэмэх"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                centered
                bodyStyle={{ paddingBottom: 80, }}
                extra={
                    <Space>
                        <Button
                            key="delete"
                            danger
                            onClick={showDeleteConfirm}
                            hidden={formdata.getFieldValue("visitid") === 0}
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
                >
                    <Form.Item name="visitid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item name="coachid" label="Айлчилсан хүний нэр" hidden={userinfo.coachid !== ''} >
                        <Select style={{ width: "100%" }}>
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="visitdate" label="Айлчилсан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="memberid" label="Айлчлалаар уулзсан өрхийн гишүүн">
                        <Select style={{ width: "100%" }}>
                            {relationship?.map((t, i) => (
                                <Select.Option key={i} value={t.memberid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="note" label="Тайлбар">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
