﻿import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Tabs, Tag } from "antd";
import { Button, Tooltip, Space, Divider } from "antd";
import HouseHold from "./HouseHold";
import Visit from "./Visit";
import Meeting from "./Meeting";
import Loan from "./Loan";
import { api } from '../../system/api';
import LoanReturn from './LoanReturn';

export default function HouseHoldPage() {

    const { householdid } = useParams();

    const [householddata, sethouseholddata] = useState();
    const navigate = useNavigate();

    const fetchData = useCallback(() => {

        api.get(`/api/record/households/get_household?id=${householdid}`)
            .then((response) => {
                sethouseholddata(response.data.retdata[0]);
            });

    }, [householdid]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);


    if (!householddata)
        return null;

    return (
        <div>
            <Space direction="vertical">
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
            </Space>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: `Үндсэн мэдээлэл`,
                        key: "1",
                        children: <HouseHold />,
                    },
                    {
                        label: `Өрхийн айчлалын мэдээлэл`,
                        key: "2",
                        children: <Visit />,
                    },
                    {
                        label: `Хурлын ирцийн мэдээлэл`,
                        key: "3",
                        children: <Meeting />,
                    },
                    {
                        label: `Зээлийн мэдээлэл`,
                        key: "4",
                        children:
                            <div>
                                <Divider />
                                <Loan />
                                <br />
                                <Divider />
                                <LoanReturn />
                            </div >,
                    },
                ]}
            />
        </div>
    );
}
