import React from 'react'
import { Tabs } from 'antd';

import HouseHold from './HouseHold';
import HouseHoldMember from './HouseHoldMember';

export default function HouseHoldPage() {


    return (
        <div >
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label: `Үндсэн мэдээлэл`,
                        key: '1',
                        children: <HouseHold />,
                    },
                    {
                        label: `Өрхийн гишүүд`,
                        key: '2',
                        children: <HouseHoldMember />,
                    },
                    {
                        label: `Хөгжлийн бэрхшээл`,
                        key: '3',
                        children: `Content of Tab Pane 3`,
                    },
                ]}
            />

        </div>
    )
}
