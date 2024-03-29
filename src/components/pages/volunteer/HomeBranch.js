import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table, Input, Space, Button, Tag } from "antd";
import useUserInfo from "../../system/useUserInfo";
import VolunteerList from "./VolunteerList";
import ReportList from "./ReportList";
import ProjectList from "./ProjectList";
import Highlighter from "react-highlight-words";
import HomeVolunteer from "./HomeVolunteer";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

export default function HomeBranch() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { userinfo } = useUserInfo();
    const [volList, setVolList] = useState(false);
    const [Lstatus, setLstatus] = useState();
    const [report, setReport] = useState(false);
    const [project, setProject] = useState(false);
    const [activeVol, setActiveVol] = useState();
    const [pendingVol, setPendingVol] = useState();
    const [griddata1, setGridData1] = useState();
    const [title, settitle] = useState();
    const fetchData = useCallback(
        async () => {
            await api
                .get(
                    `/api/Committee/get_report_list?committeeid=${userinfo.committeeid}`
                )
                .then((res) => {
                    if (res?.status === 200 && res?.data?.rettype === 0) {
                        setGridData1(res?.data?.retdata);
                        gettitle(res?.data?.retdata);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
            await api.get(`/api/Volunteer/get_Volunteer_list`).then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    if (userinfo.committeeid) {
                        const filteredData = res.data.retdata.filter(
                            (item) =>
                                item.committeeid == userinfo.committeeid && item.status == 1
                        );
                        const filteredData1 = res.data.retdata.filter(
                            (item) =>
                                item.committeeid == userinfo.committeeid && item.status == 0
                        );
                        setPendingVol(filteredData1);
                        setActiveVol(filteredData);
                    }
                }
            });
        },
        [userinfo.committeeid]
    );

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
    const gridcolumns1 = [
        {
            title: "Салбар",
            dataIndex: "committee",
            key: "committee",
            ...getColumnSearchProps("committee"),
        },
        {
            title: "Тайлан он/сар",
            dataIndex: "reportdate",
            key: "reportdate",
            ...getColumnSearchProps("reportdate"),
        },
        {
            title: "Тайлан илгээсэн огноо",
            dataIndex: "updated",
            key: "updated",
            ...getColumnSearchProps("updated"),
        },
    ];
    const statusTagColors = {
        1: "green",
        0: "red",
    };
    const gridcolumns = [
        {
            title: "Овог",
            dataIndex: "lastname",
            key: "lastname",
            ...getColumnSearchProps("lastname"),
        },
        {
            title: "Нэр",
            dataIndex: "firstname",
            key: "firstname",
            ...getColumnSearchProps("firstname"),
        },
        {
            title: "Регистрийн дугаар",
            dataIndex: "regno",
            key: "regno",
            ...getColumnSearchProps("regno"),
        },
        {
            title: "Утас дугаар",
            dataIndex: "phone",
            key: "phone",
            ...getColumnSearchProps("phone"),
        },
        {
            title: "Төлөв",
            dataIndex: "status",
            render: (status) => (
                <Tag color={statusTagColors[status]}>
                    {status == "1" ? "ДШХ-нд бүртгэлтэй" : "Хүлээгдэж байна"}
                </Tag>
            ),
        },
    ];
    const tableOnRow = (record, rowIndex) => {

        return {
            onClick: (event) => {
                navigate(`/volunteer/${record.id}`);

            },

        };
    };
    const tableOnRow2 = (record, rowIndex) => {

        return {
            onClick: (event) => {
                navigate(`/report`, { state: { committeeid: record.committeeid, udur: record.reportdate } });

            },

        };
    };
    const gettitle = (data) => {

        const date = new Date();
        let filter = '';
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month === 1) {
            month = 12;
            year = year - 1;
        }
        else {
            month = month - 1;
        }
        if (month < 10)
            filter = year + '-0' + month
        else
            filter = year + '-' + month

        const found = data?.find((element) => element.reportdate === filter);
        if (found != null)
            settitle(month + " сарын тайлан илгээсэн");
        else
            settitle(month + " сарын тайлан илгээгээгүй");
    }

    if (volList) return <VolunteerList Lstatus={Lstatus} setLstatus={setLstatus} setVolList={setVolList} />;
    if (report) return <ReportList setReport={setReport} />;
    if (project) return <ProjectList setProject={setProject} />;
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        onClick={() => {
                            setVolList(true); setLstatus('active'
                            )
                        }}
                        title="Бүртгэлтэй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={
                                <h5 className="text-success font-weight-bold">
                                    {activeVol?.length ? activeVol?.length : 0}
                                </h5>
                            }
                            description="Бүртгэлтэй сайн дурын идэвхтний тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        onClick={() => { setVolList(true); setLstatus('passive') }}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        title="Бүртгэлгүй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={
                                <h5 className="text-warning font-weight-bold">
                                    {pendingVol?.length ? pendingVol?.length : 0}
                                </h5>
                            }
                            description="Хүсэлтээ илгээсэн сайн дурын идэвхтний тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        onClick={() => setReport(true)}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        title="ДШХ-ны сарын тайлан"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={
                                <h5 className="text-danger font-weight-bold">
                                    {title}
                                </h5>
                            }
                            description="ДШХ-ны сар бүрийн тайлан"
                        />
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={24} lg={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                Бүртгэлтэй: Сайн дурын идэвхтний жагсаалт
                            </h5>
                        )}
                        loading={loading}
                        dataSource={activeVol}
                        bordered
                        columns={gridcolumns}
                        pagination={true}
                        onRow={tableOnRow}
                        rowKey={(record) => record.id}
                    ></Table>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={24} lg={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                ДШХ-ны сарын тайлан илгээсэн байдал
                            </h5>
                        )}
                        loading={loading}
                        bordered
                        dataSource={griddata1}
                        columns={gridcolumns1}
                        pagination={true}
                        onRow={tableOnRow2}
                        rowKey={(record) => record.id}
                    ></Table>
                </Col>
            </Row>
        </>
    );
}
