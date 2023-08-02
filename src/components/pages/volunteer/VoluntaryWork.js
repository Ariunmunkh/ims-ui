import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Modal, Drawer, Space, Form, Button, Input, DatePicker, Select, Divider, } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from 'dayjs';
const { confirm } = Modal;

export default function VoluntaryWork() {
    const { userinfo } = useUserInfo();
    const { volunteerid } = useParams();
    const [griddata, setGridData] = useState();
    const [voluntarywork, setvoluntarywork] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        api.get(`/api/Volunteer/get_VolunteerVoluntaryWork_list?id=${volunteerid ?? userinfo.volunteerid}`)
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
        api.get(`/api/record/base/get_dropdown_item_list?type=voluntarywork`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setvoluntarywork(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const gridcolumns = [
        {
            title: "Сайн дурын ажлын төрөл",
            dataIndex: "voluntarywork",
            ...getColumnSearchProps("voluntarywork"),
        },
        {
            title: "Хугацаа",
            dataIndex: "duration",
            ...getColumnSearchProps("duration"),
        },
        {
            title: "Огноо",
            dataIndex: "voluntaryworkdate",
            ...getColumnSearchProps("voluntaryworkdate"),
        },
        {
            title: "Нэмэлт мэдээлэл",
            dataIndex: "note",
            ...getColumnSearchProps("note"),
        },
        {
            title: "Төлөв",
            dataIndex: "status",
            ...getColumnSearchProps("status"),
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
            .delete(
                `/api/Volunteer/delete_VolunteerVoluntaryWork?id=${formdata.getFieldValue("id")}`
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
        fdata.voluntaryworkdate = fdata.voluntaryworkdate.format('YYYY.MM.DD HH:mm:ss');
        fdata.status = 0;
        await api
            .post(`/api/Volunteer/set_VolunteerVoluntaryWork`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (visitid) => {
        await api
            .get(`/api/Volunteer/get_VolunteerVoluntaryWork?id=${visitid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.voluntaryworkdate = dayjs(fdata.voluntaryworkdate, 'YYYY.MM.DD HH:mm:ss');
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            volunteerid: volunteerid ?? userinfo.volunteerid,
            voluntaryworkid: null,
            duration: null,
            voluntaryworkdate: null,
            note: null,
            status: 0
        });
        showModal();
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current >= dayjs().endOf('day');
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={(e) => newFormData()}
            >
                Сайн дурын ажлын мэдээлэл нэмэх
            </Button>

            <Table
                size="small"
                loading={loading}
                bordered
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                rowKey={(record) => record.visitid}
                pagination={true}
            ></Table>
            <Drawer
                forceRender
                title="Сайн дурын ажлын мэдээлэл нэмэх"
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
                >
                    <Form.Item name="id" hidden={true} />
                    <Form.Item name="volunteerid" hidden={true} />

                    <Form.Item name="voluntaryworkid" label="Сайн дурын ажлын төрөл" rules={[{ required: true, message: 'Сайн дурын ажлын төрөл оруулна уу!' }]}>
                        <Select style={{ width: "100%" }}>
                            {voluntarywork?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="duration" label="Хугацаа">
                        <Input />
                    </Form.Item>

                    <Form.Item name="voluntaryworkdate" label="Огноо">
                        <DatePicker
                            disabledDate={disabledDate}
                            style={{ width: "100%" }}
                            placeholder="Өдөр сонгох" />
                    </Form.Item>

                    <Form.Item name="note" label="Нэмэлт мэдээлэл">
                        <Input.TextArea />
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}
