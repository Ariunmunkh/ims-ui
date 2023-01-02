import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
  Table,
  Modal,
  Drawer,
  Space,
  Form,
  Button,
  Input,
  DatePicker,
  Select,
  Divider,
  InputNumber,
  Switch,
  Typography,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;
const { Text } = Typography;

export default function Support() {
  const { userinfo } = useUserInfo();
  const { householdid } = useParams();
  const [relationship, setrelationship] = useState([]);
  const [coachlist, setcoachlist] = useState([]);
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [shirheg, setQuantity] = useState(0);
  const [dun, setUnitPrice] = useState(0);
  const [nitDun, setTotalPrice] = useState(0);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/record/coach/get_othersupport_list?id=${householdid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setGridData(res?.data?.retdata);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [householdid]);

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

  useEffect(() => {
    
    setTotalPrice(shirheg.value * dun.value);

  }, [shirheg, dun]);

  const gridcolumns = [
    {
      title: "Тусламж, дэмжлэг хүлээн авсан огноо",
      dataIndex: "supportdate",
    },
    {
      title: "Хүлээн авсан тусламж дэмжлэг",
      dataIndex: "name",
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "quantity",
    },
    {
      title: "Нэгжийн үнэ",
      dataIndex: "unitprice",
    },
    {
      title: "Нийт үнэ",
      dataIndex: "totalprice",
    },
    {
      title: "Дэмжлэг олгосон байгууллагын нэр",
      dataIndex: "orgname",
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
        `/api/record/coach/delete_othersupport?id=${formdata.getFieldValue(
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
    fdata.supportdate = fdata.supportdate.format("YYYY.MM.DD HH:mm:ss");
    await api.post(`/api/record/coach/set_othersupport`, fdata).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setIsModalOpen(false);
        fetchData();
      }
    });
  };

  const getFormData = async (entryid) => {
    await api
      .get(`/api/record/coach/get_othersupport?id=${entryid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          let fdata = res?.data?.retdata[0];
          fdata.supportdate = dayjs(
            fdata.supportdate,
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
      householdid: householdid,
      supportdate: null,
      name: null,
      quantity: null,
      unitprice: null,
      totalprice: null,
      orgname: null,
      coachid: userinfo.coachid,
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
        Бусад тусламж, дэмжлэг нэмэх
      </Button>

      <Table
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={false}
        rowKey={(record) => record.entryid}
        summary={(pageData) => {
          let totalamount = 0;
          pageData.forEach(({ totalprice }) => {
            // totalamount += parseFloat(totalprice.replaceAll(',', ''));
            totalamount += totalprice;
          });
          totalamount = totalamount
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          return (
            <>
              <Table.Summary.Row style={{ background: "#fafafa" }}>
                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <Text>{totalamount}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}  colSpan={4}/>
              </Table.Summary.Row>
            </>
          );
        }}
      ></Table>
      <Drawer
        forceRender
        title="Бусад тусламж, дэмжлэг нэмэх"
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
          <Form.Item name="supportdate" label="Тусламж, дэмжлэг хүлээн авсан огноо">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item name="name" label="Хүлээн авсан тусламж дэмжлэг">
            {/* <Select style={{ width: "100%" }}>
                            {relationship?.map((t, i) => (
                                <Select.Option key={i} value={t.memberid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select> */}
            <Input placeholder="Хүлээн авсан тусламж дэмжлэг" />
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
              onChange={(value) => {
                setQuantity({ value });
              }}
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
              onChange={(value) => {
                setUnitPrice({ value });
              }}
            />
          </Form.Item>
          {/* <Form.Item name="totalprice" label="Нийт үнэ">
            <InputNumber
              placeholder="Нийт үнэ"
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              defaultValue={0}
              value={nitDun}
              disabled
              onChange={(value) => setTotalPrice({value})}
            />
            {console.log(nitDun)}
          </Form.Item> */}
          
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
          <Form.Item name="orgname" label="Дэмжлэг олгосон байгууллагын нэр">
            <Input.TextArea
              placeholder="Дэмжлэг олгосон байгууллагын нэр"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
