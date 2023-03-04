import React, { useRef, useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
  Table,
  Modal,
  Tag,
  Drawer,
  Space,
  Form,
  Button,
  Input,
  DatePicker,
  Divider,
  Select,
  InputNumber,
  Typography,
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

export default function Investment() {
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [exceldata, setexceldata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();
  const [assetreceivedtype, setassetreceivedtype] = useState([]);
  const [assetreceived, setassetreceived] = useState([]);

  const fetchData = useCallback(() => {
    setLoading(true);
    let coachid = userinfo.coachid;
    coachid = coachid || coachid === "" ? "0" : coachid;
    api
      .get(`/api/record/coach/get_investment_list?coachid=${coachid}`)
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
    api
      .get(`/api/record/base/get_dropdown_item_list?type=assetreceivedtype`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setassetreceivedtype(res?.data?.retdata);
        }
      });
    api
      .get(`/api/record/base/get_dropdown_item_list?type=assetreceived`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setassetreceived(res?.data?.retdata);
        }
      });
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
      title: "Хөрөнгө хүлээн авсан огноо",
      dataIndex: "investmentdate",
    },
    {
      title: "Хүлээн авсан хөрөнгийн төрөл",
      dataIndex: "assetreceivedtype",
      ...getColumnSearchProps("assetreceivedtype"),
    },
    {
      title: "Хүлээн авсан хөрөнгийн нэр",
      dataIndex: "assetreceived",
      ...getColumnSearchProps("assetreceived"),
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "quantity",
      align: "right",
      ...getColumnSearchProps("quantity"),
    },
    {
      title: "Нэгжийн үнэ",
      dataIndex: "funitprice",
      align: "right",
      ...getColumnSearchProps("funitprice"),
    },
    {
      title: "Нийт үнэ",
      dataIndex: "ftotalprice",
      align: "right",
      ...getColumnSearchProps("ftotalprice"),
    },
    {
      title: "Тайлбар (марк, дугаар)",
      dataIndex: "note",
      ...getColumnSearchProps("note"),
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
        `/api/record/coach/delete_investment?id=${formdata.getFieldValue(
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
    fdata.investmentdate = fdata.investmentdate.format("YYYY.MM.DD HH:mm:ss");
    await api.post(`/api/record/coach/set_investment`, fdata).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setIsModalOpen(false);
        fetchData();
      }
    });
  };

  const getFormData = async (entryid) => {
    await api
      .get(`/api/record/coach/get_investment?id=${entryid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          let fdata = res?.data?.retdata[0];
          fdata.investmentdate = dayjs(
            fdata.investmentdate,
            "YYYY.MM.DD HH:mm:ss"
          );
          formdata.setFieldsValue(fdata);
          showModal();
        }
      });
  };

  const newFormData = async () => {
    formdata.setFieldsValue({
      entryid: 0,
      householdid: null,
      investmentdate: null,
      assetreceivedtypeid: null,
      assetreceivedid: null,
      quantity: 0,
      unitprice: 0,
      totalprice: 0,
      note: null,
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
        Хөрөнгө оруулалтын мэдээлэл
      </Button>

      <Table
        bordered
        title={() => (
          <>
            <Tag icon={<UserOutlined />} color="magenta">
              Хөрөнгийн мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
            </Tag>

            <CSVLink data={exceldata} filename={"Хөрөнгийн жагсаалт.csv"}>
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
          pageData.forEach(({ totalprice, quantity }) => {
            totalquantity += quantity;
            totalamount += totalprice;
          });
          totalamount = totalamount
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          return (
            <>
              <Table.Summary.Row style={{ background: "#fafafa" }}>
                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} align="right">
                  <Text>{totalquantity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} align="right">
                  <Text>{totalamount}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} />
              </Table.Summary.Row>
            </>
          );
        }}
      ></Table>
      <Drawer
        forceRender
        title="Хөрөнгө оруулалтын мэдээлэл нэмэх"
        open={isModalOpen}
        width={720}
        onClose={handleCancel}
        centered
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
        <Divider />
        <Form
          form={formdata}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          labelWrap
        >
          <Form.Item name="entryid" hidden={true} />
          <Form.Item name="householdid" hidden={true} />
          <Form.Item name="investmentdate" label="Хөрөнгө хүлээн авсан огноо">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item
            name="assetreceivedtypeid"
            label="Хүлээн авсан хөрөнгийн төрөл"
          >
            <Select style={{ width: "100%" }}>
              {assetreceivedtype?.map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assetreceivedid" label="Хүлээн авсан хөрөнгийн нэр">
            <Select style={{ width: "100%" }}>
              {assetreceived?.map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="Тоо ширхэг">
            <InputNumber
              min={0}
              placeholder="Тоо ширхэг"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="unitprice" label="Нэгжийн үнэ">
            <InputNumber
              placeholder="Нэгжийн үнэ"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="totalprice" label="Нийт үнэ">
            <InputNumber
              placeholder="Нийт үнэ"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="note" label="Тайлбар (марк, дугаар)">
            <Input.TextArea
              placeholder="Тайлбар (марк, дугаар)"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
