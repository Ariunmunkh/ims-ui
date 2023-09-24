import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
    Drawer,
    Space,
    Spin,
    Form,
    Switch,
    Button,
    Image, message, Upload,
    Input,
    Select,
    InputNumber,
    Descriptions,
    DatePicker,
    Row,
    Col,
} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY.MM.DD HH:mm:ss";

export default function Volunteer() {
    const { volunteerid } = useParams();

    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [educationlevel, seteducationlevel] = useState([]);
    const [branch, setBranch] = useState();
    const [loading, setLoading] = useState(false);
    const [division, setdivision] = useState([]);
    const [district, setdistrict] = useState([]);
    const [districtcopy, setdistrictcopy] = useState([]);
    const bloodgroup = [
        { value: 1, label: 'I бүлэг /O/' },
        { value: 2, label: 'II бүлэг /A/' },
        { value: 3, label: 'III бүлэг /B/' },
        { value: 4, label: 'IV бүлэг /AB/' },
    ];
    const genders = [
        { value: 0, label: 'Эрэгтэй' },
        { value: 1, label: 'Эмэгтэй' },
        { value: 2, label: 'Бусад' },
    ];
    const type = [
        { value: 1, label: 'Сайн дурын идэвхтэн' },
        { value: 2, label: 'Хүүхэд, залуучуудын хөдөлгөөний гишүүн' },
    ];
    const fetchData = useCallback(async () => {
        setLoading(true);

        await api
            .get(`/api/record/base/get_dropdown_item_list?type=division`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let tdata = res?.data?.retdata.sort((a, b) => a.id - b.id)
                    setdivision(tdata);
                }
            });
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=district`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrict(res?.data?.retdata);
                }
            });

        await api
            .get(
                `/api/Volunteer/get_Volunteer?id=${volunteerid ?? userinfo.volunteerid}`
            )
            .then((res) => {
                let fdata = res?.data?.retdata[0];

                fdata.birthday = fdata?.birthday ? dayjs(fdata?.birthday, dateFormat) : null;
                fdata.joindate = fdata?.joindate ? dayjs(fdata?.joindate, dateFormat) : null;

                formdata.setFieldsValue(fdata);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [volunteerid, userinfo.volunteerid]);

    useEffect(() => {
        api
            .get(`/api/record/base/get_dropdown_item_list?type=educationlevel`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    seteducationlevel(res?.data?.retdata);
                }
            });
        api
            .get(`/api/record/base/get_Committee_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setBranch(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);

        setdistrictcopy(district?.filter(row => row?.divisionid === formdata?.getFieldValue("divisionid")));
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        fdata.birthday = fdata.birthday.format(dateFormat);
        fdata.joindate = fdata.joindate.format(dateFormat);

        await api.post(`/api/Volunteer/set_Volunteer`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            } else {
                console.log(res?.data);
            }
        });
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current >= dayjs().endOf('day');
    };
    const getname = (s, t) => {
        const found = t.find(obj => { return obj.value === s });
        return found?.label;
    };


    return (
        <div>
            <Spin spinning={loading}>

                <Space size={12}>
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />


                </Space>

                <Descriptions gutter={16}
                    title={
                        <>
                            <Space wrap>
                                <div>
                                    "САЙН ДУРЫН ИДЭВХТНИЙ МЭДЭЭЛЭЛ"
                                </div>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        showModal();
                                    }}
                                >
                                    Засах
                                </Button>
                            </Space>
                        </>
                    }
                    bordered
                    style={{ paddingBottom: 30 }}
                >

                    <Descriptions.Item span={3} label="Харьяалагдах дунд шатны хороо">
                        {formdata.getFieldValue("committee")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Харьяалагдах аймаг, хот">
                        {getname(formdata.getFieldValue("divisionid"), division)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Харьяалагдах сум, дүүрэг">
                        {getname(formdata.getFieldValue("districtid"), district)}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Сайн дурын идэвхтний төрөл">
                        {getname(formdata.getFieldValue("type"), type)}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Ургийн овог">
                        {formdata.getFieldValue("familyname")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Эцэг, эхийн нэр">
                        {formdata.getFieldValue("lastname")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Нэр">
                        {formdata.getFieldValue("firstname")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Регистрийн дугаар">
                        {formdata.getFieldValue("regno")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Хүйс">
                        {getname(formdata.getFieldValue("gender"), genders)}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Төрсөн огноо">
                        {formdata.getFieldValue("birthday")?.format("YYYY.MM.DD")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Элссэн огноо /улаан загалмайд/">
                        {formdata.getFieldValue("joindate")?.format("YYYY.MM.DD")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Мэргэжил">
                        {formdata.getFieldValue("jobname")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Боловсролын түвшин">
                        {formdata.getFieldValue("educationlevelid")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Төрсөн газар">
                        {formdata.getFieldValue("birthplace")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Цусны бүлэг">
                        {getname(formdata.getFieldValue("bloodgroupid"), bloodgroup)}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Утас">
                        {formdata.getFieldValue("phone")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="И-мэйл">
                        {formdata.getFieldValue("email")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Хөгжлийн бэрхшээлтэй эсэх">
                        {formdata.getFieldValue("isdisabled") ? "Тийм" : "Үгүй"}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Фэйсбүүк хаяг">
                        {formdata.getFieldValue("facebook")}
                    </Descriptions.Item>

                    <Descriptions.Item span={2} label="Одоо эрхлэж буй ажил">
                        {formdata.getFieldValue("employment")}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Гэрийн хаяг">
                        {formdata.getFieldValue("address")}
                    </Descriptions.Item>

                </Descriptions>
            </Spin>
            <Drawer
                forceRender
                title="Сайн дурын идэвхтний мэдээлэл засах"
                open={isModalOpen}
                width={1000}
                onClose={handleCancel}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button key="cancel" onClick={handleCancel}>
                            Болих
                        </Button>
                        <Button key="save" type="primary" onClick={() => { formdata.submit() }}>
                            Хадгалах
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={formdata}
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    labelAlign="left"
                    labelWrap
                    onFieldsChange={(changedFields, allFields) => {
                        if (changedFields.length === 1) {
                            if (changedFields[0]?.name[0] === 'divisionid') {
                                formdata.setFieldValue('districtid', null);
                                setdistrictcopy(district?.filter(row => row?.divisionid === formdata?.getFieldValue("divisionid")));
                            }
                        }

                    }}
                >


                    <Form.Item name="id" label="Бүртгэлийн дугаар" hidden={true}>
                        <InputNumber min={0} readOnly />
                    </Form.Item>

                    <Form.Item key="committeeid" name="committeeid" label="Харьяалагдах улаан загалмайн хороо" hidden={true}>
                        <Select style={{ width: "100%" }}>
                            {branch?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row>
                        <Col span={12}>
                            <Form.Item name="divisionid" label="Харьяалагдах аймаг, хот" rules={[{ required: true, message: "Утга оруулна уу!" }]} >
                                <Select style={{ width: "100%" }}>
                                    {division?.map((t, i) => (
                                        <Select.Option key={i} value={t.id}>
                                            {t.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="districtid" label="Харьяалагдах сум, дүүрэг" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Select style={{ width: "100%" }}>
                                    {districtcopy?.map((t, i) => (
                                        <Select.Option key={i} value={t.id}>
                                            {t.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item name="type" label="Сайн дурын идэвхтний төрөл" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Select
                                    options={type}
                                    style={{ width: "100%" }}>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>

                            <Form.Item name="familyname" label="Ургийн овог" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="lastname" label="Эцэг, эхийн нэр" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="firstname" label="Өөрийн нэр" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="regno" label="Регистрийн дугаар" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Хүйс" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Select
                                    style={{ width: "100%" }}
                                    options={genders}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="birthday" label="Төрсөн огноо" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <DatePicker
                                    disabledDate={disabledDate}
                                    style={{ width: "100%" }}
                                    placeholder="Өдөр сонгох"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="joindate" label="Элссэн огноо /улаан загалмайд/" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <DatePicker
                                    disabledDate={disabledDate}
                                    style={{ width: "100%" }}
                                    placeholder="Өдөр сонгох"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="jobname" label="Мэргэжил" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="educationlevelid" label="Боловсролын түвшин" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Select style={{ width: "100%" }}>
                                    {educationlevel?.map((t, i) => (
                                        <Select.Option key={i} value={t.id}>
                                            {t.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="birthplace" label="Төрсөн газар" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="bloodgroupid" label="Цусны бүлэг" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Select style={{ width: "100%" }}
                                    options={bloodgroup}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={12}>
                            <Form.Item name="phone" label="Утас" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Имэйл" readOnly={true} rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item name="isdisabled" label="Хөгжлийн бэрхшээлтэй эсэх" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Switch style={{ width: "100%" }} checkedChildren="Тийм" unCheckedChildren="Үгүй" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="facebook" label="Фэйсбүүк хаяг" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item name="employment" label="Одоо эрхлэж буй ажил" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="address" label="Гэрийн хаяг" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
}
