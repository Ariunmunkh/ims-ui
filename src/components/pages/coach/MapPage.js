import React, { useState, useEffect, useCallback } from "react";
import BingMapsReact from "bingmaps-react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { Spin, Select, Typography, Row, Col } from "antd";
const { Text } = Typography;

export default function MapPage() {

    const { userinfo } = useUserInfo();
    const [loading, setloading] = useState(true);
    const [pushPins, setdata] = useState([]);
    const [coachlist, setcoachlist] = useState([]);
    const [coachid, setcoachid] = useState(0);
    const [districtlist, setdistrictlist] = useState([]);
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
                }
            })
            .finally(() => {
                setloading(false);
            });

    }, [userinfo, districtid, coachid]);

    useEffect(() => {
        api.get(`/api/record/base/get_district_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    res?.data?.retdata.push({ districtid: 0, name: 'хоосон' });
                    setdistrictlist(res?.data?.retdata);
                }
            });
        api.get(`/api/record/coach/get_coach_list`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    res?.data?.retdata.push({ coachid: 0, name: 'хоосон' });
                    setcoachlist(res?.data?.retdata);
                }
            });
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
                                {t.name}
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
                                {t.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row >
            <Row >
                <Col style={{ width: "80%", height: "80vh" }}>
                    <div style={{ width: "100%", height: "80vh" }}>
                        <BingMapsReact
                            bingMapsKey="Al5_dVdiKO78I00m1mkAwVz7EmrK9ylIMTqI7qzQvwo2LSruRN2OkQFeRAsIaI24"
                            pushPins={pushPins}
                        />
                    </div>
                </Col>
                <Col>
                    <Text>Коуч</Text>
                </Col>
            </Row >
        </Spin >
    );
}
