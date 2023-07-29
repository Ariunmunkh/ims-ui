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

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Branch() {
  const { volunteerid } = useParams();

  const { userinfo } = useUserInfo();
  const [formdata] = Form.useForm();
  const [educationlevel, seteducationlevel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchData = useCallback(() => {
    //setLoading(true);

    //api
    //  .get(
    //    `/api/Volunteer/get_Volunteer?id=${volunteerid ?? userinfo.volunteerid}`
    //  )
    //  .then((res) => {
    //    let fdata = res?.data?.retdata[0];
    //    if (fdata.birthday === "0001-01-01T00:00:00") fdata.birthday = null;
    //    else fdata.birthday = dayjs(fdata.birthday, dateFormat);
    //    fdata.birthday = null;
    //    fdata.joindate = null;
    //    formdata.setFieldsValue(fdata);
    //  })
    //  .finally(() => {
    //    setLoading(false);
    //  });
  }, [volunteerid, userinfo.volunteerid, formdata]);

  useEffect(() => {
    api
      .get(`/api/record/base/get_dropdown_item_list?type=educationlevel`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          seteducationlevel(res?.data?.retdata);
        }
      });
    fetchData();
  }, [fetchData]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      const values = await formdata.validateFields();
      // Make the API call to save the data here
      await api.post(`/api/Volunteer/set_Volunteer`, values);
      fetchData(); // Fetch updated data after saving
      setIsEditMode(false);
    } catch (error) {
      console.log("Validation Error:", error);
    }
  };

  const [data, setData] = useState([
    { key: "1", name: "John Doe", age: 25, address: "123 Main St" },
    { key: "2", name: "Jane Smith", age: 30, address: "456 Park Ave" },
  ]);

  // Function to add a new row to the table
  const handleAddRow = () => {
    const newRow = {
      key: Date.now().toString(),
      name: "",
      temdeg: 0,
      dans: "",
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
                  <Button type="primary" onClick={handleSave}>
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
          <Descriptions.Item span={3}
            label="Хэрэгжүүлж байсан төслийн нэр, хугацаа, үндсэн үйл ажиллагаа, үр дүнгийн тухай 2-3 өгүүлбэрт багтаах            /2020 оноос хойшхи/  "
          >
            {!isEditMode ? (
              formdata.getFieldValue("projectName")
            ) : (
              <Form.Item
                name="projectName"
                initialValue={formdata.getFieldValue("projectName")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <TextArea />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item span={3} className="font-weight-bold"
            label="Нөөц хөгжүүлэх үйл ажиллагааны талаарх мэдээлэл "
          >
          </Descriptions.Item>
          <Descriptions.Item span={3}
            label="Нөөц хөгжүүлэх, орлого нэмэгдүүлэх чиглэлээр хийгддэг үйл ажиллагаа /Үйл ажиллагааг жагсааж оруулах/"
          >
            {!isEditMode ? (
              formdata.getFieldValue("resource")
            ) : (
              <Form.Item
                name="resource"
                initialValue={formdata.getFieldValue("resource")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <TextArea />
              </Form.Item>
            )}
          </Descriptions.Item>
        </Descriptions>
        {!isEditMode ? (
          <Table dataSource={data} columns={columns}  title={()=> "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"}/>
        ) : (
          <Form.Item>
            <Table dataSource={data} columns={columns}  title={()=> "Удирдах зөвлөл болон Төр улаан загалмайн гишүүдийн мэдээлэл"}/>
            <Button onClick={handleAddRow} type="primary">
              Шинэ мөр нэмэх
            </Button>
          </Form.Item>
        )}
      </Spin>
    </div>
  );
}
