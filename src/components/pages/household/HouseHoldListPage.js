import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Button, Tag } from "antd";
import {
    Drawer,
    Space,
    Form,
    Input,
    Select,
    InputNumber,
    Typography,
    Row,
    Col,
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
const { Text } = Typography;

export default function HouseHoldListPage() {
    const navigate = useNavigate();
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [status, setstatus] = useState(1);
    const [group, setgroup] = useState(0);
    const [loading, setLoading] = useState(false);
    const { userinfo } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formdata] = Form.useForm();
    const [districtlist, setdistrictlist] = useState([]);
    const [districtFilter, setdistrictlistFilter] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [householdstatus, sethouseholdstatus] = useState([]);
    const [householdgroup, sethouseholdgroup] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        let coachid = userinfo.coachid;
        coachid = coachid || coachid === "" ? "0" : coachid;
        await api
            .get(
                `/api/record/households/get_household_list?coachid=${coachid}&status=${status}&group=${group === undefined ? 0 : group
                }`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                    setexceldata(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo, status, group]);

    useEffect(() => {
        api.get(`/api/record/base/get_district_list`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setdistrictlist(res?.data?.retdata);
                let tdata = [];
                for (let i = 0; i < res?.data?.retdata.length; i++) {
                    tdata.push({
                        text: res?.data?.retdata[i].name,
                        value: res?.data?.retdata[i].name,
                    });
                }
                setdistrictlistFilter(tdata);
                console.log(tdata);
            }
        });
        api.get(`/api/record/coach/get_coach_list`).then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setcoachlist(res?.data?.retdata);
            }
        });
        api
            .get(`/api/record/base/get_dropdown_item_list?type=householdstatus`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethouseholdstatus(res?.data?.retdata);
                }
            });
        api
            .get(`/api/record/base/get_dropdown_item_list?type=householdgroup`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    sethouseholdgroup(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const groupchange = (householdgroupid, householdid) => {
        const tdata = [...griddata];
        const found = tdata.find((a) => a.householdid === householdid);
        if (found) found.householdgroupid = householdgroupid;

        setGridData(tdata);

        api.post(
            `/api/record/households/set_household_group?householdid=${householdid}&householdgroupid=${householdgroupid}`
        );
    };

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
            title: "Өрхийн статус",
            dataIndex: "householdstatus",
            render: (text, record, index) => {
                return (
                    <Button
                        type="link"
                        onClick={() => navigate(`/household/${record.householdid}`)}
                    >
                        {text}
                    </Button>
                );
            },
        },
        {
            title: "Бүлэг",
            dataIndex: "householdgroupid",
            render: (text, record, index) => {
                return (
                    <Select
                        style={{ width: 275 }}
                        bordered={false}
                        value={record?.householdgroupid}
                        onChange={(value) => groupchange(value, record.householdid)}
                    >
                        {householdgroup?.map((t, i) => (
                            <Select.Option key={i} value={t.id}>
                                {t.name}
                            </Select.Option>
                        ))}
                    </Select>
                );
            },
        },
        {
            title: "Ам бүлийн тоо",
            dataIndex: "numberof",
        },
        {
            title: "Өрхийн тэргүүний нэр",
            dataIndex: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Дүүрэг",
            dataIndex: "districtname",
            filters: districtFilter,
            onFilter: (value, record) => record.districtname.indexOf(value) === 0,
        },
        {
            title: "Хороо",
            dataIndex: "section",
            ...getColumnSearchProps("section"),
        },
        {
            title: "Хаяг",
            dataIndex: "address",
            ...getColumnSearchProps("address"),
        },
        {
            title: "Утас",
            dataIndex: "phone",
            ...getColumnSearchProps("phone"),
        },
    ];

    const newFormData = async () => {
        formdata.setFieldsValue({
            householdid: 0,
            status: null,
            numberof: 0,
            name: null,
            districtid: null,
            section: null,
            address: null,
            phone: null,
            coachid: userinfo.coachid,
        });
        showModal();
    };
    let content = [];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        await api
            .post(`/api/record/households/set_household`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setIsModalOpen(false);
                    fetchData();
                }
            });
    };

    const changeStatus = async (value) => {
        setstatus(value);
    };
    const changeGroup = async (value) => {
        setgroup(value);
    };

    return (
        <>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={2}>
                    <Button type="primary" onClick={(e) => newFormData()}>
                        Шинэ
                    </Button>
                </Col>
                <Col>
                    <Text>Өрхийн статус</Text>
                </Col>
                <Col>
                    <Select
                        defaultValue={1}
                        onChange={(value) => changeStatus(value)}
                        style={{ width: "200px" }}
                    >
                        {householdstatus?.map((t, i) => (
                            <Select.Option key={i} value={t.id}>
                                {t.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Text>Бүлэг</Text>
                </Col>
                <Col>
                    <Select
                        onChange={(value) => changeGroup(value)}
                        allowClear
                        style={{ width: "200px" }}
                    >
                        {householdgroup?.map((t, i) => (
                            <Select.Option key={i} value={t.id}>
                                {t.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Drawer
                forceRender
                title="Өрхийн мэдээлэл"
                open={isModalOpen}
                width={720}
                onClose={handleCancel}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
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
                    <Form.Item name="householdid" label="Өрхийн дугаар" >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="numberof" label="Ам бүлийн тоо" hidden={true} />
                    <Form.Item name="name" label="Өрхийн тэргүүний нэр" hidden={true} />
                    <Form.Item name="status" label="Өрхийн статус">
                        <Select style={{ width: "100%" }}>
                            {householdstatus?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="districtid" label="Дүүрэг">
                        <Select style={{ width: "100%" }}>
                            {districtlist?.map((t, i) => (
                                <Select.Option key={i} value={t.districtid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="section" label="Хороо">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="address" label="Хаяг">
                        <Input.TextArea style={{ width: "100%" }} placeholder="Хаяг" />
                    </Form.Item>
                    <Form.Item name="phone" label="Утас">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="coachid"
                        label="Хариуцсан коучийн нэр"
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
                </Form>
            </Drawer>
            <div className="row">
                <div className="col-md-12">
                    <Table
                        bordered
                        title={() => (
                            <>
                                <Tag icon={<UserOutlined />} color="magenta">
                                    Өрхийн мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                                </Tag>

                                <CSVLink data={exceldata} filename={"Өрхийн жагсаалт.csv"}>
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
                        dataSource={userinfo.roleid === "1" ? griddata : content}
                        pagination={true}
                        rowKey={(record) => record.householdid}
                    ></Table>
                </div>
            </div>
        </>
    );
}
