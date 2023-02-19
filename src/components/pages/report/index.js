import React from "react";
import { Col, DatePicker, Row, Space } from "antd";
import { Progress } from "antd";
import { green, red } from "@ant-design/colors";
const { RangePicker } = DatePicker;
export default function Report() {
  return (
    <>
      <Row>
        <Col span={12}>
          <Space direction="vertical" size={12}>
            <strong>Үр дүн харах өдрөө сонгоно уу.</strong>
            <RangePicker />
          </Space>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={2}>
          <p>Шалгуур 1</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 2</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 3</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 4</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 5</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 6</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 7</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 8</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 9</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 10</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 11</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 12</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
      <Row>
        <Col span={2}>
          <p>Шалгуур 13</p>
        </Col>
        <Col span={6}>
          <Progress percent={100} steps={10} status="active" showInfo={true} strokeColor={[red[2], red[2],red[2],green[3],green[4],green[4],green[5],green[6],green[6],green[6]]}/>
        </Col>
      </Row>
     
    </>
  );
}
