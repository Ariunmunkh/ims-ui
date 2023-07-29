import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import TextArea from "antd/es/input/TextArea";
const { confirm } = Modal;
export default function Project() {

    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formtitle] = useState('Хэрэгжүүлж буй төсөл, хөтөлбөр');
    const [formdata] = Form.useForm();
    const [program, setprogram] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/record/base/get_Project_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=program`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setprogram(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.id);
            },
        };
    };

    useEffect(() => {
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
            title: "Хөтөлбөр",
            dataIndex: "programid",
            ...getColumnSearchProps("programid"),
        },
        {
            title: "Төслийн нэр",
            dataIndex: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Санхүүжүүлэгч",
            dataIndex: "funder",
            ...getColumnSearchProps("funder"),
        },
        {
            title: "Төслийн товч мэдээлэл, зорилтот бүлэг, хүрэх үр дүн",
            dataIndex: "note",
        },
        {
            title: "Хүрсэн үр дүн ",
            dataIndex: "results",
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
                `/api/record/base/delete_Project?id=${formdata.getFieldValue("id")}`
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
            .post(`/api/record/base/set_Project`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/record/base/get_Project?id=${id}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata[0]);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({ id: 0, name: null });
        showModal();
    };


    return (
        <div>
            <Button
                style={{ marginBottom: 16 }}
                icon={<PlusOutlined />}
                type="primary"
                onClick={(e) => newFormData()}
            >
                {`${formtitle} нэмэх`}
            </Button>

            <Table
                size="small"
                title={() => formtitle}
                bordered
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={true}
                rowKey={(record) => record.id}
            ></Table>

            <Drawer
                forceRender
                title={formtitle}
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
                >
                    <Form.Item name="id" label="Дугаар" hidden={true}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="programid" label="Хөтөлбөр" rules={[{ required: true }]}>
                        <Select style={{ width: "100%" }}>
                            {program?.map((t, i) => (<Select.Option key={i} value={t.id}>{t.name}</Select.Option>))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="name" label="Төслийн нэр" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="funder" label="Санхүүжүүлэгч" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="note" label="Төслийн товч мэдээлэл" rules={[{ required: true }]}>
                        <TextArea />
                    </Form.Item>
                    <Form.Item name="results" label="Хүрсэн үр дүн" >
                        <Input />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}

