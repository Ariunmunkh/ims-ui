import React, { useState } from "react";
import { Tabs, Button } from "antd";
import VoluntaryWork from "./VoluntaryWork";
import Education from "./Education";
import Employment from "./Employment";
import Training from "./Training";
import Languages from "./Languages";
import EmergencyContact from "./EmergencyContact";
import Volunteer from "./Volunteer";
import { useLocation } from 'react-router-dom';

export default function VolunteerPage() {
    const location = useLocation();
    const tabKey = new URLSearchParams(location.search).get('tab') || '1';

    return (
        <div>
            <Tabs
                defaultActiveKey={tabKey}
                items={[
                    {
                        label: `Үндсэн мэдээлэл`,
                        key: "1",
                        children: (
                            <>
                                <Volunteer />
                                <Education />
                                <Languages />
                                <EmergencyContact />
                            </>),
                    },
                    {
                        label: `Сайн дурын үйл ажиллагааны мэдээлэл`,
                        key: "2",
                        children: <VoluntaryWork />,
                    },
                    {
                        label: `Улаан загалмайн хамрагдсан сургалт`,
                        key: "3",
                        children: <Training />,
                    },
                ]}
            />
        </div>
    );
}
