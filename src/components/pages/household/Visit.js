import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
  Table,
  Modal,
  Form,
  Button,
  Input,
  DatePicker,
  Select,
  Divider,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
const { confirm } = Modal;

export default function Visit() {
  const { userinfo } = useUserInfo();
  const { householdid } = useParams();
  const nulldata = {
    memberid: 0,
    householdid: householdid,
    visitdate: null,
    note: null,
  };

  const [relationship, setrelationship] = useState([]);
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/record/coach/get_householdvisit?id=${householdid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setGridData(res?.data?.retdata);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    api
      .get(
        `/api/record/households/get_householdmember_list?householdid=${householdid}`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setrelationship(res?.data?.retdata);
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
      title: "Айлчилсан огноо",
      dataIndex: "visitdate",
    },
    {
      title: "Айлчлалаар уулзсан өрхийн гишүүд",
      dataIndex: "memberid",
    },
    {
      title: "Тайлбар",
      dataIndex: "note",
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
        `/api/record/coach/delete_householdvisit?id=${formdata.getFieldValue(
          "visitid"
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
      .post(`/api/record/coach/set_householdvisit`, formdata.getFieldsValue())
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const getFormData = async (visitid) => {
    await api
      .get(`/api/record/coach/get_householdvisit?id=${visitid}`)
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
        Өрхийн айлчлалын мэдээлэл нэмэх
      </Button>

      <Table
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={false}
        rowKey={(record) => record.visitid}
      ></Table>
      <Modal
        forceRender
        title="Өрхийн айлчлалын мэдээлэл нэмэх"
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
            hidden={formdata.getFieldValue("visitid") === 0}
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
          <Form.Item name="visitdate" label="Айлчилсан огноо">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item name={householdid} label="householdid" hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item name={userinfo.coachid} label="coachid" hidden={true}>
            <Input />
          </Form.Item>

          <Form.Item name="memberid" label="Айлчлалаар уулзсан өрхийн гишүүн">
            <Select style={{ width: "100%" }}>
              {relationship?.map((t, i) => (
                <Select.Option key={i} value={t.memberid}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Тайлбар">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
