import React from "react";
import { Tabs } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";

import HouseHold from "./HouseHold";
import { useNavigate } from "react-router-dom";

export default function HouseHoldPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Space direction="vertical">
        <Space wrap>
          <Tooltip title="буцах">
            <Button
              icon={<CaretLeftOutlined />}
              onClick={() => navigate(-1)}
              
            > Буцах</Button>
          </Tooltip>
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
            label: `Хөгжлийн бэрхшээл`,
            key: "3",
            children: `Content of Tab Pane 3`,
          },
        ]}
      />
    </div>
  );
}
