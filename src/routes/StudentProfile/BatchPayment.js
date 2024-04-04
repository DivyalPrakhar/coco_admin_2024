import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { find, map, omit, sumBy } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { printHelper, PRINT_TYPE, STATUS } from "../../Constants";
import { addStudentInstallment, collectTutionFeesPayment, getBatchRequest, resetAddInstallment, resetTutionFees } from "../../redux/reducers/batches";
import { getAllCenterAction } from "../../redux/reducers/center";
import { amountToWords } from "../../utils/FileHelper";
import { useCheckStatus } from "../../utils/useCheckStatus";

export default function BatchInstallment({ closeModal, currentStudent, visible }) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const installment = Form.useWatch('noOfInstallment', form)
    const [installments, setInstallments] = useState([])
    const [showAlert, setShowAlert] = useState(false)

    const totalInstallmentAmount = visible?.batchDetail?.offlineTutionFees - parseInt(Form.useWatch('concession', form))

    const installmentHandler = (name, index, value) => {
        let install = [...installments]
        install[index][name] = value;
        setInstallments(install);
    }

    useEffect(() => {
        let newInstallment = [];
        if (installment) {
            if (installment < installments?.length) {
                newInstallment = [...installments].slice(0, installment);
            } else {
                newInstallment = [...installments, ...map(new Array(installment - installments.length), i => {
                    return ({
                        amount: '',
                        dueDate: ''
                    });
                })];
            }
        }
        setInstallments(newInstallment);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [installment])

    const onFinish = (data) => {
        if (data.concession <= visible?.batchDetail?.offlineTutionFees) {
            if (totalInstallmentAmount === sumBy(installments, 'amount')) {
                dispatch(addStudentInstallment({ ...omit(data, 'concessionRemark', 'noOfInstallment'), remark: data.concessionRemark, installments: installments }))
            }
            else {
                alert("Installments amount must be equal to total amount")
            }
        }
        else {
            setShowAlert(true)
        }
    }

    const { addStudentInstallmentStatus } = useSelector(s => s.batches)

    useCheckStatus({
        status: addStudentInstallmentStatus,
        onSuccess: () => {
            dispatch(resetAddInstallment())
            closeModal()
        },
    }, [addStudentInstallmentStatus]);

    return (
        <Modal width="800px" title='Add Batch Installment' okText='Add' visible={visible} footer={false} onCancel={closeModal} >
            <Form
                form={form}
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 12 }}
                layout="horizontal"
                size='large'
                onFinish={onFinish}
            >
                <Card style={{ padding: 0, border: 0 }}>
                    <Form.Item label="Batch Name" name={'batch'} initialValue={visible.batchDetail?._id}>
                        <Row>{visible.batchDetail?.name}</Row>
                    </Form.Item>
                    <Form.Item label="Offline Tution Fees" name={"totalAmount"} initialValue={visible?.batchDetail?.offlineTutionFees}>
                        <Row>{visible?.batchDetail?.offlineTutionFees}</Row>
                    </Form.Item>
                    <Form.Item hidden={true} initialValue={visible?.batch?.course} name={"course"} >
                        <Input />
                    </Form.Item>
                    <Form.Item hidden={true} initialValue={currentStudent.user._id} name={"userId"}>
                        <Input />
                    </Form.Item>
                    <CustomInput label="Concession" name='concession' value={0} min={0} type="number" placeholder='Concession' />
                    {showAlert ?
                        <Form.Item wrapperCol={{ offset: 7, span: 15 }} style={{ marginTop: -36, marginBottom: 0 }}>
                            <Row style={{ color: 'red' }}>Concession must be less or equal to Tution Fees</Row>
                        </Form.Item>
                        :
                        null
                    }
                    <CustomInput label="Concession Remark" name='concessionRemark' placeholder='Concession Remark' />
                    <Form.Item label="No of Installment" name='noOfInstallment' rules={[{ required: true, message: 'Please fill in the field.' }]} >
                        <Input type="number" placeholder='Installment' max={5} />
                    </Form.Item>
                    <Form.Item label="Total Installment Amount">
                        <Row>{totalInstallmentAmount}</Row>
                    </Form.Item>
                    {installment ? map(Array.from({ length: installment }), (val, i) => {
                        return (
                            i < 5 ?
                                <Form.Item label={"Installment " + (i + 1)}>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Input placeholder="Amount" type="number" onChange={(e) => installmentHandler("amount", i, parseInt(e.target.value))} />
                                        </Col>
                                        <Col span={12}>
                                            <DatePicker placeholder="Select DueDate" format={"DD-MM-YYYY"} onChange={(e) => installmentHandler("dueDate", i, e)} />
                                        </Col>
                                    </Row>
                                </Form.Item>
                                :
                                null
                        )
                    })
                        :
                        null
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={addStudentInstallmentStatus === STATUS.FETCHING}>Add</Button>
                    </Form.Item>
                </Card>
            </Form>
        </Modal >
    )
}

