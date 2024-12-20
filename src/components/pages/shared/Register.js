import React from "react";
import { Button, Form, Input, Row, Col, Space } from "antd";
import PropTypes from "prop-types";
import { api } from "../../system/api";
import { message } from "antd";

import "./Register.css";

import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/bg.jpg";

export default function Register({ setRegister }) {
    async function addVolunteer(volunteerdata) {
        return api
            .post("/api/Volunteer/set_Volunteer", volunteerdata)
            .then((response) => response?.data?.retdata);
    }
    async function removeVolunteer(volunteerid) {
        return api
            .delete("/api/Volunteer/delete_Volunteer?id=" + volunteerid)
            .then((response) => response?.data?.retdata);
    }
    async function addUser(userdata) {
        return api
            .post("/api/systems/User/set_user", userdata)
            .then((response) => response?.data);
    }

    const onFinish = async (values) => {
        var volunteerdata = await addVolunteer(values);
        var userdata = await addUser({
            username: values.email,
            password: values.password,
            email: values.email,
            roleid: 5,
            status: 0,
            volunteerid: volunteerdata.volunteerid,
        });

        if (userdata.rettype !== 0) {
            removeVolunteer(volunteerdata.volunteerid);
        }
        else {
            message.success("Амжилттай");
            setRegister(false);
        }
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
                            label="Нууц үг"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Нууц үг оруулна уу!",
                                },
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>

                        <Form.Item
                            label="Нууц үг давтах"
                            name="password2"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ижилхэн нууц үг оруулна уу!'));
                                    },
                                }),
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>


                        <Form.Item>
                            <Space wrap>
                                <Button type="primary" htmlType="submit" size="large">
                                    Бүртгүүлэх
                                </Button>

                                <Button type="dashed" onClick={() => { setRegister(false) }} size="large" >
                                    Буцах
                                </Button>
                            </Space>
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
