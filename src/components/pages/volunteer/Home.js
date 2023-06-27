import React, {useState} from "react";
import { UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Avatar, Table } from "antd";
const { Meta } = Card;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const gridcolumns = [
    {
        title: "Сайн дурын ажлын төрөл",
        dataIndex: "voluntarywork",
    },
    {
        title: "Хугацаа",
        dataIndex: "duration",
    },
    {
        title: "Огноо",
        dataIndex: "voluntaryworkdate",
    },
    {
        title: "Нэмэлт мэдээлэл",
        dataIndex: "note",
    }
];
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={{ span: 12 }}>
          <Card
            hoverable={true}
            
            style={{
              textAlign: "center", backgroundColor: "#FAFAFA"
            }}
            extra={<Avatar shape="circle" icon={<UserOutlined />} />}
            title="Харьяа дунд шатны хороо"
          >
            <Meta
              style={{ textAlign: "center" }}
              // title={<Title ellipsis={true} autos level={4}>Баянзүрх дүүргийн улаан загалмайн хороо</Title>}
              title={
                <h4 className="text-primary font-weight-bold">
                  Баянзүрх дүүргийн улаан загалмайн хороо
                </h4>
              }
              description="7777-0508"
            />
          </Card>
        </Col>
        <Col xs={24} lg={{ span: 12 }}>
          <Card
            hoverable={true}
            style={{
              textAlign: "center", backgroundColor: "#FAFAFA"
            }}
            extra={
              <Avatar
                style={{
                  backgroundColor: "#1677FF",
                }}
              >
                K
              </Avatar>
            }
            title="Сайн дурын ажлын мэдээлэл"
          >
            <Meta
              style={{ textAlign: "center" }}
              title={<h4 className="text-primary font-weight-bold">12</h4>}
              description="Хийсэн сайн дурын ажлын тоо"
            />
          </Card>
        </Col>
      </Row>
<br />
      <Row>
        <Col xs={24} lg={24}>
          <Table
            size="small"
            title={()=><h5 className="font-weight-light text-secondary text-uppercase">Сайн дурын ажлын жагсаалт</h5>}
            loading={loading}
            bordered
            columns={gridcolumns}
            pagination={true}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
