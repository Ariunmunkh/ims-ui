import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Modal, Drawer, Form, Space, Button, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import useUserInfo from "../../system/useUserInfo";
const { confirm } = Modal;
export default function PrimaryStageInfo() {

    const { userinfo } = useUserInfo();
    const location = useLocation();
    const { committeeid } = location.state || {};
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);
    const [formtitle] = useState('Анхан шатны хороодын мэдээлэл');
    const [formdata] = Form.useForm();

    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/Committee/get_primarystageinfo_list?committeeid=${committeeid || userinfo.committeeid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [committeeid, userinfo.committeeid]);

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
            title: "Анхан шатны хорооны нэр",
            dataIndex: "c4_1",
            ...getColumnSearchProps("c4_1"),
        },
        {
            title: "Анхан шатны хорооны байгуулагдсан огноо",
            dataIndex: "c4_2",
            ...getColumnSearchProps("c4_2"),
        },
        {
            title: "СУМ/ХОРОО",
            dataIndex: "c4_3_1",
            ...getColumnSearchProps("c4_3_1"),
        },
        {
            title: "БАЙГУУЛЛАГА/ААН",
            dataIndex: "c4_3_2",
            ...getColumnSearchProps("c4_3_2"),
        },
        {
            title: "Тэргүүний овог, нэр",
            dataIndex: "c4_4",
            ...getColumnSearchProps("c4_4"),
        },
        {
            title: "Холбогдох утасны дугаар",
            dataIndex: "c4_5",
            ...getColumnSearchProps("c4_5"),
        },
        {
            title: "Нарийн бичгийн даргын овог, нэр",
            dataIndex: "c4_6",
            ...getColumnSearchProps("c4_6"),
        },
        {
            title: "Холбогдох утасны дугаар",
            dataIndex: "c4_7",
            ...getColumnSearchProps("c4_7"),
        },
        {
            title: "Энгийн гишүүн",
            dataIndex: "c4_8_1",
            ...getColumnSearchProps("c4_8_1"),
        },
        {
            title: "Онцгой гишүүн",
            dataIndex: "c4_8_2",
            ...getColumnSearchProps("c4_8_2"),
        },
        {
            title: "Мөнгөн гишүүн",
            dataIndex: "c4_8_3",
            ...getColumnSearchProps("c4_8_3"),
        },
        {
            title: "Алтан гишүүн",
            dataIndex: "c4_8_4",
            ...getColumnSearchProps("c4_8_4"),
        },
        {
            title: "Хүмүүнлэгийн гишүүн байгууллагын тоо",
            dataIndex: "c4_9",
            ...getColumnSearchProps("c4_9"),
        },
        {
            title: "Сайн дурын идэвхтний тоо",
            dataIndex: "c4_10",
            ...getColumnSearchProps("c4_10"),
        },
        {
            title: "Хүүхэд залуучуудын гишүүний тоо",
            dataIndex: "c4_11",
            ...getColumnSearchProps("c4_11"),
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
                `/api/Committee/delete_primarystageinfo?id=${formdata.getFieldValue("id")}`
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
            .post(`/api/Committee/set_primarystageinfo`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (id) => {
        await api.get(`/api/Committee/get_primarystageinfo?id=${id}`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                formdata.setFieldsValue(res?.data?.retdata);
                showModal();
            }
        });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            id: 0,
            committeeid: committeeid || userinfo.committeeid,
            c4_1: null,
            c4_2: null,
            c4_3_1: null,
            c4_3_2: null,
            c4_4: null,
            c4_5: null,
            c4_6: null,
            c4_7: null,
            c4_8_1: null,
            c4_8_2: null,
            c4_8_3: null,
            c4_8_4: null,
            c4_9: null,
            c4_10: null,
            c4_11: null,
        });
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

                    <Form.Item name="committeeid" label="ДШХ" hidden={true} >
                        <Input />
                    </Form.Item>

                    <Form.Item name="c4_1" label="Анхан шатны хорооны нэр" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_2" label="Анхан шатны хорооны байгуулагдсан огноо" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_3_1" label="СУМ/ХОРОО" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_3_2" label="БАЙГУУЛЛАГА/ААН" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_4" label="Тэргүүний овог, нэр" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_5" label="Холбогдох утасны дугаар" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_6" label="Нарийн бичгийн даргын овог, нэр" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_7" label="Холбогдох утасны дугаар" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_8_1" label="Энгийн гишүүн" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_8_2" label="Онцгой гишүүн" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_8_3" label="Мөнгөн гишүүн" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_8_4" label="Алтан гишүүн" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_9" label="Хүмүүнлэгийн гишүүн байгууллагын тоо" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_10" label="Сайн дурын идэвхтний тоо" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="c4_11" label="Хүүхэд залуучуудын гишүүний тоо" >
                        <Input />
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    );
}

