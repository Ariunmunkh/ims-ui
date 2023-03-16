import React, { useState } from "react";
import { Tabs, Select } from "antd";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page5 from "./Page5";
import Page6 from "./Page6";
import Page7 from "./Page7";

export default function LivelihoodSupportSwitch() {

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

                    { value: '1', label: 'Бизнесээ сонгосон нийт гол гишүүний тоо, эзлэх хувь%, хүйсээр, /нийт, дүүрэг, хороо, коучээр/' },
                    { value: '2', label: 'Сонгосон бизнесийн төрлүүд: үйлдвэрлэл, үйлчилгээ, худалдаа эзлэх хувиар / нийт , дүүрэг, хороо, коучээр/' },
                    { value: '3', label: 'Нийт тоног төхөөрөмжийн дэмжлэг авсан өрхийн  тоо  /нийт, дүүрэг, хороо, коуч/' },
                    { value: '4', label: 'Нийт хүлээлгэн өгсөн тоног төхөөрөмжийн нийт үнэ болон дундаж  үнэ  /нийт, дүүрэг, хороо, коуч/' },
                    { value: '5', label: 'Амьжиргааг дэмжих сургалтанд хамрагдсан гол гишүүдийн  тоо,  хүйсээр /нийт, дүүрэг, хороо, коуч, сургалтын нэр , төрөл, сургалт зохион байгуулсан сараар/' },
                    { value: '6', label: 'Техникийн ур чадвар олгох сургалтанд хамрагдсан  хүний тоо, хүйсээр, өрхөөр /нийт, дүүрэг, хороо, коуч, сургалтын төрөл , сургалт зохион байгуулсан сар/' },
                    { value: '7', label: 'Аж ахуй эрхлэлтийг дэд салбараар бизнес эрхлэгчдийн тоо, хүйсээр /нийт, дүүрэг, хороо, коуч, дэд салбарын төрлөөр өрхийг оруулах/' },

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
                    {
                        key: "5",
                        children: <Page5 />,
                    },
                    {
                        key: "6",
                        children: <Page6 />,
                    },
                    {
                        key: "7",
                        children: <Page7 />,
                    },
                ]}
            />
        </div>
    );
}
