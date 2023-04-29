import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Table,
    Space,
    Button,
    Typography,
    Tag,
    Input,
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
const { Text } = Typography;

export default function Meeting() {
    const { userinfo } = useUserInfo();
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = (isNaN(userinfo.coachid) ? 0 : userinfo.coachid) * 1;
        let districtid = (isNaN(userinfo.districtid) ? 0 : userinfo.districtid) * 1;
        api
            .get(`/api/record/coach/get_meetingattendance_list?coachid=${coachid}&districtid=${districtid}`)
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
            title: "Бүлгийн хурлын огноо",
            dataIndex: "meetingdate",
            ...getColumnSearchProps("meetingdate"),
        },
        {
            title: "Дундын хадгаламжийн бүлгийн нэр",
            dataIndex: "householdgroupname",
            ...getColumnSearchProps("householdgroupname"),
        },
        {
            title: "Дүүрэг",
            dataIndex: "districtname",
            ...getColumnSearchProps("districtname"),
        },
        {
            title: "Хороо",
            dataIndex: "section",
            ...getColumnSearchProps("section"),
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
            title: "Бүлгийн хуралд оролцсон эсэх",
            dataIndex: "isjoin",
            ...getColumnSearchProps("isjoin"),
        },
        {
            title: "Худалдан авсан хувьцааны тоо",
            dataIndex: "quantity",
            ...getColumnSearchProps("quantity"),
        },
        {
            title: "Хуримтлуулсан мөнгөн дүн",
            dataIndex: "famount",
            align: "right",
            ...getColumnSearchProps("famount"),
        },
    ];

    return (
        <div>

            <Table
                size="small"
                bordered
                title={() => (
                    <>
                        <Tag icon={<UserOutlined />} color="magenta">
                            Хурлын ирцийн мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                        </Tag>

                        <CSVLink data={exceldata} filename={"Хурлын ирцийн жагсаалт.csv"}>
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
                pagination={true}
                rowKey={(record) => record.entryid}
                summary={(pageData) => {
                    let totalamount = 0;
                    let totalquantity = 0;
                    pageData.forEach(({ amount, quantity }) => {
                        totalamount += parseFloat(amount);
                        totalquantity += quantity;
                    });
                    totalamount = totalamount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    return (
                        <>
                            <Table.Summary.Row style={{ background: "#fafafa" }}>
                                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} />
                                <Table.Summary.Cell index={2} />
                                <Table.Summary.Cell index={3} />
                                <Table.Summary.Cell index={4} />
                                <Table.Summary.Cell index={5} />
                                <Table.Summary.Cell index={6} />
                                <Table.Summary.Cell index={7}>
                                    <Text>{totalquantity}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={8} align="right">
                                    <Text>{totalamount}</Text>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            ></Table>
        </div>
    );
}
