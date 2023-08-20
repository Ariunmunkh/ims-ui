import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../system/api";
import {
    Space,
    Spin,
    Form,
    Button,
    Input,
    Descriptions,
    Switch,
    Table,
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import TextArea from "antd/es/input/TextArea";

export default function Activity() {

    const { userinfo } = useUserInfo();
    const [formdata] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const location = useLocation();
    const { committeeid } = location.state || {};
    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/Committee/get_committeeactivity?id=${committeeid || userinfo.committeeid}`)
            .then((res) => {
                let fdata = res?.data?.retdata[0];
                if (typeof fdata.committeeactivitydtl === "undefined")
                    setData([]);
                else
                    setData(fdata.committeeactivitydtl);
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
        fdata.committeeactivitydtl = data;
        await api.post(`/api/Committee/set_committeeactivity`, fdata).then((res) => {
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
        var newid = 0;
        for (var i = 0; i < data?.length; i++) {
            if (data[i].id < newid)
                newid = data[i].id;
        }
        newid = newid - 1;

        const newRow = {
            id: newid,
            name: "",
            job: "",
            type: false,
        };
        setData([...data, newRow]);
    };

    const columns = [
        {
            title: "Овог, нэр",
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
            title: "Албан тушаал",
            dataIndex: "job",
            key: "job",
            render: (text, record) => (
                <>
                    {!isEditMode ? (
                        <Input value={record.job} readOnly></Input>
                    ) : (
                        <Input value={record.job} onChange={(value) => changeRow("job", value.target.value, record.id)}></Input>
                    )}
                </>
            ),
        },
        {
            title: "Гишүүний төрөл",
            dataIndex: "type",
            key: "type",
            render: (text, record) => (
                <>
                    {!isEditMode ? (
                        <Switch
                            checkedChildren="Удирдах зөвлөл"
                            unCheckedChildren="Төр-Улаан загалмай"
                            style={{ width: "100%" }}
                            checked={record.isnote}
                            disabled={true}
                        />
                    ) : (
                        <Switch
                            checkedChildren="Удирдах зөвлөл"
                            unCheckedChildren="Төр-Улаан загалмай"
                            style={{ width: "100%" }}
                            checked={record.isnote}
                            onChange={(value) => changeRow("type", value, record.id)}
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
                        title={<>" 3. ҮЙЛ АЖИЛЛАГААНЫ ТАЛААРХ МЭДЭЭЛЭЛ "</>}
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
                            label="Төсөл, хөтөлбөрийн талаарх мэдээлэл"
                            className="font-weight-bold"
                            span={3}
                        ></Descriptions.Item>
                        <Descriptions.Item span={3}
                            label="Хэрэгжүүлж байсан төслийн нэр, хугацаа, үндсэн үйл ажиллагаа, үр дүнгийн тухай 2-3 өгүүлбэрт багтаах /2020 оноос хойшхи/"
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c3_3")
                            ) : (
                                <Form.Item
                                    name="c3_3"
                                    initialValue={formdata.getFieldValue("c3_3")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <TextArea />
                                </Form.Item>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item span={3} className="font-weight-bold"
                            label="Нөөц хөгжүүлэх үйл ажиллагааны талаарх мэдээлэл "
                        >
                        </Descriptions.Item>
                        <Descriptions.Item span={3}
                            label="Нөөц хөгжүүлэх, орлого нэмэгдүүлэх чиглэлээр хийгддэг үйл ажиллагаа /Үйл ажиллагааг жагсааж оруулах/"
                        >
                            {!isEditMode ? (
                                formdata.getFieldValue("c3_4")
                            ) : (
                                <Form.Item
                                    name="c3_4"
                                    initialValue={formdata.getFieldValue("c3_4")}
                                    rules={[{ required: true, message: "Please enter a value" }]}
                                >
                                    <TextArea />
                                </Form.Item>
                            )}
                        </Descriptions.Item>

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
                    <Descriptions.Item span={3} className="font-weight-bold"
                        label="Байгууллагын хөгжлийн талаарх мэдээлэл "
                    >
                        {!isEditMode ? (
                            <Table dataSource={data} columns={columns} title={() => "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"} />
                        ) : (
                            <Form.Item>
                                <Table dataSource={data} columns={columns} title={() => "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"} />
                                <Button onClick={handleAddRow} type="primary">
                                    Шинэ мөр нэмэх
                                </Button>
                            </Form.Item>
                        )}
                    </Descriptions.Item>
                </Form>
            </Spin>
        </div>
    );
}
