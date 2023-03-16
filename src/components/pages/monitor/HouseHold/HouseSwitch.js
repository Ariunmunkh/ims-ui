import React, { useState } from "react";
import { Tabs, Select } from "antd";
import HouseHold from "./HouseHold";
import WorkingAge from "./WorkingAge";
import SchoolAge from "./SchoolAge";
import KindergartenAge from "./KindergartenAge";
import HouseHead from "./HouseHead";
import HouseSingle from "./HouseSingle";
import HouseMenber from "./HouseMenber";
import Participant from "./Participant";
import ParticipantAge from "./ParticipantAge";
import ParticipantDisabled from "./ParticipantDisabled";
import DisabledAvg from "./DisabledAvg";
import Coach from "./Coach";

export default function HouseSwitch() {

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
                    { value: '1', label: 'Нийт өрхийн тоо/нийт, хороо, дүүрэг, коучээр харах/' },
                    { value: '2', label: '18-55 насны хөдөлмөрийн насны гишүүний тоо, /нийт, хороо, дүүрэг, коуч, өрхийн тэргүүний хүйсээр/' },
                    { value: '3', label: 'Нийт сургуулийн насны хүүхдийн тоо, /нийт, хороо, дүүрэг, коуч, өрхийн тэргүүний хүйсээр/' },
                    { value: '4', label: 'Нийт цэцэрлэгийн насны хүүхдийн тоо, /нийт, хороо, дүүрэг, коуч, өрхийн тэргүүний хүйсээр/' },
                    { value: '5', label: 'Өрхийн тэргүүний хүйс /нийт, хороо, дүүрэг/' },
                    { value: '6', label: 'Өрх толгойлсон байдал /нийт, хороо, дүүрэг/' },
                    { value: '7', label: 'Нийт өрхийн гишүүдийн дундаж тоо /хороо, дүүрэг, нийт, өрхийн тэргүүний хүйс/' },
                    { value: '8', label: 'Гол оролцогч гишүүний хүйс /нийт, хороо, дүүрэг, коучээр/' },
                    { value: '9', label: 'Гол оролцогч гишүүний нас, насны категориор /нийт, хороо, дүүрэг, коучээр/' },
                    { value: '10', label: 'Гол оролцогч гишүүний хөгжлийн бэрхшээлтэй байдал, хөгжлийн бэрхшээлтэй эсэх /нийт, хороо, дүүрэг, коучээр/' },
                    { value: '11', label: 'Нийт хөгжлийн бэрхшээлтэй гишүүний дундаж тоо /нийт, хороо, дүүрэг, коучээр/' },
                    { value: '12', label: 'Коучийн хариуцсан өрхийн тоо /дүүргээр харагдана/' },
                ]}
            />

            <Tabs
                style={{ height: '80vh' }}
                activeKey={activeKey}
                items={[
                    {
                        key: "1",
                        children: <HouseHold />,
                    },
                    {
                        key: "2",
                        children: <WorkingAge />,
                    },
                    {
                        key: "3",
                        children: <SchoolAge />,
                    },
                    {
                        key: "4",
                        children: <KindergartenAge />,
                    },
                    {
                        key: "5",
                        children: <HouseHead />,
                    },
                    {
                        key: "6",
                        children: <HouseSingle />,
                    },
                    {
                        key: "7",
                        children: <HouseMenber />,
                    },
                    {
                        key: "8",
                        children: <Participant />,
                    },
                    {
                        key: "9",
                        children: <ParticipantAge />,
                    },
                    {
                        key: "10",
                        children: <ParticipantDisabled />,
                    },
                    {
                        key: "11",
                        children: <DisabledAvg />,
                    },
                    {
                        key: "12",
                        children: <Coach />,
                    }
                ]}
            />
        </div>
    );
}
