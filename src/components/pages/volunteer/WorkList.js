import React, { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Col, Row, Table, Button, Input, Space, Tag, Segmented } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
import Home from "./Home";

export default function WorkList({ Lstatus }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);
  const [count, setCount] = useState(2);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(
        `/api/Volunteer/get_VolunteerVoluntaryWork_list?committeeid=${userinfo.committeeid}`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          if (userinfo.committeeid) {
            if (count != 2) {
              const filteredData = res.data.retdata.filter(
                (item) => item.status == count
              );
              setGridData(filteredData);
            } else {
              setGridData(res?.data?.retdata);
            }
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userinfo.committeeid, count]);
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
    null: "red",
    1: "green",
    0: "red",
  };
  const gridcolumns = [
    {
      title: "Үйлдэл",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/volunteer/${record.volunteerid}`)}
        >
          Дэлгэрэнгүй мэдээлэл харах
        </Button>
      ),
    },
    {
      title: "Овог",
      dataIndex: "lastname",
      ...getColumnSearchProps("lastname"),
    },
    {
      title: "Нэр",
      dataIndex: "firstname",
      ...getColumnSearchProps("firstname"),
    },
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
          {status === 1 || status === "1" ? "Баталгаажсан" : "Хүсэлт илгээсэн"}
        </Tag>
      ),
    },
  ];
  const onFinish = async () => {
    setLoading(true);

    const updateRequests = selectedRowKeys.map(async (volunteerId) => {
      const payload = {
        id: volunteerId,
        status: 1,
      };

      return api.post(`/api/Volunteer/update_VolunteerVoluntaryWork`, payload);
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
          {count === 0 ? (
            <Button
              className="ml-3"
              type="primary"
              onClick={onFinish}
              disabled={!hasSelected}
              loading={loading}
            >
              Хийсэн сайн дурын ажлыг хүлээн зөвшөөрөх
            </Button>
          ) : null}

          <span
            style={{
              marginLeft: 8,
            }}
          >
            {hasSelected ? `Сонгогдсон ${selectedRowKeys.length} мөр` : ""}
          </span>
          <Space>
            <Segmented
              value={count}
              onChange={(value) => {
                setCount(value); // Update count when segment is clicked
                fetchData(value); // Trigger fetchData with the new count
              }}
              options={[
                {
                  label: "Бүх хүсэлт",
                  value: 2,
                  style: {
                    backgroundColor: "blue", // Change the background color to blue
                    color: "white", // Change the text color to white
                  },
                },
                {
                  label: "Зөвшөөрсөн хүсэлтүүд",
                  value: 1,
                  style: {
                    backgroundColor: "green", // Change the background color to green
                    color: "white", // Change the text color to white
                  },
                },
                {
                  label: "Илгээсэн хүсэлтүүд",
                  value: 0,
                  style: {
                    backgroundColor: "red", // Change the background color to red
                    color: "white", // Change the text color to white
                  },
                },
              ]}
            />
          </Space>
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
