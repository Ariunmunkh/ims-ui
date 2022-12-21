import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Table, Modal, Form, Button, Input, Switch } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;
export default function HouseHoldMember() {
  const { householdid } = useParams();
  const nulldata = {
    memberid: 0,
    householdid: householdid,
    name: null,
    relative: null,
    istogether: true,
  };
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(
        `/api/households/get_householdmember_list?householdid=${householdid}`
      )
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
        getFormData(record.memberid);
      },
    };
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const gridcolumns = [
    {
      title: "Өрхийн гишүүний нэр",
      dataIndex: "name",
    },
    {
      title: "Өрхийн тэргүүнтэй ямар хамааралтай болох",
      dataIndex: "relative",
    },
    {
      title: "Төрсөн огноо",
      dataIndex: "birthdate",
    },
    {
      title: "Хүйс",
      dataIndex: "gender",
    },
    {
      title: "Одоо тантай хамт амьдарч байгаа юу ?",
      dataIndex: "istogether",
    },
    {
      title: "Огноо",
      dataIndex: "updated",
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
        `/api/households/delete_householdmember?id=${formdata.getFieldValue(
          "memberid"
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
    await api
      .post(`/api/households/set_householdmember`, formdata.getFieldsValue())
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const getFormData = async (memberid) => {
    await api
      .get(`/api/households/get_householdmember?id=${memberid}`)
      .then((res) => {
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
        Өрхийн гишүүн нэмэх
      </Button>

      <Table
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={false}
        rowKey={(record) => record.memberid}
      ></Table>
      <Modal
        forceRender
        title="Өрхийн гишүүн"
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
            hidden={formdata.getFieldValue("memberid") === 0}
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
        <Form form={formdata} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
          <Form.Item name="memberid" label="Дугаар" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="householdid" label="Өрхийн дугаар" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Өрхийн гишүүний нэр">
            <Input />
          </Form.Item>
          <Form.Item
            name="relative"
            label="Өрхийн тэргүүнтэй ямар хамааралтай болох"
          >
            <Input />
          </Form.Item>
          <Form.Item name="birthdate" label="Төрсөн огноо">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Хүйс">
            <Input />
          </Form.Item>
          <Form.Item
            name="istogether"
            label="Одоо тантай хамт амьдарч байгаа юу ?"
            valuePropName="checked"
          >
            <Switch checkedChildren="Тийм" unCheckedChildren="Үгүй" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
