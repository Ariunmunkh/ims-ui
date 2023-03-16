import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Space, Form, Button, DatePicker, Input, Select, Switch, Divider } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
const { confirm } = Modal;
export default function HouseHoldMember() {
    const { householdid } = useParams();
    const nulldata = {
        memberid: 0,
        householdid: householdid,
        name: null,
        relationshipid: null,
        birthdate: null,
        gender: null,
        educationlevel: null,
        employment: null,
        health: null,
        istogether: true,
        isparticipant: false,
    };

    const [griddata, setGridData] = useState();
    const [relationship, setrelationship] = useState([]);
    const [educationdegree, seteducationdegree] = useState([]);
    const [employmentstatus, setemploymentstatus] = useState([]);
    const [healthcondition, sethealthcondition] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/record/households/get_householdmember_list?householdid=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [householdid]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.memberid);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/base/get_relationship_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setrelationship(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=educationdegree`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    seteducationdegree(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=employmentstatus`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setemploymentstatus(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=healthcondition`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethealthcondition(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Өрхийн гишүүний нэр",
            dataIndex: "name",
        },
        {
            title: "Өрхийн тэргүүнтэй ямар хамааралтай болох",
            dataIndex: "relationshipname",
        },
        {
            title: "Төрсөн огноо",
            dataIndex: "birthdate",
        },
        {
            title: "Хүйс",
            dataIndex: "gender",
        },
        {
            title: "Гол оролцогч",
            dataIndex: "isparticipant",
        },
        {
            title: "Боловсролын зэрэг",
            dataIndex: "educationdegree",
        },
        {
            title: "Хөдөлмөр эрхлэлтийн байдал",
            dataIndex: "employmentstatus",
        },
        {
            title: "Эрүүл мэндийн байдал",
            dataIndex: "healthcondition",
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
        await api.delete(`/api/record/households/delete_householdmember?id=${formdata.getFieldValue("memberid")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        debugger;
        let fdata = formdata.getFieldsValue();
        fdata.birthdate = fdata.birthdate.format('YYYY.MM.DD');
        await api
            .post(`/api/record/households/set_householdmember`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (memberid) => {
        await api
            .get(`/api/record/households/get_householdmember?id=${memberid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.birthdate = dayjs(fdata.birthdate, 'YYYY.MM.DD');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue(nulldata);
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
                Өрхийн гишүүн нэмэх
            </Button>

            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                scroll={{ y: '50vh' }}
                rowKey={(record) => record.memberid}
            ></Table>
            <Drawer
                forceRender
                title="Өрхийн гишүүн"
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
                            hidden={formdata.getFieldValue("memberid") === 0}
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
                <Form form={formdata} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} labelAlign="left" labelWrap>
                    <Form.Item name="memberid" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="householdid" label="Өрхийн дугаар" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Өрхийн гишүүний нэр">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="relationshipid"
                        label="Өрхийн тэргүүнтэй ямар хамааралтай болох"
                    >
                        <Select style={{ width: '100%' }}>
                            {relationship?.map((t, i) => (<Select.Option key={i} value={t.relationshipid}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="birthdate" label="Төрсөн огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="gender" label="Хүйс">
                        <Select
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: 0,
                                    label: 'Эрэгтэй',
                                },
                                {
                                    value: 1,
                                    label: 'Эмэгтэй',
                                }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="isparticipant"
                        label="Гол оролцогч эсэх?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="istogether"
                        label="Одоо тантай хамт амьдарч байгаа юу ?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="educationdegreeid" label="Боловсролын зэрэг">
                        <Select style={{ width: '100%' }}>
                            {educationdegree?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="employmentstatusid" label="Хөдөлмөр эрхлэлтийн байдал">
                        <Select style={{ width: '100%' }}>
                            {employmentstatus?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="healthconditionid" label="Эрүүл мэндийн байдал">
                        <Select style={{ width: '100%' }}>
                            {healthcondition?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}
