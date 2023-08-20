import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import "./MyComponent.css";
import {
    Space,
    Spin,
    Form,
    Button,
    Input,
    InputNumber,
    Descriptions,
    DatePicker,
    Switch,
    Table,
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Branch() {
    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const formattedDateCorrect = dayjs(formdata.getFieldValue("c2_2"))
        .locale("en")
        .format("YYYY-MM-DD");
    const location = useLocation();
    const { committeeid } = location.state || {};
    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/Committee/get_CommitteeInfo?id=${committeeid || userinfo.committeeid}`)
            .then((res) => {
                let fdata = res?.data?.retdata[0];
                if (typeof fdata.committeeinfodtl === "undefined")
                    setData([]);
                else
                    setData(fdata.committeeinfodtl);
                formdata.setFieldsValue(fdata);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo.committeeid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        fdata.committeeinfodtl = data;
        await api.post(`/api/Committee/set_CommitteeInfo`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsEditMode(false); // Exit edit mode after successful save
                fetchData();
            } else {
                console.log(res?.data);
            }
        });
    };

    const [data, setData] = useState([]);

    // Function to add a new row to the table
    const handleAddRow = () => {
        if (data === undefined || data === null)
            data = [];
        var newid = 0;
        for (var i = 0; i < data?.length; i++) {
            if (data[i].id < newid)
                newid = data[i].id;
        }
        newid = newid - 1;

        const newRow = {
            id: newid,
            name: "",
            isnote: false,
            isbank: false,
        };
        setData([...data, newRow]);
    };

    const columns = [
        {
            title: "Сум / Хороо дахь анхан шатны хорооны нэр",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <>
                    {!isEditMode ? (
                        <Input value={record.name} readOnly></Input>
                    ) : (
                        <Input value={record.name} onChange={(value) => changeRow("name", value.target.value, record.id)}></Input>
                    )}
                </>
            ),
        },
        {
            title: "Тэмдэг",
            dataIndex: "isnote",
            key: "isnote",
            render: (text, record) => (
                <>
                    {!isEditMode ? (
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                            checked={record.isnote}
                            disabled={true}
                        />
                    ) : (
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                            checked={record.isnote}
                            onChange={(value) => changeRow("isnote", value, record.id)}
                        />
                    )}
                </>


            ),
        },
        {
            title: "Банкны данс",
            dataIndex: "isbank",
            key: "isbank",
            render: (text, record) => (
                <>
                    {!isEditMode ? (
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                            checked={record.isbank}
                            disabled={true}
                        />
                    ) : (
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                            checked={record.isbank}
                            onChange={(value) => changeRow("isbank", value, record.id)}
                        />
                    )}
                </>
            ),
        },
    ];

    const changeRow = (column, value, id) => {

        let tgriddata = [...data];

        let eIndex = tgriddata.findIndex((r) => r.id === id);
        if (eIndex >= 0) {
            tgriddata[eIndex][column] = value;
        }

        setData(tgriddata);
    };

    return (
        <div>
            <Spin spinning={loading}>
                <Form
                    form={formdata}
                    onFinish={onFinish}
                    column={{
                        xxl: 4,
                        xl: 3,
                        lg: 3,
                        md: 3,
                        sm: 2,
                        xs: 1,
                    }}
                >
                    <Descriptions
                        title={<>" 2. ДУНД ШАТНЫ ХОРООНЫ ТАЛААРХ МЭДЭЭЛЭЛ "</>}
                        label
                        extra={
                            <>
                                {!isEditMode && (
                                    <Button type="primary" onClick={handleEdit}>
                                        ЗАСАХ
                                    </Button>
                                )}
                                {isEditMode && (
                                    <Space>
                                        <Button onClick={() => setIsEditMode(false)}>Цуцлах</Button>
                                        <Button type="primary" htmlType="submit">
                                            Хадгалах
                                        </Button>
                                    </Space>
                                )}
                            </>
                        }
                        bordered
                    >
                        <Descriptions.Item
                            label="Үндсэн мэдээлэл"
                            span={3}
                            className="font-weight-bold"
                        ></Descriptions.Item>
                        <Descriptions.Item label="2.1. Дунд шатны хорооны нэр ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_1")
                            ) : (
                                <Form.Item
                                    name="c2_1"
                                    initialValue={formdata.getFieldValue("c2_1")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.2. Байгуулагдсан он, сар, өдөр">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_2")
                            ) : (
                                <Form.Item
                                    name="c2_2"
                                    initialValue={formdata.getFieldValue("c2_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.3. Хаяг, байршил ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_3")
                            ) : (
                                <Form.Item
                                    name="c2_3"
                                    initialValue={formdata.getFieldValue("c2_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.4. Утасны дугаар">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_4")
                            ) : (
                                <Form.Item
                                    name="c2_4"
                                    initialValue={formdata.getFieldValue("c2_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.5. И-мэйл хаяг " span={2}>
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_5")
                            ) : (
                                <Form.Item
                                    name="c2_5"
                                    initialValue={formdata.getFieldValue("c2_5")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Хүний нөөцийн талаарх мэдээлэл "
                            className="font-weight-bold"
                            span={3}
                        ></Descriptions.Item>
                        <Descriptions.Item label="2.6. Үндсэн ажилтаны тоо">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_6")
                            ) : (
                                <Form.Item
                                    name="c2_6"
                                    initialValue={formdata.getFieldValue("c2_6")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.7. Гэрээт ажилтаны тоо">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_7")
                            ) : (
                                <Form.Item
                                    name="c2_7"
                                    initialValue={formdata.getFieldValue("c2_7")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.8. Бүртгэлтэй Сайн дурын идэвхтний тоо ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_8")
                            ) : (
                                <Form.Item
                                    name="c2_8"
                                    initialValue={formdata.getFieldValue("c2_8")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="2.9. Гишүүнчлэл"
                            span={3}
                            className="font-weight-bold"
                        ></Descriptions.Item>
                        <Descriptions.Item label="2.9. Гишүүн">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_9_1")
                            ) : (
                                <Form.Item
                                    name="c2_9_1"
                                    initialValue={formdata.getFieldValue("c2_9_1")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.9. Онцгой гишүүн">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_9_2")
                            ) : (
                                <Form.Item
                                    name="c2_9_2"
                                    initialValue={formdata.getFieldValue("c2_9_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.9. Мөнгөн гишүүн">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_9_3")
                            ) : (
                                <Form.Item
                                    name="c2_9_3"
                                    initialValue={formdata.getFieldValue("c2_9_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.9. Алтан гишүүн" span={3}>
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_9_4")
                            ) : (
                                <Form.Item
                                    name="c2_9_4"
                                    initialValue={formdata.getFieldValue("c2_9_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="2.10. Хүмүүнлэгийн гишүүн байгууллагын тоо"
                            span={3}
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_10")
                            ) : (
                                <Form.Item
                                    name="c2_10"
                                    initialValue={formdata.getFieldValue("c2_10")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="2.11. Хүүхэд залуучуудын хөдөлгөөний гишүүний тоо "
                            span={3}
                        ></Descriptions.Item>
                        <Descriptions.Item label="2.11. Багачуудын улаан загалмайч">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_11_1")
                            ) : (
                                <Form.Item
                                    name="c2_11_1"
                                    initialValue={formdata.getFieldValue("c2_11_1")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.11. Өсвөрийн улаан загалмайч">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_11_2")
                            ) : (
                                <Form.Item
                                    name="c2_11_2"
                                    initialValue={formdata.getFieldValue("c2_11_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.11. Залуучуудын улаан загалмайч">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_11_3")
                            ) : (
                                <Form.Item
                                    name="c2_11_3"
                                    initialValue={formdata.getFieldValue("c2_11_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.11. Идэр улаан загалмайч" span={3}>
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_11_4")
                            ) : (
                                <Form.Item
                                    name="c2_11_4"
                                    initialValue={formdata.getFieldValue("c2_11_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Үндсэн хөрөнгийн талаарх мэдээлэл "
                            className="font-weight-bold"
                            span={3}
                        ></Descriptions.Item>
                        <Descriptions.Item label="2.12. ДШХ-ны эзэмшлийн газартай эсэх ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_12_1")
                            ) : (
                                <Form.Item
                                    name="c2_12_1"
                                    initialValue={formdata.getFieldValue("c2_12_1")}
                                    rules={[{ required: false, message: "Please enter a value" }]}
                                >
                                    <Switch
                                        checkedChildren="Тийм"
                                        unCheckedChildren="Үгүй"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.12. Эзэмшлийн газрын зориулалт ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_12_2")
                            ) : (
                                <Form.Item
                                    name="c2_12_2"
                                    initialValue={formdata.getFieldValue("c2_12_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.12. Талбайн хэмжээ ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_12_3")
                            ) : (
                                <Form.Item
                                    name="c2_12_3"
                                    initialValue={formdata.getFieldValue("c2_12_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="2.12. Хэрэв үгүй бол Газрын зориулалт"
                            span={3}
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_12_4")
                            ) : (
                                <Form.Item
                                    name="c2_12_4"
                                    initialValue={formdata.getFieldValue("c2_12_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.13. ДШХ-ны эзэмшлийн байртай эсэх ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_13_1")
                            ) : (
                                <Form.Item
                                    name="c2_13_1"
                                    initialValue={formdata.getFieldValue("c2_13_1")}
                                    rules={[{ required: false, message: "Please enter a value" }]}
                                >
                                    <Switch
                                        checkedChildren="Тийм"
                                        unCheckedChildren="Үгүй"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.13.Эзэмшлийн байрны тоо">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_13_2")
                            ) : (
                                <Form.Item
                                    name="c2_13_2"
                                    initialValue={formdata.getFieldValue("c2_13_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.13. Талбайн хэмжээ ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_13_3")
                            ) : (
                                <Form.Item
                                    name="c2_13_3"
                                    initialValue={formdata.getFieldValue("c2_13_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.13. Өрөөний тоо">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_13_4")
                            ) : (
                                <Form.Item
                                    name="c2_13_4"
                                    initialValue={formdata.getFieldValue("c2_13_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="2.13. Хэрэв үгүй бол байрны зориулалт"
                            span={2}
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_13_5")
                            ) : (
                                <Form.Item
                                    name="c2_13_5"
                                    initialValue={formdata.getFieldValue("c2_13_5")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.14. ДШХ-ны эзэмшлийн агуулахтай эсэх ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_14_1")
                            ) : (
                                <Form.Item
                                    name="c2_14_1"
                                    initialValue={formdata.getFieldValue("c2_14_1")}
                                    rules={[{ required: false, message: "Please enter a value" }]}
                                >
                                    <Switch
                                        checkedChildren="Тийм"
                                        unCheckedChildren="Үгүй"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.14. Ашиглалтанд орсон огноо ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_14_2")
                            ) : (
                                <Form.Item
                                    name="c2_14_2"
                                    initialValue={formdata.getFieldValue("c2_14_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.14. Талбайн хэмжээ">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_14_3")
                            ) : (
                                <Form.Item
                                    name="c2_14_3"
                                    initialValue={formdata.getFieldValue("c2_14_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.15. ДШХ-ны эзэмшлийн тээврийн хэрэгсэлтэй эсэх">
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_15_1")
                            ) : (
                                <Form.Item
                                    name="c2_15_1"
                                    initialValue={formdata.getFieldValue("c2_15_1")}
                                    rules={[{ required: false, message: "Please enter a value" }]}
                                >
                                    <Switch
                                        checkedChildren="Тийм"
                                        unCheckedChildren="Үгүй"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="2.15. Тээврийн хэрэгслийн тоо " span={2}>
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_15_2")
                            ) : (
                                <Form.Item
                                    name="c2_15_2"
                                    initialValue={formdata.getFieldValue("c2_15_2")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            span={3}
                            label="2.15. Тээврийн хэрэгслийн тайлбар /Марк, ашигласан хугацаа, Монголд орж ирсэн огноо/"
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_15_3")
                            ) : (
                                <Form.Item
                                    name="c2_15_3"
                                    initialValue={formdata.getFieldValue("c2_15_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <TextArea />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            span={3}
                            label="2.16. Бусад хөрөнгө /зөөврийн болон суурийн компьютер, принтер гэх мэтийг дурдах/  "
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c2_16")
                            ) : (
                                <Form.Item
                                    name="c2_16"
                                    initialValue={formdata.getFieldValue("c2_16")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <TextArea />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label="Анхан шатны хорооны талаарх мэдээлэл"
                            className="font-weight-bold"
                            span={3}
                        ></Descriptions.Item>
                        <Descriptions.Item>
                            {!isEditMode ? (
                                <></>
                            ) : (
                                <Form.Item
                                    name="committeeid"
                                    initialValue={formdata.getFieldValue("c3_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                    hidden
                                >
                                    <Input />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                    {!isEditMode ? (
                        <Table dataSource={data} columns={columns} />
                    ) : (
                        <>
                            <Table dataSource={data} columns={columns} />
                            <Button onClick={handleAddRow} type="primary">
                                Шинэ мөр нэмэх
                            </Button>
                        </>
                    )}
                </Form>
            </Spin>
        </div>
    );
}
