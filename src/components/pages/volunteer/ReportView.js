import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  UserOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table, Button, Input, Space } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
import Home from "./Home";
const { Meta } = Card;

export default function ReportView() {
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/api/Committee/get_report_list`)
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

  if (back) return <Home setBack={setBack} />;

  return (
    <>
      <Table
        size="small"
        title={() => (
          <h5 className="font-weight-light text-secondary text-uppercase">
            ДШХ-ны сарын тайлан
          </h5>
        )}
        loading={loading}
        bordered
        dataSource={griddata}
        columns={gridcolumns}
        pagination={{
          pageSize: 50,
        }}
      ></Table>
    </>
  );
}
