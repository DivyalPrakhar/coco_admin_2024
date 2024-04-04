import { Button, Card, Col, Drawer, Form, Input, Row, Space } from "antd";
import { map, orderBy } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import { addRemarksAction, resetRemarksData, resetRemarkStatus, updateEnquiryAction } from "../../redux/reducers/offlineEnquiry/Enquiry";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function EnquiryRemarkList({ data, closeDrawer }) {
    const dispatch = useDispatch()
    const [form] = Form.useForm();

    const onFinish = (d) => {
        const enquiry = {
            id: data._id,
            remark: d.remark
        }
        dispatch(addRemarksAction(enquiry))
    }

    const { remarkList, addRemarksStatus } = useSelector(s => s.enquiry)

    useCheckStatus({
        status: addRemarksStatus,
        onSuccess: () => {
            form.resetFields()
            dispatch(resetRemarkStatus())
        },
    }, [addRemarksStatus]);

    const _closeDrawer = () => {
        dispatch(resetRemarksData())
        closeDrawer()
    }

    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={true} footer={false} width='30%' title={'Enquiry Remarks List'}>
            {/* <Row justify="space-between" style={{ height: "100%", flexDirection: "column" }}> */}

            <Col style={{ overflowY: "scroll", height: "90%" }}>
                <Space style={{ width: "100%" }} direction="vertical">
                    {data.remarks?.length || remarkList?.length ?
                        map(orderBy(remarkList?.length ? remarkList : data.remarks, "date", "desc"), remark => (
                            <Card>
                                <Row>
                                    <Col></Col>
                                    <Col style={{ fontSize: '16px', fontWeight: "bold", textAlign: 'end' }}>{moment(remark.date).format("DD-MM-YYYY hh:mm A")}</Col>
                                </Row>
                                <Row style={{ marginTop: '10px' }}>
                                    <Col>{remark.remark}</Col>
                                </Row>
                            </Card>
                        ))
                        :
                        <Col style={{ textAlign: "center", fontSize: "20px" }}>No remark Found</Col>
                    }
                </Space>
            </Col>
            <Col style={{width:"100%", position: "fixed", bottom: 2, height: "10%" }}>
                <Form
                    form={form}
                    // labelCol={{ span: 8 }}
                    // wrapperCol={{ span: 16 }}
                    // layout="horizontal"
                    width="100%"
                    size='large'
                    onFinish={onFinish}>
                    <Row>
                        <Col style={{ width:"300px", height: "fit-content" }}>
                            <Form.Item rules={[{ required: true, message: 'Please fill in the field.' }]} name='remark'>
                                <Input.TextArea placeholder='Enter Remarks Here...' />
                            </Form.Item>
                        </Col>
                        <Col style={{ height: "fit-content" }}>
                            <Form.Item wrapperCol={{ offset: 4 }}>
                                <Button type="primary" shape='round'
                                    htmlType="submit"
                                    loading={addRemarksStatus === STATUS.FETCHING ? true : false}
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Drawer>
    )
}