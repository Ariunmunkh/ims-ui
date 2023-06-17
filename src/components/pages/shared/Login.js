import React, { useState } from "react";
import PropTypes from "prop-types";
import { api } from "../../system/api";
import ForgetPasswordPage from "./ForgetPasswordPage";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, Popconfirm, Spin } from "antd";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import ims1 from "../../../assets/images/ims1.svg";
import bg from "../../../assets/images/bg.jpg";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

async function loginUser(credentials) {
  return api
    .post("/api/Systems/login", credentials)
    .then((response) => response?.data?.retdata);
}

export default function Login({ setToken }) {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errormsg, setErrorMgs] = useState();
  const [forgetpass, setForgetPass] = useState(false);

  const handleSubmit = async (e) => {
    try {
      const token = await loginUser({
        username,
        password,
      });
      setToken(token);
      if (token) {
        window.location.reload(false);
        setLoading(true);
      } else {
        setLoading(false);
        message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (e) {
      if (e.response.status === 401) {
        setLoading(true);
        message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
        setLoading(false);
      } else setErrorMgs(e.message);
    }
  };
  if (forgetpass) return <ForgetPasswordPage setForgetPass={setForgetPass} />;

  return (
    <section className="vh-100">
      <div className="container-fluid">
        <div className="row">
          <Spin spinning={loading}></Spin>
          <div className="col-md-6 col-lg-4 text-black d-flex align-content-center flex-wrap mt-2">
            <div className="d-flex align-content-center flex-wrap ml-2">
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
              >
                <img
                  src={logo}
                  alt="Монголын улаан загалмай нийгэмлэг"
                  height={70}
                  className="mx-auto d-block mb-3"
                ></img>

                <h4 className="text-center text-uppercase font-weight-normal text-primary">
                  Монголын улаан загалмай нийгэмлэг
                </h4>
                <p className="text-center font-weight-light font-italic text-secondary">
                  Цахим мэдээллийн систем
                </p>
                <hr className="mb-4" />
                <h3 className="mb-3 ">Нэвтрэх</h3>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Хэрэглэгчийн нэрээ оруулна уу!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="form-control" />}
                    placeholder="Хэрэглэгчийн нэр"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
                >
                  <Input
                    prefix={<LockOutlined className="form-control" />}
                    type="password"
                    placeholder="Нууц үг"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="font-weight-light">
                      Намайг санаарай
                    </Checkbox>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <div className="d-grid gap-2">
                    <Button
                      type="button"
                      name="button"
                      htmlType="submit"
                      className="btn btn-primary btn-lg"
                      style={{ height: 50 }}
                    >
                      Нэвтрэх
                    </Button>
                  </div>
                </Form.Item>
                <Form.Item>
                  <Form.Item name="register">
                    <p className="font-weight-light font-italic text-right">
                      Бүртгэлгүй бол
                      <Link
                        to={'register'}
                        className="text-primary font-weight-bold"
                      >
                        &nbsp;ЭНД&nbsp;
                      </Link>
                      дарж бүртгүүлнэ үү.
                    </p>
                    <Link to="/register">
                      <button variant="outlined">Sign up</button>
                    </Link>
                  </Form.Item>
                  <Popconfirm cancelText={errormsg}></Popconfirm>
                </Form.Item>
              </Form>
            </div>
          </div>
          <div className="col-md-6 col-lg-8 px-0 d-none d-sm-block d-none d-md-block">
            <div className="bg-image">
              <img
                src={bg}
                alt="zurag"
                className="w-100 vh-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div className="position-absolute bottom-0 text-light w-100  m-2 p-0 rounded-4 mx-0 d-flex bg-primary bg-opacity-50 justify-content-center">
                <div className="p-3  d-flex align-items-center text-white ">
                  <img
                    src={ims1}
                    alt="Хөдөлмөр, нийгмийн хамгааллын яам"
                    height={50}
                  ></img>
                  <p className="m-2">Сайн дурын идэвхтний бүртгэл</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
