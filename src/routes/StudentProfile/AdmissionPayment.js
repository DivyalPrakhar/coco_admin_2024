import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select, Space } from "antd";
import { find, lowerCase, omit } from "lodash";
import moment from "moment";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { CommonPageHeader } from "../../components/CommonPageHeader";
import { UploadImageBox } from "../../components/UploadImageBox";
import { printHelper, PRINT_TYPE, STATUS } from "../../Constants";
import { addOfflinePaymentAction, resetPaymentStatus } from "../../redux/reducers/offlineEnquiry/Enquiry";
import { getOfflineCourseAction } from "../../redux/reducers/offlineEnquiry/OfflineCourse";
import { getStatesAction } from "../../redux/reducers/states";
import { addAddressAction, getStudentAction, resetUpdateAddress, updateAddressAction, updateStudentAction } from "../../redux/reducers/student";
import { useCheckStatus } from "../../utils/useCheckStatus";
import PaymentReceipt from "./PaymentRecipt";

export default function AdmissionPayment() {
    const { userId, courseId, enquiryId } = useParams()
    const history = useHistory()
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [showAdmissionPayment, setShowAdmissionPayment] = useState(false)
    const { allOfflineCourses, getOfflineCourseStatus } = useSelector(s => s.offlineCourse)
    const { student } = useSelector((state) => ({
        student: state.student,
    }))
    const paymentMode = Form.useWatch('mode', form)

    useEffect(() => {
        if (getOfflineCourseStatus !== STATUS.SUCCESS) {
            dispatch(getOfflineCourseAction())
        }
        return () => dispatch(resetPaymentStatus())
    }, [dispatch, getOfflineCourseStatus])

    const course = find(allOfflineCourses, course => course._id === courseId)

    const _collectPayment = (e) => {
        dispatch(addOfflinePaymentAction(({ ...omit(e, 'admissionFees', 'cheque_dd', 'bank', 'date'), paymentMeta: { cheque_dd: e.cheque_dd, bank: e.bank, date: e.date } })))
    }

    const { offlinePaymentDetails, addOfflinePaymentStatus } = useSelector(s => s.enquiry)

    const handlePrint = () => {
        printHelper(PRINT_TYPE.PRINT_PAYMENT_RECEIPT, { isPrint: true, course: course, currentStudent: student?.currentStudent, offlinePaymentDetails: offlinePaymentDetails })
    }

    window.onload = function () {
        history.push('/student/profile/' + userId)
    }
    return (
        <div>
            <CommonPageHeader title={"Student Admission"} />
            <br />
            {addOfflinePaymentStatus !== STATUS.SUCCESS ?
                showAdmissionPayment === false ?
                    < AdmissionForm userId={userId} nextButton={setShowAdmissionPayment} allOfflineCourses={allOfflineCourses} course={course} student={student} enquiryId={enquiryId} />
                    :
                    <Card style={{ width: '100%', alignItems: "center", paddingLeft: "30px" }}>
                        <Col style={{ fontSize: "20px" }}>Proceed to Collect Payment</Col>

                        <Form
                            form={form}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 14 }}
                            layout="horizontal"
                            size='large'
                            onFinish={_collectPayment}
                        >
                            <Card style={{ padding: 0, border: 0 }}>
                                <Form.Item label="Admission Fees" name={'admissionFees'} initialValue={course?.admissionFees}>
                                    <Row>{course?.admissionFees}</Row>
                                </Form.Item>
                                <CustomInput hidden name='userId' value={userId} />
                                <CustomInput hidden name='course' value={courseId} />

                                <Form.Item label="Payment Method" rules={[{ required: true, message: 'Please select Payment Method.' }]} name='mode'>
                                    <Select showSearch autoComplete='invalid' allowClear placeholder='Select State'>
                                        <Select.Option value='CASH'>Cash</Select.Option>
                                        <Select.Option value='CHEQUE'>Cheque</Select.Option>
                                    </Select>
                                </Form.Item>
                                {paymentMode === "CHEQUE" ?
                                    <>
                                        <CustomInput label="Cheque/DD" name='cheque_dd' rules={[{ required: true, message: 'Please fill in the field.' }]} placeholder='Cheque Details' />
                                        <CustomInput label="Bank" name='bank' rules={[{ required: true, message: 'Please fill in the field.' }]} placeholder='Bank Name' />
                                        <Form.Item label="Date" rules={[{ required: true, message: 'Please select Payment Method.' }]} name='date'>
                                            <DatePicker placeholder="Select date" format={"DD-MM-YYYY"} />
                                        </Form.Item>
                                    </> :
                                    null
                                }
                                <Form.Item wrapperCol={{ span: 14 }}>
                                    <Space style={{ justifyContent: "center" }}>
                                        <Col>
                                            <Button onClick={() => setShowAdmissionPayment(false)}>Back</Button>
                                        </Col>
                                        <Col>
                                            <Button type="primary" htmlType="submit" loading={addOfflinePaymentStatus === STATUS.FETCHING}>Collect Payment</Button>
                                        </Col>
                                    </Space>
                                </Form.Item>
                            </Card>
                        </Form>
                    </Card>
                :
                <Card>
                    <Row style={{ marginBottom: 20 }} align="center" justify="" center>
                        <CheckCircleOutlined style={{ marginTop: 8, fontSize: 22, color: 'green' }} height={"fit-content"} />
                        <Row style={{ marginLeft: 8, fontSize: 20 }}>Payment Collected</Row>
                    </Row>
                    <PaymentReceipt course={course} currentStudent={student?.currentStudent} offlinePaymentDetails={offlinePaymentDetails} />
                    <Row align="center">
                        <Space style={{ marginTop: 30, justifyContent: "center" }}>
                            <Col>
                                <Button onClick={() => history.push('/student/profile/' + userId)}>Go to profile</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={handlePrint}>Print receipt</Button>
                            </Col>
                        </Space>
                    </Row>
                </Card>
            }
            <br />
        </div>
    )
}

