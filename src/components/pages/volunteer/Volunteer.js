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

    const props = {
        name: 'file',
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div>
            <Spin spinning={loading}>

                <Space size={12}>
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />

                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Зураг оруулах</Button>
                    </Upload>

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

                    <Descriptions.Item label="Сайн дурын идэвхтний төрөл">
                        {getname(formdata.getFieldValue("type"), type)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Харьяалагдах аймаг, хот">
                        {getname(formdata.getFieldValue("divisionid"), division)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Харьяалагдах сум, дүүрэг">
                        {getname(formdata.getFieldValue("districtid"), district)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ургийн овог">
                        {formdata.getFieldValue("familyname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Эцэг, эхийн нэр">
                        {formdata.getFieldValue("lastname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Нэр">
                        {formdata.getFieldValue("firstname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Хүйс">
                        {getname(formdata.getFieldValue("gender"), genders)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Нас">
                        {formdata.getFieldValue("birthday")?.format("YYYY.MM.DD")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Регистрийн дугаар">
                        {formdata.getFieldValue("regno")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Утас">
                        {formdata.getFieldValue("phone")}
                    </Descriptions.Item>
                    <Descriptions.Item label="И-мэйл">
                        {formdata.getFieldValue("householdgroupname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Гэрийн хаяг">
                        {formdata.getFieldValue("address")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Элссэн огноо /улаан загалмайд/">
                        {formdata.getFieldValue("joindate")?.format("YYYY.MM.DD")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Төрсөн газар">
                        {formdata.getFieldValue("householdgroupname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Цусны бүлэг">
                        {getname(formdata.getFieldValue("bloodgroupid"), bloodgroup)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Мэргэжил">
                        {formdata.getFieldValue("jobname")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Боловсролын түвшин">
                        {formdata.getFieldValue("educationlevelid")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Хөгжлийн бэрхшээлтэй эсэх">
                        {formdata.getFieldValue("isdisabled") ? "Тийм" : "Үгүй"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Фэйсбүүк хаяг">
                        {formdata.getFieldValue("reason")}
                    </Descriptions.Item>
                </Descriptions>
            </Spin>
            <Drawer
                forceRender
                title="Сайн дурын идэвхтний мэдээлэл засах"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                bodyStyle={{ paddingBottom: 80 }}
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
                        if (changedFields.length === 1) {
                            if (changedFields[0]?.name[0] === 'divisionid') {
                                formdata.setFieldValue('districtid', null);
                                setdistrictcopy(district?.filter(row => row?.divisionid === formdata?.getFieldValue("divisionid")));
                            }
                        }

                    }}
                >
                    <Form.Item name="id" label="Бүртгэлийн дугаар">
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


                    <Form.Item name="divisionid" label="Харьяалагдах аймаг, хот" >
                        <Select style={{ width: "100%" }}>
                            {division?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="districtid" label="Харьяалагдах сум, дүүрэг" >
                        <Select style={{ width: "100%" }}>
                            {districtcopy?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item name="type" label="Сайн дурын идэвхтний төрөл">
                        <Select
                            options={type}
                            style={{ width: "100%" }}>

                        </Select>
                    </Form.Item>
                    <Form.Item name="familyname" label="Ургийн овог">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastname" label="Эцэг, эхийн нэр">
                        <Input />
                    </Form.Item>
                    <Form.Item name="firstname" label="Өөрийн нэр">
                        <Input />
                    </Form.Item>

                    <Form.Item name="gender" label="Хүйс">
                        <Select
                            style={{ width: "100%" }}
                            options={genders}
                        ></Select>
                    </Form.Item>

                    <Form.Item name="birthday" label="Төрсөн огноо">
                        <DatePicker
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            placeholder="Өдөр сонгох"
                        />
                    </Form.Item>

                    <Form.Item name="regno" label="Регистрийн дугаар">
                        <Input />
                    </Form.Item>

                    <Form.Item name="phone" label="Утас">
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Имэйл">
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Гэрийн хаяг">
                        <Input />
                    </Form.Item>

                    <Form.Item name="joindate" label="Элссэн огноо /улаан загалмайд/">
                        <DatePicker
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            placeholder="Өдөр сонгох"
                        />
                    </Form.Item>

                    <Form.Item name="birthplace" label="Төрсөн газар">
                        <Input />
                    </Form.Item>

                    <Form.Item name="bloodgroupid" label="Цусны бүлэг">
                        <Select style={{ width: "100%" }}
                            options={bloodgroup}
                        ></Select>
                    </Form.Item>

                    <Form.Item name="jobname" label="Мэргэжил">
                        <Input />
                    </Form.Item>

                    <Form.Item name="educationlevelid" label="Боловсролын түвшин">
                        <Select style={{ width: "100%" }}>
                            {educationlevel?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="isdisabled" label="Хөгжлийн бэрхшээлтэй эсэх">
                        <Switch style={{ width: "100%" }} checkedChildren="Тийм" unCheckedChildren="Үгүй" />
                    </Form.Item>

                    <Form.Item name="facebook" label="Фэйсбүүк хаяг">
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
