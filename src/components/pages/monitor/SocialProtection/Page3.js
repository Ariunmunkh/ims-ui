import React from "react";

import { Row, Col } from "antd";

export default function Page3() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Нийгмийн хамгааллын үйлчилгээнд холбон зуучлагдсан өрхийн тоо /нийт өрх, дүүрэг, хороо, коуч, холбон зуучлагдсан төрөл/
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Хөгжүүлэгдэж байгаа..
                </Col>
            </Row>
        </div>
    );
}
