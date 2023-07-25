import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import {
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
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Community() {
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

  return (
    <div>
      <Spin spinning={loading}>
        <Descriptions
          title={
            <>
              " 1. ОРОН НУТГИЙН ТАЛААРХ МЭДЭЭЛЭЛ "
            </>
          }
          extra={
            <>
              {!isEditMode && (
                <Button
                  type="primary"
                  onClick={handleEdit}
                >
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
          <Descriptions.Item label="1.1. Аймаг/Дүүргийн нэр">
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
          <Descriptions.Item label="1.2. Сум/Хорооны тоо">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfbranch")
            ) : (
              <Form.Item
                name="numberOfbranch"
                initialValue={formdata.getFieldValue("numberOfbranch")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.3. Нийслэлээс алслагдсан байдал /км/ ">
            {!isEditMode ? (
              formdata.getFieldValue("km")
            ) : (
              <Form.Item
                name="km"
                initialValue={formdata.getFieldValue("km")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="1.4. Хүн амын тоо"
            className="font-weight-bold"
            span={3}
          ></Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /0-5 нас/">
            {!isEditMode ? (
              formdata.getFieldValue("05")
            ) : (
              <Form.Item
                name="05"
                initialValue={formdata.getFieldValue("05")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /6-17 нас/">
            {!isEditMode ? (
              formdata.getFieldValue("617")
            ) : (
              <Form.Item
                name="617"
                initialValue={formdata.getFieldValue("617")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /18-25 нас/">
            {!isEditMode ? (
              formdata.getFieldValue("1825")
            ) : (
              <Form.Item
                name="1825"
                initialValue={formdata.getFieldValue("1825")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /26-45 нас/">
            {!isEditMode ? (
              formdata.getFieldValue("2645")
            ) : (
              <Form.Item
                name="2645"
                initialValue={formdata.getFieldValue("2645")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /46-60 нас/">
            {!isEditMode ? (
              formdata.getFieldValue("4660")
            ) : (
              <Form.Item
                name="4660"
                initialValue={formdata.getFieldValue("4660")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.4. Хүн амын тоо /61+ нас/">
            {!isEditMode ? (
              formdata.getFieldValue("61")
            ) : (
              <Form.Item
                name="61"
                initialValue={formdata.getFieldValue("61")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="1.5. Хөдөлмөр эрхлэгч насны хүн амын тоо"
            span={3}
          >
            {!isEditMode ? (
              formdata.getFieldValue("numberOfEmployer")
            ) : (
              <Form.Item
                name="numberOfEmployer"
                initialValue={formdata.getFieldValue("numberOfEmployer")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="1.6. Зорилтот бүлгийн хүн амын тоо "
            span={3}
            className="font-weight-bold"
          ></Descriptions.Item>
          <Descriptions.Item label="1.6. Өрх толгойлсон эрэгтэй">
            {!isEditMode ? (
              formdata.getFieldValue("16er")
            ) : (
              <Form.Item
                name="16er"
                initialValue={formdata.getFieldValue("16er")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.6. Өрх толгойлсон эмэгтэй">
            {!isEditMode ? (
              formdata.getFieldValue("16em")
            ) : (
              <Form.Item
                name="16em"
                initialValue={formdata.getFieldValue("16em")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.6. Хөгжлийн бэрхшээлтэй иргэн">
            {!isEditMode ? (
              formdata.getFieldValue("16dis")
            ) : (
              <Form.Item
                name="16dis"
                initialValue={formdata.getFieldValue("16dis")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.6. Өндөр настан">
            {!isEditMode ? (
              formdata.getFieldValue("16old")
            ) : (
              <Form.Item
                name="16old"
                initialValue={formdata.getFieldValue("16old")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.6. Хагас өнчин хүүхдийн тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("16hagas")
            ) : (
              <Form.Item
                name="16hagas"
                initialValue={formdata.getFieldValue("16hagas")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.6. Бүтэн өнчин хүүхдийн тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("16buten")
            ) : (
              <Form.Item
                name="16buten"
                initialValue={formdata.getFieldValue("16buten")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.7. Малчин өрхийн тоо " span={3}>
            {!isEditMode ? (
              formdata.getFieldValue("herders")
            ) : (
              <Form.Item
                name="herders"
                initialValue={formdata.getFieldValue("herders")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label="1.8. Малын тоо, толгой "
            span={3}
            className="font-weight-bold"
          ></Descriptions.Item>
          <Descriptions.Item label="1.8. Адуу ">
            {!isEditMode ? (
              formdata.getFieldValue("aduu")
            ) : (
              <Form.Item
                name="aduu"
                initialValue={formdata.getFieldValue("aduu")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.8. Тэмээ ">
            {!isEditMode ? (
              formdata.getFieldValue("temee")
            ) : (
              <Form.Item
                name="temee"
                initialValue={formdata.getFieldValue("temee")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.8. Үхэр ">
            {!isEditMode ? (
              formdata.getFieldValue("uher")
            ) : (
              <Form.Item
                name="uher"
                initialValue={formdata.getFieldValue("uher")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.8. Хонь ">
            {!isEditMode ? (
              formdata.getFieldValue("honi")
            ) : (
              <Form.Item
                name="honi"
                initialValue={formdata.getFieldValue("honi")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.8. Ямаа " span={2}>
            {!isEditMode ? (
              formdata.getFieldValue("yamaa")
            ) : (
              <Form.Item
                name="yamaa"
                initialValue={formdata.getFieldValue("yamaa")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.9. Төрийн өмчит аж ахуй нэгж байгууллагын тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfOrg")
            ) : (
              <Form.Item
                name="numberOfOrg"
                initialValue={formdata.getFieldValue("numberOfOrg")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.10. Хувийн өмчит аж ахуй нэгж байгууллагын тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfHuv")
            ) : (
              <Form.Item
                name="numberOfHuv"
                initialValue={formdata.getFieldValue("numberOfHuv")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.11. Орон нутагт үйл ажиллагаа явуулж буй Олон улсын байгууллагын тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfOlon")
            ) : (
              <Form.Item
                name="numberOfOlon"
                initialValue={formdata.getFieldValue("numberOfOlon")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.12. Орон нутагт үйл ажиллагаа явуулж буй хүмүүнлэгийн байгууллагын тоо  ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfHum")
            ) : (
              <Form.Item
                name="numberOfHum"
                initialValue={formdata.getFieldValue("numberOfHum")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.13. Их, дээд сургуулийн тоо  ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfUni")
            ) : (
              <Form.Item
                name="numberOfUni"
                initialValue={formdata.getFieldValue("numberOfUni")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.14. Ерөнхий боловсролын сургуулийн тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfSch")
            ) : (
              <Form.Item
                name="numberOfSch"
                initialValue={formdata.getFieldValue("numberOfSch")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.15. Сургуулийн өмнөх боловсролын байгууллагын тоо">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfKin")
            ) : (
              <Form.Item
                name="numberOfKin"
                initialValue={formdata.getFieldValue("numberOfKin")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="1.16. Жолооны курсын тоо ">
            {!isEditMode ? (
              formdata.getFieldValue("numberOfDri")
            ) : (
              <Form.Item
                name="numberOfDri"
                initialValue={formdata.getFieldValue("numberOfDri")}
                rules={[{ required: true, message: "Please enter a value" }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </div>
  );
}
