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
    Switch, Col, Row, Image,
    Input,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;

export default function Training() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [training, settraining] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

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
            title: "Сургалтын төрөл",
            dataIndex: "training",
        },
        {
            title: "Сургалтын нэр",
            dataIndex: "name",
        },
        {
            title: "Зохион байгуулагч",
            dataIndex: "organizer",
        },
        {
            title: "Сургалт эхэлсэн огноо",
            dataIndex: "begindate2",
        },
        {
            title: "Сургалт дууссан огноо",
            dataIndex: "enddate2",
        },
        {
            title: "Сургалтын байршил",
            dataIndex: "location",
        },
        {
            title: "Гэрчилгээтэй эсэх",
            dataIndex: "iscertificate2",
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
        fdata.begindate = fdata.begindate.format("YYYY.MM.DD HH:mm:ss");
        fdata.enddate = fdata.enddate.format("YYYY.MM.DD HH:mm:ss");
        fdata.image = postImage.image;
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
                    fdata.begindate = dayjs(fdata.begindate, "YYYY.MM.DD HH:mm:ss");
                    fdata.enddate = dayjs(fdata.enddate, "YYYY.MM.DD HH:mm:ss");
                    formdata.setFieldsValue(fdata);
                    setPostImage({ ...postImage, image: fdata.image });
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            trainingid: null,
            name: null,
            organizer: null,
            begindate: null,
            enddate: null,
            location: null,
            iscertificate: null
        });
        setPostImage({ ...postImage, image: "" });
        showModal();
    };

    const [imagehidden, setimagehidden] = useState(true);

    const [postImage, setPostImage] = useState({
        volunteerid: volunteerid ?? userinfo.volunteerid, image: "",
    });

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPostImage({ ...postImage, image: base64 });

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
                    onFieldsChange={(changedFields, allFields) => {
                        if (changedFields.length === 1) {
                            if (changedFields[0]?.name[0] === 'iscertificate') {
                                setimagehidden(!changedFields[0].value);
                            }
                        }

                    }}
                >
                    <Form.Item name="id" hidden={true} >
                        <Input />
                    </Form.Item>
                    <Form.Item name="volunteerid" hidden={true} >
                        <Input />
                    </Form.Item>

                    <Form.Item name="trainingid" label="Сургалтын төрөл" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <Select style={{ width: "100%" }}>
                            {training?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="name" label="Сургалтын нэр" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="organizer" label="Зохион байгуулагч" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="begindate" label="Сургалт эхэлсэн огноо" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item name="enddate" label="Сургалт дууссан огноо" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item name="location" label="Сургалтын байршил" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="iscertificate" label="Гэрчилгээтэй эсэх" rules={[{ required: true, message: "Утга оруулна уу!" }]}>
                        <Switch style={{ width: "100%" }} checkedChildren="Тийм" unCheckedChildren="Үгүй" />
                    </Form.Item>

                </Form>

                <Row hidden={imagehidden}>
                    <Col span={8}>Гэрчилгээний зураг:</Col>
                    <Col span={14}>
                        <Space >
                            <Space.Compact direction="vertical">
                                <Image
                                    width={200}
                                    src={postImage.image}
                                />

                                <input
                                    type="file"
                                    label="Image"
                                    name="myFile"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={(e) => handleFileUpload(e)}
                                />

                            </Space.Compact>
                        </Space>
                    </Col>
                </Row>

            </Drawer>
        </div>
    );
}
