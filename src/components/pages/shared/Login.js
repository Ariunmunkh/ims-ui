import React, { useState } from "react";
import PropTypes from "prop-types";
import { api } from "../../system/api";
import ForgetPasswordPage from "./ForgetPasswordPage";
import Register from "./Register";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Popconfirm,
  Spin,
  Row,
  Col,
  Space,
} from "antd";
import "./Login.css";

import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/bg.jpg";

async function loginUser(credentials) {
  return api
    .post("/api/Systems/login", credentials)
    .then((response) => response?.data?.retdata);
}

export default function Login({ setToken }) {
  const [loading, setLoading] = useState(false);
  const [forgetpass, setForgetPass] = useState(false);
  const [register, setRegister] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const token = await loginUser({ ...values });
      setToken(token);
      setLoading(false);
      if (token) {
        window.location.reload(false);
      } else {
        message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (e) {
      setLoading(false);
      if (e.response.status === 401) {
        message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      } else message.error(e.message);
    }
  };

  if (forgetpass) return <ForgetPasswordPage setForgetPass={setForgetPass} />;
  else if (register) return <Register setRegister={setRegister} />;
  return (
    <Spin spinning={loading}>
      <Row>
        <Col span={9}>
          <div className="content">
            <div style={{ textAlign: "center" }}>
              <img src={logo} width={70} style={{ paddingBottom: 10 }}></img>
            </div>
            <Space align={"center"}></Space>
            <h5 className="text-center text-uppercase text-primary">
              Монголын улаан загалмай нийгэмлэг
            </h5>
            <p className="text-center font-italic">
              Мэдээллийн менежментийн систем
            </p>
            <hr />
            <h3 className="mb-3 ">Нэвтрэх</h3>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Бүртгэлтэй и-мэйл хаягаа оруулна уу!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="И-мэйл хаяг"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Нууц үг оруулна уу!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Нууц үг"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Намайг санах?</Checkbox>
                </Form.Item>

                <Button type="link" onClick={() => setForgetPass(true)}>
                  Нууц үгээ мартсан
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size="large"
                >
                  Нэвтрэх
                </Button>

                <Button type="link" onClick={() => setRegister(true)}>
                  Бүртгүүлэх!
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
    </Spin>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
