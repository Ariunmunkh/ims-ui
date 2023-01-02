import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Modal, Drawer, Space, Form, Button, Input, DatePicker, Select, Divider, InputNumber, Switch, } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;

const orgList = [
    "Монголын улаан загалмай нийгэмлэг",
    "Гэр бүл хүүхэд залуучуудын хөгжлийн хэлтэс",
    "Эрүүл мэндийн төв",
  ];

export default function Training() {
    const { userinfo } = useUserInfo();
    const { householdid } = useParams();
    const [relationship, setrelationship] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api
            .get(`/api/record/coach/get_training_list?id=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        api
            .get(
                `/api/record/households/get_householdmember_list?householdid=${householdid}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setrelationship(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }, [householdid]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.entryid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Огноо",
            dataIndex: "trainingdate",
        },
        {
            title: "Зохион байгуулагдсан сургалт, үйл ажиллагааны нэр",
            dataIndex: "name",
        },
        {
            title: "Сургалт, үйл ажиллагаа зохион байгуулсан байгууллагын нэр",
            dataIndex: "orgname",
        },
        {
            title: "Сургалтын үргэжилсэн хугацаа",
            dataIndex: "duration",
        },
        {
            title: "Өрхөөс уг сургалтад хамрагдсан эсэх",
            dataIndex: "isjoin",
        },
        {
            title: "Сургалт, үйл ажиллагаанд хамрагдсан өрхийн гишүүний нэр",
            dataIndex: "memberid",
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
            .delete(
                `/api/record/coach/delete_training?id=${formdata.getFieldValue(
                    "entryid"
                )}`
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
        fdata.trainingdate = fdata.trainingdate.format('YYYY.MM.DD HH:mm:ss');
        await api
            .post(`/api/record/coach/set_training`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (entryid) => {
        await api
            .get(`/api/record/coach/get_training?id=${entryid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.trainingdate = dayjs(fdata.trainingdate, 'YYYY.MM.DD HH:mm:ss');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            entryid: 0,
            householdid: householdid,
            trainingdate: null,
            name: null,
            orgname: null,
            duration: null,
            isjoin: null,
            coachid: userinfo.coachid,
            memberid: null,
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
                Сургалт, үйл ажиллагааны мэдээлэл нэмэх
            </Button>

            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.entryid}
            ></Table>
            <Drawer
                forceRender
                title="Сургалт, үйл ажиллагааны мэдээлэл нэмэх"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                centered
                bodyStyle={{ paddingBottom: 80, }}
                extra={
                    <Space>
                        <Button
                            key="delete"
                            danger
                            onClick={showDeleteConfirm}
                            hidden={formdata.getFieldValue("entryid") === 0}
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
                    <Form.Item name="entryid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item name="trainingdate" label="Огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="name" label="Зохион байгуулагдсан сургалт, үйл ажиллагааны нэр">
                        {/* <Select style={{ width: "100%" }}>
                            {relationship?.map((t, i) => (
                                <Select.Option key={i} value={t.memberid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select> */}
                        <Input/>
                    </Form.Item>
                    <Form.Item name="orgname" label="Сургалт, үйл ажиллагаа зохион байгуулсан байгууллагын нэр">
                        <Select style={{ width: "100%" }}>
                            {orgList?.map((t, i) => (
                                <Select.Option key={i} value={t}>
                                    {t}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="duration" label="Сургалтын үргэжилсэн хугацаа">
                        <InputNumber placeholder="Хугацаа" min={0}  style={{ width: "100%" }}/>                
                    </Form.Item>
                    <Form.Item
                        name="isjoin"
                        label="Өрхөөс уг сургалтад хамрагдсан эсэх"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Тийм"
                            unCheckedChildren="Үгүй"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item name="memberid" label="Сургалт, үйл ажиллагаанд хамрагдсан өрхийн гишүүний нэр">
                        <Select style={{ width: "100%" }}>
                            {relationship?.map((t, i) => (
                                <Select.Option key={i} value={t.memberid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                
                </Form>
            </Drawer>
        </div>
    );
}
