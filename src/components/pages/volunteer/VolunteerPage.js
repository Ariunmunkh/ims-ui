import React from "react";
import { Tabs, Divider } from "antd";
import VoluntaryWork from "./VoluntaryWork";
import Meeting from "./Meeting";
import Loan from "./Loan";
import LoanReturn from "./LoanReturn";
import Training from "./Training";
import Investment from "./Investment";
import Support from "./Support";
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
                        label: `Сургууль, ангийн мэдээлэл`,
                        key: "3",
                        children: <Meeting />,
                    },
                    {
                        label: `Эрхэлсэн ажил`,
                        key: "4",
                        children: (
                            <div>
                                <Loan />
                                <br />
                                <Divider />
                                <LoanReturn />
                            </div>
                        ),
                    },
                    {
                        label: `Гадаад хэлний мэдлэг`,
                        key: "5",
                        children: (
                            <div>
                                <Training />
                            </div>
                        ),
                    },
                    {
                        label: `Яаралтай холбоо барих хүний мэдээлэл`,
                        key: "6",

                        children: (
                            <div>
                                <Investment />
                                <br />
                                <Divider />
                                <Support />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}
