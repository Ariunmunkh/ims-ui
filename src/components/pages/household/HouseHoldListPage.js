﻿import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Button } from "antd";
import { Drawer, Space, Form, Input, Select, InputNumber } from "antd";
import useUserInfo from "../../system/useUserInfo";

export default function HouseHoldListPage() {
    const navigate = useNavigate();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const { userinfo } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formdata] = Form.useForm();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachlist, setcoachlist] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        await api
            .get(`/api/record/households/get_household_list`)
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
                navigate(`/household/${record.householdid}`);
            },
        };
    };

    useEffect(() => {
        fetchData();
        api.get(`/api/record/base/get_district_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrictlist(res?.data?.retdata);
                }
            });
        api.get(`/api/record/coach/get_coach_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setcoachlist(res?.data?.retdata);
                }
            });
    }, []);

    const gridcolumns = [
        {
            title: "Ам бүлийн тоо",
            dataIndex: "numberof",
        },
        {
            title: "Өрхийн тэргүүний нэр",
            dataIndex: "name",
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
            title: "Хаяг",
            dataIndex: "address",
        },
        {
            title: "Утас",
            dataIndex: "phone",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
        },
    ];

    const newFormData = async () => {
        formdata.setFieldsValue({
            householdid: 0,
            status: 0,
            numberof: 0,
            name: null,
            districtid: null,
            section: null,
            address: null,
            phone: null,
            coachid: userinfo.coachid,
        });
        showModal();
    };

    let content = [];


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        await api.post(`/api/record/households/set_household`, formdata.getFieldsValue()).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
        });
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                type="primary"
                onClick={(e) => newFormData()}
            >
                Шинэ
            </Button>
            <Drawer
                forceRender
                title="Өрхийн мэдээлэл засах"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                bodyStyle={{ paddingBottom: 80, }}
                extra={
                    <Space>
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
                    <Form.Item name="householdid" label="Өрхийн дугаар" hidden={true} />
                    <Form.Item name="numberof" label="Ам бүлийн тоо" hidden={true} />
                    <Form.Item name="name" label="Өрхийн тэргүүний нэр" hidden={true} />
                    <Form.Item name="districtid" label="Дүүрэг">
                        <Select style={{ width: "100%" }}>
                            {districtlist?.map((t, i) => (
                                <Select.Option key={i} value={t.districtid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="section" label="Хороо" >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="address" label="Хаяг">
                        <Input.TextArea style={{ width: "100%" }} placeholder="Хаяг" />
                    </Form.Item>
                    <Form.Item name="phone" label="Утас" >
                        <Input />
                    </Form.Item>

                    <Form.Item name="coachid" label="Хариуцсан коучийн нэр" hidden={userinfo.coachid !== ''} >
                        <Select style={{ width: "100%" }}>
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                </Form>
            </Drawer>
            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={userinfo.roleid === '1' ? griddata : content}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.householdid}
            ></Table>
        </div>
    );
}
