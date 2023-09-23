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
  Popover,
} from "antd";

import useUserInfo from "../../system/useUserInfo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY.MM.DD HH:mm:ss";

export default function Volunteer() {
  const { volunteerid } = useParams();

  const { userinfo } = useUserInfo();
  const [formdata] = Form.useForm();
  const [educationlevel, seteducationlevel] = useState([]);
  const [branch, setBranch] = useState();
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    await api
      .get(
        `/api/Volunteer/get_Volunteer?id=${volunteerid ?? userinfo.volunteerid}`
      )
      .then((res) => {
        let fdata = res?.data?.retdata[0];

        fdata.birthday = fdata?.birthday
          ? dayjs(fdata?.birthday, dateFormat)
          : null;
        fdata.joindate = fdata?.joindate
          ? dayjs(fdata?.joindate, dateFormat)
          : null;

        formdata.setFieldsValue(fdata);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [volunteerid, userinfo.volunteerid]);

  useEffect(() => {
    api
      .get(`/api/record/base/get_dropdown_item_list?type=educationlevel`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          seteducationlevel(res?.data?.retdata);
        }
      });
    api.get(`/api/record/base/get_Committee_list`).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setBranch(res?.data?.retdata);
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
    fdata.birthday = fdata.birthday.format(dateFormat);
    fdata.joindate = fdata.joindate.format(dateFormat);

    await api.post(`/api/Volunteer/set_Volunteer`, fdata).then((res) => {
      if (res?.status === 200 && res?.data?.rettype === 0) {
        setIsModalOpen(false);
        fetchData();
      } else {
        console.log(res?.data);
      }
    });
  };

  const [visible, setVisible] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState("");

  const availableLetters = [
    "А",
    "Б",
    "В",
    "Г",
    "Д",
    "Е",
    "Ё",
    "Ж",
    "З",
    "И",
    "Й",
    "К",
    "Л",
    "М",
    "Н",
    "О",
    "Ө",
    "П",
    "Р",
    "С",
    "Т",
    "У",
    "Ү",
    "Ф",
    "Х",
    "Ц",
    "Ч",
    "Ш",
    "Щ",
    "Ъ",
    "Ы",
    "Ь",
    "Э",
    "Ю",
    "Я",
  ];

  const handleInputClick = () => {
    setVisible(!visible);
  };

  const handleLetterClick = (letter) => {
    setSelectedLetters(selectedLetters + letter);
  };

  const columns = 7; // Maximum letters per row

  const letterRows = [];
  for (let i = 0; i < availableLetters.length; i += columns) {
    const row = availableLetters.slice(i, i + columns);
    letterRows.push(row);
  }

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
            {formdata.getFieldValue("committee")}
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
            {formdata.getFieldValue("birthday")?.format("YYYY.MM.DD")}
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
            {formdata.getFieldValue("joindate")?.format("YYYY.MM.DD")}
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

          <Form.Item
            key="committeeid"
            name="committeeid"
            label="Харьяалагдах улаан загалмайн хороо"
          >
            <Select style={{ width: "100%" }}>
              {branch?.map((t, i) => (
                <Select.Option key={i} value={t.id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
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
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
          </Form.Item>
          <Form.Item name="regno" label="Регистрийн дугаар">
            <Popover
              content={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {letterRows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {row.map((letter, letterIndex) => (
                        <Button
                          key={letterIndex}
                          style={{
                            marginBottom: "2px",
                            flex: "1",
                          }}
                          onClick={() => handleLetterClick(letter)}
                        >
                          {letter}
                        </Button>
                      ))}
                    </div>
                  ))}
                </div>
              }
              title="РД эхний үсгээ сонгоно уу"
              trigger="click"
            >
              <Space direction="horizontal">
                <Input
                  value={selectedLetters}
                  onClick={handleInputClick}
                  style={{ width: "35px" }}
                  maxLength={1}
                />
                <Input
                  value={selectedLetters}
                  onClick={handleInputClick}
                  style={{ width: "35px" }}
                  maxLength={1}
                />
                <InputNumber maxLength={9} style={{ width: "100%" }} />
              </Space>
            </Popover>
          </Form.Item>

          <Form.Item name="phone" label="Утас">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Имэйл">
            <Input />
          </Form.Item>

          <Form.Item name="joindate" label="Элссэн огноо /улаан загалмайд/">
            <DatePicker style={{ width: "100%" }} placeholder="Өдөр сонгох" />
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
