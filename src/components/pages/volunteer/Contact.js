import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
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
} from "antd";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;

export default function Contact() {
    const { householdid } = useParams();
    const [household, sethousehold] = useState([]);
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [mediatedservicetype, setmediatedservicetype] = useState([]);
    const [intermediaryorganization, setintermediaryorganization] = useState([]);
    const [proxyservice, setproxyservice] = useState([]);
    const [proxyservicecopy, setproxyservicecopy] = useState([]);

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

    }, [householdid]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.entryid);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/households/get_householdmember_list?householdid=${householdid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethousehold(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=mediatedservicetype`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setmediatedservicetype(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=intermediaryorganization`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setintermediaryorganization(res?.data?.retdata);
                }
            });
        api.get(`/api/record/base/get_dropdown_item_list?type=proxyservice`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setproxyservice(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData, householdid]);

    const gridcolumns = [
        {
            title: "Үйлчилгээний төрөл",
            dataIndex: "mediatedservicetype",
        },
        {
            title: "Үйлчилгээний нэр",
            dataIndex: "proxyservice",
        },
        {
            title: "Үйлчилгээ үзүүлсэн байгууллага / ажилтан",
            dataIndex: "intermediaryorganization",
        },
        {
            title: "Үйлчилгээ авсан огноо",
            dataIndex: "mediateddate",
        },
        {
            title: "Үйлчилгээ авсан өрхийн гишүүний нэр",
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
                size="small"
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
                    onFieldsChange={(changedFields, allFields) => {

                        if (changedFields[0]?.name[0] === 'mediatedservicetypeid') {
                            formdata.setFieldValue('proxyserviceid', null);
                            setproxyservicecopy(proxyservice?.filter(row => row?.mediatedservicetypeid === formdata?.getFieldValue("mediatedservicetypeid")))
                        }

                    }}
                >
                    <Form.Item name="entryid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item name="mediatedservicetypeid" label="Үйлчилгээний төрөл">
                        <Select style={{ width: '100%' }}>
                            {mediatedservicetype?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="proxyserviceid" label="Үйлчилгээний нэр">
                        <Select style={{ width: '100%' }}>
                            {proxyservicecopy?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="intermediaryorganizationid" label="Үйлчилгээ үзүүлсэн байгууллага / ажилтан ">
                        <Select style={{ width: '100%' }}>
                            {intermediaryorganization?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="mediateddate" label="Үйлчилгээ авсан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item name="memberid" label="Үйлчилгээ авсан өрхийн гишүүний нэр">
                        <Select style={{ width: "100%" }}>
                            {household?.map((t, i) => (<Select.Option key={i} value={t.memberid}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}