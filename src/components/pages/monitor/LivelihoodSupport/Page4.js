import React from "react";

import { Row, Col } from "antd";

export default function Page4() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Нийт хүлээлгэн өгсөн тоног төхөөрөмжийн нийт үнэ болон дундаж  үнэ  /нийт, дүүрэг, хороо, коуч/
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
