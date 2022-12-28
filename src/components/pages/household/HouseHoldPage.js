import React, { useState, useEffect } from 'react'
import { Tabs, Tag } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";

import HouseHold from "./HouseHold";
import { useNavigate, useParams } from "react-router-dom";
import Visit from "./Visit";
import Meeting from "./Meeting";
import Loan from "./Loan";
import { api } from '../../system/api'

export default function HouseHoldPage() {
  const { householdid } = useParams();
  const [state, setState] = useState();
  const navigate = useNavigate();


  useEffect(() => {
    api
      .get(`/api/record/households/get_household?id=${householdid}`)
      .then((response) => {
        setState(response.data.retdata[0]);
      });
  }, [householdid]);
  if (!state) return null;
  console.log(state)
  return (
    <div>
      <Space direction="vertical">
        <Space wrap>
          <Tooltip title="буцах">
            <Button icon={<CaretLeftOutlined />} onClick={() => navigate(-1)}>
              Буцах
            </Button>
          </Tooltip>
          <Tag color="blue" style={{ height: "30px" }}>
            Өрхийн тэргүүн нэр: <b>{state.name}</b>
          </Tag>
          <Tag color="blue" style={{ height: "30px" }}>
            Дүүрэг: <b>{state.district}</b>
          </Tag>
          <Tag color="blue" style={{ height: "30px" }}>
            Хаяг: <b>{state.address}</b>
          </Tag>
          <Tag color="blue" style={{ height: "30px" }}>
            Утас: <b>{state.phone}</b>
          </Tag>
        </Space>
      </Space>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Үндсэн мэдээлэл`,
            key: "1",
            children: <HouseHold />,
          },
          {
            label: `Өрхийн айчлалын мэдээлэл`,
            key: "2",
            children: <Visit />,
          },
          {
            label: `Хурлын ирцийн мэдээлэл`,
            key: "3",
            children: <Meeting />,
          },
          {
            label: `Зээлийн мэдээлэл`,
            key: "4",
            children: <Loan />,
          },
        ]}
      />
    </div>
  );
}
