import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Table,
    Modal,
    Tag,
    Drawer,
    Space,
    Form,
    Button,
    DatePicker,
    Select,
    Input,
    Divider,
} from "antd";
import {
    ExclamationCircleFilled,
    PlusOutlined,
    SearchOutlined,
    DownloadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
const { confirm } = Modal;

export default function Contact() {
    const { userinfo } = useUserInfo();
    const [household, sethousehold] = useState([]);
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formdata] = Form.useForm();
    const [mediatedservicetype, setmediatedservicetype] = useState([]);
    const [intermediaryorganization, setintermediaryorganization] = useState([]);
    const [proxyservice, setproxyservice] = useState([]);

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = userinfo.coachid;
        coachid = coachid || coachid === "" ? "0" : coachid;
        api
            .get(`/api/record/coach/get_mediatedactivity_list?coachid=${coachid}`)
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
                getFormData(record.entryid);
            },
        };
    };

    useEffect(() => {
        api
            .get(`/api/record/households/get_householdmember_list?householdid=1`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethousehold(res?.data?.retdata);
                }
            });
        api
            .get(`/api/record/base/get_dropdown_item_list?type=mediatedservicetype`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setmediatedservicetype(res?.data?.retdata);
                }
            });
        api
            .get(
                `/api/record/base/get_dropdown_item_list?type=intermediaryorganization`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setintermediaryorganization(res?.data?.retdata);
                }
            });
        api
            .get(`/api/record/base/get_dropdown_item_list?type=proxyservice`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setproxyservice(res?.data?.retdata);
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
            title: "Огноо",
            dataIndex: "mediateddate",
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
            title: "Холбон зуучилсан үйлчилгээний төрөл",
            dataIndex: "mediatedservicetype",
            ...getColumnSearchProps("mediatedservicetype"),
        },
        {
            title: "Холбон зуучилсан байгууллагын нэр",
            dataIndex: "intermediaryorganization",
            ...getColumnSearchProps("intermediaryorganization"),
        },
        {
            title: "Холбон зуучилсан үйлчилгээний нэр",
            dataIndex: "proxyservice",
            ...getColumnSearchProps("proxyservice"),
        },
        {
            title: "Үйлчилгээнд холбогдсон өрхийн гишүүний нэр",
            dataIndex: "membername",
            ...getColumnSearchProps("membername"),
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
                `/api/record/coach/delete_mediatedactivity?id=${formdata.getFieldValue(
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
            householdid: null,
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
                bordered
                title={() => (
                    <>
                        <Tag icon={<UserOutlined />} color="magenta">
                            Холбон зуучлалын мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                        </Tag>

                        <CSVLink data={exceldata} filename={"Холбон жагсаалт.csv"}>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="small"
                            >
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
                    <Form.Item
                        name="mediatedservicetypeid"
                        label="Холбон зуучилсан үйлчилгээний төрөл"
                    >
                        <Select style={{ width: "100%" }}>
                            {mediatedservicetype?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="intermediaryorganizationid"
                        label="Холбон зуучилсан  байгууллагын нэр"
                    >
                        <Select style={{ width: "100%" }}>
                            {intermediaryorganization?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="proxyserviceid"
                        label="Холбон зуучилсан үйлчилгээний нэр"
                    >
                        <Select style={{ width: "100%" }}>
                            {proxyservice?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="memberid"
                        label="Үйлчилгээнд холбогдсон өрхийн гишүүний нэр"
                    >
                        <Select style={{ width: "100%" }}>
                            {household?.map((t, i) => (
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
