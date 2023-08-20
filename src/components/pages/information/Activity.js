import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
  Drawer,
  Space,
  Spin,
  Form,
  Button,
  Input,
  Select,
  InputNumber,
  Descriptions,
  DatePicker,
  Row,
  Col,
  Switch,
  Table,
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Branch() {
  const { volunteerid } = useParams();

  const { userinfo } = useUserInfo();
  const [formdata] = Form.useForm();
  const [educationlevel, seteducationlevel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const { committeeid } = location.state || {};
  const [data, setData] = useState([]);
  const fetchData = useCallback(() => {
    setLoading(true);
    api
      .get(
        `/api/Committee/get_committeeactivity?id=${
          committeeid || userinfo.committeeid
        }`
      )
      .then((res) => {
        let fdata = res?.data?.retdata[0];
        formdata.setFieldsValue(fdata);
      })
      .finally(() => {
        setLoading(false);
      });


  }, [volunteerid, userinfo.volunteerid, formdata]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const onFinish = async (values) => {
    let fdata = formdata.getFieldsValue();

    await api
      .post(`/api/Committee/set_committeeactivity`, fdata)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsEditMode(false); // Exit edit mode after successful save
          fetchData();
        } else {
          console.log(res?.data);
        }
      });
  };

  // Function to add a new row to the table
  const handleAddRow = () => {
    const newRow = {
      committeeid: userinfo.committeeid || committeeid,
      name: '',
      job: '',
      type: false,
    };
    setData([...data, newRow]);
  };

  const columns = [
    {
      title: "Овог, нэр",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <>
          {!isEditMode ? (
            <Input value={text} key={record.name} readOnly></Input>
          ) : (
            <Form.Item>
              <Input value={text} key={record.name}></Input>
            </Form.Item>
          )}
        </>
      ),
    },
    {
      title: "Албан тушаал",
      dataIndex: "position",
      key: "position",
      render: (text, record) => (
        <>
          {!isEditMode ? (
            <Input value={text} key={record.name} readOnly></Input>
          ) : (
            <Form.Item>
              <Input value={text} key={record.name}></Input>
            </Form.Item>
          )}
        </>
      ),
    },
    {
      title: "Гишүүний төрөл",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <Switch
          checkedChildren="Удирдах зөвлөл"
          unCheckedChildren="Төр-Улаан загалмай"
          style={{ width: "100%" }}
        />
      ),
    },
  ];

  const handleInputChange = (e, key, dataIndex) => {
    const { value } = e.target;
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [dataIndex]: value } : item
      )
    );
  };

  return (
    <div>
      <Spin spinning={loading}>
        <Form
          form={formdata}
          onFinish={onFinish}
          column={{
            xxl: 4,
            xl: 3,
            lg: 3,
            md: 3,
            sm: 2,
            xs: 1,
          }}
        >
          <Descriptions
            title={<>" 3. ҮЙЛ АЖИЛЛАГААНЫ ТАЛААРХ МЭДЭЭЛЭЛ "</>}
            extra={
              <>
                {!isEditMode && (
                  <Button type="primary" onClick={handleEdit}>
                    ЗАСАХ
                  </Button>
                )}
                {isEditMode && (
                  <Space>
                    <Button onClick={() => setIsEditMode(false)}>Цуцлах</Button>
                    <Button type="primary" htmlType="submit">
                      Хадгалах
                    </Button>
                  </Space>
                )}
              </>
            }
            bordered
          >
            <Descriptions.Item
              label="Байгууллагын хөгжлийн талаарх мэдээлэл  "
              className="font-weight-bold"
              span={3}
            ></Descriptions.Item>
            <Descriptions.Item
              span={3}
              label="Хэрэгжүүлж байсан төслийн нэр, хугацаа, үндсэн үйл ажиллагаа, үр дүнгийн тухай 2-3 өгүүлбэрт багтаах            /2020 оноос хойшхи/  "
            >
              {!isEditMode ? (
                formdata.getFieldValue("c3_3")
              ) : (
                <Form.Item
                  name="c3_3"
                  initialValue={formdata.getFieldValue("c3_3")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <TextArea />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              className="font-weight-bold"
              label="Нөөц хөгжүүлэх үйл ажиллагааны талаарх мэдээлэл "
            ></Descriptions.Item>
            <Descriptions.Item
              span={3}
              label="Нөөц хөгжүүлэх, орлого нэмэгдүүлэх чиглэлээр хийгддэг үйл ажиллагаа /Үйл ажиллагааг жагсааж оруулах/"
            >
              {!isEditMode ? (
                formdata.getFieldValue("c3_4")
              ) : (
                <Form.Item
                  name="c3_4"
                  initialValue={formdata.getFieldValue("c3_4")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <TextArea />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item>
              {!isEditMode ? null : (
                <Form.Item
                  name="committeeid"
                  initialValue={userinfo.committeeid}
                  rules={[{ required: true, message: "Please enter a value" }]}
                  hidden
                >
                  <Input />
                </Form.Item>
              )}
            </Descriptions.Item>
          </Descriptions>
          {!isEditMode ? (
            <Table
              dataSource={data}
              columns={columns}
              title={() =>
                "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"
              }
            />
          ) : (
            <>
              <Table
                dataSource={data}
                columns={columns}
                title={() =>
                  "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"
                }
              />
              <Button onClick={handleAddRow} type="primary">
                Шинэ мөр нэмэх
              </Button>
            </>
          )}
        </Form>
      </Spin>
    </div>
  );
}
