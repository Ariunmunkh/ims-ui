import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Card, Col, Row, Table, Button, Input, Space, Tag } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
import Home from "./Home";

export default function VolunteerList({ Lstatus }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;

  const fetchData = useCallback(
    async () => {
      setLoading(true);
      await api
        .get(`/api/Volunteer/get_Volunteer_list`)
        .then((res) => {
          if (res?.status === 200 && res?.data?.rettype === 0) {
            if (userinfo.committeeid && Lstatus === "active") {
              const filteredData = res.data.retdata.filter(
                (item) =>
                  item.committeeid == userinfo.committeeid && item.status == "1"
              );
              setGridData(filteredData);
            } else if (userinfo.committeeid && Lstatus === "passive") {
              const filteredData = res.data.retdata.filter(
                (item) =>
                  item.committeeid == userinfo.committeeid && item.status == "0"
              );
              setGridData(filteredData);
            } else if (userinfo.roleid == 1 && Lstatus === "active") {
              const filteredData = res.data.retdata.filter(
                (item) => item.status == 1
              );
              setGridData(filteredData);
            } else if (userinfo.roleid == 1 && Lstatus === "passive") {
              const filteredData = res.data.retdata.filter(
                (item) => item.status == 0 || item.status == null
              );
              setGridData(filteredData);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [Lstatus],
    [userinfo.committeeid],
    [userinfo.roleid]
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
  const statusTagColors = {
    1: "green",
    0: "red",
  };
  const gridcolumns = [
    {
      title: "Үйлдэл",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/volunteer/${record.id}`)}>
          Дэлгэрэнгүй мэдээлэл харах
        </Button>
      ),
    },
    userinfo.roleid === "1"
      ? {
          title: "Салбар",
          dataIndex: "committeeid",
          key: "committeeid",
          ...getColumnSearchProps("committeeid"),
        }
      : {},
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
  const onFinish = async () => {
    setLoading(true);

    const updateRequests = selectedRowKeys.map(async (volunteerId) => {
      const payload = {
        id: volunteerId,
        committeeid: userinfo.committeeid,
        status: 1,
      };

      return api.post(`/api/Volunteer/update_Volunteer`, payload);
    });

    try {
      await Promise.all(updateRequests);

      // After all requests are completed, update data and reset selectedRowKeys
      setSelectedRowKeys([]);
      fetchData(); // Assuming fetchData fetches the updated data
    } catch (error) {
      console.error("Error updating volunteer status:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (back) return <Home setBack={setBack} />;

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => setBack(true)}
          />
          {userinfo.roleid === "2" ? (
            <Button
              className="ml-3"
              type="primary"
              onClick={onFinish}
              disabled={!hasSelected}
              loading={loading}
            >
              ДШХ-нд бүртгэж авах
            </Button>
          ) : null}
          <span
            style={{
              marginLeft: 8,
            }}
          >
            {hasSelected ? `Сонгогдсон ${selectedRowKeys.length} мөр` : ""}
          </span>
          <Table
            size="small"
            title={() => (
              <h5 className="font-weight-light text-secondary text-uppercase">
                Сайн дурын идэвхтний жагсаалт
              </h5>
            )}
            loading={loading}
            bordered
            dataSource={griddata}
            columns={gridcolumns}
            rowSelection={rowSelection}
            pagination={{
              pageSize: 50,
            }}
            rowKey={(record) => record.id}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
