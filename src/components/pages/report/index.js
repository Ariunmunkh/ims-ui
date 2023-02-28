import React, { useEffect, useState, useCallback } from "react";
import {
  DatePicker,
  Space,
  Typography,
  Select,
  Spin,
  Button,
  Slider,
} from "antd";
import { api } from "../../system/api";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Progress } from "antd";

export default function Report() {
  const [data, setdata] = useState();
  const [statuslist, setstatuslist] = useState([]);
  const [status, setstatus] = useState(null);
  const [districtlist, setdistrictlist] = useState([]);
  const [district, setdistrict] = useState(null);
  const [sectionlist, setsectionlist] = useState([]);
  const [section, setsection] = useState(null);
  const [grouplist, setgrouplist] = useState([]);
  const [group, setgroup] = useState(null);
  const [coachlist, setcoachlist] = useState([]);
  const [coach, setcoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    api
      .get(`/api/record/base/get_tree_dropdown`)
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setstatuslist(res?.data?.retdata);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getData = async (_status, _district, _section, _group, _coach) => {
    setLoading(true);

    await api
      .get(
        `/api/record/households/get_household_survey?status=${_status}&district=${_district}&section=${_section}&group=${_group}&coach=${_coach}&household=0&begindate=2023.01.01&enddate=2023.12.31`
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.rettype === 0) {
          setdata(res?.data?.retdata[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const changeStatus = (value) => {
    setstatus(value);
    setdistrict(null);
    setsection(null);
    setgroup(null);
    setcoach(null);
    const found = statuslist.find((r) => r.key === value);
    if (found) {
      found.district.sort((a, b) => a.key - b.key);
      setdistrictlist(found.district);
    } else setdistrictlist([]);

    getData(value, 0, 0, 0, 0);
  };

  const changeDistrict = (value) => {
    setdistrict(value);
    setsection(null);
    setgroup(null);
    setcoach(null);
    const found = districtlist.find((r) => r.key === value);
    if (found) {
      found.section.sort((a, b) => a.key - b.key);
      setsectionlist(found.section);
    } else setsectionlist([]);

    getData(status, value, 0, 0, 0);
  };

  const changeSection = (value) => {
    setsection(value);
    setgroup(null);
    setcoach(null);
    const found = sectionlist.find((r) => r.key === value);
    if (found) {
      found.group.sort((a, b) => a.key - b.key);
      setgrouplist(found.group);
    } else setgrouplist([]);

    getData(status, district, value, 0, 0);
  };

  const changeGroup = (value) => {
    setgroup(value);
    setcoach(null);
    const found = grouplist.find((r) => r.key === value);
    if (found) {
      found.coach.sort((a, b) => a.key - b.key);
      setcoachlist(found.coach);
    } else setcoachlist([]);

    getData(status, district, section, value, 0);
  };

  const changeCoach = (value) => {
    setcoach(value);

    getData(status, district, section, group, value);
  };

  const btnClicked = () => {
    setShow(!show);
  };

  var r1 = ((data?.h1 + data?.h2 + data?.h3) / 3).toFixed(1);
  var r2 = ((data?.h4 + data?.h5) / 2).toFixed(1);
  var r3 = ((data?.h6 + data?.h7) / 2).toFixed(1);
  var r4 = (
    (data?.h8 + data?.h9 + data?.h10 + data?.h11 + data?.h12 + data?.h13) /
    6
  ).toFixed(1);
  var r5 = (
    (data?.h1 +
      data?.h2 +
      data?.h3 +
      data?.h4 +
      data?.h5 +
      data?.h6 +
      data?.h7 +
      data?.h8 +
      data?.h9 +
      data?.h10 +
      data?.h11 +
      data?.h12 +
      data?.h13) /
    13
  ).toFixed(1);
  console.log(data);

  return (
    <>
      <Spin spinning={loading}>
        <h2>Үр дүн</h2>
        <hr />
        <div className="card card-default">
          <div className="card-header">
            {show && (
              <h6 className="card-title">
                Дараах үр дүнд <UserOutlined />
                {data.householdcount} өрхийн мэдээллийг харуулж байна.
              </h6>
            )}
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Хөтөлбөрийн статус</label>
                  <Select
                    value={status}
                    onChange={(value) => changeStatus(value)}
                    style={{ width: "100%" }}
                  >
                    {statuslist?.map((t, i) => (
                      <Select.Option key={i} value={t.key}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <label>Дүүрэг</label>
                  <Select
                    allowClear
                    value={district}
                    onChange={(value) => changeDistrict(value)}
                    style={{ width: "100%" }}
                  >
                    {districtlist?.map((t, i) => (
                      <Select.Option key={i} value={t.key}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <label>Хороо</label>
                  <Select
                    allowClear
                    value={section}
                    onChange={(value) => changeSection(value)}
                    style={{ width: "100%" }}
                  >
                    {sectionlist?.map((t, i) => (
                      <Select.Option key={i} value={t.key}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <Space direction="vertical" size={12}>
                    <strong>Үр дүн харах дугаарыг сонгоно уу.</strong>
                    <Slider range dots max={5} min={1} defaultValue={[1, 5]} />
                  </Space>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Бүлэг</label>
                  <Select
                    allowClear
                    value={group}
                    onChange={(value) => changeGroup(value)}
                    style={{ width: "100%" }}
                  >
                    {grouplist?.map((t, i) => (
                      <Select.Option key={i} value={t.key}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <label>Коуч</label>
                  <Select
                    allowClear
                    value={coach}
                    onChange={(value) => changeCoach(value)}
                    style={{ width: "100%" }}
                  >
                    {coachlist?.map((t, i) => (
                      <Select.Option key={i} value={t.key}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <label>Өрх</label>
                  <Select style={{ width: "100%" }}></Select>
                </div>
                <div className="form-group">
                  <label> </label>
                  <Button
                    type="primary"
                    size="large"
                    style={{ width: "100%" }}
                    icon={<SearchOutlined />}
                    onClick={btnClicked}
                  >
                    Хайх
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        {show && (
          <>
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">ШАЛГУУР ҮЗҮҮЛЭЛТ</h6>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Шалгуур</th>
                          <th>Асуумж 1</th>
                          <th>Асуумж 2</th>
                          <th>Асуумж 3</th>
                          <th>Асуумж 4</th>
                          <th>Асуумж 5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Шалгуур 1</td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 2</td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h2).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h1).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 3</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-info"
                                style={{ width: `${(data?.h3).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h3).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 4</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${(data?.h4).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h4).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>

                        <tr>
                          <td>Шалгуур 5</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-secondary"
                                style={{ width: `${(data?.h5).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h5).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 6</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-info"
                                style={{ width: `${(data?.h6).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h6).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 7</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${(data?.h7).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h7).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 8</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar progress-bar-danger"
                                style={{ width: `${(data?.h8).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h8).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 9</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-secondary"
                                style={{ width: `${(data?.h9).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h9).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 10</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-info"
                                style={{ width: `${(data?.h10).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h10).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 11</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-warning"
                                style={{ width: `${(data?.h11).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h11).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 12</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar progress-bar-danger"
                                style={{ width: `${(data?.h12).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h12).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Шалгуур 13</td>
                          <td>
                            <div className="progress progress-xs">
                              <div
                                className="progress-bar bg-info"
                                style={{ width: `${(data?.h13).toFixed(1)}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${(data?.h13).toFixed(
                              1
                            )}%`}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">ЕРӨНХИЙ БҮЛГИЙН ХҮРЭЭНД</h6>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ width: 250 }}>Гүйцэтгэл</th>
                          <th style={{ width: 250 }}>Явц</th>
                          <th style={{ width: 40 }}>Хувь</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Нийгмийн хамгаалал</td>
                          <td>
                            <Progress
                              percent={r1}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${r1}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Амьжиргаа</td>
                          <td>
                            <Progress
                              percent={r2}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${r2}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Санхүүгийн оролцоо</td>
                          <td>
                            <Progress
                              percent={r3}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${r3}%`}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Нийгмийн чадавхи</td>
                          <td>
                            <Progress
                              percent={`${r4}`}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${r4}%`}</span>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <b>ЕРӨНХИЙ ҮР ДҮН</b>
                          </td>
                          <td>
                            <Progress
                              percent={r5}
                              strokeColor={{
                                "0%": "#108ee9",
                                "100%": "#87d068",
                              }}
                            />
                          </td>
                          <td>
                            <span className="badge bg-danger">{`${r5}%`}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Spin>
    </>
  );
}
