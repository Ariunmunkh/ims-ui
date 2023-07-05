import React, { useState } from "react";
import { Card, Col, Row, Steps, Divider, Table, Space, Button } from "antd";
const { Meta } = Card;

export default function Report() {
  let date = new Date().toISOString().split("T")[0];
  const description = date + " сарын тайлан";
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(2);

  const gridcolumns = [
    {
      title: "0-5",
      children: [
        {
          title: "эр",
          dataIndex: "c1",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c2",
          key: "эм",
        },
      ],
    },
    {
      title: "6-12",
      children: [
        {
          title: "эр",
          dataIndex: "c3",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c4",
          key: "эм",
        },
      ],
    },
    {
      title: "13-17",
      children: [
        {
          title: "эр",
          dataIndex: "c5",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c6",
          key: "эм",
        },
      ],
    },
    {
      title: "18-29",
      children: [
        {
          title: "эр",
          dataIndex: "c7",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c8",
          key: "эм",
        },
      ],
    },
    {
      title: "30-39",
      children: [
        {
          title: "эр",
          dataIndex: "c9",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c10",
          key: "эм",
        },
      ],
    },
    {
      title: "40-49",
      children: [
        {
          title: "эр",
          dataIndex: "c11",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c12",
          key: "эм",
        },
      ],
    },
    {
      title: "50-59",
      children: [
        {
          title: "эр",
          dataIndex: "c13",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c14",
          key: "эм",
        },
      ],
    },
    {
      title: "60-69",
      children: [
        {
          title: "эр",
          dataIndex: "c15",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c16",
          key: "эм",
        },
      ],
    },
    {
      title: "70-79",
      children: [
        {
          title: "эр",
          dataIndex: "c17",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c18",
          key: "эм",
        },
      ],
    },
    {
      title: "80+",
      children: [
        {
          title: "эр",
          dataIndex: "c19",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c20",
          key: "эм",
        },
      ],
    },
    {
      title: "Хөгжлийн бэрхшээлтэй эсэх",
      children: [
        {
          title: "эр",
          dataIndex: "c21",
          key: "эр",
        },
        {
          title: "эм",
          dataIndex: "c22",
          key: "эм",
        },
      ],
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">Засах</Button>
        </Space>
      ),
    },
    
  ];

  const data = [
    {
      key: "1",
      c1: "0",
      c2: "0",
      c3: "0",
      c4: "0",
      c5: "0",
      c6: "0",
      c7: "0",
      c8: "0",
      c9: "0",
      c10: "0",
      c11: "0",
      c12: "0",
      c13: "0",
      c14: "0",
      c15: "0",
      c16: "0",
      c17: "0",
      c18: "0",
      c19: "0",
      c20: "0",
      c21: "0",
      c22: "0",
    },
  ];
  return (
    <>
      <Row>
        <Col xs={24} lg={24}>
          <Steps
            progressDot
            current={current}
            onChange={onChange}
            items={[
              {
                title: "1. ЗАХИРГАА УДИРДЛАГА, БАЙГУУЛЛАГЫН ХӨГЖЛИЙН ЧИГЛЭЛЭЭР",
                description,
              },
              {
                title:
                  "2. УУР АМЬСГАЛЫН ӨӨРЧЛӨЛТ, ГАМШГИЙН УДИРДЛАГЫН ХӨТӨЛБӨРИЙН ХҮРЭЭНД",
                description,
              },
              {
                title: "3. НИЙГМИЙН ЭРҮҮЛ МЭНДИЙГ ДЭМЖИХ ХӨТӨЛБӨРИЙН ХҮРЭЭНД",
                description,
              },
              {
                title:
                  "4. НИЙГМИЙН ХАЛАМЖ, ОРОЛЦООГ ДЭМЖИХ ХӨТӨЛБӨРИЙН ХҮРЭЭНД",
                description,
              },
              {
                title: "5. ХҮҮХЭД, ЗАЛУУЧУУДЫН ХӨГЖЛИЙН ХӨТӨЛБӨРИЙН ХҮРЭЭНД",
                description,
              },
            ]}
          />
          <Divider />
          <h5 className="text-primary text-uppercase">
            1. ЗАХИРГАА УДИРДЛАГА, БАЙГУУЛЛАГЫН ХӨГЖЛИЙН ЧИГЛЭЛЭЭР
          </h5>
          <Table
            size="small"
            title={() => (
              <h6 className="font-weight-light text-secondary text-uppercase">
                1.1 ҮНДСЭН 7 ЗАРЧИМ, ТАНИХ ТЭМДЭГ, ЭМБЛЕМ, ХҮМҮҮНЛЭГИЙН ЭРХ ЗҮЙ,
                МУЗН-ИЙН ЭРХ ЗҮЙН БАЙДЛЫН ТУХАЙ ХУУЛЬ СУРТАЛЧЛАХ ЧИГЛЭЛЭЭР ХҮРЧ
                АЖИЛЛАСАН ХҮНИЙ ТОО
              </h6>
            )}
            loading={loading}
            bordered
            dataSource={data}
            columns={gridcolumns}
          ></Table>

          <Table
            size="small"
            title={() => (
              <h6 className="font-weight-light text-secondary text-uppercase">
                1.2 ТУХАЙН САРД ЭЛССЭН ГИШҮҮНИЙ ТОО
              </h6>
            )}
            loading={loading}
            bordered
            dataSource={data}
            columns={gridcolumns}
          ></Table>

          <Table
            size="small"
            title={() => (
              <h6 className="font-weight-light text-secondary text-uppercase">
                1.3 ТУХАЙН САРД ЭЛССЭН САЙН ДУРЫН ИДЭВХТНИЙ ТОО
              </h6>
            )}
            loading={loading}
            bordered
            dataSource={data}
            columns={gridcolumns}
          ></Table>

          <Table
            size="small"
            title={() => (
              <h6 className="font-weight-light text-secondary text-uppercase">
                1.4 ТУХАЙН САРД ЗОХИОН БАЙГУУЛСАН ҮЙЛ АЖИЛЛАГААНД ОРОЛЦСОН НИЙТ
                САЙН ДУРЫН ИДЭВХТНИЙ ТОО
              </h6>
            )}
            loading={loading}
            bordered
            dataSource={data}
            columns={gridcolumns}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
