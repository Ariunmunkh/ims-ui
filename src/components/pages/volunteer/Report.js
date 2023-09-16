import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../system/api";
import useUserInfo from "../../system/useUserInfo";
import {
    Form,
    Popconfirm,
    Col,
    Row,
    Steps,
    Divider,
    Table,
    Input,
    DatePicker,
    Typography,
} from "antd";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
const { Text } = Typography;
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
export default function Report() {
    const [form] = Form.useForm();
    const { userinfo } = useUserInfo();
    const [reportdata, setreportdata] = useState([]);
    const [reportid, setreportid] = useState(1);
    const [programid, setprogramid] = useState(0);
    const [title, settitle] = useState();
    const [loading, setLoading] = useState(false);
    const [program, setprogram] = useState([]);
    const [indicator, setindicator] = useState([]);
    const [agegroup, setagegroup] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const location = useLocation();
    const [reportdate, setreportdate] = useState(location?.state?.udur ? dayjs(location?.state?.udur, "YYYY-MM") : dayjs());
    const [committeeid] = useState(location?.state?.committeeid ?? userinfo.committeeid);

    const isEditing = (record) => {
        return record.key === editingKey;
    };

    const edit = (record) => {
        form.setFieldsValue({
            record,
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            let dtls = [];
            let agegroupid = 0;

            Object.keys(row).forEach((item) => {
                if (item.includes("female")) {
                    agegroupid = item.replace(/[^0-9]/g, "");

                    const found = dtls.find(
                        (element) => element.agegroupid === agegroupid
                    );
                    if (found) {
                        found.female = row[item];
                    } else {
                        dtls.push({
                            id: 0,
                            reportid: reportid,
                            programid: userinfo.committeeid,
                            indicatorid: editingKey,
                            agegroupid: agegroupid,
                            male: 0,
                            female: row[item],
                        });
                    }
                } else if (item.includes("male")) {
                    agegroupid = item.replace(/[^0-9]/g, "");
                    const found = dtls.find(
                        (element) => element.agegroupid === agegroupid
                    );
                    if (found) {
                        found.male = row[item];
                    } else {
                        dtls.push({
                            id: 0,
                            reportid: reportid,
                            programid: userinfo.committeeid,
                            indicatorid: editingKey,
                            agegroupid: agegroupid,
                            male: row[item],
                            female: 0,
                        });
                    }
                }
            });

            await api
                .post(`/api/Committee/set_report`, {
                    id: reportid,
                    committeeid: userinfo.committeeid || 0,
                    reportdate: reportdate?.format("YYYY.MM"),
                    dtls: dtls,
                })
                .then((res) => {
                    if (res?.status === 200 && res?.data?.rettype === 0) {
                        setreportid(res?.data?.retdata);
                        setEditingKey("");
                    }
                });
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const fetchData = useCallback(async () => {

        setLoading(true);

        await api
            .get(
                `/api/Committee/get_report?committeeid=${committeeid}&reportdate=${reportdate.format("YYYY.MM")}`
            )
            .then(async (res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    let tprogram = res?.data?.retdata?.program;
                    tprogram.sort((a, b) => (a.name > b.name ? 1 : -1));
                    setprogram(tprogram);
                    settitle(tprogram[0]?.name);

                    let tagegroup = res?.data?.retdata?.agegroup;
                    tagegroup.sort((a, b) => (a.name > b.name ? 1 : -1));
                    let cdata = [];

                    tagegroup.forEach((row) => {
                        cdata.push({
                            title: row.name,
                            children: [
                                {
                                    title: "эр",
                                    dataIndex: "male" + row.id,
                                    width: "4%",
                                    editable: true,
                                },
                                {
                                    title: "эм",
                                    dataIndex: "female" + row.id,
                                    width: "4%",
                                    editable: true,
                                },
                            ],
                        });
                    });

                    cdata.push({
                        title: "Үйлдэл",
                        dataIndex: "operation",
                        render: (_, record) => {
                            const editable = isEditing(record);
                            return editable ? (
                                <span>
                                    <Typography.Link
                                        onClick={() => save(record.key)}
                                        style={{
                                            marginRight: 8,
                                        }}
                                    >
                                        Хадгалах
                                    </Typography.Link>
                                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                        <a>Болих</a>
                                    </Popconfirm>
                                </span>
                            ) : (
                                <Typography.Link
                                    disabled={editingKey !== ""}
                                    onClick={() => edit(record)}
                                >
                                    Засах
                                </Typography.Link>
                            );
                        },
                    });
                    setagegroup(cdata);

                    let tindicator = res?.data?.retdata?.indicator;
                    tindicator.sort((a, b) => (a.name > b.name ? 1 : -1));
                    setindicator(tindicator);

                    let treportdata = res?.data?.retdata?.retdata;
                    setreportdata(treportdata);
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }, [editingKey, reportdate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const mergedColumns = agegroup.map((col) => {
        if (!col.editable && !col.children) {
            return col;
        }
        return {
            title: col.title,
            children: [
                {
                    title: col.children[0].title,
                    dataIndex: col.children[0].dataIndex,
                    width: "4%",
                    onCell: (record) => ({
                        record,
                        inputType: "number",
                        dataIndex: col.children[0].dataIndex,
                        editing: isEditing(record),
                    }),
                },
                {
                    title: col.children[1].title,
                    dataIndex: col.children[1].dataIndex,
                    width: "4%",
                    onCell: (record) => ({
                        record,
                        inputType: "number",
                        dataIndex: col.children[1].dataIndex,
                        editing: isEditing(record),
                    }),
                },
            ],
        };
    });

    return (
        <>
            <Row>
                <Divider>
                    <Col>
                        <h5 className="font-weight-bold text-secondary text-uppercase">{location?.state?.committee}</h5>
                    </Col>
                    <Col>
                        <Text>Тайлангийн огноо:</Text>
                    </Col>

                    <Col>
                        <DatePicker
                            picker="month"
                            allowClear={false}
                            value={reportdate}
                            onChange={(date, dateString) => {
                                setreportdate(date);
                            }}
                        />
                    </Col>
                </Divider>
            </Row>
            <Row>
                <Steps
                    progressDot
                    current={programid}
                    onChange={(value) => {
                        setprogramid(value);
                        settitle(program[value]?.name);
                    }}
                >
                    {program?.map((t, i) => (
                        <Steps.Item key={t.id} title={t.name} />
                    ))}
                </Steps>
                <Divider />
                <h5 className="text-primary text-uppercase">{title}</h5>
            </Row>

            <Row>
                <Col xs={24} lg={24}>
                    <Form form={form} component={false}>
                        {indicator
                            ?.filter((i) => i.headid === program[programid]?.id)
                            .map((t, i) => (
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    size="small"
                                    title={() => (
                                        <h6 className="font-weight-light text-secondary text-uppercase">
                                            {t.name}
                                        </h6>
                                    )}
                                    loading={loading}
                                    bordered
                                    dataSource={reportdata.filter((i) => i.key === t.id)}
                                    columns={mergedColumns}
                                    rowClassName="editable-row"
                                    pagination={{
                                        onChange: cancel,
                                    }}
                                ></Table>
                            ))}
                    </Form>
                </Col>
            </Row>
        </>
    );
}