export const AdmissionForm = ({ closeModal, course, enquiryId, userId, nextButton, student, updateData }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [form] = Form.useForm();
    const [profilePic, changeProfilePic] = useState()

    const { states, user } = useSelector((state) => ({
        states: state.states,
        user: state.user.user,
    }))
    const currentStudent = student?.currentStudent
    // useEffect(() => {
    //     if (!currentStudent)
    //         dispatch(getStudentAction({ userId }));
    // }, [currentStudent, dispatch, userId])

    useEffect(() => {
        if (states.getStatesStatus !== STATUS.SUCCESS)
            dispatch(getStatesAction())

        return () => dispatch(resetUpdateAddress())
    }, [dispatch, states.getStatesStatus])

    const [selectedState, setState] = useState('')
    const [selectedCity, setCity] = useState('')
    const [formKey, setFormKey] = useState(1)

    useEffect(() => {
        if (states.getStatesStatus === STATUS.SUCCESS) {
            let state = find(states.statesList, st => lowerCase(st.name) === lowerCase(currentStudent?.address?.state))
            let city = state?.cities?.length ? find(state.cities, c => lowerCase(c.name) === lowerCase(currentStudent?.address?.city)) : null
            form.setFieldsValue({ state: state?.name })
            setState(state)
            setCity(city)
            setFormKey(formKey + 1)

        }
    }, [states.getStatesStatus])

    const selectState = (name) => {
        if (find(states.statesList, s => s.name === name)) {
            setState(find(states.statesList, s => s.name === name))
        }
        else {
            setState([])
        }
    }
    const _selectState = (e) => {
        selectState(e)
        setFormKey(formKey + 1)
        setCity(null)
    }

    const changeImage = (img) => {
        changeProfilePic(img)
    }

    const onFinish = (data) => {
        const userData = ({ ...omit(data, 'address', 'landmark', 'state', 'city', 'pincode', 'schoolName', 'passingYear', 'marks', 'stream'), id: userId })
        let educationDetails = {
            schoolName: data.schoolName,
            passingYear: data.passingYear,
            marks: data.marks,
            stream: data.stream,
        }
        let address = {
            address: data.address,
            landmark: data.landmark,
            city: data.city,
            state: data.state,
            pincode: data.pincode
        }

        dispatch(updateStudentAction({ id: userId, ...userData, educationDetails }))

        if (currentStudent?.address) {
            dispatch(updateAddressAction({ ...address, addressId: currentStudent.address?._id }))
        }
        else {
            dispatch(addAddressAction({ ...address, userId: currentStudent.user?._id, default: true }))
        }
    }
    useCheckStatus({
        status: student.updateStudentStatus,
        onSuccess: () => {
            if (updateData) {
                closeModal()
            }
            else {
                if (course.admissionFees === 0) {
                    history.push('/student/profile/' + userId)
                }
                else {
                    nextButton(true)
                }
            }
        },
    });
    return (
        <Card loading={student.getStudentStatus === STATUS.FETCHING}>
            {currentStudent?.user ?
                <Form
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    size='large'
                    onFinish={onFinish}
                >
                    <Card style={{ padding: 0, border: 0 }}>
                        <Form.Item label="Student Image">
                            <UploadImageBox ratio={'1:1'} getImage={changeImage} />
                        </Form.Item>
                        <CustomInput label="Full Name" rules={[{ required: true, message: 'Please fill in the field.' }]} value={currentStudent.user?.name} name='name' placeholder='Name' />
                        <CustomInput hidden name='instituteId' value={user?.staff.institute._id} />
                        <CustomInput hidden name='avatar' value={profilePic?.file?.response?.url} />
                        {course?.admissionFees === 0 ?
                            <>
                                <CustomInput hidden name='userEnquiryId' value={enquiryId} />
                                <CustomInput hidden name='course' value={course?._id} />
                            </>
                            :
                            null
                        }
                        <Form.Item label="Gender" rules={[{ required: true, message: 'Please pick a gender.' }]} initialValue={currentStudent.user?.gender} name='gender'>
                            <Radio.Group required>
                                <Radio.Button required value="male" >Male</Radio.Button>
                                <Radio.Button required value="female">Female</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth.' }]} initialValue={currentStudent.user?.dob ? moment(currentStudent.user?.dob, "YYYY-MM-DD") : null} name='dob'>
                            <DatePicker name placeholder='Date Of Birth' />
                        </Form.Item>
                        <CustomInput label="E-mail" type='email' rules={[{ required: true, message: 'Please fill in the field.' }]} value={currentStudent.user?.email} name='email' placeholder='Email' />
                        <Form.Item label='Contact Number'
                            rules={[{ required: true, message: 'Please fill in the field.' }, { pattern: '^[6-9][0-9]{9}$', message: 'Enter valid mobile number' }]} initialValue={currentStudent.user?.contact} name='contact'
                        >
                            <Input placeholder='Mobile Number' />
                        </Form.Item>
                        <Form.Item label='Whatsapp Number'
                            rules={[{ required: true, message: 'Please fill in the field.' }, { pattern: '^[6-9][0-9]{9}$', message: 'Enter valid whatsapp number' }]} initialValue={currentStudent.user?.whatsappContact} name='whatsappContact'
                        >
                            <Input placeholder='Whatsapp Number' />
                        </Form.Item>
                        <CustomInput label="Father Name" name='fatherName' placeholder='Father Name' value={currentStudent.user?.fatherName} />
                        <CustomInput label="Father Contact" rules={[{ pattern: '^[6-9][0-9]{9}$', message: 'Enter valid contact number' }]} value={currentStudent.user?.fatherContact} name='fatherContact' placeholder='Father Contact' />
                        <CustomInput label="Father Occupation" name='fatherOccuption' placeholder='Father Occupation' value={currentStudent.user?.fatherOccuption} />
                        <Form.Item label="Category" name='category' initialValue={currentStudent.user?.category}>
                            <Select showSearch autoComplete='invalid' allowClear placeholder='Select Category'>
                                <Select.Option value={"GENERAL"}>GENERAL</Select.Option>
                                <Select.Option value={"OBC"}>OBC</Select.Option>
                                <Select.Option value={"SC"}>SC</Select.Option>
                                <Select.Option value={"ST"}>ST</Select.Option>
                            </Select>
                        </Form.Item>
                        <br />
                        <Row style={{ fontSize: 20 }}>Permanent Address</Row>
                        <Form.Item label="Address" rules={[{ required: true, message: 'Please fill in the field.' }]} initialValue={currentStudent?.address?.address} name='address'>
                            <Input.TextArea placeholder='Address' />
                        </Form.Item>
                        <Form.Item label="Landmark" name='landmark' initialValue={currentStudent?.address?.landmark}>
                            <Input placeholder='Landmark' />
                        </Form.Item>
                        <Form.Item label="State" initialValue={selectedState?.name} required name='state' >
                            <Select showSearch autoComplete='invalid' allowClear required placeholder='select state'
                                onChange={(e) => _selectState(e)}
                                // value={selectedState?.name}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {states?.statesList?.map(state =>
                                    <Select.Option value={state.name} key={state.name}>{state.name}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item initialValue={selectedCity?.name} key={formKey} label="City" name='city' required>
                            <Select showSearch autoComplete='invalid' required allowClear placeholder='select city'
                                // value={selectedCity?.name}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {selectedState?.cities?.length ? selectedState.cities.map(city =>
                                    <Select.Option value={city.name} key={city.name}>{city.name}</Select.Option>
                                ) : null}
                            </Select>
                        </Form.Item>
                        <CustomInput
                            rules={[
                                { pattern: '^[1-9][0-9]{5}$', message: 'Pincode should have 6 digits' }
                            ]} value={currentStudent?.address?.pincode?.toString()}
                            label="Pin Code" required name='pincode' type='number' placeholder='Pincode'
                        />
                        <br />
                        <Row style={{ fontSize: 20 }}>Academic Details</Row>
                        <CustomInput label="School/College Name" name='schoolName' value={currentStudent.user?.educationDetails?.schoolName} placeholder='School/College Name' />
                        <CustomInput label="Passing Year" name='passingYear' value={currentStudent.user?.educationDetails?.passingYear} placeholder='Passing Year' />
                        <CustomInput label="Marks" name='marks' value={currentStudent.user?.educationDetails?.marks} placeholder='Marks in percentage' />
                        <CustomInput label="Strean" name='stream' value={currentStudent.user?.educationDetails?.stream} placeholder='Stream' />
                    </Card>
                    {updateData ?
                        <Form.Item wrapperCol={{ offset: 6 }}>
                            <Button type="primary" shape='round'
                                htmlType="submit" loading={student.updateStudentStatus === STATUS.FETCHING}
                            >
                                Save
                            </Button>
                        </Form.Item>
                        :
                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Button shape='round' style={{ marginRight: 10 }} onClick={() => history.push('/student/profile/' + userId)}>
                                Cancel
                            </Button>
                            <Button type="primary" shape='round'
                                htmlType="submit" loading={student.updateStudentStatus === STATUS.FETCHING}
                            // onClick={onFinish}
                            >
                                {course?.admissionFees === 0 ? "Save" : "Next"}
                            </Button>
                        </Form.Item>
                    }
                </Form>
                :
                null
            }
        </Card>
    )
}


const CustomInput = ({ label, required, name, placeholder, type, rules, hidden, value }) => {
    return (
        <Form.Item label={label} hidden={hidden} rules={rules} initialValue={value} name={name}>
            <Input placeholder={placeholder} type={type || 'text'} />
        </Form.Item>
    )
}