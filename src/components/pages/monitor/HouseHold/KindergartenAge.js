import React, { useState, useEffect } from "react";
import { api } from "../../../system/api";

import { Spin, Row, Col, Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function KindergartenAge() {

    const [gendercount, setgendercount] = useState([]);
    const [districtcount, setdistrictcount] = useState([]);
    const [district, setdistrict] = useState();
    const [districtlist, setdistrictlist] = useState([]);
    const [coachcount, setcoachcount] = useState([]);
    const [status, setstatus] = useState(1);
    const [statuslist, setstatuslist] = useState([]);
    const [gender, setgender] = useState(-1);
    const [genderlist] = useState([{ id: -1, name: 'Бүгд' }, { id: 0, name: 'Эр' }, { id: 1, name: 'Эм' }]);
    const [loading, setloading] = useState(true);

    const fetchData = async () => {

        setloading(true);

        getgendercount(status, gender);
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

    const getgendercount = async (tstatus, tgender) => {
        setstatus(tstatus);
        setgender(tgender);
        await getgendercountdistrict(tstatus, tgender, district);
        setloading(true);

        await api
            .get(`/api/record/report/get_household_kindergarten_age_count?status=${tstatus}&gender=${tgender}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setgendercount(res?.data?.retdata);

                }
            })
            .finally(() => {
                setloading(false);
            });
    };

    const getgendercountdistrict = async (tstatus, tgender, tdistrict) => {
        setdistrict(tdistrict);
        setloading(true);

        await api
            .get(`/api/record/report/get_household_kindergarten_age_count_district?status=${tstatus}&gender=${tgender}&districtid=${tdistrict ?? 0}`)
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
                        Нийт цэцэрлэгийн насны хүүхдийн тоо, /нийт, хороо, дүүрэг, коуч, өрхийн тэргүүний хүйсээр/
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col span={12}>
                        <label style={{ width: 170 }}>Хөтөлбөрийн статус</label>
                        <Select
                            value={status}
                            onChange={(value) => getgendercount(value, gender)}
                            style={{ width: 200 }}
                        >
                            {statuslist?.map((t, i) => (
                                <Select.Option key={i} value={t.id}>
                                    {t.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <label style={{ width: 170 }}>Өрхийн тэргүүний хүйс</label>
                        <Select
                            value={gender}
                            onChange={(value) => getgendercount(status, value)}
                            style={{ width: 200 }}
                        >
                            {genderlist?.map((t, i) => (
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
                            <Bar dataKey="male" stackId="a" name={"эр"} fill="#8884d8" />
                            <Bar dataKey="female" stackId="a" name={"эм"} fill="#82ca9d" />
                            <Bar dataKey="none" stackId="a" name={"хоосон"} fill="#ffc658" />
                        </BarChart>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col>
                        <label style={{ width: 170 }}>Дүүрэг</label>
                        <Select
                            value={district}
                            onChange={(value) => getgendercountdistrict(status, gender, value)}
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
                            <Bar dataKey="male" stackId="a" name={"эр"} fill="#8884d8" />
                            <Bar dataKey="female" stackId="a" name={"эм"} fill="#82ca9d" />
                            <Bar dataKey="none" stackId="a" name={"хоосон"} fill="#ffc658" />
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
                            <Bar dataKey="male" stackId="a" name={"эр"} fill="#8884d8" />
                            <Bar dataKey="female" stackId="a" name={"эм"} fill="#82ca9d" />
                            <Bar dataKey="none" stackId="a" name={"хоосон"} fill="#ffc658" />
                        </BarChart>
                    </Col>
                </Row>

            </Spin>
        </div>
    );
}
