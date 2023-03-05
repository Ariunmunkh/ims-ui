import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Drawer, Space, Form, Button, Input, Select, InputNumber, Descriptions, Divider } from "antd";
import HouseHoldMember from "./HouseHoldMember";

export default function HouseHold() {
    const { householdid } = useParams();
    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [householdstatus, sethouseholdstatus] = useState([]);

    const fetchData = useCallback(() => {
        api.get(`/api/record/households/get_household?id=${householdid}`)
            .then((response) => {
                formdata.setFieldsValue(response.data.retdata[0]);
            });
    }, [householdid, formdata]);

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
        api.get(`/api/record/base/get_dropdown_item_list?type=householdstatus`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethouseholdstatus(res?.data?.retdata);
                }
            });
    }, [fetchData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        await api.post(`/api/record/households/set_household`, formdata.getFieldsValue()).then((res) => {
            debugger;
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
            else {
                console.log(res?.data);
            }
        });
    };

    return (
        <div>
            <Descriptions
                title="ӨРХИЙН МЭДЭЭЛЭЛ"
                bordered
                style={{ paddingBottom: 30 }}
            >
                <Descriptions.Item label="Өрхийн дугаар">
                    {formdata.getFieldValue('householdid')}
                </Descriptions.Item>
                <Descriptions.Item label="Өрхийн тэргүүн нэр">
                    {formdata.getFieldValue('name')}
                </Descriptions.Item>
                <Descriptions.Item label="Ам бүл">{formdata.getFieldValue('numberof')}</Descriptions.Item>
                <Descriptions.Item label="Дүүрэг">{formdata.getFieldValue('districtname')}</Descriptions.Item>
                <Descriptions.Item label="Хороо">{formdata.getFieldValue('section')}</Descriptions.Item>
                <Descriptions.Item label="Утас">{formdata.getFieldValue('phone')}</Descriptions.Item>
                <Descriptions.Item label="Хаяг">{formdata.getFieldValue('address')}</Descriptions.Item>
            </Descriptions>
            <Button type="link" onClick={() => { showModal(); }}>Засах</Button>
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
                    <Form.Item name="householdid" label="Өрхийн дугаар" >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="numberof" label="Ам бүлийн тоо" hidden={true} />
                    <Form.Item name="name" label="Өрхийн тэргүүний нэр" hidden={true} />
                    <Form.Item name="status" label="Өрхийн статус">
                        <Select style={{ width: '100%' }}>
                            {householdstatus?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="districtname" hidden={true} />
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
            <Divider />
            <Descriptions title="ӨРХИЙН ГИШҮҮДИЙН МЭДЭЭЛЭЛ " bordered>
                <Descriptions.Item >
                    <HouseHoldMember />
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
}
