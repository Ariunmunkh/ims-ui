import React from "react";
import { Tabs } from "antd";
import UserListPage from "../user/UserListPage";
import AssetReceived from "../baseinfo/AssetReceived";
import AssetReceivedType from "../baseinfo/AssetReceivedType";
import District from "../baseinfo/District";
import EducationDegree from "../baseinfo/EducationDegree";
import EmploymentStatus from "../baseinfo/EmploymentStatus";
import HealthCondition from "../baseinfo/HealthCondition";
import HouseholdStatus from "../baseinfo/HouseholdStatus";
import IntermediaryOrganization from "../baseinfo/IntermediaryOrganization";
import LoanPurpose from "../baseinfo/LoanPurpose";
import MediatedServiceType from "../baseinfo/MediatedServiceType";
import Organization from "../baseinfo/Organization";
import ProxyService from "../baseinfo/ProxyService";
import Relationship from "../baseinfo/Relationship";
import SponsoringOrganization from "../baseinfo/SponsoringOrganization";
import SubBranch from "../baseinfo/SubBranch";
import SupportReceivedType from "../baseinfo/SupportReceivedType";
import TrainingAndActivity from "../baseinfo/TrainingAndActivity";
import HouseholdGroup from "../baseinfo/HouseholdGroup";
import TrainingType from "../baseinfo/TrainingType";
import Business from "../baseinfo/Business";

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
                        label: `Өрхийн статус`,
                        key: "5",
                        children: <HouseholdStatus />,
                    },
                    {
                        label: `Дундын хадгаламжийн бүлэг`,
                        key: "6",
                        children: <HouseholdGroup />,
                    },
                    {
                        label: `Ураг төрлийн нэршил`,
                        key: "7",
                        children: <Relationship />,
                    },
                    {
                        label: `Боловсролын зэрэг`,
                        key: "8",
                        children: <EducationDegree />,
                    },
                    {
                        label: `Хөдөлмөр эрхлэлтийн байдал`,
                        key: "9",
                        children: <EmploymentStatus />,
                    },
                    {
                        label: `Эрүүл мэндийн байдал`,
                        key: "10",
                        children: <HealthCondition />,
                    },
                    {
                        label: `Зээлийн зориулалт`,
                        key: "11",
                        children: <LoanPurpose />,
                    },
                    {
                        label: `Сургалтын төрөл`,
                        key: "12",
                        children: <TrainingType />,
                    },
                    {
                        label: `Сургалтын нэр`,
                        key: "13",
                        children: <TrainingAndActivity />,
                    },
                    {
                        label: `Сургалт өгсөн байгууллага / ажилтан`,
                        key: "14",
                        children: <Organization />,
                    },
                    {
                        label: `Бизнес`,
                        key: "23",
                        children: <Business />,
                    },
                    {
                        label: `Бизнесийн төрөл`,
                        key: "15",
                        children: <SubBranch />,
                    },
                    {
                        label: `Хүлээн авсан хөрөнгийн төрөл`,
                        key: "16",
                        children: <AssetReceivedType />,
                    },
                    {
                        label: `Хүлээн авсан хөрөнгийн нэр`,
                        key: "17",
                        children: <AssetReceived />,
                    },
                    {
                        label: `Хүлээн авсан дэмжлэгийн төрөл`,
                        key: "18",
                        children: <SupportReceivedType />,
                    },
                    {
                        label: `Дэмжлэг олгосон байгууллагын нэр`,
                        key: "19",
                        children: <SponsoringOrganization />,
                    },
                    {
                        label: `Холбон зуучилсан үйлчилгээний төрөл`,
                        key: "20",
                        children: <MediatedServiceType />,
                    },
                    {
                        label: `Холбон зуучилсан үйлчилгээний нэр`,
                        key: "22",
                        children: <ProxyService />,
                    },
                    {
                        label: `Холбон зуучилсан байгууллагын нэр`,
                        key: "21",
                        children: <IntermediaryOrganization />,
                    },
                ]}
            />
        </div>
    );
}
