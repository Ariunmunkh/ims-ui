import React from "react";

import { Row, Col } from "antd";

export default function Page9() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Өрхийн орлого, зарлагын бүртгэлээ тогтмол хөтөлж буй өрхийн тоо /нийт, дүүрэг, хороо, коуч/
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
