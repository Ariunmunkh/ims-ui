import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { api } from "../../system/api";
import { Card, Col, Row, Avatar, Table } from "antd";
import useUserInfo from "../../system/useUserInfo";
import VolunteerList from "./VolunteerList";
import ReportList from "./ReportList";
import ProjectList from "./ProjectList";
const { Meta } = Card;

export default function Home() {
    const [loading, setLoading] = useState(false);
    const { userinfo } = useUserInfo();
    const [volList, setVolList] = useState(false);
    const [report, setReport] = useState(false);
    const [project, setProject] = useState(false);
    const [griddata, setGridData] = useState();

    const fetchData = useCallback(async () => {

        if (userinfo.volunteerid)
            await api.get(`/api/Volunteer/get_VolunteerVoluntaryWork_list?id=${userinfo.volunteerid}`)
                .then((res) => {
                    if (res?.status === 200 && res?.data?.rettype === 0) {
                        setGridData(res?.data?.retdata);
                    }
                });

    }, [userinfo.volunteerid]);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const gridcolumns = [
        {
            title: "Сайн дурын ажлын төрөл",
            dataIndex: "voluntarywork",
        },
        {
            title: "Хугацаа",
            dataIndex: "duration",
        },
        {
            title: "Огноо",
            dataIndex: "voluntaryworkdate",
        },
        {
            title: "Нэмэлт мэдээлэл",
            dataIndex: "note",
        },
        {
            title: "Төлөв",
            dataIndex: "status",
        },
    ];

    if (volList) return <VolunteerList setVolList={setVolList} />;
    if (report) return <ReportList setReport={setReport} />;
    if (project) return <ProjectList setProject={setProject} />;
    return userinfo.roleid === '5' ? (
        <>
            <Row gutter={16}>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={<Avatar shape="circle" icon={<UserOutlined />} />}
                        title="Харьяа дунд шатны хороо"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            // title={<Title ellipsis={true} autos level={4}>Баянзүрх дүүргийн улаан загалмайн хороо</Title>}
                            title={
                                <h6 className="text-primary font-weight-bold">
                                    Баянзүрх дүүргийн улаан загалмайн хороо
                                </h6>
                            }
                            description="7777-0508"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Сайн дурын ажлын мэдээлэл"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-primary font-weight-bold">12</h5>}
                            description="Хийсэн сайн дурын ажлын тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="МУЗН-ийн хэрэгжүүлж буй төсөл, хөтөлбөрүүд"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-primary font-weight-bold">5</h5>}
                            description="Хэрэгжүүлж буй төсөл, хөтөлбөрийн тоо"
                        />
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={24} lg={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                Сайн дурын ажлын жагсаалт
                            </h5>
                        )}
                        loading={loading}
                        bordered
                        dataSource={griddata}
                        columns={gridcolumns}
                        pagination={true}
                    ></Table>
                </Col>
            </Row>
        </>
    ) : (
        <>
            <Row gutter={16}>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        onClick={() => setVolList(true)}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Бүртгэлтэй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-success font-weight-bold">12</h5>}
                            description="Бүртгэлтэй сайн дурын идэвхтний тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        onClick={() => setVolList(true)}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="Бүртгэлгүй: Сайн дурын идэвхтэн"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-warning font-weight-bold">12</h5>}
                            description="Хүсэлтээ илгээсэн сайн дурын идэвхтний тоо"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={{ span: 8 }}>
                    <Card
                        hoverable={true}
                        onClick={() => setReport(true)}
                        style={{
                            textAlign: "center",
                            backgroundColor: "#FAFAFA",
                        }}
                        extra={
                            <Avatar
                                style={{
                                    backgroundColor: "#1677FF",
                                }}
                            >
                                K
                            </Avatar>
                        }
                        title="ДШХ-ны сарын тайлан"
                    >
                        <Meta
                            style={{ textAlign: "center" }}
                            title={<h5 className="text-danger font-weight-bold">5 сарын тайлан явуулаагүй</h5>}
                            description="ДШХ-ны сар бүрийн тайлан"
                        />
                    </Card>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={24} lg={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                Бүртгэлтэй: Сайн дурын идэвхтний жагсаалт
                            </h5>
                        )}
                        loading={loading}
                        bordered
                        columns={gridcolumns}
                        pagination={true}
                    ></Table>
                </Col>
            </Row>
            <br />
            <Row>
                <Col xs={24} lg={24}>
                    <Table
                        size="small"
                        title={() => (
                            <h5 className="font-weight-light text-secondary text-uppercase">
                                ДШХ-ны сарын тайлан илгээсэн байдал
                            </h5>
                        )}
                        loading={loading}
                        bordered
                        columns={gridcolumns}
                        pagination={true}
                    ></Table>
                </Col>
            </Row>
        </>
    );
}
