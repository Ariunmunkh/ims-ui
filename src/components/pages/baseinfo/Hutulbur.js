import React from "react";
import { Tabs } from "antd";
import Program from "./Program";
import Idicator from "./Idicator";
import AgeGroup from "./AgeGroup";

export default function Hutulbur() {

    return (
        <div>
            <Tabs
                tabPosition="top"
                defaultActiveKey="1"
                items={[
                    {
                        label: "Хөтөлбөр",
                        key: "1",
                        children: <Program />,
                    },
                    {
                        label: "Хөтөлбөрийн индикатор",
                        key: "2",
                        children: <Idicator />,
                    },
                    {
                        label: "Насны ангилал",
                        key: "3",
                        children: <AgeGroup />,
                    },
                ]}
            />
        </div>
    );
}
