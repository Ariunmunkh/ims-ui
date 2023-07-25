import React from "react";
import { Tabs } from "antd";

import Community from "./Community";
import Branch from "./Branch";
import Activity from "./Activity";

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
                ]}
            />
        </div>
    );
}
