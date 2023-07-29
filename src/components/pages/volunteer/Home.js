import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table, Input, Space,Button } from "antd";
import useUserInfo from "../../system/useUserInfo";
import VolunteerList from "./VolunteerList";
import ReportList from "./ReportList";
import ProjectList from "./ProjectList";
import Highlighter from "react-highlight-words";
const { Meta } = Card;

export default function Home() {
    const [loading, setLoading] = useState(false);
    const { userinfo } = useUserInfo();
    const [volList, setVolList] = useState(false);
    const [report, setReport] = useState(false);
    const [project, setProject] = useState(false);
    const [griddata, setGridData] = useState();
    const [griddata1, setGridData1] = useState();

    const fetchData = useCallback(async () => {

        if (userinfo.volunteerid)
            await api.get(`/api/Volunteer/get_VolunteerVoluntaryWork_list?id=${userinfo.volunteerid}`)
                .then((res) => {
                    if (res?.status === 200 && res?.data?.rettype === 0) {
                        setGridData(res?.data?.retdata);
                    }
                });

        await api
            .get(`/api/Committee/get_report_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData1(res?.data?.retdata);
                }
            }).finally(() => {
                setLoading(false);
            });

    }, [userinfo.volunteerid]);
    useEffect(() => {
        fetchData();
    }, [fetchData])
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
          dataIndex: "committeeid",
          ...getColumnSearchProps("committeeid"),
        },
        {
          title: "Тайлан он/сар",
          dataIndex: "reportdate",
          ...getColumnSearchProps("reportdate"),
        },
        {
          title: "Тайлан илгээсэн огноо",
          dataIndex: "updated",
          ...getColumnSearchProps("updated"),
        },
      ];
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
          ...getColumnSearchProps("firstname"),
        },
        {
          title: "Регистрийн дугаар",
          dataIndex: "regno",
          ...getColumnSearchProps("regno"),
        },
        {
          title: "Утас дугаар",
          dataIndex: "phone",
          ...getColumnSearchProps("phone"),
        },
      ];

    if (volList) return <VolunteerList setVolList={setVolList} />;
    if (report) return <ReportList setReport={setReport} />;
    if (project) return <ProjectList setProject={setProject} />;
    return userinfo.roleid === '5' ? (
        <>
            <Row gutter={16}>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={<Avatar shape="circle" icon={<UserOutlined />} />}
                        title="Харьяа дунд шатны хороо"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            // title={<Title ellipsis={true} autos level={4}>Баянзүрх дүүргийн улаан загалмайн хороо</Title>}
                            title={
                                <h6 className="text-primary font-weight-bold">
                                    Баянзүрх дүүргийн улаан загалмайн хороо
                                </h6>
                            }
                            description="7777-0508"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Сайн дурын ажлын мэдээлэл"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-primary font-weight-bold">12</h5>}
                            description="Хийсэн сайн дурын ажлын тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="МУЗН-ийн хэрэгжүүлж буй төсөл, хөтөлбөрүүд"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-primary font-weight-bold">5</h5>}
                            description="Хэрэгжүүлж буй төсөл, хөтөлбөрийн тоо"
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
                                Сайн дурын ажлын жагсаалт
                            </h5>
                        )}
                        loading={loading}
                        bordered
                        dataSource={griddata}
                        columns={gridcolumns}
                        pagination={true}
                    ></Table>
                </Col>
            </Row>
        </>
    ) : (
        <>
            <Row gutter={16}>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        onClick={() => setVolList(true)}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Бүртгэлтэй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-success font-weight-bold">12</h5>}
                            description="Бүртгэлтэй сайн дурын идэвхтний тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        onClick={() => setVolList(true)}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Бүртгэлгүй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-warning font-weight-bold">12</h5>}
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
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="ДШХ-ны сарын тайлан"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-danger font-weight-bold">5 сарын тайлан явуулаагүй</h5>}
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
                        bordered
                        columns={gridcolumns}
                        pagination={true}
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
                    ></Table>
                </Col>
            </Row>
        </>
    );
}
