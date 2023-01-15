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
    DatePicker,
    Select,
    Divider,
} from "antd";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;

export default function Contact() {
    const { userinfo } = useUserInfo();
    const { householdid } = useParams();
    const [household, sethousehold] = useState([]);
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [mediatedservicetype, setmediatedservicetype] = useState([]);
    const [intermediaryorganization, setintermediaryorganization] = useState([]);
    const [proxyservice, setproxyservice] = useState([]);

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/record/coach/get_mediatedactivity_list?id=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });

        api.get(`/api/record/households/get_householdmember_list?householdid=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethousehold(res?.data?.retdata);
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
        api.get(`/api/record/base/get_dropdown_item_list?type=mediatedservicetype`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setmediatedservicetype(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=intermediaryorganization`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setintermediaryorganization(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=proxyservice`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setproxyservice(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Огноо",
            dataIndex: "mediateddate",
        },
        {
            title: "Холбон зуучилсан үйлчилгээний төрөл",
            dataIndex: "mediatedservicetype",
        },
        {
            title: "Холбон зуучилсан байгууллагын нэр",
            dataIndex: "intermediaryorganization",
        },
        {
            title: "Холбон зуучилсан үйлчилгээний нэр",
            dataIndex: "proxyservice",
        },
        {
            title: "Үйлчилгээнд холбогдсон өрхийн гишүүний нэр",
            dataIndex: "membername",
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
            .delete(`/api/record/coach/delete_mediatedactivity?id=${formdata.getFieldValue("entryid")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const onFinish = async (values) => {
        let fdata = formdata.getFieldsValue();
        fdata.mediateddate = fdata.mediateddate.format("YYYY.MM.DD HH:mm:ss");
        await api
            .post(`/api/record/coach/set_mediatedactivity`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (entryid) => {
        await api
            .get(`/api/record/coach/get_mediatedactivity?id=${entryid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.mediateddate = dayjs(fdata.mediateddate, "YYYY.MM.DD HH:mm:ss");
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            entryid: 0,
            memberid: null,
            householdid: householdid,
            mediateddate: null,
            mediatedservicetypeid: null,
            intermediaryorganizationid: null,
            proxyserviceid: null,
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
                Холбон зуучилсан үйл ажиллагааны мэдээлэл нэмэх
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
                title="Холбон зуучилсан үйл ажиллагааны мэдээлэл нэмэх"
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
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 14 }}
                    labelAlign="left"
                    labelWrap
                >
                    <Form.Item name="entryid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item name="mediateddate" label="Огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="mediatedservicetypeid" label="Холбон зуучилсан үйлчилгээний төрөл">
                        <Select style={{ width: '100%' }}>
                            {mediatedservicetype?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="intermediaryorganizationid" label="Холбон зуучилсан  байгууллагын нэр">
                        <Select style={{ width: '100%' }}>
                            {intermediaryorganization?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="proxyserviceid" label="Холбон зуучилсан үйлчилгээний нэр">
                        <Select style={{ width: '100%' }}>
                            {proxyservice?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="memberid" label="Үйлчилгээнд холбогдсон өрхийн гишүүний нэр">
                        <Select style={{ width: "100%" }}>
                            {household?.map((t, i) => (<Select.Option key={i} value={t.memberid}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
