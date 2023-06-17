import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Drawer, Space, Spin, Form, Button, Input, Select, InputNumber, Descriptions, Switch } from "antd";
import useUserInfo from "../../system/useUserInfo";

export default function Volunteer() {
    const { volunteerid } = useParams();

    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [householdstatus, sethouseholdstatus] = useState([]);
    const [householdgroup, sethouseholdgroup] = useState([]);
    const [householdgroupcopy, sethouseholdgroupcopy] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(() => {
        setLoading(true);


        api.get(`/api/Volunteer/get_Volunteer?id=${volunteerid ?? userinfo.volunteerid}`)
            .then((response) => {
                formdata.setFieldsValue(response.data.retdata[0]);
            }).finally(() => {
                setLoading(false);
            });
    }, [volunteerid, formdata]);

    useEffect(() => {
        fetchData();
        //api.get(`/api/record/base/get_district_list`)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            setdistrictlist(res?.data?.retdata);
        //        }
        //    });
        //api.get(`/api/record/coach/get_coach_list`)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            setcoachlist(res?.data?.retdata);
        //        }
        //    });
        //api.get(`/api/record/base/get_dropdown_item_list?type=householdstatus`)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            sethouseholdstatus(res?.data?.retdata);
        //        }
        //    });
        //api.get(`/api/record/base/get_dropdown_item_list?type=householdgroup`)
        //    .then((res) => {
        //        if (res?.status === 200 && res?.data?.rettype === 0) {
        //            sethouseholdgroup(res?.data?.retdata);
        //        }
        //    });
    }, [fetchData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        sethouseholdgroupcopy(householdgroup?.filter(row =>
            row?.coachid === formdata?.getFieldValue("coachid") &&
            row?.districtid === formdata?.getFieldValue("districtid")));
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
            else {
                console.log(res?.data);
            }
        });
    };

    return (
        <div>
            <Spin spinning={loading}>

                <Descriptions
                    title={
                        <>
                            "САЙН ДУРЫН ИДЭВХТНИЙ МЭДЭЭЛЭЛ"
                            <Button type="link" onClick={() => { showModal(); }}>Засах</Button>
                        </>
                    }
                    bordered
                    style={{ paddingBottom: 30 }}
                >
                    <Descriptions.Item label="Харьяалагдах улаан загалмайн хороо">{formdata.getFieldValue('volunteerid')}</Descriptions.Item>
                    <Descriptions.Item label="Ургийн овог">{formdata.getFieldValue('name')}</Descriptions.Item>
                    <Descriptions.Item label="Эцэг, эхийн нэр">{formdata.getFieldValue('numberof')}</Descriptions.Item>
                    <Descriptions.Item label="Нэр">{formdata.getFieldValue('districtname')}</Descriptions.Item>
                    <Descriptions.Item label="Хүйс">{formdata.getFieldValue('section')}</Descriptions.Item>
                    <Descriptions.Item label="Нас">{formdata.getFieldValue('phone')}</Descriptions.Item>
                    <Descriptions.Item label="Регистрийн дугаар">{formdata.getFieldValue('address')}</Descriptions.Item>
                    <Descriptions.Item label="Утас">{formdata.getFieldValue('householdgroupname')}</Descriptions.Item>
                    <Descriptions.Item label="И-мэйл">{formdata.getFieldValue('householdgroupname')}</Descriptions.Item>
                    <Descriptions.Item label="Элссэн огноо /улаан загалмайд/">{formdata.getFieldValue('householdgroupname')}</Descriptions.Item>
                    <Descriptions.Item label="Төрсөн газар">{formdata.getFieldValue('householdgroupname')}</Descriptions.Item>
                    <Descriptions.Item label="Цусны бүлэг">{formdata.getFieldValue('isactive') === true}</Descriptions.Item>
                    <Descriptions.Item label="Эрүүл мэндийн байдал">{formdata.getFieldValue('reason')}</Descriptions.Item>
                    <Descriptions.Item label="Фэйсбүүк хаяг">{formdata.getFieldValue('reason')}</Descriptions.Item>
                </Descriptions>

            </Spin>
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
                    onFieldsChange={(changedFields, allFields) => {

                        if (changedFields[0]?.name[0] === 'coachid' || changedFields[0]?.name[0] === 'districtid') {
                            formdata.setFieldValue('householdgroupid', null);
                            sethouseholdgroupcopy(householdgroup?.filter(row =>
                                row?.coachid === formdata?.getFieldValue("coachid") &&
                                row?.districtid === formdata?.getFieldValue("districtid")));
                        }

                    }}
                >
                    <Form.Item name="volunteerid" label="Өрхийн дугаар" >
                        <InputNumber min={0} readOnly />
                    </Form.Item>

                    <Form.Item name="coachid" label="Хариуцсан коучийн нэр" >
                        <Select style={{ width: "100%" }}>
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="householdgroupid"
                        label="Дундын хадгаламжийн бүлэг"
                    >
                        <Select style={{ width: "100%" }}>
                            {householdgroupcopy?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="numberof" label="Ам бүлийн тоо" hidden={true} />
                    <Form.Item name="name" label="Өрхийн тэргүүний нэр" hidden={true} />
                    <Form.Item name="status" label="Өрхийн статус">
                        <Select style={{ width: '100%' }}>
                            {householdstatus?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="isactive"
                        label="Идэвхитэй эсэх?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="reason" label="Шалтгаан">
                        <Input.TextArea />
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
                    <Form.Item name="latitude" label="Өргөрөг/Latitude/" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="longitude" label="Уртраг/longitude/" >
                        <Input />
                    </Form.Item>


                </Form>
            </Drawer>
        </div>
    );
}
