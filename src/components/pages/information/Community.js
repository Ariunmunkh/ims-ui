import React, { useEffect, useState, useCallback } from "react";
import { api } from "../../system/api";
import {
  Space,
  Spin,
  Form,
  Button,
  Input,
  InputNumber,
  Descriptions,
} from "antd";
import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./MyComponent.css";
import { useLocation } from "react-router-dom";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Community(props) {
  const { userinfo } = useUserInfo();
  const [formdata] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const location = useLocation();
  const { committeeid } = location.state || {};

  const fetchData = useCallback(async () => {
    setLoading(true);

    api
      .get(`/api/Committee/get_LocalInfo?id=${committeeid || userinfo.committeeid}`)
      .then((res) => {
        let fdata = res?.data?.retdata[0];
        formdata.setFieldsValue(fdata);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userinfo.committeeid, formdata]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const onFinish = async (values) => {
    await api
      .post(`/api/Committee/set_LocalInfo`, formdata.getFieldsValue())
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setIsEditMode(false);
        }
      });
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
            column={3}
            title={<>" 1. ОРОН НУТГИЙН ТАЛААРХ МЭДЭЭЛЭЛ "</>}
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
                    <Button type="primary" onClick={onFinish}>
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
                formdata.getFieldValue("c1_1")
              ) : (
                <Form.Item
                  name="c1_1"
                  initialValue={formdata.getFieldValue("c1_1")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <Input />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.2. Сум/Хорооны тоо">
              {!isEditMode ? (
                formdata.getFieldValue("c1_2")
              ) : (
                <Form.Item
                  name="c1_2"
                  initialValue={formdata.getFieldValue("c1_2")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.3. Нийслэлээс алслагдсан байдал /км/ ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_3")
              ) : (
                <Form.Item
                  name="c1_3"
                  initialValue={formdata.getFieldValue("c1_3")}
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
                formdata.getFieldValue("c1_4_1")
              ) : (
                <Form.Item
                  name="c1_4_1"
                  initialValue={formdata.getFieldValue("c1_4_1")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.4. Хүн амын тоо /6-17 нас/">
              {!isEditMode ? (
                formdata.getFieldValue("c1_4_2")
              ) : (
                <Form.Item
                  name="c1_4_2"
                  initialValue={formdata.getFieldValue("c1_4_2")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.4. Хүн амын тоо /18-25 нас/">
              {!isEditMode ? (
                formdata.getFieldValue("c1_4_3")
              ) : (
                <Form.Item
                  name="c1_4_3"
                  initialValue={formdata.getFieldValue("c1_4_3")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.4. Хүн амын тоо /26-45 нас/">
              {!isEditMode ? (
                formdata.getFieldValue("c1_4_4")
              ) : (
                <Form.Item
                  name="c1_4_4"
                  initialValue={formdata.getFieldValue("c1_4_4")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.4. Хүн амын тоо /46-60 нас/">
              {!isEditMode ? (
                formdata.getFieldValue("c1_4_5")
              ) : (
                <Form.Item
                  name="c1_4_5"
                  initialValue={formdata.getFieldValue("c1_4_5")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.4. Хүн амын тоо /61+ нас/">
              {!isEditMode ? (
                formdata.getFieldValue("c1_4_6")
              ) : (
                <Form.Item
                  name="c1_4_6"
                  initialValue={formdata.getFieldValue("c1_4_6")}
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
                formdata.getFieldValue("c1_5")
              ) : (
                <Form.Item
                  name="c1_5"
                  initialValue={formdata.getFieldValue("c1_5")}
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
                formdata.getFieldValue("c1_6_1")
              ) : (
                <Form.Item
                  name="c1_6_1"
                  initialValue={formdata.getFieldValue("c1_6_1")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.6. Өрх толгойлсон эмэгтэй">
              {!isEditMode ? (
                formdata.getFieldValue("c1_6_2")
              ) : (
                <Form.Item
                  name="c1_6_2"
                  initialValue={formdata.getFieldValue("c1_6_2")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.6. Хөгжлийн бэрхшээлтэй иргэн">
              {!isEditMode ? (
                formdata.getFieldValue("c1_6_3")
              ) : (
                <Form.Item
                  name="c1_6_3"
                  initialValue={formdata.getFieldValue("c1_6_3")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.6. Өндөр настан">
              {!isEditMode ? (
                formdata.getFieldValue("c1_6_4")
              ) : (
                <Form.Item
                  name="c1_6_4"
                  initialValue={formdata.getFieldValue("c1_6_4")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.6. Хагас өнчин хүүхдийн тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_6_5")
              ) : (
                <Form.Item
                  name="c1_6_5"
                  initialValue={formdata.getFieldValue("c1_6_5")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.6. Бүтэн өнчин хүүхдийн тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_6_6")
              ) : (
                <Form.Item
                  name="c1_6_6"
                  initialValue={formdata.getFieldValue("c1_6_6")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.7. Малчин өрхийн тоо " span={3}>
              {!isEditMode ? (
                formdata.getFieldValue("c1_7")
              ) : (
                <Form.Item
                  name="c1_7"
                  initialValue={formdata.getFieldValue("c1_7")}
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
                formdata.getFieldValue("c1_8_1")
              ) : (
                <Form.Item
                  name="c1_8_1"
                  initialValue={formdata.getFieldValue("c1_8_1")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.8. Тэмээ ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_8_2")
              ) : (
                <Form.Item
                  name="c1_8_2"
                  initialValue={formdata.getFieldValue("c1_8_2")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.8. Үхэр ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_8_3")
              ) : (
                <Form.Item
                  name="c1_8_3"
                  initialValue={formdata.getFieldValue("c1_8_3")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.8. Хонь ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_8_4")
              ) : (
                <Form.Item
                  name="c1_8_4"
                  initialValue={formdata.getFieldValue("c1_8_4")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.8. Ямаа " span={2}>
              {!isEditMode ? (
                formdata.getFieldValue("c1_8_5")
              ) : (
                <Form.Item
                  name="c1_8_5"
                  initialValue={formdata.getFieldValue("c1_8_5")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.9. Төрийн өмчит аж ахуй нэгж байгууллагын тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_9")
              ) : (
                <Form.Item
                  name="c1_9"
                  initialValue={formdata.getFieldValue("c1_9")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.10. Хувийн өмчит аж ахуй нэгж байгууллагын тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_10")
              ) : (
                <Form.Item
                  name="c1_10"
                  initialValue={formdata.getFieldValue("c1_10")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.11. Орон нутагт үйл ажиллагаа явуулж буй Олон улсын байгууллагын тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_11")
              ) : (
                <Form.Item
                  name="c1_11"
                  initialValue={formdata.getFieldValue("c1_11")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.12. Орон нутагт үйл ажиллагаа явуулж буй хүмүүнлэгийн байгууллагын тоо  ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_12")
              ) : (
                <Form.Item
                  name="c1_12"
                  initialValue={formdata.getFieldValue("c1_12")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.13. Их, дээд сургуулийн тоо  ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_13")
              ) : (
                <Form.Item
                  name="c1_13"
                  initialValue={formdata.getFieldValue("c1_13")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.14. Ерөнхий боловсролын сургуулийн тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_14")
              ) : (
                <Form.Item
                  name="c1_14"
                  initialValue={formdata.getFieldValue("c1_14")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.15. Сургуулийн өмнөх боловсролын байгууллагын тоо">
              {!isEditMode ? (
                formdata.getFieldValue("c1_15")
              ) : (
                <Form.Item
                  name="c1_15"
                  initialValue={formdata.getFieldValue("c1_15")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="1.16. Жолооны курсын тоо ">
              {!isEditMode ? (
                formdata.getFieldValue("c1_16")
              ) : (
                <Form.Item
                  name="c1_16"
                  initialValue={formdata.getFieldValue("c1_16")}
                  rules={[{ required: true, message: "Please enter a value" }]}
                >
                  <InputNumber />
                </Form.Item>
              )}
            </Descriptions.Item>
            <Descriptions.Item>
              {!isEditMode ? (
                userinfo.committeeid
              ) : (
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
        </Form>
      </Spin>
    </div>
  );
}
