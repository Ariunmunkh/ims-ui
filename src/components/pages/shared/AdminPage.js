import React from "react";
import { Tabs } from "antd";
import UserListPage from "../user/UserListPage";
import District from "../baseinfo/District";
import Committee from "../baseinfo/Committee";
import EducationLevel from "../baseinfo/EducationLevel";
import VoluntaryWork from "../baseinfo/VoluntaryWork";

export default function AdminPage() {

    return (
        <div>
            <Tabs
                tabPosition={"left"}
                style={{ height: '80vh' }}
                defaultActiveKey="1"
                items={[
                    {
                        label: `Хэрэглэгч`,
                        key: "1",
                        children: <UserListPage />,
                    },
                    {
                        label: `Сум, Дүүрэг`,
                        key: "4",
                        children: <District />,
                    },
                    {
                        label: `Дунд шатны хорооны бүртгэл`,
                        key: "5",
                        children: <Committee />,
                    },
                    {
                        label: `Боловсролын түвшин`,
                        key: "6",
                        children: <EducationLevel />,
                    },
                    {
                        label: `Сайн дурын ажлын төрөл`,
                        key: "7",
                        children: <VoluntaryWork />,
                    },
                ]}
            />
        </div>
    );
}
