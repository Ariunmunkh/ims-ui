import React, { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeftOutlined, SearchOutlined, FileAddOutlined } from "@ant-design/icons";
import { api } from "../../system/api";
import { Col, Row, Table, Button, Input, Space } from "antd";
import useUserInfo from "../../system/useUserInfo";
import { useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";
import Home from "./Home";

export default function ReportList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { userinfo } = useUserInfo();
    const [griddata, setGridData] = useState();
    const [back, setBack] = useState(false);
    const [committee, setcommittee] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/Committee/get_report_list?id=${userinfo.committeeid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);

                    setcommittee(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo.committeeid]);

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
                        Хайх
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Шинэчлэх
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
                        Шүүлтүүр
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Хаах
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
    const uniqueCommittees = [...new Set(committee.map(item => item.committeeid))];

    console.log(committee)
    const gridcolumns = [
        {
            title: "Салбар",
            dataIndex: "committee",
            filters: uniqueCommittees.map(committeeId => ({ text: committee.find(item => item.committeeid === committeeId)?.committee, value: committeeId })),
            onFilter: (value, record) => record?.committeeid === value,
        },
        {
            title: "Тайлан он/сар",
            dataIndex: "reportdate",
            onFilter: (value, record) => record?.reportdate === value,
        },
        {
            title: "Тайлан илгээсэн огноо",
            dataIndex: "updated",
            ...getColumnSearchProps("updated"),
        },
    ];
    if (back) return <Home setBack={setBack} />;
    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {
                navigate(`/report`, {
                    state: {
                        committeeid: record.committeeid,
                        udur: record.reportdate,
                        committee: record.committee,
                    },
                });
            },
        };
    };
    return userinfo.roleid !== '5' ? (
        <>
            <Row>
                <Col span={1}>
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={(event) => {
                            event.preventDefault();
                            window.open("/home", "_self");
                        }}
                    />
                </Col>
                <Col span={2} hidden={userinfo.roleid === '1'}>
                    <Button
                        type="primary"
                        icon={<FileAddOutlined />}
                        onClick={(event) => {
                            event.preventDefault();
                            window.open("/report", "_self");
                        }}
                    >
                        Шинэ
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                ДШХ-ны сарын тайлан илгээсэн байдал
                            </h5>
                        )}
                        loading={loading}
                        dataSource={griddata}
                        bordered
                        columns={gridcolumns}
                        pagination={true}
                        onRow={tableOnRow}
                        rowKey={(record) => record.id}
                    ></Table>
                </Col>
            </Row>
        </>
    ) : (
        <></>
    );
}
