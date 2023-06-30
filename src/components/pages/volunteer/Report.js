import React, { useState } from "react";
import { Card, Col, Row, Steps, Divider, Table } from "antd";
const { Meta } = Card;

export default function Report() {
  let date=new Date().toISOString().split("T")[0]
  const description = date + " сарын тайлан";
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
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
        </Col>
      </Row>
    </>
  );
}
