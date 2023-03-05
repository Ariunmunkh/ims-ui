import React, { useRef, useEffect, useState } from "react";
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
import { useReactToPrint } from 'react-to-print';

export default function Report() {
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
            .get(`/api/record/base/get_tree_dropdown?issurvey=true`)
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
        const found = sectionlist.find((r) => r.key === value);
        if (found) {
            found.group.sort((a, b) => a.key - b.key);
            setgrouplist(found.group);
        } else setgrouplist([]);
    };

    const changeGroup = (value) => {
        setgroup(value);
        setcoach(null);
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
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const getkobodata = async () => {
        setLoading(true);
        await api
            .get(`/api/record/base/download_survey`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    messageApi.success('Амжилттай татлаа');
                }
                else {
                    messageApi.error('Амжилтгүй');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <>
            {contextHolder}
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col>
                    <Button onClick={handlePrint} type="primary" danger><FilePdfOutlined /> Export to PDF </Button>
                </Col>
                <Col>
                    <Button onClick={getkobodata} type="primary" ><CloudDownloadOutlined /> Kobo системээс мэдээлэл татах </Button>
                </Col>
            </Row>
            <div className="row">
                <div className="col-md-12">
                    <Spin spinning={loading}>
                        <h2>Үр дүн</h2>
                        <hr />
                        <div className="card card-default">
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
                                                <Slider
                                                    onChange={(value) => setdugaar(value)}
                                                    range
                                                    dots
                                                    max={5}
                                                    min={1}
                                                    value={dugaar}
                                                />
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
                                                            {data?.map((row) => (
                                                                <th>
                                                                    <Tag color="geekblue" icon={<FormOutlined />}>Асуумж: <b>{row?.dugaar}</b></Tag>  <Tag icon={<UserOutlined />}>Өрх тоо:<b>{row?.householdcount}</b></Tag>
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Тэжээллэг хоол хүнс</td>
                                                            {data?.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h1 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h1 > 60 && row?.h1 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h1).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Эрүүл мэндийн үйлчилгээ</td>
                                                            {data?.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h2 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h2 > 60 && row?.h2 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h2).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Үндсэн хэрэглээ</td>
                                                            {data?.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h3 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h3 > 60 && row?.h3 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h3).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Өрхийн бизнес</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h4 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h4 > 60 && row?.h4 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h4).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>

                                                        <tr>
                                                            <td>Тогтмол орлогын эх үүсвэр</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h5 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h5 > 60 && row?.h5 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h5).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Хадгаламж</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h6 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h6 > 60 && row?.h6 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h6).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Зээлийн үйлчилгээ</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h7 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h7 > 60 && row?.h7 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h7).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Идэвхи, оролцоо</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h8 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h8 > 60 && row?.h8 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h8).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Өрхийн алсын хараа, төлөвлөгөө</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h9 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h9 > 60 && row?.h9 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h9).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Гэр бүлийн харилцаа</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h10 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h10 > 60 && row?.h10 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h10).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Эрүүл ахуй</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h11 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h11 > 60 && row?.h11 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h11).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Сургууль цэцэрлэгт хамрагдалт</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h12 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h12 > 60 && row?.h12 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h12).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                        <tr>
                                                            <td>Өрхийн гишүүдийн тэгш оролцоо</td>
                                                            {data.map((row) => (
                                                                <td>
                                                                    <span
                                                                        className={
                                                                            row?.h13 <= 60
                                                                                ? "badge bg-danger"
                                                                                : row?.h13 > 60 && row?.h13 < 80
                                                                                    ? "badge bg-warning"
                                                                                    : "badge bg-success"
                                                                        }
                                                                    >{`${(row?.h13).toFixed(1)}%`}</span>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
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
                                                            <th>Гүйцэтгэл</th>
                                                            <th>Явц</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Нийгмийн хамгаалал</td>
                                                            <td>
                                                                {data.map((row) => (
                                                                    <div style={{ width: 200 }}>
                                                                        <Progress
                                                                            percent={row?.r1}
                                                                            format={() => (
                                                                                <>
                                                                                    <Tag color="blue">
                                                                                        <b>Үнэлгээ {row?.dugaar}</b>
                                                                                    </Tag>
                                                                                    <span
                                                                                        className={
                                                                                            row?.r1 <= 60
                                                                                                ? "badge bg-danger"
                                                                                                : row?.r1 > 60 && row?.r1 < 80
                                                                                                    ? "badge bg-warning"
                                                                                                    : "badge bg-success"
                                                                                        }
                                                                                    >{`${(row?.r1).toFixed(1)}%`}</span>
                                                                                </>
                                                                            )}
                                                                            size="large"
                                                                            strokeColor={{
                                                                                "0%": "#108ee9",
                                                                                "100%": "#87d068",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Амьжиргаа</td>
                                                            <td>
                                                                {data.map((row) => (
                                                                    <div style={{ width: 200 }}>
                                                                        <Progress
                                                                            percent={row?.r2}
                                                                            format={() => (
                                                                                <>
                                                                                    <Tag color="blue">
                                                                                        <b>Үнэлгээ {row?.dugaar}</b>
                                                                                    </Tag>
                                                                                    <span
                                                                                        className={
                                                                                            row?.r2 <= 60
                                                                                                ? "badge bg-danger"
                                                                                                : row?.r2 > 60 && row?.r2 < 80
                                                                                                    ? "badge bg-warning"
                                                                                                    : "badge bg-success"
                                                                                        }
                                                                                    >{`${(row?.r2).toFixed(1)}%`}</span>
                                                                                </>
                                                                            )}
                                                                            size="large"
                                                                            strokeColor={{
                                                                                "0%": "#108ee9",
                                                                                "100%": "#87d068",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Санхүүгийн оролцоо</td>
                                                            <td>
                                                                {data.map((row) => (
                                                                    <div style={{ width: 200 }}>
                                                                        <Progress
                                                                            percent={row?.r3}
                                                                            format={() => (
                                                                                <>
                                                                                    <Tag color="blue">
                                                                                        <b>Үнэлгээ {row?.dugaar}</b>
                                                                                    </Tag>
                                                                                    <span
                                                                                        className={
                                                                                            row?.r3 <= 60
                                                                                                ? "badge bg-danger"
                                                                                                : row?.r3 > 60 && row?.r3 < 80
                                                                                                    ? "badge bg-warning"
                                                                                                    : "badge bg-success"
                                                                                        }
                                                                                    >{`${(row?.r3).toFixed(1)}%`}</span>
                                                                                </>
                                                                            )}
                                                                            size="large"
                                                                            strokeColor={{
                                                                                "0%": "#108ee9",
                                                                                "100%": "#87d068",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Нийгмийн чадавхи</td>
                                                            <td>
                                                                {data.map((row) => (
                                                                    <div style={{ width: 200 }}>
                                                                        <Progress
                                                                            percent={row?.r4}
                                                                            format={() => (
                                                                                <>
                                                                                    <Tag color="blue">
                                                                                        <b>Үнэлгээ {row?.dugaar}</b>
                                                                                    </Tag>
                                                                                    <span
                                                                                        className={
                                                                                            row?.r4 <= 60
                                                                                                ? "badge bg-danger"
                                                                                                : row?.r4 > 60 && row?.r4 < 80
                                                                                                    ? "badge bg-warning"
                                                                                                    : "badge bg-success"
                                                                                        }
                                                                                    >{`${(row?.r4).toFixed(1)}%`}</span>
                                                                                </>
                                                                            )}
                                                                            size="large"
                                                                            strokeColor={{
                                                                                "0%": "#108ee9",
                                                                                "100%": "#87d068",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <b>ЕРӨНХИЙ ҮР ДҮН</b>
                                                            </td>
                                                            <td>
                                                                {data.map((row) => (
                                                                    <div style={{ width: 200 }}>
                                                                        <Progress
                                                                            percent={row?.r5}
                                                                            format={() => (
                                                                                <>
                                                                                    <Tag color="blue">
                                                                                        <b>Үнэлгээ {row?.dugaar}</b>
                                                                                    </Tag>
                                                                                    <span
                                                                                        className={
                                                                                            row?.r5 <= 60
                                                                                                ? "badge bg-danger"
                                                                                                : row?.r5 > 60 && row?.r5 < 80
                                                                                                    ? "badge bg-warning"
                                                                                                    : "badge bg-success"
                                                                                        }
                                                                                    >{`${(row?.r5).toFixed(1)}%`}</span>
                                                                                </>
                                                                            )}
                                                                            size="large"
                                                                            strokeColor={{
                                                                                "0%": "#108ee9",
                                                                                "100%": "#87d068",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div className="row">
                                    <div className="col-md-12 col-xs-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h6 className="card-title">ҮР ДҮНГ ГРАФИКТ ХАРУУЛСНААР</h6>
                                            </div>
                                            <div className="card-body">
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Spin>
                </div>
            </div>
        </>
    );
}
