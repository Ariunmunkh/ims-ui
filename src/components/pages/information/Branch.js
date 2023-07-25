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
    setLoading(true);

    api
      .get(
        `/api/Volunteer/get_Volunteer?id=${volunteerid ?? userinfo.volunteerid}`
      )
      .then((res) => {
        let fdata = res?.data?.retdata[0];
        if (fdata.birthday === "0001-01-01T00:00:00") fdata.birthday = null;
        else fdata.birthday = dayjs(fdata.birthday, dateFormat);
        fdata.birthday = null;
        fdata.joindate = null;
        formdata.setFieldsValue(fdata);
      })
      .finally(() => {
        setLoading(false);
      });
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
      title: "Сум / Хороо дахь анхан шатны хорооны нэр",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <>
          {!isEditMode ? (
            <Input value={text} key={record.name} readOnly></Input>
          ) : (
            <Form.Item
              name="otherAsset"
              initialValue={formdata.getFieldValue("otherAsset")}
              rules={[{ required: true, message: "Please enter a value" }]}
            >
              <Input value={text} key={record.name}></Input>
            </Form.Item>
          )}
        </>
      ),
    },
    {
      title: "Тэмдэг",
      dataIndex: "temdeg",
      key: "temdeg",
      render: (text, record) => (
        <Switch
          checkedChildren="Тийм"
          unCheckedChildren="Үгүй"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Банкны данс",
      dataIndex: "dans",
      key: "dans",
      render: (text, record) => (
        <Switch
          checkedChildren="Тийм"
          unCheckedChildren="Үгүй"
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
          title={<>" 2. ДУНД ШАТНЫ ХОРООНЫ ТАЛААРХ МЭДЭЭЛЭЛ "</>}
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
            label="Үндсэн мэдээлэл"
            span={3}
            className="font-weight-bold"
          ></Descriptions.Item>
          <Descriptions.Item label="2.1. Дунд шатны хорооны нэр ">
            {!isEditMode ? (
              formdata.getFieldValue("branchname")
            ) : (
              <Form.Item
                name="branchname"
                initialValue={formdata.getFieldValue("branchname")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.2. Байгуулагдсан он, сар, өдөр">
            {!isEditMode ? (
              formdata.getFieldValue("date")
            ) : (
              <Form.Item
                name="date"
                initialValue={formdata.getFieldValue("date")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <DatePicker />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.3. Хаяг, байршил ">
            {!isEditMode ? (
              formdata.getFieldValue("location")
            ) : (
              <Form.Item
                name="location"
                initialValue={formdata.getFieldValue("location")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.4. Утасны дугаар">
            {!isEditMode ? (
              formdata.getFieldValue("number")
            ) : (
              <Form.Item
                name="number"
                initialValue={formdata.getFieldValue("number")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.4. И-мэйл хаяг " span={2}>
            {!isEditMode ? (
              formdata.getFieldValue("email")
            ) : (
              <Form.Item
                name="email"
                initialValue={formdata.getFieldValue("email")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="Хүний нөөцийн талаарх мэдээлэл "
            className="font-weight-bold"
            span={3}
          ></Descriptions.Item>
          <Descriptions.Item label="2.6. Үндсэн ажилтаны тоо">
            {!isEditMode ? (
              formdata.getFieldValue("numOfEmp")
            ) : (
              <Form.Item
                name="numOfEmp"
                initialValue={formdata.getFieldValue("numOfEmp")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.7. Гэрээт ажилтаны тоо">
            {!isEditMode ? (
              formdata.getFieldValue("numOfGereet")
            ) : (
              <Form.Item
                name="numOfGereet"
                initialValue={formdata.getFieldValue("numOfGereet")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.8. Бүртгэлтэй Сайн дурын идэвхтний тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numOfVol")
            ) : (
              <Form.Item
                name="numOfVol"
                initialValue={formdata.getFieldValue("numOfVol")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="2.9. Гишүүнчлэл"
            span={3}
            className="font-weight-bold"
          ></Descriptions.Item>
          <Descriptions.Item label="2.9. Гишүүн">
            {!isEditMode ? (
              formdata.getFieldValue("mem")
            ) : (
              <Form.Item
                name="mem"
                initialValue={formdata.getFieldValue("mem")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.9. Онцгой гишүүн">
            {!isEditMode ? (
              formdata.getFieldValue("Onmem")
            ) : (
              <Form.Item
                name="Onmem"
                initialValue={formdata.getFieldValue("Onmem")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.9. Мөнгөн гишүүн">
            {!isEditMode ? (
              formdata.getFieldValue("Munmem")
            ) : (
              <Form.Item
                name="Munmem"
                initialValue={formdata.getFieldValue("Munmem")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.9. Алтан гишүүн" span={3}>
            {!isEditMode ? (
              formdata.getFieldValue("Altmem")
            ) : (
              <Form.Item
                name="Altmem"
                initialValue={formdata.getFieldValue("Altmem")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="2.10. Хүмүүнлэгийн гишүүн байгууллагын тоо"
            span={3}
          >
            {!isEditMode ? (
              formdata.getFieldValue("NumOfHum")
            ) : (
              <Form.Item
                name="NumOfHum"
                initialValue={formdata.getFieldValue("NumOfHum")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="2.11. Хүүхэд залуучуудын хөдөлгөөний гишүүний тоо "
            span={3}
          ></Descriptions.Item>
          <Descriptions.Item label="2.11. Багачуудын улаан загалмайч">
            {!isEditMode ? (
              formdata.getFieldValue("baga")
            ) : (
              <Form.Item
                name="baga"
                initialValue={formdata.getFieldValue("baga")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.11. Өсвөрийн улаан загалмайч">
            {!isEditMode ? (
              formdata.getFieldValue("usvur")
            ) : (
              <Form.Item
                name="usvur"
                initialValue={formdata.getFieldValue("usvur")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.11. Залуучуудын улаан загалмайч">
            {!isEditMode ? (
              formdata.getFieldValue("zaluu")
            ) : (
              <Form.Item
                name="zaluu"
                initialValue={formdata.getFieldValue("zaluu")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.11. Идэр улаан загалмайч" span={3}>
            {!isEditMode ? (
              formdata.getFieldValue("ider")
            ) : (
              <Form.Item
                name="ider"
                initialValue={formdata.getFieldValue("ider")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="Үндсэн хөрөнгийн талаарх мэдээлэл "
            className="font-weight-bold"
            span={3}
          ></Descriptions.Item>
          <Descriptions.Item label="2.12. ДШХ-ны эзэмшлийн газартай эсэх ">
            {!isEditMode ? (
              formdata.getFieldValue("Isgazar")
            ) : (
              <Form.Item
                name="Isgazar"
                initialValue={formdata.getFieldValue("Isgazar")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Switch
                  checkedChildren="Тийм"
                  unCheckedChildren="Үгүй"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.12. Эзэмшлийн газрын зориулалт ">
            {!isEditMode ? (
              formdata.getFieldValue("gazarZor")
            ) : (
              <Form.Item
                name="gazarZor"
                initialValue={formdata.getFieldValue("gazarZor")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.12. Талбайн хэмжээ ">
            {!isEditMode ? (
              formdata.getFieldValue("gazarTalbai")
            ) : (
              <Form.Item
                name="gazarTalbai"
                initialValue={formdata.getFieldValue("gazarTalbai")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="2.12. Хэрэв үгүй бол Газрын зориулалт"
            span={3}
          >
            {!isEditMode ? (
              formdata.getFieldValue("NoGazarZor")
            ) : (
              <Form.Item
                name="NoGazarZor"
                initialValue={formdata.getFieldValue("NoGazarZor")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.13. ДШХ-ны эзэмшлийн байртай эсэх ">
            {!isEditMode ? (
              formdata.getFieldValue("Isbar")
            ) : (
              <Form.Item
                name="Isbar"
                initialValue={formdata.getFieldValue("Isbar")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
            {formdata.getFieldValue("")}
          </Descriptions.Item>
          <Descriptions.Item label="2.13.Эзэмшлийн байрны тоо">
            {!isEditMode ? (
              formdata.getFieldValue("bairZor")
            ) : (
              <Form.Item
                name="bairZor"
                initialValue={formdata.getFieldValue("bairZor")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
            {formdata.getFieldValue("bairZor")}
          </Descriptions.Item>
          <Descriptions.Item label="2.13. Талбайн хэмжээ ">
            {!isEditMode ? (
              formdata.getFieldValue("bairTalbai")
            ) : (
              <Form.Item
                name="bairTalbai"
                initialValue={formdata.getFieldValue("bairTalbai")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.13. Өрөөний тоо">
            {!isEditMode ? (
              formdata.getFieldValue("uruuToo")
            ) : (
              <Form.Item
                name="uruuToo"
                initialValue={formdata.getFieldValue("uruuToo")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="2.13. Хэрэв үгүй бол байрны зориулалт"
            span={2}
          >
            {!isEditMode ? (
              formdata.getFieldValue("NoBairZor")
            ) : (
              <Form.Item
                name="NoBairZor"
                initialValue={formdata.getFieldValue("NoBairZor")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Input />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.14. ДШХ-ны эзэмшлийн агуулахтай эсэх ">
            {!isEditMode ? (
              formdata.getFieldValue("IsStorage")
            ) : (
              <Form.Item
                name="IsStorage"
                initialValue={formdata.getFieldValue("IsStorage")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Switch
                  checkedChildren="Тийм"
                  unCheckedChildren="Үгүй"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.14. Ашиглалтанд орсон огноо ">
            {!isEditMode ? (
              formdata.getFieldValue("storageDate")
            ) : (
              <Form.Item
                name="storageDate"
                initialValue={formdata.getFieldValue("storageDate")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <DatePicker />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.14. Талбайн хэмжээ">
            {!isEditMode ? (
              formdata.getFieldValue("storageTalbai")
            ) : (
              <Form.Item
                name="storageTalbai"
                initialValue={formdata.getFieldValue("storageTalbai")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.15. ДШХ-ны эзэмшлийн тээврийн хэрэгсэлтэй эсэх">
            {!isEditMode ? (
              formdata.getFieldValue("IsCar")
            ) : (
              <Form.Item
                name="IsCar"
                initialValue={formdata.getFieldValue("IsCar")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <Switch
                  checkedChildren="Тийм"
                  unCheckedChildren="Үгүй"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="2.15. Тээврийн хэрэгслийн тоо " span={2}>
            {!isEditMode ? (
              formdata.getFieldValue("numberOfCar")
            ) : (
              <Form.Item
                name="numberOfCar"
                initialValue={formdata.getFieldValue("numberOfCar")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label="2.15. Тээврийн хэрэгслийн тайлбар /Марк, ашигласан хугацаа, Монголд орж ирсэн огноо/"
          >
            {!isEditMode ? (
              formdata.getFieldValue("descOfCar")
            ) : (
              <Form.Item
                name="descOfCar"
                initialValue={formdata.getFieldValue("descOfCar")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <TextArea />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            span={3}
            label="2.16. Бусад хөрөнгө /зөөврийн болон суурийн компьютер, принтер гэх мэтийг дурдах/  "
          >
            {!isEditMode ? (
              formdata.getFieldValue("otherAsset")
            ) : (
              <Form.Item
                name="otherAsset"
                initialValue={formdata.getFieldValue("otherAsset")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <TextArea />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="Анхан шатны хорооны талаарх мэдээлэл"
            className="font-weight-bold"
            span={3}
          ></Descriptions.Item>
        </Descriptions>
        {!isEditMode ? (
          <Table dataSource={data} columns={columns} />
        ) : (
          <>
            <Table dataSource={data} columns={columns} />
            <Button onClick={handleAddRow} type="primary">
              Шинэ мөр нэмэх
            </Button>
          </>
        )}
      </Spin>
    </div>
  );
}
