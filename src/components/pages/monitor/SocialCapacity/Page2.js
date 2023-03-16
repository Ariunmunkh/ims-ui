import React from "react";

import { Row, Col } from "antd";

export default function Page2() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Өрхийг идэвхижүүлэх үйл ажиллагаанд хамрагдсан өрхийн гол гишүүдийн тоо, хүйсээр /нийт, дүүрэг, хороо, коуч, үйл ажиллагааны нэр, сар/
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
