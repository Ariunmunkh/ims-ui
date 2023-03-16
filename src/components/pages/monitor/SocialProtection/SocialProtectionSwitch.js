import React, { useState } from "react";
import { Tabs, Select } from "antd";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";

export default function SocialProtectionSwitch() {

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
                    { value: '1', label: 'Өрхийн хэрэгцээний төрөл /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '2', label: 'Өрхийн нийгмийн хамгааллын хэрэгцээний тоо /өрх, төрөл тутмаар тоо, нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '3', label: 'Нийгмийн хамгааллын үйлчилгээнд холбон зуучлагдсан өрхийн тоо /нийт өрх, дүүрэг, хороо, коуч, холбон зуучлагдсан төрөл/' },
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
                ]}
            />
        </div>
    );
}
