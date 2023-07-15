import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import { Col, Row, Steps, Divider, Table, Space, Button, DatePicker, Typography } from "antd";

const { Text } = Typography;
export default function Report() {

    const [reportdata, setreportdata] = useState([]);
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
            .get(`/api/record/base/get_dropdown_item_list?type=agegroup`)
            .then(async (res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {


                    let tagegroup = res?.data?.retdata;
                    tagegroup.sort((a, b) => a.name > b.name ? 1 : -1);
                    let cdata = [];

                    tagegroup.forEach((row) => {
                        cdata.push({
                            title: row.name,
                            children: [
                                {
                                    title: "эр",
                                    dataIndex: "male" + row.id,
                                },
                                {
                                    title: "эм",
                                    dataIndex: "female" + row.id,
                                },
                            ],
                        });
                    });

                    cdata.push({
                        title: "Үйлдэл",
                        key: "action",
                        render: (_, record) => (
                            <Space size="middle">
                                <Button type="link" >Засах</Button>
                            </Space>
                        ),
                    });
                    setagegroup(cdata);


                    let tindicator = [];

                    await api
                        .get(`/api/record/base/get_dropdown_item_list?type=indicator`)
                        .then((res) => {
                            if (res?.status === 200 && res?.data?.rettype === 0) {
                                tindicator = res?.data?.retdata;
                                tindicator.sort((a, b) => a.name > b.name ? 1 : -1);
                                setindicator(tindicator);
                            }
                        });

                    if (tindicator?.length > 0) {

                        let treportdata = [];
                        let trow = {};

                        tagegroup.forEach((row) => {
                            trow["male" + row.id] = 0;
                            trow["female" + row.id] = 1;
                        });

                        tindicator.forEach((row) => {
                            treportdata.push({ id: row.id, data: [trow] });
                        });
                        setreportdata(treportdata);
                    }

                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onFinish = async (values) => {

        await api
            .post(`/api/record/base/set_dropdown_item`, values)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {

                }
            });
    };

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
                            dataSource={reportdata.filter(i => i.id === t.id)[0]?.data}
                            columns={agegroup}
                        ></Table>
                    </Col>
                </Row>))}

        </>
    );
}
