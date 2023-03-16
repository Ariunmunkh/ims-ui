import React, { useState } from "react";
import { Tabs, Select } from "antd";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";

export default function CoachSwitch() {

    const [activeKey, setactiveKey] = useState('1');

    const handleChange = (value) => {
        setactiveKey(value);
    };

    return (
        <div>

            <Select
                defaultValue="1"
                onChange={handleChange}
                style={{ width: 800 }}
                options={[
                    { value: '1', label: 'Айлчиллын хувь /дүүрэг, хороо, коуч, /дотроо сараар/' },
                    { value: '2', label: 'Нийгмийн хамгааллын үйлчилгээнд холбон зуучлагдсан өрхийн эзлэх хувь /нийт өрх, дүүрэг, хороо, коуч, холбон зуучлагдсан төрөл/' },
                    { value: '3', label: 'Өрхөд тулгарч буй нийтлэг асуудлуудын тоо /төрөл, нийт, дүүрэг, хороо/' },
                    { value: '4', label: 'Өрхөд тулгарч буй асуудлыг шийдвэрлэсэн тоо /нийт тоо, дүүрэг, хороо, коуч/' },
                ]}
            />

            <Tabs
                style={{ height: '80vh' }}
                activeKey={activeKey}
                items={[
                    {
                        key: "1",
                        children: <Page1 />,
                    },
                    {
                        key: "2",
                        children: <Page2 />,
                    },
                    {
                        key: "3",
                        children: <Page3 />,
                    },
                    {
                        key: "4",
                        children: <Page4 />,
                    },
                ]}
            />
        </div>
    );
}
