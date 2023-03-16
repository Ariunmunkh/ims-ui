import React, { useState, useEffect } from "react";
import { api } from "../../../system/api";

import { Spin, Row, Col, Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function ParticipantAge() {

    const [gendercount, setgendercount] = useState([]);
    const [districtcount, setdistrictcount] = useState([]);
    const [district, setdistrict] = useState();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachcount, setcoachcount] = useState([]);
    const [status, setstatus] = useState(1);
    const [statuslist, setstatuslist] = useState([]);
    const [loading, setloading] = useState(true);

    const fetchData = async () => {

        setloading(true);

        getgendercount(status);
        await api
            .get(`/api/record/base/get_district_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrictlist(res?.data?.retdata);
                }
            });
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=householdstatus`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setstatuslist(res?.data?.retdata);
                }
            })
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {

        fetchData();
    }, []);

    const getgendercount = async (tstatus) => {
        setstatus(tstatus);
        await getgendercountdistrict(tstatus, district);
        setloading(true);

        await api
            .get(`/api/record/report/get_participant_age_count?status=${tstatus}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setgendercount(res?.data?.retdata);

                }
            })
            .finally(() => {
                setloading(false);
            });
    };

    const getgendercountdistrict = async (tstatus, tdistrict) => {
        setdistrict(tdistrict);
        setloading(true);

        await api
            .get(`/api/record/report/get_participant_age_count_district?status=${tstatus}&districtid=${tdistrict ?? 0}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdistrictcount(res?.data?.retdata?.section);
                    setcoachcount(res?.data?.retdata?.coach);

                }
            })
            .finally(() => {
                setloading(false);
            });
    };

    return (
        <div>
            <Spin spinning={loading}>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
                        Гол оролцогч гишүүний нас, насны категориор /нийт, хороо, дүүрэг, коучээр/
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col>
                        <label style={{ width: 170 }}>Хөтөлбөрийн статус</label>
                        <Select
                            value={status}
                            onChange={(value) => getgendercount(value)}
                            style={{ width: 200 }}
                        >
                            {statuslist?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
                        <BarChart
                            width={800}
                            height={300}
                            data={gendercount}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="age24" stackId="a" name={"<25"} fill="#8884d8" />
                            <Bar dataKey="age54" stackId="a" name={"25-54"} fill="#82ca9d" />
                            <Bar dataKey="agemax" stackId="a" name={">54"} fill="#ffc658" />
                        </BarChart>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col>
                        <label style={{ width: 170 }}>Дүүрэг</label>
                        <Select
                            value={district}
                            onChange={(value) => getgendercountdistrict(status, value)}
                            style={{ width: 200 }}
                        >
                            {districtlist?.map((t, i) => (
                                <Select.Option key={i} value={t.districtid}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
                        <BarChart
                            width={800}
                            height={300}
                            data={districtcount}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="age24" stackId="a" name={"<25"} fill="#8884d8" />
                            <Bar dataKey="age54" stackId="a" name={"25-54"} fill="#82ca9d" />
                            <Bar dataKey="agemax" stackId="a" name={">54"} fill="#ffc658" />
                        </BarChart>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={24}>
                        <BarChart
                            width={800}
                            height={300}
                            data={coachcount}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="age24" stackId="a" name={"<25"} fill="#8884d8" />
                            <Bar dataKey="age54" stackId="a" name={"25-54"} fill="#82ca9d" />
                            <Bar dataKey="agemax" stackId="a" name={">54"} fill="#ffc658" />
                        </BarChart>
                    </Col>
                </Row>

            </Spin>
        </div>
    );
}
