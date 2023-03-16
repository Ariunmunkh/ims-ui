import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import { SearchOutlined } from '@ant-design/icons';
import { Spin, Select, Typography, Row, Col, Button } from "antd";
import _ from "lodash";
const { Text } = Typography;

export default function MapPage() {
    const { userinfo } = useUserInfo();
    const [loading, setloading] = useState(true);
    const [pushPins, setdata] = useState([]);
    const [coachlist, setcoachlist] = useState([
        { coachid: 0, coachname: "хоосон" },
    ]);
    const [coachid, setcoachid] = useState(userinfo.coachid * 1);
    const [districtlist, setdistrictlist] = useState([
        { districtid: 0, districtname: "хоосон" },
    ]);
    const [districtid, setdistrictid] = useState(0);

    const fetchData = useCallback(async () => {

        setloading(true);

        await api
            .get(
                `/api/record/households/get_household_location?coachid=${coachid}&districtid=${districtid}`
            )
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    setdata(res?.data?.retdata);

                    var tcoach = _.uniqBy(res?.data?.retdata, "coachid");
                    tcoach.push({ coachid: 0, coachname: "хоосон" });
                    tcoach.sort((a, b) => a.coachid - b.coachid);
                    tcoach = tcoach.filter(x => x.coachid != null);
                    setcoachlist(tcoach);

                    var tdistrict = _.uniqBy(res?.data?.retdata, "districtid");
                    tdistrict.push({ districtid: 0, districtname: "хоосон" });
                    tdistrict.sort((a, b) => a.districtid - b.districtid);
                    tdistrict = tdistrict.filter(x => x.districtid != null);
                    setdistrictlist(tdistrict);
                }
            })
            .finally(() => {
                setloading(false);
            });
    }, [coachid, districtid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <Spin spinning={loading}>
                <Row gutter={16} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Col>
                        <Text>Дүүрэг</Text>
                    </Col>
                    <Col>
                        <Select
                            style={{ width: "150px" }}
                            value={districtid}
                            onChange={(value) => {
                                setcoachid(0);
                                setdistrictid(value);
                            }}
                        >
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
                        <Select
                            style={{ width: "150px" }}
                            value={coachid}
                            onChange={(value) => setcoachid(value)}
                        >
                            {coachlist?.map((t, i) => (
                                <Select.Option key={i} value={t.coachid}>
                                    {t.coachname}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => fetchData()} icon={<SearchOutlined />}>
                            Хайх
                        </Button>
                    </Col>
                </Row>
            </Spin>

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Өрхийн байршлын мэдээлэл</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="d-md-flex">
                                <div className="p-1 flex-fill" >
                                    <div
                                        id="world-map-markers"
                                        style={{ height: 700 }}
                                    >


                                    </div>
                                </div>
                                <div className="card-pane-right bg-success pt-2 pb-2 pl-4 pr-4 text-white text-center">
                                    <div className="description-block mb-4">
                                        <div className="sparkbar pad" data-color="#fff">
                                            ӨРХИЙН ТОО
                                        </div>
                                        <h3 className="description-header">{pushPins.length}</h3>
                                    </div>
                                    <div className="description-block mb-4">
                                        <div className="sparkbar pad" data-color="#fff">
                                            ХОРООНЫ ТОО
                                        </div>
                                        <h3 className="description-header">{`${_.uniqBy(pushPins, "section").length
                                            }`}</h3>
                                    </div>
                                    <div className="description-block mb-4">
                                        <div className="sparkbar pad" data-color="#fff">
                                            КОУЧИЙН ТОО
                                        </div>
                                        <h3 className="description-header">{`${_.uniqBy(pushPins, "coachid").length
                                            }`}</h3>
                                    </div>
                                    <div className="description-block mb-4">
                                        <div className="sparkbar pad" data-color="#fff">
                                            БҮЛГИЙН ТОО
                                        </div>
                                        <h3 className="description-header">{`${_.uniqBy(pushPins, "householdgroupid").length
                                            }`}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
