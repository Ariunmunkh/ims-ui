import React from "react";

import { Row, Col } from "antd";

export default function Page1() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Санхүүгийн анхан шатны сургалтанд хамрагдсан өрхийн гол гишүүний тоо, эзлэх хувь%, хүйсээр /нийт, дүүрэг, хороо, коуч, сургалтын нэр, сар/
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
