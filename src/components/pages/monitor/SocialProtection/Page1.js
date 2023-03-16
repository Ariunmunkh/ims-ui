import React from "react";

import { Row, Col } from "antd";

export default function Page1() {

    return (
        <div>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24}>
                    Өрхийн хэрэгцээний төрөл /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/
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
