import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Table,
    Space,
    Button,
    Input,
    Tag
} from "antd";
import { SearchOutlined, UserOutlined, DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import Highlighter from "react-highlight-words";


export default function Visit() {
    const { userinfo } = useUserInfo();
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = (isNaN(userinfo.coachid) ? 0 : userinfo.coachid) * 1;
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
            title: "Айлчилсан огноо",
            dataIndex: "visitdate",
            ...getColumnSearchProps("visitdate"),
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
            title: "Айлчлалаар уулзсан өрхийн гишүүд",
            dataIndex: "membername",
            ...getColumnSearchProps("membername"),
        },
        {
            title: "Хэлэлцсэн асуудал",
            dataIndex: "note",
            ...getColumnSearchProps("note"),
        },
        {
            title: "Шийдвэрлэсэн байдал, авах арга хэмжээ",
            dataIndex: "decisionandaction",
            ...getColumnSearchProps("decisionandaction"),
        },
        {
            title: "Үндсэн хэрэгцээ",
            dataIndex: "mediatedservicetypename",
            ...getColumnSearchProps("mediatedservicetypename"),
        },
        {
            title: "Орлого, зарлагын бүртгэлээ тогтмол хөтөлсөн",
            dataIndex: "incomeexpenditurerecord",
            filters: [{ text: "Тийм", value: "Тийм" }, { text: "Үгүй", value: "Үгүй" }, { text: "Хоосон", value: "Хоосон" }],
            onFilter: (value, record) => record.incomeexpenditurerecord.indexOf(value) === 0,
        },
        {
            title: "Өрхийн хөгжлийн төлөвлөгөө боловсруулсан эсэх",
            dataIndex: "developmentplan",
            filters: [{ text: "Тийм", value: "Тийм" }, { text: "Үгүй", value: "Үгүй" }, { text: "Хоосон", value: "Хоосон" }],
            onFilter: (value, record) => record.developmentplan.indexOf(value) === 0,
        },
        {
            title: "Айлчилсан хүний нэр",
            dataIndex: "coachname",
            ...getColumnSearchProps("coachname"),
        },
    ];

    return (
        <>
            <div className="row">
                <div className="col-md-12">

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
                        pagination={false}
                        rowKey={(record) => record.visitid}
                    ></Table>
                </div>
            </div>

        </>
    );
}
