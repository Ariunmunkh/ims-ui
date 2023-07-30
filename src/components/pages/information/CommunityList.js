import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  UserOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table, Button, Input, Space } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
const { Meta } = Card;

export default function CommunityList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/api/Committee/get_LocalInfo_list`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setGridData(res?.data?.retdata);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
  const gridcolumns = [
    {
      title: "Салбар",
      dataIndex: "committeeid",
      key: "committeeid",
      ...getColumnSearchProps("committeeid"),
    },
    {
      title: "Мэдээлэл илгээсэн огноо",
      dataIndex: "updated",
      ...getColumnSearchProps("updated"),
    },
  ];

  const tableOnRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        navigate(`/survey/${record.id}`);
      },
    };
  };

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Table
            size="small"
            title={() => (
              <h5 className="font-weight-light text-secondary text-uppercase">
                Орон нутгийн мэдээлэл илгээсэн Дунд шатны хорооны жагсаалт
              </h5>
            )}
            loading={loading}
            bordered
            dataSource={griddata}
            columns={gridcolumns}
            pagination={{
              pageSize: 50,
            }}
            onRow={tableOnRow}
            rowKey={(record) => record.id}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
