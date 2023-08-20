import React, { useState, useCallback, useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../system/api";
import { Card, Col, Row, Table, Form } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Highlighter from "react-highlight-words";
const { Meta } = Card;

export default function Survies() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);
  const [committeeid, setcommitteeid] = useState(null);
  const [formdata] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/api/Committee/get_LocalInfo_list`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setGridData(res?.data?.retdata);
          const firstItem = res.data.retdata[0];
          if (firstItem) {
            // Extract the committeeid from the first object and set it in state
            setcommitteeid(firstItem.committeeid);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const gridcolumns = [
    {
      title: "Салбар",
      dataIndex: "committee",
      key: "committee",
    },
    {
      title: "Мэдээлэл илгээсэн огноо",
      dataIndex: "updated",
    },
  ];

  const tableOnRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        navigate(`/survey/${record.id}`, { state: { committeeid: record.committeeid } });
      },
    };
  };
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Table
            size="small"
            title={() => (
              <h5 className="font-weight-light text-secondary text-uppercase">
                Дунд шатны хорооны судалгааны жагсаалт
              </h5>
            )}
            loading={loading}
            bordered
            dataSource={griddata}
            columns={gridcolumns}
            pagination={{
              pageSize: 50,
            }}
            onRow={tableOnRow}
            rowKey={(record) => record.id}
          ></Table>
        </Col>
      </Row>
    </>
  );
}
