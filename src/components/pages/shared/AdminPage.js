import React from "react";
import { Tabs } from "antd";
import UserListPage from "../user/UserListPage";
import District from "../baseinfo/District";
import Committee from "../baseinfo/Committee";
import EducationLevel from "../baseinfo/EducationLevel";
import VoluntaryWork from "../baseinfo/VoluntaryWork";
import Hutulbur from "../baseinfo/Hutulbur";

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
                        key: "2",
                        children: <District />,
                    },
                    {
                        label: `Дунд шатны хорооны бүртгэл`,
                        key: "3",
                        children: <Committee />,
                    },
                    {
                        label: `Боловсролын түвшин`,
                        key: "4",
                        children: <EducationLevel />,
                    },
                    {
                        label: `Сайн дурын ажлын төрөл`,
                        key: "5",
                        children: <VoluntaryWork />,
                    },
                    {
                        label: `ДШХ-ны сарын мэдээний индикатор`,
                        key: "6",
                        children: <Hutulbur />,
                    },
                   
                    
                ]}
            />
        </div>
    );
}
