import React, { useState } from "react";
import PropTypes from "prop-types";
import { api } from "../../system/api";
// import css from "./Login.css";
import ForgetPasswordPage from "./ForgetPasswordPage";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import logo from "../../../assets/images/logo.png";
import hudlogo from "../../../assets/images/hny.png";
import adblogo from "../../../assets/images/adb.png";
import bg from "../../../assets/images/bg.jpg";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

async function loginUser(credentials) {
    return api
        .post("/api/Systems/login", credentials)
        .then((response) => response?.data?.retdata);
}

export default function Login({ setToken }) {
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
            if (token) window.location.reload(false);
            else setErrorMgs("Нэвтрэх нэр эсвэл нууц үг буруу байна");
        } catch (e) {
            if (e.response.status === 401)
                setErrorMgs("Нэвтрэх нэр эсвэл нууц үг буруу байна");
            else setErrorMgs(e.message);
        }
    };
    if (forgetpass) return <ForgetPasswordPage setForgetPass={setForgetPass} />;

    return (
        <section className="vh-100">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-4 text-black position-relative mt-5">
                        <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-40 mt-5 pt-5 pt-xl-5 mt-xl-n5 position-absolute start-0">
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={handleSubmit}
                            >
                                <h2 className="text-center display-5">Төгсөлтийн аргачлал төсөл</h2>
                                <hr className="mb-5" />
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
                                        <Checkbox>Намайг санаарай</Checkbox>
                                    </Form.Item>

                                    <Button
                                        className="link-primary"
                                        onClick={(e) => setForgetPass(true)}
                                    >
                                        Нууц үгээ мартсан
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <div className="d-grid gap-2 pb-5">
                                        <Button
                                            type="button"
                                            htmlType="submit"
                                            className="btn btn-primary btn-lg"
                                            style={{ height: 50 }}
                                        >
                                            Нэвтрэх
                                        </Button>
                                    </div>
                                </Form.Item>
                                <Form.Item>{errormsg}</Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div className="col-sm-8 px-0 d-none d-sm-block">
                        <div className="bg-image">
                            <img
                                src={bg}
                                alt="zurag"
                                className="w-100 vh-100"
                                style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                            <div
                                className="position-absolute top-0 text-light w-100  m-2 p-0 rounded-4 mx-0 d-flex bg-primary bg-opacity-50 justify-content-center"
                            >
                                <div className="p-3  d-flex align-items-center text-white ">
                                    <img src={hudlogo} alt="Хөдөлмөр, нийгмийн хамгааллын яам" height={50}></img>
                                    <p className="m-2">Хөдөлмөр, нийгмийн хамгааллын яам</p>
                                </div>
                                <div className="p-2 d-flex align-items-center">
                                    <img src={adblogo} alt="Азийн хөгжлийн банк" height={50}></img>
                                    <p className="m-2">Азийн хөгжлийн банк</p>
                                </div>
                                <div className="p-2 d-flex align-items-center">
                                    <img src={logo} alt="Монголын улаан загалмай нийгэмлэг" height={50}></img>
                                    <p className="m-2">Монголын улаан загалмай нийгэмлэг</p>
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
