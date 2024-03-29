import React, { useRef, useState, useEffect } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { confirm } = Modal;
export default function UserListPage() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [committee, setcommittee] = useState([]);
    const [rolelist] = useState([
        {
            value: 1,
            text: "Admin",
            label: "Admin",
        },
        {
            value: 2,
            text: "Sub-admin",
            label: "Sub-admin",
        },
        {
            value: 3,
            text: "Coach",
            label: "Coach",
        },
        {
            value: 4,
            text: "Others",
            label: "Others",
        },
        {
            value: 5,
            text: "Volunteer",
            label: "Volunteer",
        },
    ]);

    const fetchData = async () => {
        setLoading(true);

        await api.get(`/api/record/base/get_dropdown_item_list?type=committee`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setcommittee(res?.data?.retdata);
                }
            });
        await api
            .get(`/api/systems/User/get_user_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.userid);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            title: "Үүрэг",
            dataIndex: "roleid",
            render: (text, record, index) => {
                return (
                    <Select
                        value={record?.roleid}
                        disabled
                        bordered={false}
                        options={rolelist}
                    />
                );
            },

            filters: rolelist,
            onFilter: (value, record) => record.roleid === value,
        },
        {
            title: "Дунд шатны хороо",
            dataIndex: "committeename",
            ...getColumnSearchProps("committeename"),
        },
        {
            title: "Нэвтрэх нэр",
            dataIndex: "username",
            ...getColumnSearchProps("username"),
        },
        {
            title: "Имэйл",
            dataIndex: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Огноо",
            dataIndex: "updated",
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
                `/api/systems/User/delete_user?userid=${formdata.getFieldValue(
                    "userid"
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
        await api
            .post(`/api/systems/User/set_user`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    
                    fetchData();
                }
            });
    };

    const getFormData = async (userid) => {
        await api.get(`/api/systems/User/get_user?userid=${userid}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                formdata.setFieldValue('password', null);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue(
            {
                userid: 0,
                roleid: 1,
                committeeid: null,
                volunteerid: null,
                username: null,
                email: null,
                password: null,
            });
        showModal();
    };

    const roleidChange = (value) => {
        formdata.setFieldValue("coachid", null);
    };

    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={(e) => newFormData()}
            >
                Хэрэглэгч нэмэх
            </Button>

            <Table
                size="small"
                title={() => `Бүртгэлтэй хэрэглэгчийн жагсаалт:`}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.userid}
            ></Table>

            <Drawer
                forceRender
                title="Хэрэглэгч нэмэх"
                width={720}
                onClose={handleCancel}
                open={isModalOpen}
                bodyStyle={{ paddingBottom: 80, }}
                extra={
                    <Space>
                        <Button
                            key="delete"
                            danger
                            onClick={showDeleteConfirm}
                            hidden={formdata.getFieldValue("userid") === 0}
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
                >
                    <Form.Item name="userid" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>
                    
                    <Form.Item name="committeeid" label="Дунд шатны хороо" >
                        <Select style={{ width: "100%" }}>
                            {committee?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="roleid" label="Үүрэг" rules={[{ required: true }]}>
                        <Select
                            onChange={roleidChange}
                            style={{ width: 275 }}
                            options={rolelist}
                        />
                    </Form.Item>

                    <Form.Item name="volunteerid" label="Сайн дурын идэвхтэн" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Нэвтрэх нэр"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Имэйл"
                        rules={[{ required: true, type: "email" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Нууц үг">
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}
