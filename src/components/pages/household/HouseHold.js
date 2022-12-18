import React, { useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../../system/api'
import { Form, Modal, Button, Input, InputNumber } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

export default function HouseHold() {


    const navigate = useNavigate();
    const { householdid } = useParams();

    const [formdata] = Form.useForm();

    const getData = async () => {

        if (householdid === 0) {
            formdata.setFieldsValue({ householdid: 0 });
        }
        else {
            await api.get(`/api/households/get_household?id=${householdid}`)
                .then((res) => {
                    if (res?.status === 200 && res?.data?.rettype === 0) {
                        formdata.setFieldsValue(res?.data?.retdata[0]);
                    }
                });
        }
    };

    useEffect(() => {
        getData();
    });

    const onFinish = async (values) => {
        await api.post(`/api/households/set_household`, formdata.getFieldsValue())
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {

                    navigate(`/household/${res?.data?.retdata}`);
                }
            });
    };

    const showDeleteConfirm = () => {
        confirm({
            title: 'Устгах уу?',
            icon: <ExclamationCircleFilled />,
            //content: 'Some descriptions',
            okText: 'Тийм',
            okType: 'danger',
            cancelText: 'Үгүй',
            onOk() {
                onDelete();
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };

    const onDelete = async () => {
        await api.delete(`/api/households/delete_household?id=${formdata.getFieldValue("householdid")}`)
            .then((res) => {
                if (res?.status === 200 && res?.data?.rettype === 0) {
                    navigate(`/householdlist`);
                }
            });
    };

    return (
        <div >
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                onFinish={onFinish}
                form={formdata}
            >
                <Form.Item name="householdid" label="Өрхийн дугаар" hidden={true}>
                    <Input />
                </Form.Item>

                <Form.Item name="numberof" label="Ам бүлийн тоо" >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="name" label="Өрхийн тэргүүний нэр">
                    <Input />
                </Form.Item>
                <Form.Item name="district" label="Дүүрэг">
                    <Input />
                </Form.Item>
                <Form.Item name="section" label="Хороо">
                    <Input />
                </Form.Item>
                <Form.Item name="address" label="Хаяг">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="phone" label="Утас">
                    <Input />
                </Form.Item>
                <Form.Item name="coachid" label="Коучийн дугаар" hidden={true}>
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 14, offset: 8 }}>
                    <Button danger onClick={showDeleteConfirm} hidden={householdid === '0'}>
                        Устгах
                    </Button>
                    <Button type="primary" style={{ margin: '0 8px' }} htmlType="submit">
                        Хадгалах
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
