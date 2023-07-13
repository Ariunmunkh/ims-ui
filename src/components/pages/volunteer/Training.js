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
    DatePicker,
    Select,
    Divider,
    InputNumber,
    Input,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
const { confirm } = Modal;

export default function Training() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [training, settraining] = useState([]);
    const [loading, setLoading] = useState(true);
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
        api.get(`/api/Volunteer/get_VolunteerTraining_list?id=${volunteerid ?? userinfo.volunteerid}`)
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
        api.get(`/api/record/base/get_dropdown_item_list?type=training`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    settraining(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Сургалтын нэр",
            dataIndex: "training",
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
        {
            title: "Сургалтад хамрагдсан өдөр",
            dataIndex: "duration",
        },
        {
            title: "Сургалтад хамрагдсан байршил",
            dataIndex: "location",
        },
        {
            title: "Нэмэлт мэдээлэл",
            dataIndex: "note",
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
            .delete(`/api/Volunteer/delete_VolunteerTraining?id=${formdata.getFieldValue("id")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        fdata.trainingdate = fdata.trainingdate.format("YYYY.MM.DD HH:mm:ss");
        await api.post(`/api/Volunteer/set_VolunteerTraining`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
        });
    };

    const getFormData = async (id) => {
        await api
            .get(`/api/Volunteer/get_VolunteerTraining?id=${id}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.trainingdate = dayjs(fdata.trainingdate, "YYYY.MM.DD HH:mm:ss");
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            trainingid: null,
            levelid: null,
            trainingdate: null,
            location: null,
            duration: null,
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
                Хамрагдсан сургалт нэмэх
            </Button>

            <Table
                size="small"
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.id}
            ></Table>
            <Drawer
                forceRender
                title="Хамрагдсан сургалт нэмэх"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                centered
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
                <Divider />
                <Form
                    form={formdata}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    labelAlign="left"
                    labelWrap
                >
                    <Form.Item name="id" hidden={true} >
                        <Input />
                    </Form.Item>
                    <Form.Item name="volunteerid" hidden={true} >
                        <Input />
                    </Form.Item>

                    <Form.Item name="trainingid" label="Сургалтын нэр">
                        <Select style={{ width: "100%" }}>
                            {training?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="levelid" label="Түвшин">
                        <Select
                            style={{ width: "100%" }}
                            options={levelList}>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="trainingdate"
                        label="Сургалтад хамрагдсан өдөр"
                    >
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item name="duration" label="Сургалтад хамрагдсан өдөр">
                        <InputNumber
                            placeholder="Хугацаа"
                            min={1}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="location" label="Сургалтад хамрагдсан байршил">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="note"
                        label="Нэмэлт мэдээлэл"
                    >
                        <TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
