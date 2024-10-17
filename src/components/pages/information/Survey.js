import React from "react";
import { Tabs } from "antd";

import Community from "./Community";
import Branch from "./Branch";
import Activity from "./Activity";
import PrimaryStageInfo from "./PrimaryStageInfo";

export default function Survey() {
    return (
        <div>

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: `Орон нутгийн талаарх мэдээлэл`,
                        key: "1",
                        children: <Community />,
                    },
                    {
                        label: `Дунд шатны хорооны мэдээлэл `,
                        key: "2",
                        children: <Branch />,
                    },
                    {
                        label: `Үйл ажиллагааны талаарх мэдээлэл`,
                        key: "3",
                        children: <Activity />,
                    },
                    {
                        label: `Анхан шатны хороодын мэдээлэл`,
                        key: "4",
                        children: <PrimaryStageInfo />,
                    },
                ]}
            />
        </div>
    );
}
