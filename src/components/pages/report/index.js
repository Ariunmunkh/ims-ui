import React, { useEffect, useState, useCallback } from "react";
import { Col, DatePicker, Row, Space, Typography, Select, Table } from "antd";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Progress } from "antd";
import { green, red } from "@ant-design/colors";
const { RangePicker } = DatePicker;
const { Text } = Typography;
export default function Report() {
  const [griddata, setGridData] = useState();
  const [householdstatus, sethouseholdstatus] = useState([]);
  const [status, setstatus] = useState(1);
  const [group, setgroup] = useState(0);
  const [loading, setLoading] = useState(false);
  const { userinfo } = useUserInfo();
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    let coachid = userinfo.coachid;
    coachid = coachid || coachid === '' ? '0' : coachid;
    await api
        .get(`/api/record/households/get_household_survey?coachid=${coachid}&status=${status}&group=${group === undefined ? 0 : group}`)
        .then((res) => {
            if (res?.status === 200 && res?.data?.rettype === 0) {
                setGridData(res?.data?.retdata);
            }
        })
        .finally(() => {
            setLoading(false);
        });
}, [userinfo, status, group]);

  useEffect(() => {
    api
      .get(`/api/record/households/get_household_survey?districtid=0&coachid=0`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          sethouseholdstatus(res?.data?.retdata);
        }
      });
      fetchData();
  },[fetchData]);
  const changeStatus = async (value) => {
    setstatus(value);
};
  return (
    <>
      <h2>Үр дүн</h2>
      <hr />
      <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
        <Col>
          <Text>Хөтөлбөрийн статус</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.id}>
                {t.status == 1 ? "Хөтөлбөрийн өрх" : "Хяналтын өрх"}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text>Дүүрэг</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.districtid}>
                {t.districtname}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text>Хороо</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.id}>
                {t.section}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text>Бүлэг</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.id}>
                {t.householdgroupname}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text>Коуч</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.coachid}>
                {t.coachname}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text>Өрх</Text>
        </Col>
        <Col>
          <Select
            onChange={(value) => changeStatus(value)}
            style={{ width: "200px" }}
          >
            {householdstatus?.map((t, i) => (
              <Select.Option key={i} value={t.id}>
                {t.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={4} xs={8}>
          <Space direction="vertical" size={12}>
            <strong>Үр дүн харах өдрөө сонгоно уу.</strong>
            <RangePicker />
          </Space>
        </Col>
      </Row>
      <br />
      <div className="row">
        <div className="col-md-6 col-xs-12">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title">ШАЛГУУР ҮЗҮҮЛЭЛТ</h6>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Шалгуур</th>
                    <th>Явц</th>
                    <th style={{ width: 40 }}>Хувь</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Шалгуур 1</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar progress-bar-danger"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 2</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 3</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-info"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 4</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>

                  <tr>
                    <td>Шалгуур 5</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 6</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-info"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 7</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 8</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar progress-bar-danger"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 9</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 10</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-info"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 11</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-warning"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 12</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar progress-bar-danger"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Шалгуур 13</td>
                    <td>
                      <div className="progress progress-xs">
                        <div
                          className="progress-bar bg-info"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-xs-12">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title">ЕРӨНХИЙ БҮЛГИЙН ХҮРЭЭНД</h6>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Гүйцэтгэл</th>
                    <th>Явц</th>
                    <th style={{ width: 40 }}>Хувь</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Нийгмийн хамгаалал</td>
                    <td>
                      <Progress
                        percent={90}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                      />
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Амьжиргаа</td>
                    <td>
                      <Progress
                        percent={90}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                      />
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Санхүүгийн оролцоо</td>
                    <td>
                      <Progress
                        percent={90}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                      />
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Нийгмийн чадавхи</td>
                    <td>
                      <Progress
                        percent={90}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                      />
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>

                  <tr>
                    <td>ЕРӨНХИЙ ҮР ДҮН</td>
                    <td>
                      <Progress
                        percent={90}
                        strokeColor={{
                          "0%": "#108ee9",
                          "100%": "#87d068",
                        }}
                      />
                    </td>
                    <td>
                      <span className="badge bg-danger">55%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
