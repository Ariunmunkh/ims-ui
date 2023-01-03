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
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { confirm } = Modal;

const orgList = [
  "Монголын улаан загалмай нийгэмлэг",
  "Гэр бүл хүүхэд залуучуудын хөгжлийн хэлтэс",
  "Эрүүл мэндийн төв",
];

export default function Contact() {
  const { userinfo } = useUserInfo();
  const { householdid } = useParams();
  const [relationship, setrelationship] = useState([]);
  const [coachlist, setcoachlist] = useState([]);
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(`/api/record/coach/get_mediatedactivity_list?id=${householdid}`)
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
        getFormData(record.entryid);
      },
    };
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const gridcolumns = [
    {
      title: "Огноо",
      dataIndex: "mediateddate",
    },
    {
      title: "Холбон зуучилсан  байгууллагын нэр",
      dataIndex: "orgname",
    },
    {
      title: "Холбон зуучилсан үйлчилгээний нэр",
      dataIndex: "servicename",
    },
    {
      title: "Үйлчилгээнд холбогдсон өрхийн гишүүний нэр",
      dataIndex: "memberid",
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
        `/api/record/coach/delete_mediatedactivity?id=${formdata.getFieldValue(
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
    fdata.mediateddate = fdata.mediateddate.format("YYYY.MM.DD HH:mm:ss");
    await api
      .post(`/api/record/coach/set_mediatedactivity`, fdata)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsModalOpen(false);
          fetchData();
        }
      });
  };

  const getFormData = async (entryid) => {
    await api
      .get(`/api/record/coach/get_mediatedactivity?id=${entryid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          let fdata = res?.data?.retdata[0];
          fdata.mediateddate = dayjs(fdata.mediateddate, "YYYY.MM.DD HH:mm:ss");
          formdata.setFieldsValue(fdata);
          showModal();
        }
      });
  };

  const newFormData = async () => {
    formdata.setFieldsValue({
      entryid: 0,
      coachid: userinfo.coachid,
      memberid: null,
      householdid: householdid,
      mediateddate: null,
      orgname: null,
      servicename: null,
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
        Холбон зуучилсан үйл ажиллагааны мэдээлэл нэмэх
      </Button>

      <Table
        loading={loading}
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={false}
        rowKey={(record) => record.entryid}
      ></Table>
      <Drawer
        forceRender
        title="Холбон зуучилсан үйл ажиллагааны мэдээлэл нэмэх"
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
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          labelWrap
        >
          <Form.Item name="entryid" hidden={true} />
          <Form.Item name="householdid" hidden={true} />
          <Form.Item name="mediateddate" label="Огноо">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item
            name="orgname"
            label="Холбон зуучилсан  байгууллагын нэр"
          >
            <Select style={{ width: "100%" }}>
              {orgList?.map((t, i) => (
                <Select.Option key={i} value={t}>
                  {t}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="servicename"
            label="Холбон зуучилсан үйлчилгээний нэр"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="memberid"
            label="Үйлчилгээнд холбогдсон өрхийн гишүүний нэр"
          >
            <Select style={{ width: "100%" }}>
              {relationship?.map((t, i) => (
                <Select.Option key={i} value={t.memberid}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
