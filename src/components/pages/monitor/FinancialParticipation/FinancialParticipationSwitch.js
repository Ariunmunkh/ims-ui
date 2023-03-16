import React, { useState } from "react";
import { Tabs, Select } from "antd";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import Page4 from "./Page4";
import Page5 from "./Page5";
import Page6 from "./Page6";
import Page7 from "./Page7";
import Page8 from "./Page8";
import Page9 from "./Page9";

export default function FinancialParticipationSwitch() {

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
                    { value: '1', label: 'Санхүүгийн анхан шатны сургалтанд хамрагдсан өрхийн гол гишүүний тоо, эзлэх хувь%, хүйсээр /нийт, дүүрэг, хороо, коуч, сургалтын нэр, сар/' },
                    { value: '2', label: 'Дундын хадгаламжийн бүлэгт хамрагдсан хүний тоо, гол гишүүний хүйсээр /нийт, дүүрэг, хороо, коуч/' },
                    { value: '3', label: 'Коучийн хариуцаж буй бүлгийн тоо /нийт, дүүрэг, хороо/ ' },
                    { value: '4', label: 'Дундын хадгаламжийн  бүлэгт хамрагдсан нийт өрхийн эзлэх хувь /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '5', label: 'Дундын хадгаламжийн бүлгийн нийт хуримтлалын  дүн /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '6', label: 'Дундын хадгаламжийн бүлгээс зээл авсан хүний тоо /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '7', label: 'Дундын хадгаламжийн бүлгээс зээлсэн зээлийн нийт хэмжээ /нийт, дүүрэг, хороо, коуч, гол гишүүний хүйсээр/' },
                    { value: '8', label: 'Дундын хадгаламжийн бүлгээс эрүүл мэнд, боловсрол, үндсэн хэрэгцээ болон орлого олох зориулалтаар зээл авсан нийт гишүүдийн тоо, тус бүрээр, хүйсээр /нийт, дүүрэг, хороо, коуч/' },
                    { value: '9', label: 'Өрхийн орлого, зарлагын бүртгэлээ тогтмол хөтөлж буй өрхийн тоо /нийт, дүүрэг, хороо, коуч/' },
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
                    {
                        key: "8",
                        children: <Page8 />,
                    },
                    {
                        key: "9",
                        children: <Page9 />,
                    },
                ]}
            />
        </div>
    );
}
