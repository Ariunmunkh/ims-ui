import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Table,
    Modal,
    Drawer,
    Space,
    Form,
    Button,
    Switch,
    InputNumber,
    Select,
    Input
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function Languages() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [languages, setlanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formdata] = Form.useForm();
    const [levelList] = useState([
        {
            value: 1,
            label: "Анхан шат",
        },
        {
            value: 2,
            label: "Дунд шат"
        },
        {
            value: 3,
            label: "Ахисан шат",
        }
    ]);

    const fetchData = useCallback(() => {
        setLoading(true);
        api
            .get(`/api/Volunteer/get_VolunteerLanguages_list?id=${volunteerid ?? userinfo.volunteerid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [volunteerid, userinfo.volunteerid]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.id);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/base/get_dropdown_item_list?type=languages`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setlanguages(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Гадаад хэл",
            dataIndex: "languages",
        },
        {
            title: "Түвшин",
            dataIndex: "levelid",
            render: (text, record, index) => {
                return (
                    <Select
                        value={record?.levelid}
                        disabled
                        bordered={false}
                        options={levelList}
                    />
                );
            },
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
            okText: "Тийм",
            okType: "danger",
            cancelText: "Үгүй",
            onOk() {
                onDelete();
            },
        });
    };

    const onDelete = async () => {
        await api
            .delete(`/api/Volunteer/delete_VolunteerLanguages?id=${formdata.getFieldValue("id")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        //fdata.meetingdate = fdata.meetingdate.format('YYYY.MM.DD HH:mm:ss');
        await api
            .post(`/api/Volunteer/set_VolunteerLanguages`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api
            .get(`/api/Volunteer/get_VolunteerLanguages?id=${id}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    //fdata.meetingdate = dayjs(fdata.meetingdate, 'YYYY.MM.DD HH:mm:ss');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            languageid: null,
            levelid: null,
            studyyear: null,
            isscore: null,
            testname: null,
            testscore: null,
            note: null
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
                Гадаад хэл нэмэх
            </Button>

            <Table
                size="small"
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.id}
                summary={(pageData) => {

                }}
            ></Table>
            <Drawer
                forceRender
                title="Боловсрол нэмэх"
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
                            hidden={formdata.getFieldValue("id") === 0}
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
                    onFieldsChange={(changedFields, allFields) => {

                    }}
                >
                    <Form.Item name="id" hidden={true} >
                        <Input />
                    </Form.Item>
                    <Form.Item name="volunteerid" hidden={true}  >
                        <Input />
                    </Form.Item>

                    <Form.Item name="languageid" label="Гадаад хэл" >
                        <Select style={{ width: "100%" }}>
                            {languages?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="levelid" label="Түвшин">
                        <Select
                            style={{ width: "100%" }}
                            options={levelList}>
                        </Select>
                    </Form.Item>

                    <Form.Item name="studyyear" label="Сурсан хугацаа /Жилээр/" hidden={true} >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Сурсан хугацаа /Жилээр/"
                        />
                    </Form.Item>

                    <Form.Item
                        name="isscore"
                        label="Түвшин шалгасан оноотой эсэх"
                        valuePropName="checked"
                        hidden={true}
                    >
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item name="testname" label="Шалгалтын нэр" hidden={true} >
                        <Input style={{ width: "100%" }} placeholder="Шалгалтын нэр" />
                    </Form.Item>


                    <Form.Item name="testscore" label="Шалгалтын оноо" hidden={true} >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Шалгалтын оноо"
                        />
                    </Form.Item>

                    <Form.Item name="note" label="Нэмэлт мэдээлэл" hidden={true} >
                        <Input style={{ width: "100%" }} placeholder="Нэмэлт мэдээлэл" />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
