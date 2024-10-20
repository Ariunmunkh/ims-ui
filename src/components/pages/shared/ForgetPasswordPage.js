import React from "react";
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    Space,
} from "antd";
import { api } from "../../system/api";
import PropTypes from "prop-types";
import "./ForgetPasswordPage.css";
import logo from "../../../assets/images/logo.png";
import bg from "../../../assets/images/bg.jpg";
import { message } from "antd";
export default function ForgetPasswordPage({ setForgetPass }) {
    const onFinish = (values) => {
        api.post("/api/Systems/password_recovery", values.email)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0)
                    message.success("Амжилттай илгээлээ");
                else
                    message.error("Алдаа гарлаа:" + res?.data?.retmsg);
            })
            .finally(() => {
                setForgetPass(false);
            });
    };

    return (
        <Row>
            <Col span={9}>
                <div className="content">
                    <div style={{ textAlign: "center" }}>
                        <img src={logo} alt="logo" width={70} style={{ paddingBottom: 10 }}></img>
                    </div>
                    <Space align={"center"}></Space>
                    <h5 className="text-center text-uppercase text-primary">
                        Монголын улаан загалмай нийгэмлэг
                    </h5>
                    <p className="text-center font-italic">
                        Мэдээллийн менежментийн систем
                    </p>
                    <hr />
                    <h5>Нууц үг өөрчлөх</h5>
                    <p className="font-italic font-weight-light">
                        Бүртгэлтэй и-мэйл хаягаа оруулна уу. Бид танд шинэ нууц үгийг таны бүртгэлтэй и-мэйл хаяг руу илгээх болно.
                    </p>
                    <Form onFinish={onFinish}>
                        <Form.Item
                            name="email"
                            label="И-мэйл хаяг"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Имэйл хаягаа оруулна уу!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Нууц үг шинэчлэх
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

ForgetPasswordPage.propTypes = {
    setForgetPass: PropTypes.func.isRequired,
};
