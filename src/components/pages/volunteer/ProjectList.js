import React, { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { api } from "../../system/api";
import { Card, Col, Row, Button, Pagination, Divider } from "antd";
import useUserInfo from "../../system/useUserInfo";
import Home from "./Home";
const { Meta } = Card;

export default function ProjectList() {
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  const [griddata, setGridData] = useState();
  const [back, setBack] = useState(false);

  const [data, setData] = useState([]); // Array to store fetched data
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const pageSize = 10; // Number of cards to display per page

  const fetchData = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/api/Volunteer/get_Volunteer_list`)
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

  // Ensure data is an array before attempting to use slice
  const currentPageData = Array.isArray(griddata)
    ? griddata.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log(currentPageData);

  if (back) return <Home setBack={setBack} />;

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => setBack(true)}
          />
          <h5 className="text-center">МУЗН-ийн хэрэгжүүлж буй төсөл, хөтөлбөрүүд</h5>
          <Divider></Divider>
          <Row gutter={16} >
            {currentPageData.map((item) => (
              <Col span={8} className="pb-3">
                <Card title={item.id} key={item.id} bordered={true}>
                  {item.id}
                </Card>
              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data.length}
            onChange={handlePageChange}
          />
        </Col>
      </Row>
    </>
  );
}
