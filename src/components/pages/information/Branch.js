import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
    Drawer,
    Space,
    Spin,
    Form,
    Button,
    Input,
    Select,
    InputNumber,
    Descriptions,
    DatePicker,
    Row,
    Col,
    Switch,
    Table,
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TextArea from "antd/es/input/TextArea";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Branch() {

    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        if (userinfo.committeeid)
            await api
                .get(`/api/Committee/get_CommitteeInfo?id=${userinfo.committeeid}`)
                .then((res) => {

                    let fdata = res?.data?.retdata[0];
                    formdata.setFieldsValue(fdata);

                });
        setLoading(false);

    }, [userinfo.committeeid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSave = async () => {
        try {
            const values = await formdata.validateFields();
            // Make the API call to save the data here
            await api.post(`/api/Committee/set_CommitteeInfo`, values);
            fetchData(); // Fetch updated data after saving
            setIsEditMode(false);
        } catch (error) {
            console.log("Validation Error:", error);
        }
    };

    const [data, setData] = useState([
        { key: "1", name: "John Doe", age: 25, address: "123 Main St" },
        { key: "2", name: "Jane Smith", age: 30, address: "456 Park Ave" },
    ]);

    // Function to add a new row to the table
    const handleAddRow = () => {
        const newRow = {
            key: Date.now().toString(),
            name: "",
            temdeg: 0,
            dans: "",
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
                        <Input value={text} key={record.name} readOnly></Input>
                    ) : (
                        <Form.Item
                            name="otherAsset"
                            initialValue={formdata.getFieldValue("otherAsset")}
                            rules={[{ required: true, message: "Please enter a value" }]}
                        >
                            <Input value={text} key={record.name}></Input>
                        </Form.Item>
                    )}
                </>
            ),
        },
        {
            title: "Тэмдэг",
            dataIndex: "temdeg",
            key: "temdeg",
            render: (text, record) => (
                <Switch
                    checkedChildren="Тийм"
                    unCheckedChildren="Үгүй"
                    style={{ width: "100%" }}
                />
            ),
        },
        {
            title: "Банкны данс",
            dataIndex: "dans",
            key: "dans",
            render: (text, record) => (
                <Switch
                    checkedChildren="Тийм"
                    unCheckedChildren="Үгүй"
                    style={{ width: "100%" }}
                />
            ),
        },
    ];

    const handleInputChange = (e, key, dataIndex) => {
        const { value } = e.target;
        setData((prevData) =>
            prevData.map((item) =>
                item.key === key ? { ...item, [dataIndex]: value } : item
            )
        );
    };

    return (
        <div>
            <Spin spinning={loading}>
                <Descriptions
                    title={<>" 2. ДУНД ШАТНЫ ХОРООНЫ ТАЛААРХ МЭДЭЭЛЭЛ "</>}
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
                                    <Button type="primary" onClick={handleSave}>
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
                                <DatePicker />
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
                                rules={[{ required: true, message: "Please enter a value" }]}
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
                                rules={[{ required: true, message: "Please enter a value" }]}
                            >
                                <Input />
                            </Form.Item>
                        )}
                        {formdata.getFieldValue("c2_13_1")}
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
                        {formdata.getFieldValue("c2_13_2")}
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
                                rules={[{ required: true, message: "Please enter a value" }]}
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
                                <DatePicker />
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
                                rules={[{ required: true, message: "Please enter a value" }]}
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
            </Spin>
        </div>
    );
}
