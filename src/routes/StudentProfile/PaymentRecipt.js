import { Card, Col, Image, Row, Table } from "antd";
import { find } from "lodash";
import moment from "moment";

import React from "react";

import { amountToWords } from "../../utils/FileHelper";

export default function PaymentReceipt({ course, currentStudent, offlinePaymentDetails }) {
    const courseName = find(course, c => c._id === offlinePaymentDetails.course)?.name
    return (
        <Card>
            <Row style={{ marginTop: "5pt", marginBottom: "5pt" }} align="center">
                <Image src={'/images/logo-coco.png'} />
            </Row>
            <Row justify="end">
                <Col span={5} style={{ fontWeight: 'bold' }}> Date: {moment(offlinePaymentDetails?.createdAt).format("DD-MM-YYYY")}</Col>
            </Row>
            <Row justify="end">
                <Col span={5} style={{ fontWeight: 'bold' }}> R.No: {offlinePaymentDetails?.receiptNumber}</Col>
            </Row>
            <Row style={{ marginTop: "7pt", fontSize: "11pt", fontWeight: 'bold' }}>
                <Col span={4}>Student Name:</Col>
                <Col>{currentStudent?.user?.name || offlinePaymentDetails?.userId?.name}</Col>
            </Row>
            <Row style={{ marginTop: "4pt", marginBottom: "7pt", fontSize: "11pt", fontWeight: 'bold' }}>
                <Col span={4}>Course:</Col>
                <Col>{course?.name || courseName}</Col>
            </Row>
            {offlinePaymentDetails ?
                <Table dataSource={[offlinePaymentDetails]} bordered pagination={false}>
                    <Table.Column title='Particulars' width="80%"
                        render={d => d?.mode === "CASH" ? "Cash" : `Checque  ${d?.paymentMeta?.cheque_dd}`}
                    ></Table.Column>
                    <Table.Column title='Amount' dataIndex='amount'
                        render={d => d}
                    ></Table.Column>
                </Table>
                :
                null
            }
            <Row style={{ marginTop: 0 }}>
                <Col span={16}>
                    <Row>
                        <Col style={{ marginRight: "7pt", fontSize: "12pt" }}>Amount (in words): </Col>
                        <Col style={{ fontSize: "12pt" }}>{amountToWords(offlinePaymentDetails?.amount)}</Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Row>
                        <Row style={{ width: "60%", fontSize: '12pt', fontWeight: "bold", paddingRight: "7pt" }} justify="center">
                            Total:
                        </Row>
                        <Row style={{ width: "40%", fontSize: '12pt', fontWeight: "bold" }} justify="end">
                            {offlinePaymentDetails?.amount}
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "50px" }}>
                <Col style={{ fontSize: "12pt" }}>Student Signature</Col>
                <Col style={{ fontSize: "12pt" }}>Receiver Signature</Col>
            </Row>
        </Card>
    )
}