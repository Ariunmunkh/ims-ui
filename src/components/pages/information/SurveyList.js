import React, { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { api } from "../../system/api";
import { Card, Tabs } from "antd";
import useUserInfo from "../../system/useUserInfo";
import { useNavigate } from "react-router-dom";
import CommunityList from "./CommunityList";
import Branch from "./Branch";
import Activity from "./Community";
const { Meta } = Card;

export default function SurveyList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/api/Committee/get_report_list`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setGridData(res?.data?.retdata);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(userinfo);
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Орон нутгийн талаарх мэдээлэл`,
            key: "1",
            children: <CommunityList />,
          },
          {
            label: `Дунд шатны хорооны мэдээлэл `,
            key: "2",
            children: <Branch />,
          },
          {
            label: `Үйл ажиллагааны талаарх мэдээлэл`,
            key: "3",
            children: <Activity />,
          },
        ]}
      />
    </div>
  );
}
