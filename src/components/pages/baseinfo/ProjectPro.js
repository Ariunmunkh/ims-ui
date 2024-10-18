import React from "react";
import { Tabs } from "antd";
import ProProgram from "./ProProgram";
import ProProject from "./ProProject";
import ProFunder from "./ProFunder";

export default function ProjectPro() {

    return (
        <div>
            <Tabs
                tabPosition="top"
                defaultActiveKey="1"
                items={[
                    {
                        label: "Хөтөлбөр",
                        key: "1",
                        children: <ProProgram />,
                    },
                    {
                        label: "Төслийн нэр",
                        key: "2",
                        children: <ProProject />,
                    },
                    {
                        label: "Санхүүжүүлэгч",
                        key: "3",
                        children: <ProFunder />,
                    },
                ]}
            />
        </div>
    );
}
