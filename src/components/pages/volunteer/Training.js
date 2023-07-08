import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
  Table,
  Modal,
  Drawer,
  Space,
  Form,
  Button,
  DatePicker,
  Select,
  Divider,
  InputNumber,
  Switch,
  Typography,
  Input,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
const { confirm } = Modal;
const { Text } = Typography;

export default function Training() {
  const { householdid } = useParams();
  const [relationship, setrelationship] = useState([]);
  const [griddata, setGridData] = useState();
  const [loading, setLoading] = useState(true);
  const [formdata] = Form.useForm();
  const [trainingcategory, settrainingcategory] = useState([]);
  const [trainingtypecopy, settrainingtypecopy] = useState([]);
  const [trainingtype, settrainingtype] = useState([]);
  const [trainingandactivitycopy, settrainingandactivitycopy] = useState([]);
  const [trainingandactivity, settrainingandactivity] = useState([]);
  const [organization, setorganization] = useState([]);
  const [formoftraining, setformoftraining] = useState([]);

  const fetchData = useCallback(() => {
    // setLoading(true);
    // api.get(`/api/record/coach/get_training_list?id=${householdid}`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             setGridData(res?.data?.retdata);
    //         }
    //     })
    //     .finally(() => {
    //         setLoading(false);
    //     });
  }, [householdid]);

  const tableOnRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        getFormData(record.entryid);
      },
    };
  };

  useEffect(() => {
    // api.get(`/api/record/households/get_householdmember_list?householdid=${householdid}`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             setrelationship(res?.data?.retdata);
    //         }
    //     });
    // api.get(`/api/record/base/get_dropdown_item_list?type=trainingcategory`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             settrainingcategory(res?.data?.retdata);
    //         }
    //     });
    // api.get(`/api/record/base/get_dropdown_item_list?type=trainingtype`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             settrainingtype(res?.data?.retdata);
    //         }
    //     });
    // api.get(`/api/record/base/get_dropdown_item_list?type=trainingandactivity`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             settrainingandactivity(res?.data?.retdata);
    //         }
    //     });
    // api.get(`/api/record/base/get_dropdown_item_list?type=organization`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             setorganization(res?.data?.retdata);
    //         }
    //     });
    // api.get(`/api/record/base/get_dropdown_item_list?type=formoftraining`)
    //     .then((res) => {
    //         if (res?.status === 200 && res?.data?.rettype === 0) {
    //             setformoftraining(res?.data?.retdata);
    //         }
    //     });
    // fetchData();
  }, [fetchData, householdid]);

  const gridcolumns = [
    {
      title: "Сургалтын нэр",
      dataIndex: "training",
    },
    {
      title: "Түвшин",
      dataIndex: "level",
    },
    {
      title: "Сургалтад хамрагдсан өдөр",
      dataIndex: "duration",
    },
    {
      title: "Сургалтад хамрагдсан байршил",
      dataIndex: "location",
    },
    {
      title: "Нэмэлт мэдээлэл",
      dataIndex: "description",
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
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        onDelete();
      },
    });
  };

  const onDelete = async () => {
    await api
      .delete(
        `/api/record/coach/delete_training?id=${formdata.getFieldValue(
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
    fdata.trainingdate = fdata.trainingdate.format("YYYY.MM.DD HH:mm:ss");
    await api.post(`/api/record/coach/set_training`, fdata).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setIsModalOpen(false);
        fetchData();
      }
    });
  };

  const getFormData = async (entryid) => {
    await api
      .get(`/api/record/coach/get_training?id=${entryid}`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          let fdata = res?.data?.retdata[0];
          fdata.trainingdate = dayjs(fdata.trainingdate, "YYYY.MM.DD HH:mm:ss");
          formdata.setFieldsValue(fdata);
          showModal();
        }
      });
  };

  const newFormData = async () => {
    formdata.setFieldsValue({
      entryid: 0,
      householdid: householdid,
      trainingdate: null,
      trainingcategoryid: null,
      trainingtypeid: null,
      trainingandactivityid: null,
      formoftrainingid: null,
      organizationid: null,
      duration: null,
      isjoin: null,
      memberid: null,
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
        Хамрагдсан сургалт нэмэх
      </Button>

      <Table
        size="small"
        columns={gridcolumns}
        dataSource={griddata}
        onRow={tableOnRow}
        pagination={true}
        rowKey={(record) => record.entryid}
      ></Table>
      <Drawer
        forceRender
        title="Хамрагдсан сургалт нэмэх"
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
          onFieldsChange={(changedFields, allFields) => {
            if (changedFields[0]?.name[0] === "trainingcategoryid") {
              formdata.setFieldValue("trainingtypeid", null);
              formdata.setFieldValue("trainingandactivityid", null);
              settrainingtypecopy(
                trainingtype?.filter(
                  (row) =>
                    row?.trainingcategoryid ===
                    formdata?.getFieldValue("trainingcategoryid")
                )
              );
            } else if (changedFields[0]?.name[0] === "trainingtypeid") {
              formdata.setFieldValue("trainingandactivityid", null);
              settrainingandactivitycopy(
                trainingandactivity?.filter(
                  (row) =>
                    row?.trainingtypeid ===
                    formdata?.getFieldValue("trainingtypeid")
                )
              );
            }
          }}
        >
          <Form.Item name="entryid" hidden={true} />
          <Form.Item name="householdid" hidden={true} />

          <Form.Item name="training" label="Сургалтын нэр">
            <Select style={{ width: "100%" }}></Select>
          </Form.Item>
          <Form.Item name="level" label="Түвшин">
            <Select style={{ width: "100%" }}>
              {/* Анхан шат, Дунд шат, Ахисан шат */}
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Сургалтад хамрагдсан өдөр">
            <InputNumber
              placeholder="Хугацаа"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="location" label="Сургалтад хамрагдсан байршил">
           <Input/>
          </Form.Item>

          <Form.Item
            name="description"
            label="Нэмэлт мэдээлэл"
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
