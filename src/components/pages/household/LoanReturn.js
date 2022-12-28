import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
  Table,
  Modal,
  Form,
  Button,
  Input,
  Switch,
  DatePicker,
  InputNumber,
  Divider,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function LoanReturn() {
  const { householdid } = useParams();
  const nulldata = {
    memberid: 0,
    householdid: householdid,
    meetingdate: null,
    isjoin: null,
    quantity: null,
  };

  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/record/coach/get_loanrepayment?id=${householdid}`)
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

  const gridcolumns = [
    {
      title: "Зээлийн эргэн төлөлт хийсэн огноо",
      dataIndex: "repaymentdate",
    },
    {
      title: "Эргэн төлсөн мөнгөн дүн",
      dataIndex: "amount",
    },
    {
      title: "Зээлийн үлдэгдэл",
      dataIndex: "balance",
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
        `/api/record/coach/delete_loanrepayment?id=${formdata.getFieldValue("entryid")}`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const onFinish = async (values) => {
    await api
      .post(`/api/record/coach/set_loanrepayment`, formdata.getFieldsValue())
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const getFormData = async (entryid) => {
    await api.get(`/api/record/coach/get_loanrepayment?id=${entryid}`).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        formdata.setFieldsValue(res?.data?.retdata[0]);
        showModal();
      }
    });
  };

  const newFormData = async () => {
    formdata.setFieldsValue(nulldata);
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
        Зээлийн эргэн төлөлтийн мэдээлэл
      </Button>

      <Table
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={false}
        rowKey={(record) => record.entryid}
      ></Table>
      <Modal
        forceRender
        title="Зээлийн эргэн төлөлтийн мэдээлэл нэмэх"
        open={isModalOpen}
        onOk={onFinish}
        onCancel={handleCancel}
        centered
        bodyStyle={{ height: "70vh" }}
        style={{ float: "right", paddingTop: "24px", paddingRight: "10px" }}
        footer={[
          <Button
            key="delete"
            danger
            onClick={showDeleteConfirm}
            hidden={formdata.getFieldValue("entryid") === 0}
          >
            Устгах
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Болих
          </Button>,
          <Button key="save" type="primary" onClick={onFinish}>
            Хадгалах
          </Button>,
        ]}
      >
        <Divider />
        <Form
          form={formdata}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          labelWrap
        >
          <Form.Item name="repaymentdate" label="Зээлийн эргэн төлөлт хийсэн огноо">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item name="householdid" label="householdid" hidden={true}>
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Эргэн төлсөн мөнгөн дүн">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Мөнгөн дүн"
            />
          </Form.Item>
          <Form.Item name="note" label="Зээлийн үлдэгдэл">
            <Input.TextArea style={{ width: "100%" }} placeholder="Зээлийн үлдэгдэл" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