const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, max, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} max={max} />
        </Form.Item>
    )
}

export const CollectBatchPayment = ({ allOfflineCourses, currentStudent, visible }) => {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [showAlert, setShowAlert] = useState(false)
    const [dueAmount, setDueAmount] = useState(visible?.installments?.dueAmount)

    useEffect(() => {
        setDueAmount(visible?.installments?.dueAmount)
    }, [visible?.installments?.dueAmount])

    const mode = Form.useWatch('mode', form)
    const inputAmount = Form.useWatch('amount', form)

    const _collectPayment = (data) => {
        if (parseInt(data.amount) > 0 && dueAmount >= data.amount) {
            dispatch(collectTutionFeesPayment(({ ...omit(data, 'cheque_dd', 'bank', 'date', 'remark'), gstInAmount: (visible?.batchDetail?.gstPercent / 100) * inputAmount, paymentMeta: { cheque_dd: data.cheque_dd, bank: data.bank, date: data.date, remark: data.remark } })))
            setDueAmount(dueAmount - data.amount)
        }
        else {
            setShowAlert(true)
        }
    }

    const { collectTutionFeesPaymentStatus, collectedPayment } = useSelector(s => s.batches)

    useCheckStatus({
        status: collectTutionFeesPaymentStatus,
        onSuccess: () => {
        },
    }, [collectTutionFeesPaymentStatus]);

    const handlePrint = () => {
        printHelper(PRINT_TYPE.PRINT_TUTIONFESS_RECEIPT, { isPrint: true, collectedPayment: collectedPayment, currentStudent: currentStudent, allOfflineCourses: allOfflineCourses })
    }

    const _closeModal = () => {
        dispatch(resetTutionFees())
        form.resetFields()
    }

    return (
        // <Modal width="1200px" title='Collect Batch Payment' okText='Add' visible={visible} footer={false} onCancel={_closeModal}>
        <div>
            {(collectTutionFeesPaymentStatus !== STATUS.SUCCESS && !collectedPayment?._id) ?
                <Card>
                    <Row justify="space-between">
                        <Col style={{ width: "30%" }}>
                            <Row style={{ fontSize: 18 }}>Due Details</Row>

                            <Row style={{ marginTop: 20 }}>Total Due Amount</Row>
                            <Row style={{ fontSize: 16, color: "#2566e8" }}>RS. {dueAmount || 0}</Row>
                            {visible?.installments?.installments?.length ?
                                <Row style={{ marginTop: 20, fontWeight: "bold" }}>
                                    <Col style={{ width: "35%" }}>Due Date</Col>
                                    <Col style={{ width: "35%" }}>Amount</Col>
                                    <Col style={{ width: "30%" }}>Collected</Col>
                                </Row>
                                :
                                null
                            }
                            {visible?.installments?.installments?.length ?
                                map(visible?.installments?.installments, (installment, i) => {
                                    const prev = sumBy(visible?.installments?.installments.slice(i, visible?.installments?.installments?.length), "amount")
                                    return (
                                        <Row style={{ marginTop: 5 }}>
                                            <Col style={{ width: "35%" }}>{moment(installment.dueDate).format("DD-MM-YYYY")}</Col>
                                            <Col style={{ width: "35%" }}>{installment.amount}</Col>
                                            <Col>{(prev - dueAmount) >= installment.amount ? "Paid" : (prev - dueAmount) > 0 ? "Partially Paid" : "Not Paid"}</Col>
                                        </Row>
                                    )
                                })
                                :
                                null
                            }
                        </Col>
                        <Col style={{ width: "65%" }}>
                            {/* <Card style={{ width: '100%', alignItems: "center", paddingLeft: "30px" }}> */}
                            <Col style={{ fontSize: "20px" }}>Proceed to Collect Payment</Col>

                            <Form
                                form={form}
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                                size='large'
                                onFinish={_collectPayment}
                            >
                                <Card style={{ padding: 0, border: 0 }}>
                                    <CustomInput type={'text'} label="Tution Fees" name='amount' rules={[{ required: true, message: 'Please enter fees.' }]} placeholder='Admission Fees' />
                                    {showAlert ?
                                        <Form.Item wrapperCol={{ offset: 7, span: 15 }} style={{ marginBottom: 0 }}>
                                            <Row style={{ color: 'red' }}>Amount must be less or equal to {dueAmount}</Row>
                                        </Form.Item>
                                        :
                                        null
                                    }
                                    <CustomInput hidden name='userId' value={currentStudent?.user?._id} />
                                    <CustomInput hidden name='batch' value={visible.batch?.batch} />
                                    <CustomInput hidden name='course' value={visible?.batch?.offlieBatchDetails?.course || visible?.installments?.course} />
                                    <CustomInput hidden name='gstPercent' value={visible?.batchDetail?.gstPercent} />

                                    <Form.Item label="Payment Method" initialValue={"CASH"} rules={[{ required: true, message: 'Please select Payment Method.' }]} name='mode'>
                                        <Select showSearch autoComplete='invalid' allowClear placeholder='Select State'>
                                            <Select.Option value='CASH'>Cash</Select.Option>
                                            <Select.Option value='CHEQUE'>Cheque</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    {mode === "CHEQUE" ?
                                        <>
                                            <CustomInput label="Cheque/DD" name='cheque_dd' rules={[{ required: true, message: 'Please fill in the field.' }]} placeholder='Cheque Details' />
                                            <CustomInput label="Bank" name='bank' rules={[{ required: true, message: 'Please fill in the field.' }]} placeholder='Bank Name' />
                                            <Form.Item label="Date" rules={[{ required: true, message: 'Please select Payment Method.' }]} name='date'>
                                                <DatePicker placeholder="Select date" format={"DD-MM-YYYY"} />
                                            </Form.Item>
                                        </>
                                        :
                                        null
                                    }
                                    <Form.Item label="Remark" name='remark' placeholder='Enter Remark Here...'>
                                        <TextArea />
                                    </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 7, span: 6 }}>
                                        <Space style={{ justifyContent: "center" }}>
                                            {/* <Col>
                                    <Button onClick={() => setShowAdmissionPayment(false)}>Back</Button>
                                </Col> */}
                                            <Col>
                                                <Button type="primary" htmlType="submit" disabled={dueAmount === 0 ? true : false} loading={collectTutionFeesPaymentStatus === STATUS.FETCHING}>Collect Payment</Button>
                                            </Col>
                                        </Space>
                                    </Form.Item>
                                </Card>
                            </Form>
                            {/* </Card> */}
                        </Col>
                    </Row>
                </Card>
                :
                <Card>
                    <Row style={{ marginBottom: 20 }} align="center" justify="" center>
                        <CheckCircleOutlined style={{ marginTop: 8, fontSize: 22, color: 'green' }} height={"fit-content"} />
                        <Row style={{ marginLeft: 8, fontSize: 20 }}>Payment Collected</Row>
                    </Row>
                    <TutionFeesReceipt collectedPayment={collectedPayment} currentStudent={currentStudent} allOfflineCourses={allOfflineCourses} />
                    <Row align="center">
                        <Space style={{ marginTop: 30, justifyContent: "center" }}>
                            <Col>
                                <Button onClick={_closeModal}>Cancel</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={handlePrint}>Print receipt</Button>
                            </Col>
                        </Space>
                    </Row>
                </Card>
            }
        </div>
    )
}

