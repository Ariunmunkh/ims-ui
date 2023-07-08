import React from "react";
import { Tabs } from "antd";
import VoluntaryWork from "./VoluntaryWork";
import Education from "./Education";
import Employment from "./Employment";
import Training from "./Training";
import EmergencyContact from "./EmergencyContact";
import Volunteer from "./Volunteer";

export default function VolunteerPage() {
    return (
        <div>

            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: `Үндсэн мэдээлэл`,
                        key: "1",
                        children: <Volunteer />,
                    },
                    {
                        label: `Сайн дурын үйл ажиллагааны мэдээлэл`,
                        key: "2",
                        children: <VoluntaryWork />,
                    },
                    {
                        label: `Хамрагдсан сургалт`,
                        key: "3",
                        children: <Training />,
                    },
                    {
                        label: `Боловсрол`,
                        key: "4",
                        children: <Education />,
                    },
                    {
                        label: `Эрхэлсэн ажил`,
                        key: "5",
                        children: <Employment />,
                    },
                    {
                        label: `Гадаад хэлний мэдлэг`,
                        key: "6",
                        children: <Training />,
                    },
                    {
                        label: `Шаардлагатай үед холбоо барих хүний мэдээлэл`,
                        key: "7",
                        children: <EmergencyContact />,
                    },
                ]}
            />
        </div>
    );
}
