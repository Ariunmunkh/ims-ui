import React, { useEffect, useState } from "react";
import { Space, Select, Spin, Button, Slider, Tag } from "antd";
import { api } from "../../system/api";
import { SearchOutlined, UserOutlined, FormOutlined, FilePdfOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { Progress, Row, Col, message } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function Dashboard() {
    const [data, setdata] = useState([]);
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
    const [householdlist, sethouseholdlist] = useState([]);
    const [household, sethousehold] = useState(null);
    const [dugaar, setdugaar] = useState([1, 5]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        api
            .get(`/api/record/base/get_tree_dropdown?issurvey=false`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setstatuslist(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const getData = async (
        _status,
        _district,
        _section,
        _group,
        _coach,
        _household,
        _dugaar
    ) => {
        setLoading(true);

        let tdugaar = [];

        for (var i = _dugaar[0]; i <= _dugaar[1]; i++) tdugaar.push(i);

        let postdata = {
            status: _status,
            district: _district,
            section: _section,
            group: _group,
            coach: _coach,
            household: _household,
            dugaar: tdugaar,
        };

        await api
            .post(`/api/record/households/get_household_survey`, postdata)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdata(res?.data?.retdata);
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
        sethousehold(null);
        const found = statuslist.find((r) => r.key === value);
        if (found) {
            found.district.sort((a, b) => a.key - b.key);
            setdistrictlist(found.district);
        } else setdistrictlist([]);
    };

    const changeDistrict = (value) => {
        setdistrict(value);
        setsection(null);
        setgroup(null);
        setcoach(null);
        sethousehold(null);
        const found = districtlist.find((r) => r.key === value);
        if (found) {
            found.section.sort((a, b) => a.key - b.key);
            setsectionlist(found.section);
        } else setsectionlist([]);
    };

    const changeSection = (value) => {
        setsection(value);
        setgroup(null);
        setcoach(null);
        sethousehold(null);
        const found = sectionlist.find((r) => r.key === value);
        if (found) {
            found.group.sort((a, b) => a.key - b.key);
            setgrouplist(found.group);
        } else setgrouplist([]);
    };

    const changeGroup = (value) => {
        setgroup(value);
        setcoach(null);
        sethousehold(null);
        const found = grouplist.find((r) => r.key === value);
        if (found) {
            found.coach.sort((a, b) => a.key - b.key);
            setcoachlist(found.coach);
        } else
            setcoachlist([]);
    };

    const changeCoach = (value) => {
        setcoach(value);
        sethousehold(null);
        const found = coachlist.find((r) => r.key === value);
        if (found) {
            found.household.sort((a, b) => a.key - b.key);
            sethouseholdlist(found.household);
        } else
            sethouseholdlist([]);
    };

    const btnClicked = () => {
        getData(status, district, section, group, coach, household, dugaar);
        setShow(true);
    };


    return (
        <>
            {contextHolder}
            <Spin spinning={loading}>


                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
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
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={12}>
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
                    </Col>

                    <Col span={12}>
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
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>


                    <Col span={12}>
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
                    </Col>

                    <Col span={12}>
                        <label>Өрх</label>
                        <Select
                            allowClear
                            value={household}
                            onChange={(value) => sethousehold(value)}
                            style={{ width: "100%" }}
                        >
                            {householdlist?.map((t, i) => (
                                <Select.Option key={i} value={t.key}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
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
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
                        <LineChart
                            width={1000}
                            height={400}
                            data={data}
                            margin={{
                                top: 50,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="1" />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Нийгмийн хамгаалал"
                                dataKey="r1"
                                stroke="#cc9900"
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Амьжиргаа"
                                dataKey="r2"
                                stroke="#cc00cc"
                            />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Санхүүгийн оролцоо"
                                dataKey="r3"
                                stroke="#3333ff"
                            />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Нийгмийн чадавхи"
                                dataKey="r4"
                                stroke="#006699"
                            />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Ерөнхий үр дүн"
                                dataKey="r5"
                                stroke="#009933"
                            />
                            <Line
                                yAxisId="1"
                                type="monotone"
                                name="Босго"
                                dataKey="r0"
                                stroke="#ff3300"
                                strokeDasharray="3 4 5 2"
                            />
                        </LineChart>

                    </Col>
                </Row>

            </Spin>
        </>
    );
}
