import React from "react";
import { Tabs } from "antd";
import UserListPage from "../user/UserListPage";
import CoachListPage from "../coach/CoachListPage";
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
                        label: `Коучийн жагсаалт`,
                        key: "20",
                        children: <CoachListPage />,
                    },
                    {
                        label: `Сум, Дүүрэг`,
                        key: "18",
                        children: <District />,
                    },
                    {
                        label: `Өрхийн статус`,
                        key: "17",
                        children: <HouseholdStatus />,
                    },
                    {
                        label: `Бүлэг /Өрх/`,
                        key: "21",
                        children: <HouseholdGroup />,
                    },
                    {
                        label: `Ураг төрлийн нэршил`,
                        key: "19",
                        children: <Relationship />,
                    },
                    {
                        label: `Боловсролын зэрэг`,
                        key: "4",
                        children: <EducationDegree />,
                    },
                    {
                        label: `Хөдөлмөр эрхлэлтийн байдал`,
                        key: "5",
                        children: <EmploymentStatus />,
                    },
                    {
                        label: `Эрүүл мэндийн байдал`,
                        key: "6",
                        children: <HealthCondition />,
                    },
                    {
                        label: `Зээлийн зориулалт`,
                        key: "8",
                        children: <LoanPurpose />,
                    },
                    {
                        label: `Сургалтын төрөл`,
                        key: "16",
                        children: <TrainingType />,
                    },
                    {
                        label: `Сургалт, үйл ажиллагааны нэр`,
                        key: "15",
                        children: <TrainingAndActivity />,
                    },
                    {
                        label: `Сургалт, үйл ажиллагаа зохиох байгууллагын нэр`,
                        key: "10",
                        children: <Organization />,
                    },
                    {
                        label: `Харьяалагдах дэд салбар`,
                        key: "13",
                        children: <SubBranch />,
                    },
                    {
                        label: `Хүлээн авсан хөрөнгийн төрөл`,
                        key: "3",
                        children: <AssetReceivedType />,
                    },
                    {
                        label: `Хүлээн авсан хөрөнгийн нэр`,
                        key: "2",
                        children: <AssetReceived />,
                    },
                    {
                        label: `Хүлээн авсан дэмжлэгийн төрөл`,
                        key: "14",
                        children: <SupportReceivedType />,
                    },
                    {
                        label: `Дэмжлэг олгосон байгууллагын нэр`,
                        key: "12",
                        children: <SponsoringOrganization />,
                    },
                    {
                        label: `Холбон зуучилсан үйлчилгээний төрөл`,
                        key: "9",
                        children: <MediatedServiceType />,
                    },
                    {
                        label: `Холбон зуучилсан байгууллагын нэр`,
                        key: "7",
                        children: <IntermediaryOrganization />,
                    },
                    {
                        label: `Холбон зуучилсан үйлчилгээний нэр`,
                        key: "11",
                        children: <ProxyService />,
                    },
                ]}
            />
        </div>
    );
}
