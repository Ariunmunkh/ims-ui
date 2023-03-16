import React, { useState } from "react";
import { Tabs, Select } from "antd";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";

export default function SocialCapacitySwitch() {

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
                    { value: '1', label: 'Амьдрах ухааны сургалтад хамрагдсан өрхийн гол гишүүдийн тоо, хүйсээр /нийт, дүүрэг, хороо, коуч, сургалтын нэр, үйл ажиллагааны нэр, сар/' },
                    { value: '2', label: 'Өрхийг идэвхижүүлэх үйл ажиллагаанд хамрагдсан өрхийн гол гишүүдийн тоо, хүйсээр /нийт, дүүрэг, хороо, коуч, үйл ажиллагааны нэр, сар/' },
                    { value: '3', label: 'Нийгмийн чадавжилтийн үйл ажиллагааг зохион байгуулсан байгууллагын тоо /нийт, дүүрэг, хороо, коуч/' },
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
