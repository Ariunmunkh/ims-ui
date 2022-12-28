import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Descriptions, Divider } from "antd";
import HouseHoldMember from "./HouseHoldMember";

export default function HouseHold() {
  const { householdid } = useParams();
  const [state, setState] = useState();

  useEffect(() => {
    api
      .get(`/api/record/households/get_household?id=${householdid}`)
      .then((response) => {
        setState(response.data.retdata[0]);
      });
  }, [householdid]);
  if (!state) return null;
  return (
    <div>
      <Descriptions
        title="ӨРХИЙН МЭДЭЭЛЭЛ"
        bordered
        style={{ paddingBottom: 30 }}
      >
        <Descriptions.Item label="Өрхийн дугаар">
          {state.householdid}
        </Descriptions.Item>
        <Descriptions.Item label="Өрхийн тэргүүн нэр">
          {state.name}
        </Descriptions.Item>
        <Descriptions.Item label="Ам бүл">{state.numberof}</Descriptions.Item>
        <Descriptions.Item label="Дүүрэг">{state.district}</Descriptions.Item>
        <Descriptions.Item label="Хороо">{state.section}</Descriptions.Item>
        <Descriptions.Item label="Утас">{state.phone}</Descriptions.Item>
        <Descriptions.Item label="Хаяг">{state.address}</Descriptions.Item>
      </Descriptions>
      <Divider/>
      <Descriptions title={`${state.name}` +  ": ӨРХИЙН ГИШҮҮДИЙН МЭДЭЭЛЭЛ "} bordered>
        <Descriptions.Item >
          <HouseHoldMember />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
