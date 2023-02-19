import React, { useState, useEffect, useCallback } from "react";
import BingMapsReact from "bingmaps-react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Spin, Select, Typography, Row, Col, Divider } from "antd";
import _ from 'lodash';
const { Text } = Typography;

export default function MapPage() {

    const { userinfo } = useUserInfo();
    const [loading, setloading] = useState(true);
    const [pushPins, setdata] = useState([]);
    const [coachlist, setcoachlist] = useState([{ coachid: 0, coachname: 'хоосон' }]);
    const [coachid, setcoachid] = useState(0);
    const [districtlist, setdistrictlist] = useState([{ districtid: 0, districtname: 'хоосон' }]);
    const [districtid, setdistrictid] = useState(0);

    const fetchData = useCallback(async () => {
        setloading(true);
        let tcoachid = userinfo.coachid;
        tcoachid = tcoachid || tcoachid === '' ? '0' : tcoachid;
        if (coachid)
            tcoachid = coachid;

        await api.get(`/api/record/households/get_household_location?coachid=${tcoachid}&districtid=${districtid}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {

                    setdata(res?.data?.retdata);

                    var tcoach = _.uniqBy(res?.data?.retdata, 'coachid');
                    tcoach.push({ coachid: 0, coachname: 'хоосон' });
                    tcoach.sort((a, b) => a.coachid - b.coachid);
                    setcoachlist(tcoach);

                    var tdistrict = _.uniqBy(res?.data?.retdata, 'districtid');
                    tdistrict.push({ districtid: 0, districtname: 'хоосон' });
                    tdistrict.sort((a, b) => a.districtid - b.districtid);
                    setdistrictlist(tdistrict);
                }
            })
            .finally(() => {
                setloading(false);
            });

    }, [userinfo, districtid, coachid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (

        <Spin spinning={loading}>
            <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                <Col>
                    <Text>Дүүрэг</Text>
                </Col>
                <Col>
                    <Select style={{ width: "150px" }} value={districtid} onChange={(value) => { setcoachid(0); setdistrictid(value); }}>
                        {districtlist?.map((t, i) => (
                            <Select.Option key={i} value={t.districtid}>
                                {t.districtname}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Text>Коуч</Text>
                </Col>
                <Col>
                    <Select style={{ width: "150px" }} value={coachid} onChange={(value) => setcoachid(value)}>
                        {coachlist?.map((t, i) => (
                            <Select.Option key={i} value={t.coachid}>
                                {t.coachname}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row >
            <Row >
                <Col span={20}>
                    <div style={{ width: "100%", height: "80vh" }}>
                        <BingMapsReact
                            bingMapsKey="Al5_dVdiKO78I00m1mkAwVz7EmrK9ylIMTqI7qzQvwo2LSruRN2OkQFeRAsIaI24"
                            pushPins={pushPins}
                        />
                    </div>
                </Col>
                <Col span={4}>
                    <Row>
                        <Col>
                            <Divider>{`Өрхийн тоо: ${pushPins.length}`}</Divider>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Divider>{`Хорооны тоо: ${_.uniqBy(pushPins, 'section').length}`}</Divider>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Divider>{`Коучийн тоо: ${_.uniqBy(pushPins, 'coachid').length}`}</Divider>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Divider>{`Бүлгийн тоо: ${_.uniqBy(pushPins, 'householdgroupid').length}`}</Divider>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </Spin >
    );
}


