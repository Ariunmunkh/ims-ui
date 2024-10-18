import React from "react";
import { Tabs } from "antd";
import UserListPage from "../user/UserListPage";
import Division from "../baseinfo/Division";
import District from "../baseinfo/District";
import Committee from "../baseinfo/Committee";
import EducationLevel from "../baseinfo/EducationLevel";
import VoluntaryWork from "../baseinfo/VoluntaryWork";
import Hutulbur from "../baseinfo/Hutulbur";
import Project from "../baseinfo/Project";
import ProjectPro from "../baseinfo/ProjectPro";
import Training from "../baseinfo/Training";
import Languages from "../baseinfo/Languages";
import Relationship from "../baseinfo/Relationship";

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
                        label: `Аймаг, Хот`,
                        key: "2",
                        children: <Division />,
                    },
                    {
                        label: `Сум, Дүүрэг`,
                        key: "21",
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
                    {
                        label: `Хэрэгжүүлсэн төсөл, хөтөлбөрийн индикатор`,
                        key: "7",
                        children: <ProjectPro />,
                    },
                    {
                        label: `Сургалтын төрөл`,
                        key: "8",
                        children: <Training />,
                    },
                    {
                        label: `Гадаад хэлний төрөл`,
                        key: "9",
                        children: <Languages />,
                    },
                    {
                        label: `Таны юу болох`,
                        key: "10",
                        children: <Relationship />,
                    },


                ]}
            />
        </div>
    );
}
