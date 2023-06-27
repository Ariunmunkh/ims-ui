import React from "react";
import { UserOutlined  } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
const { Meta } = Card;

export default function Home() {
  return <>
  <Row>
    <Col span={12}>
    <Card
    style={{
      width: 400, textAlign: 'center',
    }}
    extra={<UserOutlined/>}
    title="Сайн дурын ажлын мэдээлэл"
  >
    <Meta
    style={{textAlign: 'center'}}
      title="12"
      description="Хийсэн сайн дурын ажлын тоо"
    />
  </Card>
    </Col>
    <Col span={12}>
    <Card
    style={{
      width: 400, textAlign: 'center',
    }}
    extra={<UserOutlined/>}
    title="Сайн дурын ажлын мэдээлэл"
  >
    <Meta
    style={{textAlign: 'center'}}
      title="12"
      description="Хийсэн сайн дурын ажлын тоо"
    />
  </Card>
    </Col>
  </Row>
  
  </>;
}
