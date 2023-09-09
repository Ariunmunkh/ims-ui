import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Routes, Route, useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table, Input, Space, Button, Tag } from "antd";
import useUserInfo from "../../system/useUserInfo";
import VolunteerList from "./VolunteerList";
import ReportList from "./ReportList";
import Highlighter from "react-highlight-words";
import ProjectList from "./ProjectList";
const { Meta } = Card;

export default function HomeVolunteer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [volList, setVolList] = useState(false);
  const [report, setReport] = useState(false);
  const [project, setProject] = useState(false);
  const [griddata, setGridData] = useState();
  const [griddata1, setGridData1] = useState();
  const [NumProject, setNumProject] = useState(0);

  const fetchData = useCallback(async () => {
    if (userinfo.volunteerid)
      await api
        .get(
          `/api/Volunteer/get_VolunteerVoluntaryWork_list?id=${userinfo?.volunteerid}`
        )
        .then((res) => {
          if (res?.status === 200 && res?.data?.rettype === 0) {
            setGridData(res?.data?.retdata);
            const filteredData = res.data.retdata.filter(
              (item) =>
                item.status == "1"
            );
            setGridData1(filteredData);
          }
          
        });
    await api.get(`/api/record/base/get_Project_list`).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setNumProject(res?.data?.retdata);
      }
    });
  }, [userinfo.volunteerid]);

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
  const statusTagColors = {
    1: "green",
    0: "red",
  };
  const gridcolumns3 = [
    {
      title: "Сайн дурын ажлын төрөл",
      dataIndex: "voluntarywork",
      ...getColumnSearchProps("voluntarywork"),
    },
    {
      title: "Хугацаа",
      dataIndex: "duration",
      ...getColumnSearchProps("duration"),
    },
    {
      title: "Огноо",
      dataIndex: "voluntaryworkdate",
      ...getColumnSearchProps("voluntaryworkdate"),
    },
    {
      title: "Нэмэлт мэдээлэл",
      dataIndex: "note",
      ...getColumnSearchProps("note"),
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      render: (status) => (
        <Tag color={statusTagColors[status]}>
          {status == "1" ? "Баталгаажсан" : "Хүсэлт илгээсэн"}
        </Tag>
      ),
    },
  ];
  if (volList) return <VolunteerList setVolList={setVolList} />;
  if (report) return <ReportList setReport={setReport} />;
  if (project) return <ProjectList setProject={setProject} />;
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={{ span: 8 }}>
          <Card
            hoverable={false}
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
                  {userinfo?.committee
                    ? userinfo?.committee
                    : "Салбар сонгогдоогүй"}
                </h6>
              }
              description="7777-0508"
            />
          </Card>
        </Col>
        <Col xs={24} lg={{ span: 8 }}>
          <Card
            hoverable={true}
            onClick={() => navigate("/volunteer?tab=2")}
            style={{
              textAlign: "center",
              backgroundColor: "#FAFAFA",
            }}
            title="Сайн дурын ажлын мэдээлэл"
          >
            <Meta
              style={{ textAlign: "center" }}
              title={
                <h5 className="text-primary font-weight-bold">
                  {griddata1?.length ? griddata1?.length : 0}
                </h5>
              }
              description="Хийсэн сайн дурын ажлын тоо"
            />
          </Card>
        </Col>
        <Col xs={24} lg={{ span: 8 }}>
          <Card
            hoverable={true}
            onClick={() => setProject(true)}
            style={{
              textAlign: "center",
              backgroundColor: "#FAFAFA",
            }}
            title="МУЗН-ийн хэрэгжүүлж буй төсөл, хөтөлбөрүүд"
          >
            <Meta
              style={{ textAlign: "center" }}
              title={
                <h5 className="text-primary font-weight-bold">
                  {NumProject?.length ? NumProject?.length : 0}
                </h5>
              }
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
            columns={gridcolumns3}
            pagination={true}
            rowKey={(record) => record.id}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
