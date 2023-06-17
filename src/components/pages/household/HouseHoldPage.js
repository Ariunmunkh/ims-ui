import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Tabs, Tag } from "antd";
import { Button, Tooltip, Space, Divider } from "antd";
import HouseHold from "./Volunteer";
import Visit from "./Visit";
import Meeting from "./Meeting";
import Loan from "./Loan";
import { api } from "../../system/api";
import LoanReturn from "./LoanReturn";
import Training from "./Training";
import Livelihood from "./Livelihood";
import Investment from "./Investment";
import Support from "./Support";
import Contact from "./Contact";
import Volunteer from "./Volunteer";

export default function HouseHoldPage() {
    // const { id } = useParams();

    // const [householddata, sethouseholddata] = useState();
    // const navigate = useNavigate();

    // const fetchData = useCallback(() => {
    //     api
    //         .get(`/api/Volunteer/get_Volunteer?id=${id}`)
    //         .then((response) => {
    //             sethouseholddata(response.data.retdata[0]);
    //         });
    // }, [id]);

    // useEffect(() => {
    //     fetchData();
    // }, [fetchData]);

    // if (!householddata) return null;

    return (
        <div>
            {/* <Space direction="vertical">
                <Space wrap>
                    <Tooltip title="буцах">
                        <Button icon={<CaretLeftOutlined />} onClick={() => navigate(-1)}>
                            Буцах
                        </Button>
                    </Tooltip>
                    <Tag color="blue" style={{ height: "30px" }}>
                        Өрхийн тэргүүн нэр: <b>{householddata.name}</b>
                    </Tag>
                    <Tag color="blue" style={{ height: "30px" }}>
                        Дүүрэг: <b>{householddata.districtname}</b>
                    </Tag>
                    <Tag color="blue" style={{ height: "30px" }}>
                        Хаяг: <b>{householddata.address}</b>
                    </Tag>
                    <Tag color="blue" style={{ height: "30px" }}>
                        Утас: <b>{householddata.phone}</b>
                    </Tag>
                </Space>
            </Space> */}
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: `Үндсэн мэдээлэл`,
                        key: "1",
                        children: <Volunteer />,
                    },
                    {
                        label: `Сайн дурын үйл ажиллагааны мэдээлэл`,
                        key: "2",
                        children: <Visit />,
                    },
                    {
                        label: `Сургууль, ангийн мэдээлэл`,
                        key: "3",
                        children: <Meeting />,
                    },
                    {
                        label: `Эрхэлсэн ажил`,
                        key: "4",
                        children: (
                            <div>
                                <Loan />
                                <br />
                                <Divider />
                                <LoanReturn />
                            </div>
                        ),
                    },
                    {
                        label: `Гадаад хэлний мэдлэг`,
                        key: "5",
                        children: (
                            <div>
                                <Training />
                            </div>
                        ),
                    },
                    {
                        label: `Яаралтай холбоо барих хүний мэдээлэл`,
                        key: "6",

                        children: (
                            <div>
                                <Investment />
                                <br />
                                <Divider />
                                <Support />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
