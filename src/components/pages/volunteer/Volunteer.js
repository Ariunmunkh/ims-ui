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
} from "antd";

import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export default function Volunteer() {
  const { volunteerid } = useParams();

  const { userinfo } = useUserInfo();
  const [formdata] = Form.useForm();
  const [educationlevel, seteducationlevel] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    let fdata = formdata.getFieldsValue();
    //fdata.birthday = fdata.birthday.format('YYYY/MM/DD');
    //fdata.joindate = fdata.joindate.format('YYYY/MM/DD');

    await api.post(`/api/Volunteer/set_Volunteer`, fdata).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setIsModalOpen(false);
        fetchData();
      } else {
        console.log(res?.data);
      }
    });
  };

  return (
    <div>
      <Spin spinning={loading}>
        
        <Descriptions
          title={
            <>
              "САЙН ДУРЫН ИДЭВХТНИЙ МЭДЭЭЛЭЛ"
              <Button
                type="link"
                onClick={() => {
                  showModal();
                }}
              >
                Засах
              </Button>
            </>
          }
          bordered
          style={{ paddingBottom: 30 }}
        >
          <Descriptions.Item label="Харьяалагдах улаан загалмайн хороо">
            {formdata.getFieldValue("id")}
          </Descriptions.Item>
          <Descriptions.Item label="Ургийн овог">
            {formdata.getFieldValue("familyname")}
          </Descriptions.Item>
          <Descriptions.Item label="Эцэг, эхийн нэр">
            {formdata.getFieldValue("lastname")}
          </Descriptions.Item>
          <Descriptions.Item label="Нэр">
            {formdata.getFieldValue("firstname")}
          </Descriptions.Item>
          <Descriptions.Item label="Хүйс">
            {formdata.getFieldValue("gender") === 0 ? "Эр" : "Эм"}
          </Descriptions.Item>
          <Descriptions.Item label="Нас">
            {formdata.getFieldValue("birthday")}
          </Descriptions.Item>
          <Descriptions.Item label="Регистрийн дугаар">
            {formdata.getFieldValue("regno")}
          </Descriptions.Item>
          <Descriptions.Item label="Утас">
            {formdata.getFieldValue("phone")}
          </Descriptions.Item>
          <Descriptions.Item label="И-мэйл">
            {formdata.getFieldValue("householdgroupname")}
          </Descriptions.Item>
          <Descriptions.Item label="Элссэн огноо /улаан загалмайд/">
            {formdata.getFieldValue("householdgroupname")}
          </Descriptions.Item>
          <Descriptions.Item label="Төрсөн газар">
            {formdata.getFieldValue("householdgroupname")}
          </Descriptions.Item>
          <Descriptions.Item label="Цусны бүлэг">
            {formdata.getFieldValue("bloodgroupid")}
          </Descriptions.Item>
          <Descriptions.Item label="Боловсролын түвшин">
            {formdata.getFieldValue("educationlevelid")}
          </Descriptions.Item>
          <Descriptions.Item label="Эрүүл мэндийн байдал">
            {formdata.getFieldValue("reason")}
          </Descriptions.Item>
          <Descriptions.Item label="Фэйсбүүк хаяг">
            {formdata.getFieldValue("reason")}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <Drawer
        forceRender
        title="Сайн дурын идэвхтний мэдээлэл засах"
        open={isModalOpen}
        width={720}
        onClose={handleCancel}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button key="cancel" onClick={handleCancel}>
              Болих
            </Button>
            <Button key="save" type="primary" onClick={onFinish}>
              Хадгалах
            </Button>
          </Space>
        }
      >
        <Form
          form={formdata}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          labelAlign="left"
          labelWrap
        >
          <Form.Item name="id" label="Бүртгэлийн дугаар">
            <InputNumber min={0} readOnly />
          </Form.Item>

          <Form.Item name="coachid" label="Харьяалагдах улаан загалмайн хороо">
            <Input />
          </Form.Item>

          <Form.Item name="familyname" label="Ургийн овог">
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label="Эцэг, эхийн нэр">
            <Input />
          </Form.Item>
          <Form.Item name="firstname" label="Өөрийн нэр">
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Хүйс">
            <Select
              style={{ width: "100%" }}
              options={[
                { value: 0, label: "Эмэгтэй" },
                { value: 1, label: "Эрэгтэй" },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="birthday" label="Төрсөн огноо">
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              placeholder="Өдөр сонгох"
            />
          </Form.Item>

          <Form.Item name="regno" label="Регистрийн дугаар">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Утас">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Имэйл">
            <Input />
          </Form.Item>

          <Form.Item name="joindate" label="Элссэн огноо /улаан загалмайд/">
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              placeholder="Өдөр сонгох"
            />
          </Form.Item>

          <Form.Item name="birthplace" label="Төрсөн газар">
            <Input />
          </Form.Item>

          <Form.Item name="bloodgroupid" label="Цусны бүлэг">
            <Select style={{ width: "100%" }}></Select>
          </Form.Item>

          <Form.Item name="educationlevelid" label="Боловсролын түвшин">
            <Select style={{ width: "100%" }}>
              {educationlevel?.map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="healthconditionid" label="Эрүүл мэндийн байдал">
            <Select style={{ width: "100%" }}></Select>
          </Form.Item>

          <Form.Item name="facebook" label="Фэйсбүүк хаяг">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
