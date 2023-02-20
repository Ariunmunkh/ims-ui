import React, { useEffect, useState, useCallback } from "react";
import { Col, DatePicker, Row, Space, Typography, Select, Spin } from "antd";
import { api } from "../../system/api";
import { Progress } from "antd";
const { RangePicker } = DatePicker;
const { Text } = Typography;
export default function Report() {

    const [griddata, setGridData] = useState();
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


    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/record/coach/get_project_list`)
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
        api
            .get(`/api/record/base/get_tree_dropdown`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setstatuslist(res?.data?.retdata);
                }
            });
        fetchData();
    }, [fetchData]);

    const changeStatus = (value) => {
        setstatus(value);
        setdistrict(null);
        setsection(null);
        setgroup(null);
        setcoach(null);
        const found = statuslist.find(r => r.key === value);
        if (found) {
            found.district.sort((a, b) => a.key - b.key);
            setdistrictlist(found.district);
        }
        else
            setdistrictlist([]);
    }

    const changeDistrict = (value) => {
        setdistrict(value);
        setsection(null);
        setgroup(null);
        setcoach(null);
        const found = districtlist.find(r => r.key === value);
        if (found) {
            found.section.sort((a, b) => a.key - b.key);
            setsectionlist(found.section);
        }
        else
            setsectionlist([]);
    }

    const changeSection = (value) => {
        setsection(value);
        setgroup(null);
        setcoach(null);
        const found = sectionlist.find(r => r.key === value);
        if (found) {
            found.group.sort((a, b) => a.key - b.key);
            setgrouplist(found.group);
        }
        else
            setgrouplist([]);

    }

    const changeGroup = (value) => {
        setgroup(value);
        setcoach(null);
        const found = grouplist.find(r => r.key === value);
        if (found) {
            found.coach.sort((a, b) => a.key - b.key);
            setcoachlist(found.coach);
        }
        else
            setcoachlist([]);
    }
    console.log(grouplist);

    return (
        <>
            <Spin spinning={loading}>
                <h2>Үр дүн</h2>
                <hr />
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col>
                        <Text>Хөтөлбөрийн статус</Text>
                    </Col>
                    <Col>
                        <Select
                            value={status}
                            onChange={(value) => changeStatus(value)}
                            style={{ width: "200px" }}
                        >
                            {statuslist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Text>Дүүрэг</Text>
                    </Col>
                    <Col>
                        <Select
                            allowClear
                            value={district}
                            onChange={(value) => changeDistrict(value)}
                            style={{ width: "200px" }}
                        >
                            {districtlist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Text>Хороо</Text>
                    </Col>
                    <Col>
                        <Select
                            allowClear
                            value={section}
                            onChange={(value) => changeSection(value)}
                            style={{ width: "200px" }}
                        >
                            {sectionlist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Text>Бүлэг</Text>
                    </Col>
                    <Col>
                        <Select
                            allowClear
                            value={group}
                            onChange={(value) => changeGroup(value)}
                            style={{ width: "200px" }}
                        >
                            {grouplist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Text>Коуч</Text>
                    </Col>
                    <Col>
                        <Select
                            allowClear
                            value={coach}
                            onChange={(value) => setcoach(value)}
                            style={{ width: "200px" }}
                        >
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Text>Өрх</Text>
                    </Col>
                    <Col>
                        <Select
                            style={{ width: "200px" }}
                        >

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
            </Spin >
        </>
    );
}
