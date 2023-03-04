import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
  Table,
  Modal,
  Drawer,
  Space,
  Form,
  Button,
  Typography,
  Switch,
  DatePicker,
  InputNumber,
  Tag,
  Input,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";
import { CSVLink } from "react-csv";
const { confirm } = Modal;
const { Text } = Typography;

export default function Meeting() {
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [exceldata, setexceldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    let coachid = userinfo.coachid;
    coachid = coachid || coachid === "" ? "0" : coachid;
    api
      .get(`/api/record/coach/get_meetingattendance_list?coachid=${coachid}`)
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

  const tableOnRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        getFormData(record.entryid);
      },
    };
  };

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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      title: "Бүлгийн хурал зохион байгуулагдсан огноо",
      dataIndex: "meetingdate",
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Устгах уу?",
      icon: <ExclamationCircleFilled />,
      //content: 'Some descriptions',
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        onDelete();
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  };

  const onDelete = async () => {
    await api
      .delete(
        `/api/record/coach/delete_meetingattendance?id=${formdata.getFieldValue(
          "entryid"
        )}`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const onFinish = async (values) => {
    let fdata = formdata.getFieldsValue();
    fdata.meetingdate = fdata.meetingdate.format("YYYY.MM.DD HH:mm:ss");
    await api
      .post(`/api/record/coach/set_meetingattendance`, fdata)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const getFormData = async (entryid) => {
    await api
      .get(`/api/record/coach/get_meetingattendance?id=${entryid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          let fdata = res?.data?.retdata[0];
          fdata.meetingdate = dayjs(fdata.meetingdate, "YYYY.MM.DD HH:mm:ss");
          formdata.setFieldsValue(fdata);
          showModal();
        }
      });
  };

  const newFormData = async () => {
    formdata.setFieldsValue({
      entryid: 0,
      memberid: null,
      householdid: null,
      meetingdate: null,
      isjoin: true,
      quantity: null,
      amount: null,
    });
    showModal();
  };
  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={(e) => newFormData()}
      >
        Хурлын ирцийн мэдээлэл нэмэх
      </Button>

      <Table
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
        onRow={tableOnRow}
        pagination={false}
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
                <Table.Summary.Cell index={2}>
                  <Text>{totalquantity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <Text>{totalamount}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      ></Table>
      <Drawer
        forceRender
        title="Хурлын ирцийн мэдээлэл нэмэх"
        open={isModalOpen}
        width={720}
        onClose={handleCancel}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button
              key="delete"
              danger
              onClick={showDeleteConfirm}
              hidden={formdata.getFieldValue("entryid") === 0}
            >
              Устгах
            </Button>
            <Button key="cancel" onClick={handleCancel}>
              Болих
            </Button>
            <Button key="save" type="primary" onClick={onFinish}>
              Хадгалах
            </Button>
          </Space>
        }
      >
        <Form
          form={formdata}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          labelWrap
        >
          <Form.Item name="entryid" hidden={true} />
          <Form.Item name="coachid" hidden={true} />
          <Form.Item name="householdid" hidden={true} />
          <Form.Item
            name="meetingdate"
            label="Бүлгийн хурал зохион байгуулагдсан огноо"
          >
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>

          <Form.Item
            name="isjoin"
            label="Бүлгийн хуралд оролцсон эсэх"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Тийм"
              unCheckedChildren="Үгүй"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="quantity" label="Худалдан авсан хувьцааны тоо">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Хувьцааны тоо"
            />
          </Form.Item>
          <Form.Item name="amount" label="Хуримтлуулсан мөнгөн дүн">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Мөнгөн дүн"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
