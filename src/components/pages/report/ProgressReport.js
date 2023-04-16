import React, { useEffect, useState } from "react";
import { Space, Select, Button, Slider, } from "antd";
import { api } from "../../system/api";
import { SearchOutlined, FilePdfOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import { Spin, Row, Col, message } from "antd";


export default function ProgressReport() {
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
    };

    const handleGeneratePdf = () => {
        window.print();
    };

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
                    <Button onClick={handleGeneratePdf} type="primary" danger><FilePdfOutlined /> Export to PDF </Button>
                </Col>
                <Col>
                    <Button onClick={getkobodata} type="primary" ><CloudDownloadOutlined /> Kobo системээс мэдээлэл татах </Button>
                </Col>
            </Row>
            <div className="row">
                <div className="col-md-12">
                    <Spin spinning={loading}>

                        <h2>Явцын үр дүн</h2>
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

                                                    <th>№</th>

                                                    <th>Шалгуур үзүүлэлт</th>

                                                    <th style={{ "background-color": "#ff0000", "text-align": "center" }}>
                                                        Бага<br />(1 оноо):
                                                    </th>

                                                    <th style={{ "background-color": "#ffff00", "text-align": "center" }}>
                                                        Дундаж<br />(2 оноо):
                                                    </th>

                                                    <th style={{ "background-color": "#ff9933", "text-align": "center" }}>
                                                        Өндөр<br />(3 оноо):
                                                    </th>

                                                    <th style={{ "background-color": "#88cc00", "text-align": "center" }}>
                                                        Маш өндөр<br />(4 оноо):
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>

                                                    <td>1
                                                    </td>
                                                    <td>Нийгмийн халамжийн дэмжлэг туслалцааг авсан байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>2
                                                    </td>
                                                    <td>Нийгмийн суурь үйлчилгээ тэр дундаа эрүүл мэндийн үйлчилгээг тогтмол авч буй байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>3
                                                    </td>
                                                    <td>Ур чадвараа дээшлүүлсэн эсвэл шинэ ур чадвар эзэмшсэн байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>4
                                                    </td>
                                                    <td>Бүтээмжтэй хөрөнгийг үр дүнтэй ашиглаж буй байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>5
                                                    </td>
                                                    <td>Өрхийн анхны сарын дундаж орлого нэмэгдэж буй байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>6
                                                    </td>
                                                    <td>Тогтмол хадгаламж үүсгэж буй байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>7
                                                    </td>
                                                    <td>Албан болон албан бус санхүүгийн үйлчилгээнд хамрагдан бичил зээл авсан байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>8
                                                    </td>
                                                    <td>Туршилтын хөтөлбөрийн хүрээнд олон нийтийн үйл ажиллагаанд хамрагдсан оролцсон байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>9
                                                    </td>
                                                    <td>Өрхийн хөгжлийн төлөвлөгөөг хэрэгжүүлж буй байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>10</td>
                                                    <td>Амьдрах ур чадварын сургалтанд хамрагдсан  байдал
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td></td>
                                                    <td>Нийт
                                                    </td>

                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Spin>
                </div>
            </div>
        </>
    );
}
