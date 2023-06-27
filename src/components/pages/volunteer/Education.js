import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import useUserInfo from "../../system/useUserInfo";
import {
  Table,
  Modal,
  Drawer,
  Space,
  Form,
  Button,
  Switch,
  InputNumber,
  Select,
  Input
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function Education() {
  const { userinfo } = useUserInfo();
  const { volunteerid } = useParams();
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(false);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    //setLoading(true);
    //api
    //    .get(`/api/record/coach/get_meetingattendance_list?id=${volunteerid}`)
    //    .then((res) => {
    //        if (res?.status === 200 && res?.data?.rettype === 0) {
    //            setGridData(res?.data?.retdata);
    //        }
    //    })
    //    .finally(() => {
    //        setLoading(false);
    //    });
  }, [volunteerid]);

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

  const gridcolumns = [
    {
      title: "Боловсролын түвшин",
      dataIndex: "edulevel",
    },
    {
      title: "Сургуулийн нэр",
      dataIndex: "schoolname",
    },
    {
      title: "Төгссөн эсэх",
      dataIndex: "isgraduated",
    },
    {
      title: "Курс/Анги",
      dataIndex: "courselevel",
    },
    {
        title: "Мэрэгжил",
        dataIndex: "major",
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
    //await api
    //    .delete(`/api/record/coach/delete_meetingattendance?id=${formdata.getFieldValue("id")}`)
    //    .then((res) => {
    //        if (res?.status === 200 && res?.data?.rettype === 0) {
    //            setIsModalOpen(false);
    //            fetchData();
    //        }
    //    });
  };

  const onFinish = async (values) => {
    //let fdata = formdata.getFieldsValue();
    //fdata.meetingdate = fdata.meetingdate.format('YYYY.MM.DD HH:mm:ss');
    //await api
    //    .post(`/api/record/coach/set_meetingattendance`, fdata)
    //    .then((res) => {
    //        if (res?.status === 200 && res?.data?.rettype === 0) {
    //            setIsModalOpen(false);
    //            fetchData();
    //        }
    //    });
  };

  const getFormData = async (entryid) => {
    //await api
    //    .get(`/api/record/coach/get_meetingattendance?id=${entryid}`)
    //    .then((res) => {
    //        if (res?.status === 200 && res?.data?.rettype === 0) {
    //            let fdata = res?.data?.retdata[0];
    //            fdata.meetingdate = dayjs(fdata.meetingdate, 'YYYY.MM.DD HH:mm:ss');
    //            formdata.setFieldsValue(fdata);
    //            showModal();
    //        }
    //    });
  };

  const newFormData = async () => {
    formdata.setFieldsValue({
      id: 0,
      volunteerid: volunteerid ?? userinfo.volunteerid,
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
        Боловсрол нэмэх
      </Button>

      <Table
        size="small"
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={true}
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
        }}
      ></Table>
      <Drawer
        forceRender
        title="Боловсрол нэмэх"
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
          onFieldsChange={(changedFields, allFields) => {
            if (
              changedFields[0]?.name[0] === "quantity" ||
              changedFields[0]?.name[0] === "unitprice"
            ) {
              formdata.setFieldValue(
                "amount",
                formdata.getFieldValue("quantity") *
                  formdata.getFieldValue("unitprice")
              );
            }
          }}
        >
          <Form.Item name="entryid" hidden={true} />
          <Form.Item name="coachid" hidden={true} />
          <Form.Item name="householdid" hidden={true} />
          <Form.Item name="edulevel" label="Бововсролын түвшин" rules={[{ required: true, message: 'Боловсролын түвшин сонгоно уу!' }]}>
                        <Select style={{ width: "100%" }}>
                            
                        </Select>
                    </Form.Item>
          <Form.Item name="schoolname" label="Сургууль">
            <Input style={{ width: "100%" }} placeholder="Сургуулийн нэр" />
          </Form.Item>
          <Form.Item name="courselevel" label="Курс/Анги">
            <InputNumber
              min={1} max={12}
              style={{ width: "100%" }}
              placeholder="Курс/Анги"
            />
          </Form.Item>
          <Form.Item
            name="isgraduated"
            label="Төгссөн эсэх"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Тийм"
              unCheckedChildren="Үгүй"
              style={{ width: "100%" }}
            />
          </Form.Item>
         
          <Form.Item name="major" label="Мэрэгжил">
            <Input style={{ width: "100%" }} placeholder="Мэрэгжил" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
