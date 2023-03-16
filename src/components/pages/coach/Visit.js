import React, { useRef, useState, useEffect, useCallback } from "react";
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
    Tag
} from "antd";
import { ExclamationCircleFilled, SearchOutlined, UserOutlined, DownloadOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";
import Highlighter from "react-highlight-words";

const { confirm } = Modal;

export default function Visit() {
    const { userinfo } = useUserInfo();
    const [coachlist, setcoachlist] = useState([]);
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = userinfo.coachid;
        coachid = coachid || coachid === "" ? "0" : coachid;
        api
            .get(`/api/record/coach/get_householdvisit_list?coachid=${coachid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                    setexceldata(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo]);

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                getFormData(record.visitid);
            },
        };
    };

    useEffect(() => {
        api.get(`/api/record/coach/get_coach_list`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setcoachlist(res?.data?.retdata);
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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
            title: "Айлчилсан огноо",
            dataIndex: "visitdate",
        },
        {
            title: "Дүүрэг",
            dataIndex: "districtname",
        },
        {
            title: "Хороо",
            dataIndex: "section",
        },
        {
            title: "Айлчлалаар уулзсан өрхийн гишүүд",
            dataIndex: "membername",
            ...getColumnSearchProps("membername"),
        },
        {
            title: "Тайлбар",
            dataIndex: "note",
        },
        {
            title: "Айлчилсан хүний нэр",
            dataIndex: "coachname",
            ...getColumnSearchProps("coachname"),
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
                `/api/record/coach/delete_householdvisit?id=${formdata.getFieldValue(
                    "visitid"
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
        fdata.visitdate = fdata.visitdate.format("YYYY.MM.DD HH:mm:ss");
        await api
            .post(`/api/record/coach/set_householdvisit`, fdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const getFormData = async (visitid) => {
        await api
            .get(`/api/record/coach/get_householdvisit?id=${visitid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let fdata = res?.data?.retdata[0];
                    fdata.visitdate = dayjs(fdata.visitdate, "YYYY.MM.DD HH:mm:ss");
                    formdata.setFieldsValue(fdata);
                    showModal();
                }
            });
    };

    const newFormData = async () => {
        formdata.setFieldsValue({
            visitid: 0,
            coachid: userinfo.coachid,
            memberid: null,
            householdid: null,
            visitdate: null,
            note: null,
        });
        showModal();
    };
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <Button
                        style={{ marginBottom: 16 }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={(e) => newFormData()}
                    >
                        Өрхийн айлчлалын мэдээлэл нэмэх
                    </Button>

                    <Table
                        bordered
                        title={() => (
                            <>
                                <Tag icon={<UserOutlined />} color="magenta">
                                    Айлчлалын мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                                </Tag>

                                <CSVLink data={exceldata} filename={"Айлчлалын жагсаалт.csv"}>
                                    <Button type="primary" icon={<DownloadOutlined />} size="small">
                                        Татах
                                    </Button>
                                </CSVLink>
                            </>
                        )}
                        onChange={(pagination, filters, sorter, extra) =>
                            setexceldata(extra.currentDataSource)
                        }
                        loading={loading}
                        columns={gridcolumns}
                        dataSource={griddata}
                        onRow={tableOnRow}
                        pagination={false}
                        rowKey={(record) => record.visitid}
                    ></Table>
                </div>
            </div>

            <Drawer
                forceRender
                title="Өрхийн айлчлалын мэдээлэл нэмэх"
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
                            hidden={formdata.getFieldValue("visitid") === 0}
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
                    <Form.Item name="visitid" hidden={true} />
                    <Form.Item name="householdid" hidden={true} />
                    <Form.Item
                        name="coachid"
                        label="Айлчилсан хүний нэр"
                        hidden={userinfo.coachid !== ""}
                    >
                        <Select style={{ width: "100%" }}>
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="visitdate" label="Айлчилсан огноо">
                        <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
                    </Form.Item>
                    <Form.Item name="memberid" label="Айлчлалаар уулзсан өрхийн гишүүн">
                        <Select style={{ width: "100%" }}>
                            {/* {relationship?.map((t, i) => (
            <Select.Option key={i} value={t.memberid}>
                      {t.name}
                  </Select.Option>
              ))} */}
                        </Select>
                    </Form.Item>
                    <Form.Item name="note" label="Тайлбар">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
