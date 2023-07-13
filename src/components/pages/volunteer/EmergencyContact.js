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
    Input,
    Divider,
    Select,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function EmergencyContact() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [relationship, setrelationship] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/Volunteer/get_EmergencyContact_list?id=${volunteerid ?? userinfo.volunteerid}`)
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
        api.get(`/api/record/base/get_dropdown_item_list?type=relationship`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setrelationship(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Таны юу болох",
            dataIndex: "relationship",
        },
        {
            title: "Овог, нэр",
            dataIndex: "firstname",
        },
        {
            title: "Утасны дугаар",
            dataIndex: "phone",
        }
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
            //content: 'Some descriptions',
            okText: "Тийм",
            okType: "danger",
            cancelText: "Үгүй",
            onOk() {
                onDelete();
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };

    const onDelete = async () => {
        await api
            .delete(`/api/Volunteer/delete_EmergencyContact?id=${formdata.getFieldValue("id")}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        await api.post(`/api/Volunteer/set_EmergencyContact`, fdata).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setIsModalOpen(false);
                fetchData();
            }
        });
    };

    const getFormData = async (id) => {
        await api
            .get(`/api/Volunteer/get_EmergencyContact?id=${id}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            relationshipid: null,
            firstname: null,
            phone: null,
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
                Гэр бүлийн гишүүний мэдээлэл нэмэх
            </Button>

            <Table
                size="small"
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination
                rowKey={(record) => record.id}
            ></Table>
            <Drawer
                forceRender
                title="Гэр бүлийн гишүүний мэдээлэл нэмэх"
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
                    <Form.Item name="id" hidden={true} />
                    <Form.Item name="volunteerid" hidden={true} />

                    <Form.Item name="relationshipid" label="Таны юу болох">
                        <Select style={{ width: '100%' }}>
                            {relationship?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="firstname" label="Овог нэр">
                        <Input />
                    </Form.Item>

                    <Form.Item name="phone" label="Утасны дугаар">
                        <Input />
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}
