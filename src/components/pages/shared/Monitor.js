import React from "react";
import { Tabs } from "antd";
import HouseSwitch from "../monitor/HouseHold/HouseSwitch";
import SocialProtectionSwitch from "../monitor/SocialProtection/SocialProtectionSwitch";
import LivelihoodSupportSwitch from "../monitor/LivelihoodSupport/LivelihoodSupportSwitch";
import FinancialParticipationSwitch from "../monitor/FinancialParticipation/FinancialParticipationSwitch";
import SocialCapacitySwitch from "../monitor/SocialCapacity/SocialCapacitySwitch";
import CoachSwitch from "../monitor/Coach/CoachSwitch";

export default function Dashboard() {
    return (
        <div>
            <Tabs
                style={{ height: '80vh' }}
                defaultActiveKey="1"
                items={[
                    {
                        label: `Өрхийн ерөнхий мэдээлэл`,
                        key: "1",
                        children: <HouseSwitch />,
                    },
                    {
                        label: `Амьжиргааг дэмжих`,
                        key: "2",
                        children: <LivelihoodSupportSwitch />,
                    },
                    {
                        label: `Нийгмийн хамгаалал`,
                        key: "3",
                        children: <SocialProtectionSwitch />,
                    },
                    {
                        label: `Санхүүгийн оролцоо`,
                        key: "4",
                        children: <FinancialParticipationSwitch />,
                    },
                    {
                        label: `Нийгмийн чадавхжилт`,
                        key: "5",
                        children: <SocialCapacitySwitch />,
                    },
                    {
                        label: `Коучинг ба менторинг`,
                        key: "6",
                        children: <CoachSwitch />,
                    }
                ]}
            />
        </div>
    );
}
