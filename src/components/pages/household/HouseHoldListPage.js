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
    Switch,
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
    const [isactive, setisactive] = useState(0);
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
        let coachid = (isNaN(userinfo.coachid) ? 0 : userinfo.coachid) * 1;
        let districtid = (isNaN(userinfo.districtid) ? 0 : userinfo.districtid) * 1;
        await api
            .get(
                `/api/record/households/get_household_list?coachid=${coachid}&districtid=${districtid}&status=${status}&group=${isNaN(group) ? 0 : group}&isactive=${isNaN(isactive) ? 0 : isactive}`
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
    }, [userinfo, status, group, isactive]);

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

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                navigate(`/household/${record.householdid}`)
            },
        };
    };

    const gridcolumns = [
        {
            title: "Өрхийн дугаар",
            dataIndex: "householdid",
            ...getColumnSearchProps("householdid"),
        },
        {
            title: "Ам бүлийн тоо",
            dataIndex: "numberof",
            ...getColumnSearchProps("numberof"),
        },
        {
            title: "Өрхийн тэргүүний регистр",
            dataIndex: "headregno",
            ...getColumnSearchProps("headregno"),
        },
        {
            title: "Өрхийн тэргүүний нэр",
            dataIndex: "headname",
            ...getColumnSearchProps("headname"),
        },
        {
            title: "Өрхийн тэргүүний нас",
            dataIndex: "headage",
            ...getColumnSearchProps("headage"),
        },
        {
            title: "ХЭБ-д бүртгэлтэй тэргүүнтэй холбогдох хамаарал",
            dataIndex: "xebrelationship",
            ...getColumnSearchProps("xebrelationship"),
        },
        {
            title: "ХЭБ-д бүртгэлтэй тэргүүний регистр",
            dataIndex: "xebregno",
            ...getColumnSearchProps("xebregno"),
        },
        {
            title: "ХЭБ-д бүртгэлтэй тэргүүний нэр",
            dataIndex: "xebname",
            ...getColumnSearchProps("xebname"),
        },
        {
            title: "Гол оролцогч гишүүний регистр",
            dataIndex: "regno",
            ...getColumnSearchProps("regno"),
        },
        {
            title: "Гол оролцогч гишүүний нэр",
            dataIndex: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Гол оролцогч гишүүний нас",
            dataIndex: "age",
            ...getColumnSearchProps("age"),
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
        {
            title: "Идэвхгүй өрхийн шалтгаан",
            dataIndex: "reason",
            ...getColumnSearchProps("reason"),
        },
    ];

    const newFormData = async () => {
        formdata.setFieldsValue({
            householdid: 0,
            status: null,
            isactive: true,
            reason: null,
            numberof: 0,
            name: null,
            districtid: null,
            section: null,
            address: null,
            latitude: null,
            longitude: null,
            phone: null,
            isnew: true,
            householdgroupid: null,
            coachid: userinfo.coachid,
        });
        showModal();
    };

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

                    navigate(`/household/${res?.data?.retdata}`)
                }
            });
    };

    const changeStatus = async (value, type) => {
        if (type === 'status')
            setstatus(value);
        else
            setisactive(value)
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
                        onChange={(value) => changeStatus(value, 'status')}
                        style={{ width: "200px" }}
                    >
                        {householdstatus?.map((t, i) => (
                            <Select.Option key={i} value={t.id}>
                                {t.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue={1}
                        onChange={(value) => changeStatus(value, 'isactive')}
                        style={{ width: "200px" }}
                    >
                        <Select.Option key={0} value={0}>
                            {"Бүгд"}
                        </Select.Option>
                        <Select.Option key={1} value={1}>
                            {"Идэвхитэй"}
                        </Select.Option>
                        <Select.Option key={2} value={2}>
                            {"Идэвхигүй/хасагдах шалтгаантай өрх"}
                        </Select.Option>
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
                    <Form.Item
                        name="isactive"
                        label="Идэвхитэй эсэх?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="reason" label="Шалтгаан">
                        <Input.TextArea />
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
                    <Form.Item name="latitude" label="Өргөрөг/Latitude/" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="longitude" label="Уртраг/longitude/" >
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Утас">
                        <Input />
                    </Form.Item>
                    <Form.Item name="isnew" label="Шинэ" hidden={true}>
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
                    <Form.Item
                        name="householdgroupid"
                        label="Дундын хадгаламжийн бүлэг"
                    >
                        <Select style={{ width: "100%" }}>
                            {householdgroup?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
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
                        onRow={tableOnRow}
                        dataSource={griddata}
                        pagination={true}
                        rowKey={(record) => record.householdid}
                    ></Table>
                </div>
            </div>
        </>
    );
}
