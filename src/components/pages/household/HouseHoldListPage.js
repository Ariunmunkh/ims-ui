import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../system/api'
import { Table, Button } from 'antd';
export default function HouseHoldListPage() {

    const navigate = useNavigate();
    const [griddata, setGridData] = useState();
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        await api.get(`/api/record/households/get_household_list`)
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

                navigate(`/household/${record.householdid}`);
            },
        };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const gridcolumns = [
        {
            title: "Ам бүлийн тоо",
            dataIndex: "numberof",
        },
        {
            title: "Өрхийн тэргүүний нэр",
            dataIndex: "name",
        },
        {
            title: "Дүүрэг",
            dataIndex: "district",
        },
        {
            title: "Хороо",
            dataIndex: "section",
        },
        {
            title: "Хаяг",
            dataIndex: "address",
        },
        {
            title: "Утас",
            dataIndex: "phone",
        },
        {
            title: "Огноо",
            dataIndex: "updated",
        }
    ];


    const newFormData = async () => {
        navigate(`/household/0`);
    };

    return (
        <div >

            <Button style={{ marginBottom: 16 }} type="primary" onClick={e => newFormData()}>Шинэ</Button>

            <Table
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                onRow={tableOnRow}
                pagination={false}
                rowKey={(record) => record.householdid}
            >

            </Table>

        </div>
    )
}
