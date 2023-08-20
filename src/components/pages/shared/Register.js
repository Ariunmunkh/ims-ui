import React from "react";
import { Button, Form, Input, Row, Col, Space } from "antd";
import PropTypes from "prop-types";
import { api } from "../../system/api";

import "./Register.css";

import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/bg.jpg";

export default function Register({ setRegister }) {
  async function addVolunteer(volunteerdata) {
    return api
      .post("/api/Volunteer/set_Volunteer", volunteerdata)
      .then((response) => response?.data?.retdata);
  }
  async function addUser(userdata) {
    return api
      .post("/api/systems/User/set_user", userdata)
      .then((response) => response?.data?.retdata);
  }

  const onFinish = async (values) => {
    var volunteerdata = await addVolunteer(values);
    await addUser({
      username: values.email,
      password: values.password,
      email: values.email,
      roleid: 5,
      status: 0,
      volunteerid: volunteerdata.volunteerid,
    });

    setRegister(false);
  };

  return (
    <Row>
      <Col span={9}>
        <div className="content">
          <div style={{ textAlign: "center" }}>
            <img
              src={logo}
              alt="logo"
              width={70}
              style={{ paddingBottom: 10 }}
            ></img>
          </div>
          <Space align={"center"}></Space>
          <h5 className="text-center text-uppercase text-primary">
            Монголын улаан загалмай нийгэмлэг
          </h5>
          <p className="text-center font-italic">
            Мэдээллийн менежментийн систем
          </p>
          <hr />
          <h3 className="mb-3 ">Бүртгэл үүсгэх</h3>

          <Form
            onFinish={onFinish}
            name="register"
            labelCol={{ span: 8 }}
            style={{ maxWidth: 400, textAlign: "center" }}
          >
            <Form.Item name="status" label="status" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Эцэг\Эх\-н нэр"
              rules={[
                { required: true, message: "Эцэг, Эхийн нэрийг оруулна уу!" },
              ]}
            >
              <Input placeholder="Овог" />
            </Form.Item>

            <Form.Item
              name="firstname"
              label="Өөрийн нэр"
              rules={[
                {
                  required: true,
                  message: "Өөрийн нэрийг оруулна уу!",
                },
              ]}
            >
              <Input placeholder="Нэр" />
            </Form.Item>

            <Form.Item
              name="email"
              label="И-мэйл"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "И-мэйл хаягаа оруулна уу!",
                },
              ]}
            >
              <Input placeholder="И-мэйл" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг"
              rules={[
                {
                  required: true,
                  message: "Нууц үг оруулна уу!",
                },
              ]}
            >
              <Input type="password" placeholder="Нууц үг" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Нууц үг давтах"
              rules={[
                {
                  required: true,
                  message: "Нууц үг давтах!",
                },
              ]}
            >
              <Input type="password" placeholder="Нууц үг давтах" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Бүртгүүлэх
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Col span={15}>
        <img
          src={bg}
          alt="zurag"
          className="w-100 vh-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Col>
    </Row>
  );
}

Register.propTypes = {
  setForgetPass: PropTypes.func.isRequired,
};