export const TutionFeesReceipt = ({ allOfflineCourses, collectedPayment, currentStudent, allCenterList, batch }) => {

    const userBatch = find(batch, b => b._id === collectedPayment.batch)

    return (
        <Card style={{ fontSize: "12pt", color: "#ec3938" }}>
            <Row style={{ marginTop: "5pt", marginBottom: "5pt" }} align="center">
                <Image preview={false} src={'/images/receipt-header.jpg'} />
            </Row>
            <Row align="center">
                <Col style={{ width: "90pt", padding: "1pt", backgroundColor: "#ec3938", color: "white", fontSize: "15pt", fontWeight: "bold", textAlign: "center", borderRadius: "5pt" }} >Receipt</Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "2pt" }}>
                <Col>
                    <Row>
                        <Col>Receipt No. :</Col>
                        <Col style={{ marginLeft: "5pt", color: "black" }}> {collectedPayment?.receiptNumber}</Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Col> Date:</Col>
                        <Col style={{ marginLeft: "5pt", color: "black" }}> {moment(collectedPayment?.createdAt).format("DD/MM/YYYY")}</Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "3pt" }}>
                <Col style={{ width: "70%" }}>
                    <Row>
                        <Col style={{ width: "83pt" }}>Student Name : </Col>
                        <Col style={{ width: "255pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{collectedPayment?.userId?.name || currentStudent.user.name}</Col>
                    </Row>
                </Col>
                <Col style={{ width: "30%" }}>
                    <Row>
                        <Col style={{ width: "67pt" }}> Fee Paid (₹) :</Col>
                        <Col style={{ width: "76pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{collectedPayment?.amount}</Col>
                    </Row>
                </Col>
            </Row>
            <Row style={{ marginTop: "2pt" }}>
                <Col style={{ width: "112pt" }}>Received (In Words) : </Col>
                <Col style={{ width: "380pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{amountToWords(collectedPayment?.amount)}</Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "2pt" }}>
                <Col style={{ width: "65%" }}>
                    <Row>
                        <Col style={{ width: "133pt" }}>Course / Package Name : </Col>
                        <Col style={{ width: "180pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{find(allOfflineCourses, course => course._id === collectedPayment.course)?.name}</Col>
                    </Row>
                </Col>
                <Col style={{ width: "35%" }}>
                    <Row>
                        <Col style={{ width: "102pt" }}>Mode of Payment :</Col>
                        <Col style={{ width: "65pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{collectedPayment.mode}</Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "2pt" }}>
                <Col style={{ width: "60%" }}>
                    <Row>
                        <Col style={{ width: "48pt" }}>Remark :</Col>
                        <Col style={{ width: "240pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{collectedPayment.paymentMeta?.remark}</Col>
                    </Row>
                </Col>
                <Col style={{ width: "40%" }}>
                    <Row>
                        <Col style={{ width: "78pt" }}>Center Name :</Col>
                        <Col style={{ width: "115pt", color: "black", borderBottom: "1px solid #ec3938", marginLeft: "5pt" }}>{find(allCenterList, c => c._id === userBatch.center)?.name}</Col>
                    </Row>
                </Col>
            </Row>
            <Row justify="space-between" style={{ marginTop: "8pt" }}>
                <Col style={{ width: "50%", paddingRight: "10pt" }}>
                    <Row style={{ fontSize: "13pt" }}>Cheque Details:-</Row>
                    <Row style={{ border: "1px solid #ec3938", borderBottom: "none", marginTop: "15pt" }}>
                        <Col style={{ width: "30%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Amount</Col>
                        <Col style={{ width: "70%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>{collectedPayment.mode === "CHEQUE" ? collectedPayment.amount : ''}</Col>
                    </Row>
                    <Row style={{ border: "1px solid #ec3938", borderBottom: "none" }}>
                        <Col style={{ width: "30%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Cheque No.</Col>
                        <Col style={{ width: "70%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>
                            <Row>
                                <Col style={{ width: "60pt" }}>{collectedPayment.paymentMeta?.cheque_dd}</Col>
                                <Col style={{ width: "30pt", color: "#ec3938" }}>Date: </Col>
                                <Col style={{ width: "60pt", marginLeft: "4pt" }}>{collectedPayment.paymentMeta?.date ? moment(collectedPayment.paymentMeta.date).format("DD/MM/YYYY") : ''}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ border: "1px solid #ec3938" }}>
                        <Col style={{ width: "30%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Bank</Col>
                        <Col style={{ width: "70%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>{collectedPayment.paymentMeta?.bank}</Col>
                    </Row>
                </Col>
                <Col style={{ width: "50%", paddingLeft: "10pt" }}>
                    <Col>
                        <Row style={{ border: "1px solid #ec3938", borderBottom: "none" }}>
                            <Col style={{ width: "45%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Total Fees</Col>
                            <Col style={{ width: "55%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>{collectedPayment.udpateDueAmount?.totalAmount}</Col>
                        </Row>
                        <Row style={{ border: "1px solid #ec3938", borderBottom: "none" }}>
                            <Col style={{ width: "45%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Received Amount</Col>
                            <Col style={{ width: "55%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>{collectedPayment.udpateDueAmount?.totalAmount - collectedPayment.udpateDueAmount?.dueAmount}</Col>
                        </Row>
                        <Row style={{ border: "1px solid #ec3938" }}>
                            <Col style={{ width: "45%", padding: "1pt", paddingLeft: "3pt", borderRight: "1px solid #ec3938" }}>Balance Amount</Col>
                            <Col style={{ width: "55%", padding: "1pt", paddingLeft: "3pt", color: "black" }}>{collectedPayment.udpateDueAmount?.dueAmount}</Col>
                        </Row>
                    </Col>
                    <Row justify="space-between" style={{ marginTop: "20pt" }}>
                        <Col style={{ fontSize: "12pt" }}>Student Signature</Col>
                        <Col style={{ fontSize: "12pt" }}>Receiver Signature</Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
}