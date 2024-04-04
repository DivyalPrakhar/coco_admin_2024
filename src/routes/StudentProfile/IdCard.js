import { Card, Col, Image, Row } from "antd"
import { find } from "lodash";
import moment from "moment";
import React from "react"

export default function IdCardPrint({ currentStudent, assignedBatch, allCenterList, studentBatchData }) {
    console.log(assignedBatch);
    return (
        <Card>
            <Row justify="space-evenly">
                <Col style={{ height: "88.9mm", width: "50.8mm", backgroundImage: 'url("/images/student-id-card.png")', preview: false, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} >
                    <Row align="bottom" justify="center" style={{ marginTop: "53pt", position: 'relative' }}>
                        <Col style={{ height: "20pt", marginLeft: "-61pt", marginBottom: "-7pt", position: 'absolute', zIndex: 2 }}>
                            <Image src="/images/Seal-Signature.png" height={"20pt"} />
                        </Col>
                        <Col style={{ width: "64pt", height: '75pt' }} >
                            <Image src={currentStudent.user?.avatar} width={"59pt"} height={'75pt'} style={{ borderRadius: "7pt" }} preview={false} />
                        </Col>
                        {/* style={{ paddingLeft: "60pt", marginBottom: "-5pt" }} */}
                    </Row>
                    <Row align="center" style={{ fontSize: "9pt", fontWeight: 'bold' }}>
                        {currentStudent.user?.name}
                    </Row>
                    <Row align="center" style={{ fontSize: "6.5pt", marginTop: -4 }}>
                        {currentStudent.user?.fatherName || '-'}
                    </Row>
                    <Row style={{ fontSize: '6pt', marginTop: "4.5pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {find(allCenterList, center => center._id === assignedBatch[0].center)?.name || '-'}
                        </Col>
                    </Row>
                    <Row style={{ fontSize: '6.5pt', marginTop: "1pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {assignedBatch[0]?.code || '-'}
                        </Col>
                    </Row>
                    <Row style={{ fontSize: '6.5pt', marginTop: "1pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {studentBatchData?.[0]?.rollNumber || '-'}
                        </Col>
                    </Row>
                    <Row style={{ fontSize: '6.5pt', marginTop: "1pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {currentStudent.user?.fatherContact || '-'}
                        </Col>
                    </Row>
                    {console.log(assignedBatch)}
                    <Row style={{ fontSize: '6.5pt', marginTop: "2pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {moment().format('DD-MM-YYYY') || '-'}
                        </Col>
                    </Row>
                    <Row style={{ fontSize: '6.5pt', marginTop: "1pt" }}>
                        <Col style={{ width: "46%" }}></Col>
                        <Col style={{ whdth: "54%" }}>
                            {assignedBatch[0]?.offlineValidity ? moment(assignedBatch[0]?.offlineValidity).format("MMM YYYY") : '-'}
                        </Col>
                    </Row>
                    <Row align="center">
                        <Image src="/images/Seal-Signature.png" height={"20pt"} style={{ paddingLeft: "60pt", marginBottom: "-5pt" }} />
                    </Row>
                </Col>
                {/* <Col style={{ height: "86mm", width: "54mm", backgroundImage: 'url("/images/id-card-back.png")', preview: false, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} /> */}

            </Row>
        </Card>
    )
}