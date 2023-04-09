import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Table, Button, Typography, Tag } from "antd";
import { UserOutlined, DownloadOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
const { Text } = Typography;

export default function Loan() {
    const { userinfo } = useUserInfo();
    const [griddata, setGridData] = useState();
    const [exceldata, setexceldata] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        let coachid = (isNaN(userinfo.coachid) ? 0 : userinfo.coachid) * 1;
        api
            .get(`/api/record/coach/get_loan_list?coachid=${coachid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setGridData(res?.data?.retdata);
                    setexceldata(res?.data?.retdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userinfo]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const gridcolumns = [
        {
            title: "Зээл авсан огноо",
            dataIndex: "loandate",
            width: 200,
        },
        {
            title: "Дүүрэг",
            dataIndex: "districtname",
        },
        {
            title: "Хороо",
            dataIndex: "section",
        },
        {
            title: "Өрхийн гол оролцогч гишүүний нэр",
            dataIndex: "householdname",
        },
        {
            title: "Бүлгээс зээлсэн мөнгөн дүн",
            dataIndex: "amount",
            align: "right",
        },
        {
            title: "Зээлийн зориулалт",
            dataIndex: "loanpurpose",
        },
        {
            title: "Зээлийн зориулалтын тайлбар",
            dataIndex: "loanpurposenote",
        },
    ];

    return (
        <div>

            <Table
                bordered
                title={() => (
                    <>
                        <Tag icon={<UserOutlined />} color="magenta">
                            Зээлийн мэдээлэл <b>{exceldata.length}</b> харагдаж байна.
                        </Tag>

                        <CSVLink data={exceldata} filename={"Зээлийн жагсаалт.csv"}>
                            <Button type="primary" icon={<DownloadOutlined />} size="small">
                                Татах
                            </Button>
                        </CSVLink>
                    </>
                )}
                onChange={(pagination, filters, sorter, extra) =>
                    setexceldata(extra.currentDataSource)
                }
                loading={loading}
                columns={gridcolumns}
                dataSource={griddata}
                pagination={true}
                scroll={{ y: '50vh' }}
                rowKey={(record) => record.entryid}
                summary={(pageData) => {
                    let totalamount = 0;
                    pageData.forEach(({ amount }) => {
                        totalamount += parseFloat(amount.replaceAll(",", ""));
                    });
                    totalamount = totalamount
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    return (
                        <>
                            <Table.Summary.Row style={{ background: "#fafafa" }}>
                                <Table.Summary.Cell index={0}>Нийт:</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} />
                                <Table.Summary.Cell index={2} />
                                <Table.Summary.Cell index={3} />
                                <Table.Summary.Cell index={4} align="right">
                                    <Text>{totalamount}</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} />
                            </Table.Summary.Row>
                        </>
                    );
                }}
            ></Table>

        </div>
    );
}
