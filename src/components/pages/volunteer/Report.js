import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import { Col, Row, Steps, Divider, Table, Space, Button, DatePicker, Typography } from "antd";

const { Text } = Typography;
export default function Report() {

    const [reportdate, setreportdate] = useState();
    const [programid, setprogramid] = useState(0);
    const [title, settitle] = useState();
    const [loading, setLoading] = useState(false);
    const [program, setprogram] = useState([]);
    const [indicator, setindicator] = useState([]);
    const [agegroup, setagegroup] = useState([]);


    const fetchData = useCallback(async () => {
        setLoading(true);
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=program`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let tdata = res?.data?.retdata;
                    tdata.sort((a, b) => a.name > b.name ? 1 : -1);
                    setprogram(tdata);
                    settitle(tdata[0]?.name);
                }
            });
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=indicator`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let tdata = res?.data?.retdata;
                    tdata.sort((a, b) => a.name > b.name ? 1 : -1);
                    setindicator(tdata);
                }
            });
        await api
            .get(`/api/record/base/get_dropdown_item_list?type=agegroup`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let tdata = res?.data?.retdata;
                    tdata.sort((a, b) => a.name > b.name ? 1 : -1);
                    let cdata = [];
                    for (var i = 0; i < tdata.length; i++) {
                        cdata.push({
                            title: tdata[i].name,
                            children: [
                                {
                                    title: "эр",
                                    dataIndex: "male" + tdata[i].id,
                                },
                                {
                                    title: "эм",
                                    dataIndex: "female" + tdata[i].id,
                                },
                            ],
                        });

                    }
                    cdata.push({
                        title: "Үйлдэл",
                        key: "action",
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="link">Засах</Button>
                            </Space>
                        ),
                    });
                    setagegroup(cdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Row>
                <Divider>
                    <Col>
                        <Text>Тайлангийн огноо:</Text>
                    </Col>

                    <Col>
                        <DatePicker value={reportdate} onChange={(date, dateString) => { setreportdate(date) }} />
                    </Col>
                </Divider>
            </Row>
            <Row>
                <Steps
                    progressDot
                    current={programid}
                    onChange={(value) => { setprogramid(value); settitle(program[value]?.name); }}

                >
                    {program?.map((t, i) => (<Steps.Item key={t.id} title={t.name} />))}
                </Steps>
                <Divider />
                <h5 className="text-primary text-uppercase">
                    {title}
                </h5>
            </Row>

            {indicator?.filter(i => i.headid === program[programid]?.id).map((t, i) => (
                <Row>
                    <Col xs={24} lg={24}>
                        <Table
                            size="small"
                            title={() => (
                                <h6 className="font-weight-light text-secondary text-uppercase">
                                    {t.name}
                                </h6>
                            )}
                            loading={loading}
                            bordered
                            dataSource={null}
                            columns={agegroup}
                        ></Table>
                    </Col>
                </Row>))}

        </>
    );
}
