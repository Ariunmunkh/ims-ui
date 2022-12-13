import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../system/api'
import { Table } from 'antd';

export default function UserListPage() {

    const navigate = useNavigate();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await api.get(`/api/systems/User/get_user_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const tableOnRow = (record, rowIndex) => {
        return {
            onClick: (event) => {

                navigate(`/home/userpage/${record.userid}`);

            },
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const gridcolumns = [
        {
            title: "Нэвтрэх нэр",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Имэйл",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
            key: "updated",
        }
    ];

    return (
        <div className="text-center">
            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}>

            </Table>
        </div>
    )
}
